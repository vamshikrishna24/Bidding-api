import { prisma } from "../startup/db";

export const retrieveNotifications = async (req: any, res: any, next: any) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        is_read: false,
      },
    });
    res.send(notifications);
  } catch (err) {
    next(err);
  }
};

export const markAllasRead = async (req: any, res: any, next: any) => {
  try {
    await prisma.notification.updateMany({
      data: {
        is_read: true,
      },
    });
    res.send("marked as read");
  } catch (err) {
    next(err);
  }
};
