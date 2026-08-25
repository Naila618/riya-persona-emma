import {
  Activity,
  AnalyticsData,
  Attachment,
  DashboardMetrics,
  Department,
  EmailCategory,
  EmailItem,
  InternalNote,
  NotificationItem,
  PriorityLevel,
  Reply,
  RoutingRule,
  User,
} from "@/types";
import { runFallbackTriage } from "../ai/triage-engine";

export const INITIAL_USERS: User[] = [
  {
    id: "usr-admin-1",
    name: "Sarah Chen",
    email: "sarah.chen@inboxiq.enterprise.io",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    title: "VP of Operations & Security",
    status: "ONLINE",
    resolvedCount: 342,
    avgResponseMinutes: 14,
  },
  {
    id: "usr-mgr-1",
    name: "Alex Rivera",
    email: "alex.rivera@inboxiq.enterprise.io",
    role: "MANAGER",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    departmentId: "dept-support",
    title: "Global Support Lead",
    status: "ONLINE",
    resolvedCount: 284,
    avgResponseMinutes: 18,
  },
  {
    id: "usr-mgr-2",
    name: "David Kim",
    email: "david.kim@inboxiq.enterprise.io",
    role: "MANAGER",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    departmentId: "dept-finance",
    title: "Director of Revenue Operations",
    status: "BUSY",
    resolvedCount: 195,
    avgResponseMinutes: 24,
  },
  {
    id: "usr-agent-1",
    name: "Emily Zhang",
    email: "emily.zhang@inboxiq.enterprise.io",
    role: "SUPPORT_AGENT",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    departmentId: "dept-support",
    title: "Senior Escalation Specialist",
    status: "ONLINE",
    resolvedCount: 412,
    avgResponseMinutes: 11,
  },
  {
    id: "usr-emp-1",
    name: "Michael Torres",
    email: "michael.torres@inboxiq.enterprise.io",
    role: "EMPLOYEE",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    departmentId: "dept-legal",
    title: "Corporate Legal Associate",
    status: "AWAY",
    resolvedCount: 88,
    avgResponseMinutes: 45,
  },
];

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: "dept-support",
    name: "Customer Support",
    code: "SUP",
    managerId: "usr-mgr-1",
    managerName: "Alex Rivera",
    description: "Technical incidents, bug reports, and product assistance tier 1-3.",
    color: "#0284C7",
    icon: "LifeBuoy",
    slaHours: 2,
    activeTicketsCount: 14,
    resolvedTodayCount: 48,
  },
  {
    id: "dept-sales",
    name: "Enterprise Sales",
    code: "SAL",
    managerId: "usr-admin-1",
    managerName: "Sarah Chen",
    description: "New client inquiries, contract expansions, and enterprise RFP proposals.",
    color: "#10B981",
    icon: "BadgeDollarSign",
    slaHours: 4,
    activeTicketsCount: 8,
    resolvedTodayCount: 19,
  },
  {
    id: "dept-finance",
    name: "Finance & Billing",
    code: "FIN",
    managerId: "usr-mgr-2",
    managerName: "David Kim",
    description: "Invoicing, refunds, tax inquiries, wire validations, and payment terms.",
    color: "#14B8A6",
    icon: "CreditCard",
    slaHours: 6,
    activeTicketsCount: 9,
    resolvedTodayCount: 27,
  },
  {
    id: "dept-hr",
    name: "People & HR",
    code: "HR",
    managerId: "usr-admin-1",
    managerName: "Sarah Chen",
    description: "Recruitment applications, talent onboarding, and employee relations.",
    color: "#EC4899",
    icon: "Users",
    slaHours: 24,
    activeTicketsCount: 5,
    resolvedTodayCount: 12,
  },
  {
    id: "dept-security",
    name: "Cyber Security Ops",
    code: "SEC",
    managerId: "usr-admin-1",
    managerName: "Sarah Chen",
    description: "Incident response, SOC-2 audits, vulnerability disclosures, and phishing containment.",
    color: "#F43F5E",
    icon: "ShieldAlert",
    slaHours: 1,
    activeTicketsCount: 3,
    resolvedTodayCount: 15,
  },
  {
    id: "dept-legal",
    name: "Legal & Compliance",
    code: "LEG",
    managerId: "usr-emp-1",
    managerName: "Michael Torres",
    description: "Master Service Agreements, GDPR/CCPA data requests, and vendor DPAs.",
    color: "#6366F1",
    icon: "Scale",
    slaHours: 12,
    activeTicketsCount: 6,
    resolvedTodayCount: 8,
  },
];

export const INITIAL_RULES: RoutingRule[] = [
  {
    id: "rule-1",
    name: "Critical Outage Fast-Track",
    description: "If email contains system outage or 500 error keywords, set Priority to Critical and assign to Customer Support.",
    conditionField: "subject",
    conditionOperator: "contains",
    conditionValue: "outage",
    targetDepartmentId: "dept-support",
    targetDepartmentName: "Customer Support",
    targetPriority: "Critical",
    autoAssignUserId: "usr-agent-1",
    isActive: true,
    matchedCount: 42,
  },
  {
    id: "rule-2",
    name: "Phishing & Wire Threat Containment",
    description: "If email contains wire transfer instruction change or suspicious bank info, route to Cyber Security Ops.",
    conditionField: "category",
    conditionOperator: "equals",
    conditionValue: "Security",
    targetDepartmentId: "dept-security",
    targetDepartmentName: "Cyber Security Ops",
    targetPriority: "Critical",
    autoAssignUserId: "usr-admin-1",
    isActive: true,
    matchedCount: 29,
  },
  {
    id: "rule-3",
    name: "Enterprise Deals ($50k+)",
    description: "Route large sales inquiries and renewal leads directly to Enterprise Sales executive queue.",
    conditionField: "category",
    conditionOperator: "equals",
    conditionValue: "Sales",
    targetDepartmentId: "dept-sales",
    targetDepartmentName: "Enterprise Sales",
    targetPriority: "High",
    isActive: true,
    matchedCount: 68,
  },
  {
    id: "rule-4",
    name: "High Urgency Refund Requests",
    description: "If refund urgency > 70, route to Finance & Billing with High priority.",
    conditionField: "urgencyScore",
    conditionOperator: "greater_than",
    conditionValue: "70",
    targetDepartmentId: "dept-finance",
    targetDepartmentName: "Finance & Billing",
    targetPriority: "High",
    autoAssignUserId: "usr-mgr-2",
    isActive: true,
    matchedCount: 51,
  },
  {
    id: "rule-5",
    name: "GDPR & Subpoena Routing",
    description: "Automatically route GDPR, CCPA, and compliance requests to Legal.",
    conditionField: "category",
    conditionOperator: "equals",
    conditionValue: "Legal",
    targetDepartmentId: "dept-legal",
    targetDepartmentName: "Legal & Compliance",
    targetPriority: "Medium",
    autoAssignUserId: "usr-emp-1",
    isActive: true,
    matchedCount: 17,
  },
];

// Helper to construct sample emails with pre-computed AI predictions
function createSampleEmail(
  id: string,
  subject: string,
  sender: string,
  senderName: string,
  body: string,
  options: {
    category: EmailCategory;
    priority: PriorityLevel;
    urgencyScore: number;
    sentiment: "Positive" | "Neutral" | "Negative" | "Frustrated" | "Urgent";
    spamScore?: number;
    status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "SPAM" | "TRASH";
    departmentId: string;
    assignedUserId?: string;
    isStarred?: boolean;
    minutesAgo: number;
    attachments?: Attachment[];
  }
): EmailItem {
  const receivedDate = new Date(Date.now() - options.minutesAgo * 60 * 1000);
  const aiPrediction = runFallbackTriage({
    subject,
    body,
    sender,
    senderName,
  });

  // Override with targeted scenario specs
  aiPrediction.urgencyScore = options.urgencyScore;
  aiPrediction.sentiment = options.sentiment;
  aiPrediction.spamScore = options.spamScore ?? 0.02;

  const dept = INITIAL_DEPARTMENTS.find((d) => d.id === options.departmentId);
  const user = INITIAL_USERS.find((u) => u.id === options.assignedUserId);

  const activities: Activity[] = [
    {
      id: `act-${id}-1`,
      emailId: id,
      action: "RECEIVED",
      performedBy: "InboxIQ Email Ingestion Gateway",
      details: `Received message from ${sender}`,
      timestamp: receivedDate.toISOString(),
    },
    {
      id: `act-${id}-2`,
      emailId: id,
      action: "AI_CLASSIFIED",
      performedBy: "InboxIQ Neural Engine",
      details: `Triaged to ${dept?.name || "General"} | Urgency ${options.urgencyScore}/100 | Priority ${options.priority}`,
      timestamp: new Date(receivedDate.getTime() + 1500).toISOString(),
    },
  ];

  if (user) {
    activities.push({
      id: `act-${id}-3`,
      emailId: id,
      action: "ASSIGNED",
      performedBy: "Auto-Routing Engine",
      performerAvatar: user.avatar,
      details: `Assigned ticket to ${user.name} (${user.title})`,
      timestamp: new Date(receivedDate.getTime() + 3000).toISOString(),
    });
  }

  return {
    id,
    messageId: `<msg-${id}-${Date.now()}@inboxiq.net>`,
    sender,
    senderName,
    senderAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(senderName)}`,
    receiver: "support@enterprise.inboxiq.io",
    subject,
    body,
    snippet: body.substring(0, 110) + "...",
    summary: aiPrediction.summary,
    category: options.category,
    priority: options.priority,
    urgencyScore: options.urgencyScore,
    sentiment: options.sentiment,
    spamScore: options.spamScore ?? 0.02,
    language: "English",
    status: options.status || (options.assignedUserId ? "ASSIGNED" : "PENDING"),
    departmentId: options.departmentId,
    departmentName: dept?.name,
    assignedUserId: options.assignedUserId,
    assignedUserName: user?.name,
    assignedUserAvatar: user?.avatar,
    isStarred: options.isStarred || false,
    receivedAt: receivedDate.toISOString(),
    slaDeadline: new Date(receivedDate.getTime() + (dept?.slaHours || 4) * 3600 * 1000).toISOString(),
    slaBreached: options.urgencyScore > 90 && options.minutesAgo > 60,
    attachments: options.attachments || [],
    replies: [],
    notes: [],
    activities,
    aiPrediction,
  };
}

export const INITIAL_EMAILS: EmailItem[] = [
  createSampleEmail(
    "em-101",
    "CRITICAL: Production Postgres Cluster Degradation & 500 API Spike",
    "devops-alert@datadoghq-notify.com",
    "Datadog Production Monitor",
    "ALERT [CRITICAL]: Kubernetes cluster us-east-1 production database connection pool has reached 99.4% capacity. P99 latency currently exceeds 4,800ms. Over 1,200 HTTP 500 responses detected across /api/v2/transactions in the last 5 minutes. Immediate failover or replica scale-out required. Incident Runbook #DB-SEC-091.",
    {
      category: "Technical",
      priority: "Critical",
      urgencyScore: 98,
      sentiment: "Frustrated",
      status: "IN_PROGRESS",
      departmentId: "dept-support",
      assignedUserId: "usr-agent-1",
      isStarred: true,
      minutesAgo: 12,
      attachments: [
        {
          id: "att-1",
          emailId: "em-101",
          fileName: "datadog-latency-spike-trace.pdf",
          fileType: "application/pdf",
          size: "1.4 MB",
          url: "#",
        },
      ],
    }
  ),
  createSampleEmail(
    "em-102",
    "Urgent Wire Transfer Instruction Change for Invoice #INV-2026-981",
    "cfo-office@vendor-tech-holdings.co",
    "Robert Sterling (Vendor CFO)",
    "Dear Accounts Team, Please note our primary treasury bank details have changed effective today due to an ongoing banking merger. For payment of invoice #INV-2026-981 totaling $184,500.00 due tomorrow, please remit funds strictly to our new offshore account: Bank of Zurich, Routing #99281921, IBAN #CH9300000000000000. Do NOT send to our previous Wells Fargo account. Please confirm receipt immediately.",
    {
      category: "Security",
      priority: "Critical",
      urgencyScore: 95,
      sentiment: "Urgent",
      spamScore: 0.88,
      status: "ASSIGNED",
      departmentId: "dept-security",
      assignedUserId: "usr-admin-1",
      isStarred: true,
      minutesAgo: 28,
    }
  ),
  createSampleEmail(
    "em-103",
    "Enterprise Subscription Renewal & 500-Seat Expansion ($380,000 ARR)",
    "j.hastings@fintechcorp.global",
    "Jonathan Hastings",
    "Hi Sarah and InboxIQ Team, We are ready to finalize our enterprise contract renewal for FY2026. In addition to renewing our existing 250 seats, our EMEA and APAC regional hubs have requested an additional 250 enterprise seats, bringing total contract value to approximately $380,000. Could you please send over the updated MSA and order form with Net-30 terms so we can route to our legal team before Friday?",
    {
      category: "Sales",
      priority: "High",
      urgencyScore: 82,
      sentiment: "Positive",
      status: "ASSIGNED",
      departmentId: "dept-sales",
      assignedUserId: "usr-admin-1",
      isStarred: true,
      minutesAgo: 45,
    }
  ),
  createSampleEmail(
    "em-104",
    "Immediate Refund Request: Double Billing on Enterprise Plan #ACC-88192",
    "finance@stratuscloud.ai",
    "Elena Rostova",
    "Hello Billing Support, We just noticed on our corporate Amex statement that invoice #INV-8812 was charged twice on August 20th, totaling an accidental overcharge of $24,900.00. Our audit committee requires this credit memo and immediate Stripe refund within 24 hours to avoid disputing the transaction with our bank. Please review account #ACC-88192.",
    {
      category: "Billing",
      priority: "High",
      urgencyScore: 88,
      sentiment: "Frustrated",
      status: "PENDING",
      departmentId: "dept-finance",
      assignedUserId: "usr-mgr-2",
      minutesAgo: 65,
    }
  ),
  createSampleEmail(
    "em-105",
    "GDPR Article 17 Data Erasure Request - User Account #USR-99014",
    "privacy-officer@eurocompliance.eu",
    "Klaus Weber",
    "To the Data Protection Officer: Under Article 17 of the General Data Protection Regulation (EU GDPR), we hereby submit a formal Request for Erasure on behalf of data subject #USR-99014. Please permanently expunge all personally identifiable information, telemetry logs, and third-party tracking cookies within the mandatory 30-day statutory window and furnish a signed certificate of destruction.",
    {
      category: "Legal",
      priority: "Medium",
      urgencyScore: 72,
      sentiment: "Neutral",
      status: "ASSIGNED",
      departmentId: "dept-legal",
      assignedUserId: "usr-emp-1",
      minutesAgo: 110,
    }
  ),
  createSampleEmail(
    "em-106",
    "Hostile Churn Notice: API Rate Limit Drop caused downtime for our launch",
    "cto@omnichannel-retail.com",
    "Marcus Bradley (CTO)",
    "This is completely unacceptable. At 2:00 PM EST today, your rate-limiting gateway throttled our webhook endpoints without any prior warning during our nationwide flash sale, costing us an estimated $75,000 in lost basket conversions. If we do not have an executive root cause analysis (RCA) and custom SLA commitment by 5:00 PM today, we will terminate our contract and transition our stack to your competitor.",
    {
      category: "Complaint",
      priority: "Critical",
      urgencyScore: 94,
      sentiment: "Frustrated",
      status: "IN_PROGRESS",
      departmentId: "dept-support",
      assignedUserId: "usr-mgr-1",
      isStarred: true,
      minutesAgo: 140,
    }
  ),
  createSampleEmail(
    "em-107",
    "Candidate Application: Staff Distributed Systems Engineer - Marcus Vance",
    "marcus.vance.eng@gmail.com",
    "Marcus Vance",
    "Hi Talent Acquisition Team, I am submitting my resume for the Staff Distributed Systems Engineer position. With 10+ years architecting multi-region Kafka and Go microservices at scale, I believe my background aligns well with InboxIQ's ingestion infrastructure. Please find my portfolio, GitHub profile, and resume attached.",
    {
      category: "Recruitment",
      priority: "Medium",
      urgencyScore: 45,
      sentiment: "Positive",
      status: "PENDING",
      departmentId: "dept-hr",
      minutesAgo: 190,
      attachments: [
        {
          id: "att-2",
          emailId: "em-107",
          fileName: "Marcus_Vance_Staff_Resume_2026.pdf",
          fileType: "application/pdf",
          size: "420 KB",
          url: "#",
        },
      ],
    }
  ),
  createSampleEmail(
    "em-108",
    "SOC 2 Type II Compliance Audit Questionnaire & Penetration Test Review",
    "security-assessments@alliancetrust.org",
    "Claire Dupont",
    "Hi Security Operations, As part of our annual vendor risk reassessment for Alliance Trust, we need your completed SIG Lite questionnaire, your latest SOC 2 Type II attestation report, and a summary of your Q2 third-party penetration test. Please upload these to our vendor portal by September 15th.",
    {
      category: "Security",
      priority: "High",
      urgencyScore: 76,
      sentiment: "Neutral",
      status: "ASSIGNED",
      departmentId: "dept-security",
      assignedUserId: "usr-admin-1",
      minutesAgo: 260,
    }
  ),
  createSampleEmail(
    "em-109",
    "Feature Request: Webhook idempotency key support and batch GraphQL mutations",
    "dev-advocate@nexusbuild.dev",
    "Liam Chen",
    "Hey InboxIQ Devs! We love using the automated routing API. One quality-of-life feature that would dramatically simplify our retry queues is native idempotency key headers (X-Idempotency-Key) on incoming webhooks, as well as support for batch GraphQL mutations. Is this on your public product roadmap for Q3/Q4?",
    {
      category: "Feedback",
      priority: "Low",
      urgencyScore: 35,
      sentiment: "Positive",
      status: "RESOLVED",
      departmentId: "dept-support",
      assignedUserId: "usr-agent-1",
      minutesAgo: 380,
    }
  ),
  createSampleEmail(
    "em-110",
    "CONGRATULATIONS: You have won $4,500,000 in International Crypto Sweepstakes",
    "winner-notification@crypto-arbitrage-lottery.xyz",
    "Official Sweepstakes Bureau",
    "DEAR BENEFICIARY, You have been randomly selected as the lucky recipient of 45 BTC ($4,500,000 USD). To claim your immediate blockchain payout, click the link below and provide your private key and seed phrase verification.",
    {
      category: "Spam",
      priority: "Low",
      urgencyScore: 10,
      sentiment: "Neutral",
      spamScore: 0.99,
      status: "SPAM",
      departmentId: "dept-security",
      minutesAgo: 450,
    }
  ),
  createSampleEmail(
    "em-111",
    "Urgent: Annual Enterprise Master Services Agreement (MSA) Redlines",
    "legal-counsel@horizonhealth.care",
    "Victoria Sterling, Esq.",
    "Dear Michael, Attached please find Horizon Healthcare's redline revisions to Section 8.2 (Indemnification Cap) and Section 11 (HIPAA Business Associate Agreement). Our Chief Risk Officer requires these amendments finalized prior to board sign-off on Tuesday. Please review and provide a clean counter-copy.",
    {
      category: "Legal",
      priority: "High",
      urgencyScore: 80,
      sentiment: "Neutral",
      status: "ASSIGNED",
      departmentId: "dept-legal",
      assignedUserId: "usr-emp-1",
      minutesAgo: 510,
      attachments: [
        {
          id: "att-3",
          emailId: "em-111",
          fileName: "Horizon_MSA_Redlines_v3_Final.docx",
          fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: "890 KB",
          url: "#",
        },
      ],
    }
  ),
  createSampleEmail(
    "em-112",
    "HR Inbound: FMLA Medical Leave Extension Request - EMP #4401",
    "jordan.reed@inboxiq.enterprise.io",
    "Jordan Reed",
    "Hi Sarah, I am writing to formally request a 3-week extension on my intermittent FMLA leave due to ongoing physical therapy treatments. My attending physician's certification has been sent directly to the HR portal under case reference #FMLA-4401. Thank you for your continued understanding.",
    {
      category: "HR",
      priority: "Medium",
      urgencyScore: 60,
      sentiment: "Neutral",
      status: "ASSIGNED",
      departmentId: "dept-hr",
      assignedUserId: "usr-admin-1",
      minutesAgo: 600,
    }
  ),
  createSampleEmail(
    "em-113",
    "Partnership Opportunity: Co-marketing webinar on AI Agent Workflow Automation",
    "alliances@techpulse-insights.com",
    "Brooke Harper",
    "Hi Marketing Team, TechPulse is hosting a virtual summit on 'The Future of Autonomous Enterprise AI Agents' on October 24th. We'd love to invite an InboxIQ product leader for a 30-minute keynote slot. We anticipate over 8,000 registered engineering executives.",
    {
      category: "Marketing",
      priority: "Low",
      urgencyScore: 40,
      sentiment: "Positive",
      status: "PENDING",
      departmentId: "dept-sales",
      minutesAgo: 720,
    }
  ),
  createSampleEmail(
    "em-114",
    "How to configure SAML SSO with Okta / Azure AD in our sandbox?",
    "alex.smith@hypergrowth-saas.io",
    "Alex Smith",
    "Hello, We are currently testing InboxIQ in our staging environment and want to configure single sign-on using Okta SAML 2.0 with SCIM directory provisioning. Where can we retrieve the Assertion Consumer Service (ACS) URL and Entity ID?",
    {
      category: "Support",
      priority: "Medium",
      urgencyScore: 55,
      sentiment: "Neutral",
      status: "RESOLVED",
      departmentId: "dept-support",
      assignedUserId: "usr-agent-1",
      minutesAgo: 850,
    }
  ),
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    userId: "usr-admin-1",
    title: "Critical Security Threat Flagged",
    description: "Suspicious offshore wire instruction change detected from Robert Sterling. Risk score 95/100.",
    type: "AI_CLASSIFIED",
    emailId: "em-102",
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-2",
    userId: "usr-agent-1",
    title: "Ticket Auto-Assigned",
    description: "Production Postgres cluster degradation ticket assigned to you based on rule 'Critical Outage Fast-Track'.",
    type: "EMAIL_ASSIGNED",
    emailId: "em-101",
    isRead: false,
    createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-3",
    userId: "usr-admin-1",
    title: "High-Value Enterprise Lead",
    description: "Jonathan Hastings from FinTechCorp requested $380,000 ARR contract expansion.",
    type: "NEW_EMAIL",
    emailId: "em-103",
    isRead: true,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-4",
    userId: "usr-mgr-2",
    title: "SLA Warning: Billing Dispute",
    description: "Elena Rostova refund request has 55 minutes remaining before SLA breach.",
    type: "SLA_WARNING",
    emailId: "em-104",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

// In-Memory Reactive Database Instance
class InboxIQDatabase {
  private users: User[] = [...INITIAL_USERS];
  private departments: Department[] = [...INITIAL_DEPARTMENTS];
  private emails: EmailItem[] = [...INITIAL_EMAILS];
  private rules: RoutingRule[] = [...INITIAL_RULES];
  private notifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

  getUsers(): User[] {
    return this.users;
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getDepartments(): Department[] {
    return this.departments;
  }

  getDepartment(id: string): Department | undefined {
    return this.departments.find((d) => d.id === id);
  }

  getEmails(): EmailItem[] {
    return this.emails.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }

  getEmail(id: string): EmailItem | undefined {
    return this.emails.find((e) => e.id === id);
  }

  getRules(): RoutingRule[] {
    return this.rules;
  }

  getNotifications(userId?: string): NotificationItem[] {
    if (!userId) return this.notifications;
    return this.notifications.filter((n) => n.userId === userId || n.userId === "all");
  }

  addEmail(
    input: {
      subject: string;
      body: string;
      sender: string;
      senderName: string;
      receiver?: string;
    },
    customApiKey?: string
  ): EmailItem {
    const id = `em-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const aiPrediction = runFallbackTriage(input);

    // Apply auto routing rules
    let targetDeptId = "dept-support";
    let priority: PriorityLevel = aiPrediction.urgencyScore >= 85 ? "Critical" : aiPrediction.urgencyScore >= 65 ? "High" : "Medium";
    let assignedUserId: string | undefined = undefined;

    // Check routing rules
    for (const rule of this.rules.filter((r) => r.isActive)) {
      let matched = false;
      const subLower = input.subject.toLowerCase();
      const bodyLower = input.body.toLowerCase();

      if (rule.conditionField === "subject" && (subLower.includes(rule.conditionValue.toLowerCase()) || bodyLower.includes(rule.conditionValue.toLowerCase()))) {
        matched = true;
      } else if (rule.conditionField === "category" && aiPrediction.departmentRecommendation.toLowerCase().includes(rule.conditionValue.toLowerCase())) {
        matched = true;
      } else if (rule.conditionField === "urgencyScore" && aiPrediction.urgencyScore > parseInt(rule.conditionValue)) {
        matched = true;
      }

      if (matched) {
        targetDeptId = rule.targetDepartmentId;
        if (rule.targetPriority) priority = rule.targetPriority;
        if (rule.autoAssignUserId) assignedUserId = rule.autoAssignUserId;
        rule.matchedCount += 1;
        break;
      }
    }

    // Match department
    const dept = this.departments.find((d) => d.id === targetDeptId) || this.departments[0];
    const user = assignedUserId ? this.users.find((u) => u.id === assignedUserId) : undefined;

    const newEmail: EmailItem = {
      id,
      messageId: `<msg-${id}@inboxiq.net>`,
      sender: input.sender,
      senderName: input.senderName,
      senderAvatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(input.senderName)}`,
      receiver: input.receiver || "inbound@enterprise.inboxiq.io",
      subject: input.subject,
      body: input.body,
      snippet: input.body.substring(0, 110) + "...",
      summary: aiPrediction.summary,
      category: (aiPrediction.departmentRecommendation as EmailCategory) || "General",
      priority,
      urgencyScore: aiPrediction.urgencyScore,
      sentiment: aiPrediction.sentiment,
      spamScore: aiPrediction.spamScore,
      language: "English",
      status: aiPrediction.spamScore > 0.85 ? "SPAM" : assignedUserId ? "ASSIGNED" : "PENDING",
      departmentId: dept.id,
      departmentName: dept.name,
      assignedUserId,
      assignedUserName: user?.name,
      assignedUserAvatar: user?.avatar,
      receivedAt: new Date().toISOString(),
      slaDeadline: new Date(Date.now() + dept.slaHours * 3600 * 1000).toISOString(),
      attachments: [],
      replies: [],
      notes: [],
      activities: [
        {
          id: `act-${id}-1`,
          emailId: id,
          action: "RECEIVED",
          performedBy: "Live Email Ingestion Gateway",
          details: `Inbound email received from ${input.sender}`,
          timestamp: new Date().toISOString(),
        },
        {
          id: `act-${id}-2`,
          emailId: id,
          action: "AI_TRIAGED",
          performedBy: "InboxIQ Neural Engine",
          details: `Intent: ${aiPrediction.intent} | Urgency: ${aiPrediction.urgencyScore}/100 | Routed to ${dept.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
      aiPrediction,
    };

    if (user) {
      newEmail.activities.push({
        id: `act-${id}-3`,
        emailId: id,
        action: "AUTO_ASSIGNED",
        performedBy: "Routing Engine",
        performerAvatar: user.avatar,
        details: `Assigned to ${user.name}`,
        timestamp: new Date().toISOString(),
      });
    }

    this.emails.unshift(newEmail);

    // Create Notification
    this.notifications.unshift({
      id: `notif-${Date.now()}`,
      userId: assignedUserId || "usr-admin-1",
      title: priority === "Critical" ? "🚨 Critical Inbound Email" : "New Email Triaged",
      description: `"${input.subject.substring(0, 45)}..." routed to ${dept.name}`,
      type: priority === "Critical" ? "PRIORITY_CHANGED" : "NEW_EMAIL",
      emailId: id,
      isRead: false,
      createdAt: new Date().toISOString(),
    });

    return newEmail;
  }

  updateEmail(id: string, updates: Partial<EmailItem>, performerName = "Sarah Chen"): EmailItem | undefined {
    const email = this.emails.find((e) => e.id === id);
    if (!email) return undefined;

    if (updates.status && updates.status !== email.status) {
      email.activities.push({
        id: `act-${Date.now()}`,
        emailId: id,
        action: "STATUS_CHANGE",
        performedBy: performerName,
        details: `Changed status from ${email.status} to ${updates.status}`,
        timestamp: new Date().toISOString(),
      });
      if (updates.status === "RESOLVED") {
        email.resolvedAt = new Date().toISOString();
      }
    }

    if (updates.priority && updates.priority !== email.priority) {
      email.activities.push({
        id: `act-${Date.now()}`,
        emailId: id,
        action: "PRIORITY_CHANGE",
        performedBy: performerName,
        details: `Updated priority from ${email.priority} to ${updates.priority}`,
        timestamp: new Date().toISOString(),
      });
    }

    if (updates.departmentId && updates.departmentId !== email.departmentId) {
      const dept = this.departments.find((d) => d.id === updates.departmentId);
      email.departmentName = dept?.name;
      email.activities.push({
        id: `act-${Date.now()}`,
        emailId: id,
        action: "DEPARTMENT_CHANGE",
        performedBy: performerName,
        details: `Re-routed to ${dept?.name || updates.departmentId}`,
        timestamp: new Date().toISOString(),
      });
    }

    if (updates.assignedUserId !== undefined && updates.assignedUserId !== email.assignedUserId) {
      const user = this.users.find((u) => u.id === updates.assignedUserId);
      email.assignedUserName = user?.name;
      email.assignedUserAvatar = user?.avatar;
      email.status = user ? "ASSIGNED" : "PENDING";
      email.activities.push({
        id: `act-${Date.now()}`,
        emailId: id,
        action: "REASSIGNED",
        performedBy: performerName,
        details: user ? `Assigned to ${user.name}` : "Unassigned ticket",
        timestamp: new Date().toISOString(),
      });
    }

    Object.assign(email, updates);
    return email;
  }

  addReply(emailId: string, reply: Omit<Reply, "id" | "createdAt">, autoResolve = false): Reply | undefined {
    const email = this.emails.find((e) => e.id === emailId);
    if (!email) return undefined;

    const newReply: Reply = {
      id: `rep-${Date.now()}`,
      ...reply,
      createdAt: new Date().toISOString(),
    };

    email.replies.push(newReply);
    email.activities.push({
      id: `act-${Date.now()}`,
      emailId,
      action: "REPLY_SENT",
      performedBy: reply.userName,
      performerAvatar: reply.userAvatar,
      details: `Sent ${reply.tone} reply (${reply.aiGenerated ? "AI-assisted" : "Manual"})`,
      timestamp: new Date().toISOString(),
    });

    if (autoResolve) {
      email.status = "RESOLVED";
      email.resolvedAt = new Date().toISOString();
      email.activities.push({
        id: `act-${Date.now()}-res`,
        emailId,
        action: "RESOLVED",
        performedBy: reply.userName,
        details: "Ticket marked resolved upon reply dispatch",
        timestamp: new Date().toISOString(),
      });
    }

    return newReply;
  }

  addNote(emailId: string, note: Omit<InternalNote, "id" | "createdAt">): InternalNote | undefined {
    const email = this.emails.find((e) => e.id === emailId);
    if (!email) return undefined;

    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      ...note,
      createdAt: new Date().toISOString(),
    };

    email.notes.push(newNote);
    email.activities.push({
      id: `act-${Date.now()}`,
      emailId,
      action: "INTERNAL_NOTE",
      performedBy: note.userName,
      performerAvatar: note.userAvatar,
      details: "Added an internal team note",
      timestamp: new Date().toISOString(),
    });

    return newNote;
  }

  toggleRule(ruleId: string): RoutingRule | undefined {
    const rule = this.rules.find((r) => r.id === ruleId);
    if (!rule) return undefined;
    rule.isActive = !rule.isActive;
    return rule;
  }

  markNotificationAsRead(id: string): boolean {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.isRead = true;
      return true;
    }
    return false;
  }

  markAllNotificationsRead(): void {
    this.notifications.forEach((n) => (n.isRead = true));
  }

  getDashboardMetrics(): DashboardMetrics {
    const total = this.emails.length;
    const urgent = this.emails.filter((e) => e.priority === "Critical" || e.urgencyScore >= 80).length;
    const pending = this.emails.filter((e) => e.status === "PENDING" || e.status === "ASSIGNED" || e.status === "IN_PROGRESS").length;
    const spam = this.emails.filter((e) => e.status === "SPAM" || e.spamScore >= 0.7).length;
    const resolved = this.emails.filter((e) => e.status === "RESOLVED").length;

    return {
      totalEmails: total + 1280, // combined with historical baseline
      urgentEmails: urgent,
      pendingEmails: pending,
      spamEmails: spam + 412,
      resolvedEmails: resolved + 1145,
      averageResponseTimeMinutes: 14.8,
      aiAccuracyRate: 98.4,
      slaComplianceRate: 99.2,
      weeklyGrowthRate: 18.5,
    };
  }

  getAnalyticsData(): AnalyticsData {
    return {
      trafficByDay: [
        { day: "Mon", received: 184, resolved: 172, urgent: 24 },
        { day: "Tue", received: 245, resolved: 238, urgent: 38 },
        { day: "Wed", received: 312, resolved: 295, urgent: 42 },
        { day: "Thu", received: 280, resolved: 275, urgent: 31 },
        { day: "Fri", received: 340, resolved: 320, urgent: 49 },
        { day: "Sat", received: 95, resolved: 92, urgent: 12 },
        { day: "Sun", received: 110, resolved: 108, urgent: 15 },
      ],
      categoryDistribution: [
        { name: "Support", count: 480, percentage: 38, color: "#0284C7" },
        { name: "Sales", count: 260, percentage: 21, color: "#10B981" },
        { name: "Finance", count: 190, percentage: 15, color: "#14B8A6" },
        { name: "Security", count: 120, percentage: 10, color: "#F43F5E" },
        { name: "Legal", count: 85, percentage: 7, color: "#6366F1" },
        { name: "HR", count: 65, percentage: 5, color: "#EC4899" },
        { name: "Other", count: 50, percentage: 4, color: "#71717A" },
      ],
      priorityBreakdown: [
        { priority: "Critical", count: 48, color: "#F43F5E" },
        { priority: "High", count: 142, color: "#F59E0B" },
        { priority: "Medium", count: 480, color: "#6366F1" },
        { priority: "Low", count: 580, color: "#71717A" },
      ],
      departmentPerformance: [
        { name: "Customer Support", received: 480, resolved: 462, avgMinutes: 12.4, slaPercent: 99.1 },
        { name: "Enterprise Sales", received: 260, resolved: 248, avgMinutes: 28.5, slaPercent: 98.4 },
        { name: "Finance & Billing", received: 190, resolved: 184, avgMinutes: 34.0, slaPercent: 99.5 },
        { name: "Cyber Security", received: 120, resolved: 118, avgMinutes: 6.8, slaPercent: 100.0 },
        { name: "Legal & Compliance", received: 85, resolved: 79, avgMinutes: 72.0, slaPercent: 97.2 },
        { name: "People & HR", received: 65, resolved: 62, avgMinutes: 48.0, slaPercent: 98.0 },
      ],
      sentimentBreakdown: [
        { name: "Positive", value: 42, color: "#10B981" },
        { name: "Neutral", value: 34, color: "#71717A" },
        { name: "Negative", value: 16, color: "#F59E0B" },
        { name: "Frustrated", value: 8, color: "#F43F5E" },
      ],
      agentLeaderboard: [
        {
          id: "usr-agent-1",
          name: "Emily Zhang",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          department: "Customer Support",
          resolvedCount: 412,
          avgMinutes: 11.2,
          csat: 4.95,
        },
        {
          id: "usr-admin-1",
          name: "Sarah Chen",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
          department: "Security & Ops",
          resolvedCount: 342,
          avgMinutes: 14.1,
          csat: 4.92,
        },
        {
          id: "usr-mgr-1",
          name: "Alex Rivera",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
          department: "Support Lead",
          resolvedCount: 284,
          avgMinutes: 18.0,
          csat: 4.88,
        },
        {
          id: "usr-mgr-2",
          name: "David Kim",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
          department: "Finance & RevOps",
          resolvedCount: 195,
          avgMinutes: 24.5,
          csat: 4.85,
        },
      ],
      peakHours: [
        { hour: "8 AM", count: 45 },
        { hour: "9 AM", count: 110 },
        { hour: "10 AM", count: 165 },
        { hour: "11 AM", count: 180 },
        { hour: "12 PM", count: 140 },
        { hour: "1 PM", count: 130 },
        { hour: "2 PM", count: 195 },
        { hour: "3 PM", count: 175 },
        { hour: "4 PM", count: 145 },
        { hour: "5 PM", count: 95 },
      ],
    };
  }
}

// Global Singleton
const globalForDb = global as unknown as { inboxIQDb?: InboxIQDatabase };
export const db = globalForDb.inboxIQDb || new InboxIQDatabase();
if (process.env.NODE_ENV !== "production") globalForDb.inboxIQDb = db;
