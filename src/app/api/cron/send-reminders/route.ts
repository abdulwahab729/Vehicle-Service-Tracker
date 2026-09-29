import { NextResponse } from "next/server";
import { PrismaClient, ReminderStatus } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
  });
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET() {
  try {
    const today = new Date();
    
    // Find all pending reminders due today or earlier
    const remindersToProcess = await prisma.maintenanceReminder.findMany({
      where: {
        status: ReminderStatus.PENDING,
        dueDate: {
          lte: today,
        },
      },
      include: {
        vehicle: {
          include: {
            customer: true,
          }
        }
      }
    });

    if (remindersToProcess.length === 0) {
      return NextResponse.json({ message: "No reminders to process today." });
    }

    const processedCount = remindersToProcess.length;

    // Process each reminder (mocking email/SMS sending)
    for (const reminder of remindersToProcess) {
      const customer = reminder.vehicle.customer;
      console.log(`[Cron] Sending reminder to ${customer.firstName} ${customer.lastName} (${customer.email || 'No email'}) for vehicle ${reminder.vehicle.make} ${reminder.vehicle.model}`);
      
      // Update reminder status
      await prisma.maintenanceReminder.update({
        where: { id: reminder.id },
        data: { 
          status: ReminderStatus.SENT,
          sentAt: new Date()
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Processed and sent ${processedCount} reminders.` 
    });

  } catch (error) {
    console.error("Failed to process reminders cron:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
