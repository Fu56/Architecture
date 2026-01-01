import { prisma } from "../config/db";

export const notifyUsers = async ({
  userIds,
  title,
  message,
  resourceId,
  assignmentId,
}: {
  userIds: string[];
  title: string;
  message: string;
  resourceId?: number;
  assignmentId?: number;
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
  } catch (error) {
    console.error("Failed to send notifications:", error);
  }
};

export const notifyAllByRole = async (
  roleName: string,
  title: string,
  message: string
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

export const notifyAll = async (title: string, message: string) => {
  try {
    const users = await prisma.user.findMany({
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
    console.error("Failed to send global notifications:", error);
  }
};
