import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import RemindersTable from "@/components/RemindersTable";

const prisma = new PrismaClient();

export default async function RemindersPage() {
  const reminders = await prisma.maintenanceReminder.findMany({
    include: {
      vehicle: {
        include: {
          customer: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Maintenance Reminders</h1>
        <Link
          href="/reminders/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5"
        >
          Schedule Reminder
        </Link>
      </div>
      
      <div className="animate-in">
        <RemindersTable initialReminders={reminders} />
      </div>
    </div>
  );
}
