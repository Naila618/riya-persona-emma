import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function GET() {
  try {
    const departments = await prisma.department.findMany();
    const users = await prisma.user.findMany();
    return NextResponse.json({ departments, users });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch departments" }, { status: 500 });
  }
}
