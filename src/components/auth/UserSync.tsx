import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/data/db";

export async function UserSync() {
  const { userId } = await auth();
  const user = await currentUser();

  if (userId && user) {
    const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || "unknown@example.com";
    const name = user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : primaryEmail.split('@')[0];
    
    try {
      await prisma.user.upsert({
        where: { id: userId },
        update: {
          name,
          email: primaryEmail,
          avatar: user.imageUrl,
        },
        create: {
          id: userId,
          name,
          email: primaryEmail,
          role: "SUPPORT_AGENT",
          avatar: user.imageUrl,
          title: "Support Agent",
        }
      });
    } catch (e) {
      console.error("Failed to sync user to database:", e);
    }
  }

  return null;
}
