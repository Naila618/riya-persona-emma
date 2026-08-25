import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReplyTone } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, emailBody, senderName, tone, customPrompt, customApiKey } = body;

    const apiKey = customApiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are InboxIQ AI Assistant. Draft a reply to the following email in a ${tone || "Professional"} tone.
${customPrompt ? `Additional Instruction: ${customPrompt}` : ""}

Original Subject: ${subject}
Original Sender: ${senderName || "Client"}
Original Email Body:
${emailBody}

Rules:
- Format cleanly with paragraph breaks.
- Keep it concise, helpful, and high-impact.
- Do not output preamble or markdown formatting codes like \`\`\` - output the clean text only.`;

        const result = await model.generateContent(prompt);
        const replyText = result.response.text().trim();
        return NextResponse.json({ reply: replyText, tone });
      } catch (err) {
        console.warn("Custom Gemini reply generation fallback:", err);
      }
    }

    // Heuristic contextual generator
    const name = senderName?.split(" ")[0] || "there";
    let fallbackText = `Hi ${name},\n\nThank you for reaching out regarding "${subject}". We are actively looking into this and will follow up shortly.\n\nBest regards,\nInboxIQ Enterprise Operations`;

    if (tone === "Friendly") {
      fallbackText = `Hey ${name}! 👋\n\nThanks so much for reaching out about "${subject}". I'm on it and will make sure this gets resolved for you right away!\n\nCheers,\nSupport Team`;
    } else if (tone === "Formal") {
      fallbackText = `Dear ${senderName || "Valued Customer"},\n\nWe acknowledge receipt of your correspondence concerning "${subject}". Your matter has been escalated for prompt resolution.\n\nSincerely,\nEnterprise Operations Team`;
    } else if (tone === "Short") {
      fallbackText = `Hi ${name},\n\nUnderstood and looking into "${subject}". We'll update you as soon as possible.\n\nThanks!`;
    } else if (tone === "Detailed") {
      fallbackText = `Hi ${name},\n\nThank you for your email regarding "${subject}".\n\nWe have reviewed the details and are taking the following steps:\n1. Verifying system state and relevant records.\n2. Coordinating with the specialized engineering and operations team.\n3. Preparing a formal resolution update.\n\nBest regards,\nInboxIQ Operations`;
    }

    return NextResponse.json({ reply: fallbackText, tone: tone || "Professional" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate reply" }, { status: 500 });
  }
}
