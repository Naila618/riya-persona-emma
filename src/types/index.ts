export type UserRole = "ADMIN" | "MANAGER" | "SUPPORT_AGENT" | "EMPLOYEE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  departmentId?: string;
  title?: string;
  status?: "ONLINE" | "BUSY" | "AWAY" | "OFFLINE";
  resolvedCount?: number;
  avgResponseMinutes?: number;
}

export type EmailCategory =
  | "Support"
  | "Sales"
  | "Finance"
  | "HR"
  | "Technical"
  | "Complaint"
  | "Feedback"
  | "Marketing"
  | "Spam"
  | "Security"
  | "Recruitment"
  | "General"
  | "Billing"
  | "Legal";

export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

export type SentimentType = "Positive" | "Neutral" | "Negative" | "Frustrated" | "Urgent";

export type EmailStatus = "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "SPAM" | "TRASH";

export type ReplyTone = "Professional" | "Friendly" | "Formal" | "Short" | "Detailed";

export interface Attachment {
  id: string;
  emailId: string;
  fileName: string;
  fileType: string;
  size: string;
  url: string;
}

export interface Reply {
  id: string;
  emailId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  tone: ReplyTone;
  aiGenerated: boolean;
  createdAt: string;
}

export interface InternalNote {
  id: string;
  emailId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  emailId: string;
  action: string;
  performedBy: string;
  performerAvatar?: string;
  details?: string;
  timestamp: string;
}

export interface ExtractedEntity {
  label: string;
  value: string;
  type: "money" | "date" | "order" | "company" | "email" | "endpoint" | "person" | "risk";
}

export interface AIPrediction {
  id: string;
  emailId: string;
  intent: string;
  confidence: number; // 0 to 100
  entities: ExtractedEntity[];
  keywords: string[];
  summary: string;
  summaryBullets?: string[];
  suggestedReplies: Record<ReplyTone, string>;
  riskScore: number; // 0 to 100
  riskFlags: string[];
  departmentRecommendation: string;
  routingReasoning: string;
  urgencyScore: number; // 0 to 100
  sentiment: SentimentType;
  spamScore: number; // 0 to 1.0
  language: string;
}

export interface EmailItem {
  id: string;
  messageId: string;
  sender: string;
  senderName: string;
  senderAvatar?: string;
  receiver: string;
  subject: string;
  body: string;
  snippet: string;
  summary: string;
  category: EmailCategory;
  priority: PriorityLevel;
  urgencyScore: number; // 0-100
  sentiment: SentimentType;
  spamScore: number; // 0.0 - 1.0
  language: string;
  status: EmailStatus;
  departmentId: string;
  departmentName?: string;
  assignedUserId?: string;
  assignedUserName?: string;
  assignedUserAvatar?: string;
  isStarred?: boolean;
  receivedAt: string;
  readAt?: string;
  resolvedAt?: string;
  slaDeadline?: string;
  slaBreached?: boolean;
  attachments: Attachment[];
  replies: Reply[];
  notes: InternalNote[];
  activities: Activity[];
  aiPrediction?: AIPrediction;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  managerId: string;
  managerName: string;
  description: string;
  color: string;
  icon: string;
  slaHours: number;
  activeTicketsCount: number;
  resolvedTodayCount: number;
  autoReplyTemplate?: string;
}

export interface RoutingRule {
  id: string;
  name: string;
  description: string;
  conditionField: "category" | "urgencyScore" | "sentiment" | "subject" | "spamScore" | "keywords";
  conditionOperator: "equals" | "greater_than" | "less_than" | "contains" | "in";
  conditionValue: string;
  targetDepartmentId: string;
  targetDepartmentName: string;
  targetPriority?: PriorityLevel;
  autoAssignUserId?: string;
  isActive: boolean;
  matchedCount: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: "EMAIL_ASSIGNED" | "PRIORITY_CHANGED" | "AI_CLASSIFIED" | "NEW_EMAIL" | "DEPARTMENT_UPDATED" | "REPLY_SENT" | "SLA_WARNING";
  emailId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  totalEmails: number;
  urgentEmails: number;
  pendingEmails: number;
  spamEmails: number;
  resolvedEmails: number;
  averageResponseTimeMinutes: number;
  aiAccuracyRate: number;
  slaComplianceRate: number;
  weeklyGrowthRate: number;
}

export interface AnalyticsData {
  trafficByDay: { day: string; received: number; resolved: number; urgent: number }[];
  categoryDistribution: { name: string; count: number; percentage: number; color: string }[];
  priorityBreakdown: { priority: string; count: number; color: string }[];
  departmentPerformance: {
    name: string;
    received: number;
    resolved: number;
    avgMinutes: number;
    slaPercent: number;
  }[];
  sentimentBreakdown: { name: string; value: number; color: string }[];
  agentLeaderboard: {
    id: string;
    name: string;
    avatar: string;
    department: string;
    resolvedCount: number;
    avgMinutes: number;
    csat: number;
  }[];
  peakHours: { hour: string; count: number }[];
}
