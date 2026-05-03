import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// 1. Define your plan credits here
const PLAN_CREDITS = {
  free: 10,
  pro: 50,
  ultra: 100,
};

// 2. Helper function to check if credits should be refilled (e.g., once a month)
const shouldAllocateCredits = (dbUser, currentPlan) => {
  if (!dbUser.creditsLastAllocatedAt) return true;

  const now = new Date();
  const lastAllocated = new Date(dbUser.creditsLastAllocatedAt);

  // Check if a month has passed since last allocation
  return (
    now.getMonth() !== lastAllocated.getMonth() ||
    now.getFullYear() !== lastAllocated.getFullYear()
  );
};

const getCurrentPlan = async (user) => {
  // Clerk publicMetadata se plan nikalna, default "free"
  return user?.publicMetadata?.plan ?? "free";
};

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    const currentPlan = await getCurrentPlan(user);

    // FIX: Ab PLAN_CREDITS defined hai, toh crash nahi hoga
    // Agar plan match nahi hota toh default 0 credits
    const credits = PLAN_CREDITS[currentPlan.toLowerCase()] ?? 0;

    if (dbUser) {
      if (dbUser.role === "INTERVIEWER") return dbUser;

      if (shouldAllocateCredits(dbUser, currentPlan)) {
        const rolledCredits = (dbUser.credits ?? 0) + credits;

        return await db.user.update({
          where: { clerkUserId: user.id },
          data: {
            credits: rolledCredits,
            currentPlan,
            creditsLastAllocatedAt: new Date(),
          },
        });
      }

      return dbUser;
    }

    // New user creation logic
    return await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        imageUrl: user.imageUrl ?? "",
        email: user.emailAddresses?.[0]?.emailAddress ?? "",
        credits,
        currentPlan,
        creditsLastAllocatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};