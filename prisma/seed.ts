import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { INITIAL_USERS, INITIAL_DEPARTMENTS, INITIAL_RULES, INITIAL_EMAILS, INITIAL_NOTIFICATIONS } from '../src/lib/data/mock-db'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Clearing database...')
  await prisma.notificationItem.deleteMany()
  await prisma.activity.deleteMany()
  await prisma.internalNote.deleteMany()
  await prisma.reply.deleteMany()
  await prisma.attachment.deleteMany()
  await prisma.keyword.deleteMany()
  await prisma.extractedEntity.deleteMany()
  await prisma.aIPrediction.deleteMany()
  await prisma.emailItem.deleteMany()
  await prisma.routingRule.deleteMany()
  await prisma.department.deleteMany()
  await prisma.user.deleteMany()

  console.log('Seeding Users...')
  for (const user of INITIAL_USERS) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        status: user.status,
        resolvedCount: user.resolvedCount,
        avgResponseMinutes: user.avgResponseMinutes,
      }
    })
  }

  console.log('Seeding Departments...')
  for (const dept of INITIAL_DEPARTMENTS) {
    await prisma.department.create({
      data: {
        id: dept.id,
        name: dept.name,
        code: dept.code,
        description: dept.description,
        color: dept.color,
        icon: dept.icon,
        slaHours: dept.slaHours,
        activeTicketsCount: dept.activeTicketsCount,
        resolvedTodayCount: dept.resolvedTodayCount,
        managerId: dept.managerId,
      }
    })
  }

  // Update Users with their department
  for (const user of INITIAL_USERS) {
    if (user.departmentId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { departmentId: user.departmentId }
      })
    }
  }

  console.log('Seeding Rules...')
  for (const rule of INITIAL_RULES) {
    await prisma.routingRule.create({
      data: {
        ...rule
      }
    })
  }

  console.log('Seeding Emails...')
  for (const email of INITIAL_EMAILS) {
    // Create base email
    await prisma.emailItem.create({
      data: {
        id: email.id,
        messageId: email.messageId,
        sender: email.sender,
        senderName: email.senderName,
        senderAvatar: email.senderAvatar,
        receiver: email.receiver,
        subject: email.subject,
        body: email.body,
        snippet: email.snippet,
        summary: email.summary,
        category: email.category,
        priority: email.priority,
        urgencyScore: email.urgencyScore,
        sentiment: email.sentiment,
        spamScore: email.spamScore,
        language: email.language,
        status: email.status,
        isStarred: email.isStarred,
        receivedAt: new Date(email.receivedAt),
        slaDeadline: email.slaDeadline ? new Date(email.slaDeadline) : null,
        slaBreached: email.slaBreached,
        departmentId: email.departmentId,
        assignedUserId: email.assignedUserId,
      }
    })

    // Attachments
    if (email.attachments && email.attachments.length > 0) {
      await prisma.attachment.createMany({
        data: email.attachments.map(att => ({
          ...att,
          emailId: email.id
        }))
      })
    }

    // Activities
    if (email.activities && email.activities.length > 0) {
      await prisma.activity.createMany({
        data: email.activities.map(act => ({
          id: act.id,
          emailId: act.emailId,
          action: act.action,
          performedBy: act.performedBy,
          performerAvatar: act.performerAvatar,
          details: act.details,
          timestamp: new Date(act.timestamp),
          // map userId logic could be complex for mock data, leaving null for now
        }))
      })
    }

    // AI Prediction
    if (email.aiPrediction) {
      await prisma.aIPrediction.create({
        data: {
          emailId: email.id,
          intent: email.aiPrediction.intent,
          confidence: email.aiPrediction.confidence,
          summary: email.aiPrediction.summary,
          summaryBullets: email.aiPrediction.summaryBullets,
          suggestedReplies: JSON.stringify(email.aiPrediction.suggestedReplies),
          riskScore: email.aiPrediction.riskScore,
          riskFlags: email.aiPrediction.riskFlags,
          departmentRecommendation: email.aiPrediction.departmentRecommendation,
          routingReasoning: email.aiPrediction.routingReasoning,
          urgencyScore: email.aiPrediction.urgencyScore,
          sentiment: email.aiPrediction.sentiment,
          spamScore: email.aiPrediction.spamScore,
          language: email.aiPrediction.language,
        }
      })
    }
  }

  console.log('Seeding Notifications...')
  for (const notification of INITIAL_NOTIFICATIONS) {
    await prisma.notificationItem.create({
      data: {
        id: notification.id,
        userId: notification.userId === "all" ? INITIAL_USERS[0].id : notification.userId, // map "all" properly or just use admin for now
        title: notification.title,
        description: notification.description,
        type: notification.type,
        emailId: notification.emailId,
        isRead: notification.isRead,
        createdAt: new Date(notification.createdAt),
      }
    })
  }

  console.log('Seeding Complete! 🎉')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
