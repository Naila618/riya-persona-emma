import { NextResponse } from "next/server";
import { db } from "@/lib/data/mock-db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const notifications = db.getNotifications(userId);
    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      db.markAllNotificationsRead();
      return NextResponse.json({ success: true });
    }

    if (notificationId) {
      db.markNotificationAsRead(notificationId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "No action specified" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
