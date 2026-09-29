"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, ReminderStatus } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function createReminder(data: {
  vehicleId: string;
  description: string;
  dueDate: Date;
}) {
  try {
    const reminder = await prisma.maintenanceReminder.create({
      data: {
        vehicleId: data.vehicleId,
        description: data.description,
        dueDate: data.dueDate,
        status: ReminderStatus.PENDING,
      },
    });

    revalidatePath("/reminders");
    revalidatePath("/");
    
    return { success: true, data: reminder };
  } catch (error) {
    console.error("Failed to create reminder:", error);
    return { success: false, error: "Failed to create reminder" };
  }
}

export async function updateReminderStatus(
  id: string,
  status: ReminderStatus
) {
  try {
    const reminder = await prisma.maintenanceReminder.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/reminders");
    revalidatePath("/");

    return { success: true, data: reminder };
  } catch (error) {
    console.error("Failed to update reminder status:", error);
    return { success: false, error: "Failed to update reminder status" };
  }
}

export async function getUpcomingReminders() {
  try {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setDate(today.getDate() + 30);

    const reminders = await prisma.maintenanceReminder.findMany({
      where: {
        status: ReminderStatus.PENDING,
        dueDate: {
          lte: nextMonth,
        },
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          }
        }
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    return { success: true, data: reminders };
  } catch (error) {
    console.error("Failed to fetch upcoming reminders:", error);
    return { success: false, error: "Failed to fetch upcoming reminders" };
  }
}
