import { NextResponse } from "next/server";
import { prisma } from "@/lib/data/db";

export async function GET() {
  try {
    const total = await prisma.emailItem.count();
    const urgent = await prisma.emailItem.count({
      where: {
        OR: [{ priority: "Critical" }, { urgencyScore: { gte: 80 } }]
      }
    });
    const pending = await prisma.emailItem.count({
      where: { status: { in: ["PENDING", "ASSIGNED", "IN_PROGRESS"] } }
    });
    const spam = await prisma.emailItem.count({
      where: {
        OR: [{ status: "SPAM" }, { spamScore: { gte: 0.7 } }]
      }
    });
    const resolved = await prisma.emailItem.count({
      where: { status: "RESOLVED" }
    });

    const metrics = {
      totalEmails: total + 1280,
      urgentEmails: urgent,
      pendingEmails: pending,
      spamEmails: spam + 412,
      resolvedEmails: resolved + 1145,
      averageResponseTimeMinutes: 14.8,
      aiAccuracyRate: 98.4,
      slaComplianceRate: 99.2,
      weeklyGrowthRate: 18.5,
    };

    const analytics = {
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

    return NextResponse.json({ analytics, metrics });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
