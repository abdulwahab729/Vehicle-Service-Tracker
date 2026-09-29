import { PrismaClient } from "@prisma/client";
import ReminderForm from "@/components/ReminderForm";

const prisma = new PrismaClient();

export default async function NewReminderPage() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      customer: true,
    },
    orderBy: {
      customer: {
        firstName: "asc",
      },
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in">
      <h1 className="text-3xl font-extrabold tracking-tight">Schedule Maintenance Reminder</h1>
      
      <div className="rounded-2xl border p-8" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <ReminderForm vehicles={vehicles} />
      </div>
    </div>
  );
}
