import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const email = await prisma.emailItem.findUnique({
      where: { id },
      include: {
        department: true,
        assignedUser: true,
        attachments: true,
        aiPrediction: true,
        activities: {
          orderBy: { timestamp: 'desc' }
        },
        replies: {
          orderBy: { createdAt: 'asc' }
        },
        notes: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json({ email });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch email" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { performerName, ...updates } = body;

    const updated = await prisma.emailItem.update({
      where: { id },
      data: updates,
    });

    if (performerName) {
      await prisma.activity.create({
        data: {
          id: `act_${Date.now()}`,
          emailId: id,
          action: `Updated email`,
          performedBy: performerName,
          details: `Updated fields: ${Object.keys(updates).join(', ')}`,
        }
      });
    }

    return NextResponse.json({ email: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update email" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updated = await prisma.emailItem.update({
      where: { id },
      data: { status: "TRASH" },
    });

    return NextResponse.json({ success: true, email: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete email" }, { status: 500 });
  }
}
