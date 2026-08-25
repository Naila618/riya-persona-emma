import { NextResponse } from "next/server";
import { runAITriage } from "@/lib/ai/triage-engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, body: emailBody, sender, senderName, customApiKey } = body;

    if (!subject || !emailBody) {
      return NextResponse.json({ error: "Missing required fields: subject, body" }, { status: 400 });
    }

    const prediction = await runAITriage(
      {
        subject,
        body: emailBody,
        sender: sender || "guest@enterprise.com",
        senderName: senderName || "Guest User",
      },
      customApiKey
    );

    return NextResponse.json({ prediction });
  } catch (error) {
    return NextResponse.json({ error: "AI classification failed" }, { status: 500 });
  }
}
