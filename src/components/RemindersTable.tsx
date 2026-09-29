"use client";

import { useState } from "react";
import { updateReminderStatus } from "@/actions/reminders";
import { ReminderStatus } from "@prisma/client";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

type Reminder = {
  id: string;
  vehicle: {
    make: string;
    model: string;
    licensePlate: string;
    customer: {
      firstName: string;
      lastName: string | null;
    };
  };
  description: string;
  dueDate: Date;
  status: ReminderStatus;
  sentAt: Date | null;
};

export default function RemindersTable({
  initialReminders,
}: {
  initialReminders: Reminder[];
}) {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (id: string, status: ReminderStatus) => {
    setLoading(id);
    const result = await updateReminderStatus(id, status);
    if (result.success && result.data) {
      setReminders(reminders.map(r => r.id === id ? { ...r, status: result.data.status } : r));
      router.refresh();
    } else {
      alert("Failed to update status");
    }
    setLoading(null);
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim"
            style={{ borderColor: 'var(--border)' }}>
            <th className="px-6 py-3">Vehicle / Customer</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Due Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reminders.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-14 text-center text-sm t-dim">
                No reminders found.
              </td>
            </tr>
          ) : (
            reminders.map((reminder) => (
              <tr key={reminder.id} className="border-b table-row-hover last:border-0"
                style={{ borderColor: 'var(--border)' }}>
                <td className="px-6 py-4">
                  <div className="font-semibold t-primary text-sm">
                    {reminder.vehicle.make} {reminder.vehicle.model} ({reminder.vehicle.licensePlate})
                  </div>
                  <div className="text-xs t-dim mt-0.5">
                    {reminder.vehicle.customer.firstName} {reminder.vehicle.customer.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm t-secondary font-medium">{reminder.description}</td>
                <td className="px-6 py-4 text-xs t-dim font-medium">
                  {format(new Date(reminder.dueDate), "MMM dd, yyyy")}
                  {reminder.dueDate < new Date() && reminder.status === "PENDING" && (
                    <span className="ml-2 px-2.5 py-1 rounded-full text-[11px] font-semibold badge-overdue">
                      Overdue
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    reminder.status === "PENDING" ? "badge-pending" :
                    reminder.status === "SENT" ? "badge-progress" :
                    reminder.status === "COMPLETED" ? "badge-complete" :
                    "badge-cancel"
                  }`}>
                    {reminder.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <select
                    value={reminder.status}
                    onChange={(e) => handleStatusChange(reminder.id, e.target.value as ReminderStatus)}
                    disabled={loading === reminder.id}
                    className="themed-input ml-auto bg-transparent border rounded-md text-xs font-medium focus:ring-2 focus:ring-blue-500/40 p-1.5 outline-none transition-all"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="SENT">Sent</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
