import { NextResponse } from "next/server";
import { db } from "@/lib/data/mock-db";

const SCENARIOS: Record<
  string,
  {
    subject: string;
    body: string;
    sender: string;
    senderName: string;
  }
> = {
  outage: {
    subject: "URGENT [P0]: Kubernetes Cluster EU-Central-1 Ingress Controller 502 Bad Gateway",
    body: "Critical Incident Alert: All traffic routing through EU ingress controller ingress-gw-04 is dropping with HTTP 502. Customer mobile apps in Germany, France, and UK are unable to complete checkouts. Over 14,000 requests dropped in the last 180 seconds. Failover standby pods immediately.",
    sender: "alert-ops@cloud-infrastructure.net",
    senderName: "SRE Automated Incident Bot",
  },
  deal: {
    subject: "Inbound Enterprise Request: 1,000 Seat Global Rollout ($650,000 ARR)",
    body: "Hi Sarah, We are evaluating InboxIQ for our global customer experience modernization across 14 countries. We need 1,000 enterprise seats with custom SSO, 99.99% uptime SLA, and SOC 2 Type II compliance. Can we schedule an executive demo with your architecture team this Thursday?",
    sender: "c.vanderbilt@global-conglomerate.com",
    senderName: "Charles Vanderbilt (EVP Global CX)",
  },
  phishing: {
    subject: "URGENT: Executive Wire Transfer Authorization for Acquisition Deposit",
    body: "Sarah, I am in a board meeting right now and cannot take calls. We need to wire a confidential $340,000 earnest money deposit for Project Titan by 3:00 PM today. Please remit immediately to the escrow account details attached. Do not discuss this with the broader team until press release.",
    sender: "ceo-office@enterprise-exec-portal.cc",
    senderName: "Chief Executive Officer (Urgent)",
  },
  refund: {
    subject: "Dispute Notice: Unauthorized Annual Renewal Charge ($19,800.00)",
    body: "Hello Billing Department, Our account was charged $19,800 today for an annual renewal we cancelled with our account manager two weeks ago. Please issue an immediate refund back to our Visa card ending in #4091 or we will initiate an unverified chargeback dispute with our bank.",
    sender: "accounting@vertex-analytics.io",
    senderName: "Samantha Miller (Head of Accounting)",
  },
  gdpr: {
    subject: "GDPR Article 17 Right to be Forgotten Request - Subject #GDPR-88192",
    body: "To Data Controller: I hereby exercise my rights under GDPR Article 17 requesting the immediate deletion of all personal data, behavioral telemetry, and transaction logs associated with email address mark.h@european-retail.de. Please provide confirmation of deletion within 30 days.",
    sender: "mark.h@european-retail.de",
    senderName: "Markus H.",
  },
  candidate: {
    subject: "Application: Principal AI / LLM Systems Architect - Dr. Maya Lin",
    body: "Dear InboxIQ Hiring Team, I am applying for the Principal AI / LLM Systems Architect position. I hold a Ph.D. in Machine Learning from Stanford and previously led the RAG inference acceleration team at Anthropic. My resume and research papers are available for review.",
    sender: "dr.maya.lin.ai@gmail.com",
    senderName: "Dr. Maya Lin",
  },
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { scenarioKey, customApiKey } = body;

    const scenario = SCENARIOS[scenarioKey] || SCENARIOS.outage;
    const email = db.addEmail(
      {
        subject: scenario.subject,
        body: scenario.body,
        sender: scenario.sender,
        senderName: scenario.senderName,
      },
      customApiKey
    );

    return NextResponse.json({ success: true, email });
  } catch (error) {
    return NextResponse.json({ error: "Failed to simulate email" }, { status: 500 });
  }
}
