import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function GET() {
  try {
    const rules = await prisma.routingRule.findMany({
      orderBy: { name: 'asc' }
    });
    return NextResponse.json({ rules });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ruleId } = body;

    if (!ruleId) {
      return NextResponse.json({ error: "Missing ruleId" }, { status: 400 });
    }

    const currentRule = await prisma.routingRule.findUnique({
      where: { id: ruleId }
    });

    if (!currentRule) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const updated = await prisma.routingRule.update({
      where: { id: ruleId },
      data: { isActive: !currentRule.isActive }
    });

    return NextResponse.json({ rule: updated });
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle rule" }, { status: 500 });
  }
}
