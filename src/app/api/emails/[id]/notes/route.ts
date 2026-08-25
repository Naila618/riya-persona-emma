import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userAvatar, content } = body;

    if (!content || !userId) {
      return NextResponse.json({ error: "Missing required fields: content, userId" }, { status: 400 });
    }

    const emailItem = await prisma.emailItem.findUnique({ where: { id } });
    if (!emailItem) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const note = await prisma.internalNote.create({
      data: {
        id: `note_${Date.now()}`,
        emailId: id,
        userId,
        userName: userName || "Team Member",
        userAvatar: userAvatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        content,
      }
    });

    await prisma.activity.create({
      data: {
        id: `act_${Date.now()}_note`,
        emailId: id,
        action: "ADDED_NOTE",
        performedBy: userName || "Team Member",
        performerAvatar: userAvatar,
        details: "Added an internal note",
      }
    });

    const updatedEmail = await prisma.emailItem.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { timestamp: 'desc' } },
        replies: { orderBy: { createdAt: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    });

    return NextResponse.json({ note, email: updatedEmail }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
