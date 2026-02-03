import { prisma } from "../config/db";
import { sendNotificationEmail, getGenericHtml } from "./email";

export const notifyUsers = async ({
  userIds,
  title,
  message,
  resourceId,
  assignmentId,
  html,
}: {
  userIds: string[];
  title: string;
  message: string;
  resourceId?: number;
  assignmentId?: number;
  html?: string;
}) => {
  try {
    const notifications = userIds.map((uid) => ({
      user_id: uid,
      title,
      message,
      resource_id: resourceId,
      assignment_id: assignmentId,
    }));

    await (prisma as any).notification.createMany({
      data: notifications,
    });

    // Email Dispatch Protocol
    const recipients = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { email: true, first_name: true },
    });

    for (const user of recipients) {
      if (user.email) {
        await sendNotificationEmail(
          user.email,
          title,
          message,
          html ||
            getGenericHtml(
              title,
              `Dear ${user.first_name || "User"},\n\n${message}`,
            ),
        );
      }
    }
  } catch (error) {
    console.error("Failed to send notifications:", error);
  }
};

export const notifyNewsletterSubscribers = async (
  title: string,
  message: string,
  html?: string,
) => {
  try {
    const subscribers = await (prisma as any).newsletterSubscription.findMany({
      select: { email: true },
    });

    for (const sub of subscribers) {
      if (sub.email) {
        await sendNotificationEmail(
          sub.email,
          title,
          message,
          html || getGenericHtml(title, message),
        );
      }
    }
  } catch (error) {
    console.error("Failed to notify newsletter subscribers:", error);
  }
};

export const notifyAllByRole = async (
  roleName: string,
  title: string,
  message: string,
) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: { name: roleName } },
      select: { id: true },
    });

    if (users.length > 0) {
      await notifyUsers({
        userIds: users.map((u) => u.id),
        title,
        message,
      });
    }
  } catch (error) {
    console.error("Failed to send role notifications:", error);
  }
};

// Global Broadcast: Both registered users and newsletter subscribers
export const notifyAll = async (
  title: string,
  message: string,
  html?: string,
) => {
  try {
    // 1. Notify Registered Users (Internal + Email)
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    if (users.length > 0) {
      await notifyUsers({
        userIds: users.map((u) => u.id),
        title,
        message,
        html,
      });
    }

    // 2. Notify Newsletter Subscribers (Email Only)
    await notifyNewsletterSubscribers(title, message, html);
  } catch (error) {
    console.error("Failed to send global notifications:", error);
  }
};
