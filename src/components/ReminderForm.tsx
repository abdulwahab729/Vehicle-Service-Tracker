"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createReminder } from "@/actions/reminders";
import { SubmitButton } from "@/components/SubmitButton";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReminderForm({ vehicles }: { vehicles: any[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const vehicleId = formData.get("vehicleId") as string;
    const description = formData.get("description") as string;
    const dueDateStr = formData.get("dueDate") as string;

    if (!vehicleId || !description || !dueDateStr) {
      setError("All fields are required");
      return;
    }

    const dueDate = new Date(dueDateStr);
    
    const result = await createReminder({ vehicleId, description, dueDate });
    
    if (result.success) {
      router.push("/reminders");
      router.refresh();
    } else {
      setError(result.error || "Failed to schedule reminder");
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-500/10 rounded-xl border border-red-500/20">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="vehicleId" className="block text-xs font-semibold uppercase tracking-wider t-muted mb-2">
          Vehicle
        </label>
        <select
          id="vehicleId"
          name="vehicleId"
          required
          className="themed-input w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        >
          <option value="">Select a vehicle...</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.customer.firstName} {v.customer.lastName} - {v.make} {v.model} ({v.licensePlate})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-xs font-semibold uppercase tracking-wider t-muted mb-2">
          Reminder Description
        </label>
        <input
          type="text"
          id="description"
          name="description"
          required
          placeholder="e.g. Oil Change, Tire Rotation"
          className="themed-input w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        />
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-xs font-semibold uppercase tracking-wider t-muted mb-2">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          required
          className="themed-input w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500/40 outline-none transition-all"
          style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
        />
      </div>

      <div className="pt-4">
        <SubmitButton 
          label="Schedule Reminder" 
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 justify-center" 
        />
      </div>
    </form>
  );
}
