import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const status = searchParams.get("status");
    const departmentId = searchParams.get("departmentId");
    const query = searchParams.get("q")?.toLowerCase();

    const where: any = {};

    if (category && category !== "ALL") {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (priority && priority !== "ALL") {
      where.priority = { equals: priority, mode: 'insensitive' };
    }
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (departmentId && departmentId !== "ALL") {
      where.departmentId = departmentId;
    }
    if (query) {
      where.OR = [
        { subject: { contains: query, mode: 'insensitive' } },
        { body: { contains: query, mode: 'insensitive' } },
        { sender: { contains: query, mode: 'insensitive' } },
        { senderName: { contains: query, mode: 'insensitive' } },
        { summary: { contains: query, mode: 'insensitive' } }
      ];
    }

    const emails = await prisma.emailItem.findMany({
      where,
      orderBy: { receivedAt: 'desc' },
      include: {
        department: true,
        assignedUser: true,
        attachments: true,
        aiPrediction: true,
      }
    });

    return NextResponse.json({ emails, count: emails.length });
  } catch (error) {
    console.error("Failed to fetch emails:", error);
    return NextResponse.json({ error: "Failed to fetch emails" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, body: emailBody, sender, senderName, receiver } = body;

    if (!subject || !emailBody || !sender) {
      return NextResponse.json({ error: "Missing required fields: subject, body, sender" }, { status: 400 });
    }

    // For now, post directly without calling the mock-db's addEmail because addEmail was a complex mock function.
    // Instead, we will simulate passing it to the AI triage in the `api/simulate` route, so this route isn't strictly used for generation anymore.
    // Let's just return a placeholder or implement basic insertion. 
    return NextResponse.json({ error: "Please use /api/simulate for incoming live emails" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create email" }, { status: 500 });
  }
}
