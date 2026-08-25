import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { userId, userName, userAvatar, content, tone, aiGenerated, autoResolve } = body;

    if (!content || !userId) {
      return NextResponse.json({ error: "Missing required fields: content, userId" }, { status: 400 });
    }

    const emailItem = await prisma.emailItem.findUnique({ where: { id } });
    if (!emailItem) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const reply = await prisma.reply.create({
      data: {
        id: `rep_${Date.now()}`,
        emailId: id,
        userId,
        userName: userName || "Support Agent",
        userAvatar: userAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
        content,
        tone: tone || "Professional",
        aiGenerated: Boolean(aiGenerated),
      }
    });

    await prisma.activity.create({
      data: {
        id: `act_${Date.now()}_reply`,
        emailId: id,
        action: "REPLIED",
        performedBy: userName || "Support Agent",
        performerAvatar: userAvatar,
        details: `Sent a ${tone || "Professional"} reply.`,
      }
    });

    if (autoResolve) {
      await prisma.emailItem.update({
        where: { id },
        data: { status: "RESOLVED" }
      });
      await prisma.activity.create({
        data: {
          id: `act_${Date.now()}_resolve`,
          emailId: id,
          action: "RESOLVED",
          performedBy: userName || "Support Agent",
          performerAvatar: userAvatar,
          details: "Auto-resolved after reply",
        }
      });
    }

    const updatedEmail = await prisma.emailItem.findUnique({
      where: { id },
      include: {
        activities: { orderBy: { timestamp: 'desc' } },
        replies: { orderBy: { createdAt: 'asc' } },
        notes: { orderBy: { createdAt: 'desc' } }
      }
    });

    return NextResponse.json({ reply, email: updatedEmail }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
