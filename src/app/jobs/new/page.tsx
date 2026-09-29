import { createJob, getTechnicians } from '@/actions/job';
import { getVehicles } from '@/actions/vehicle';
import { Wrench, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const inputCls  = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/40 transition-all";
const selectCls = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-500/40 transition-all";
const labelCls  = "block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5";
const fieldStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)' };

const SERVICE_TYPES = [
  'Oil Change','Engine Tune-Up','Brake Inspection / Replacement','Tyre Change / Balancing',
  'Battery Replacement','AC Service / Gas Refill','Suspension & Shock Absorber','Wheel Alignment',
  'Clutch Repair','Gearbox Overhaul','Radiator Flush / Coolant Change','Full Service / Car Wash',
];

export default async function NewJobPage() {
  const [vehicles, technicians] = await Promise.all([
    getVehicles(),
    getTechnicians()
  ]);

  async function handleSubmit(formData: FormData) {
    'use server';
    await createJob({
      vehicleId:   formData.get('vehicleId') as string,
      description: formData.get('description') as string,
      notes:       (formData.get('notes') as string) || undefined,
      userId:      (formData.get('technicianId') as string) || undefined,
    });
    redirect('/jobs');
  }

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-in">
      <div className="flex items-center gap-3">
        <Link href="/jobs" className="p-2 rounded-xl t-muted hover:t-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400/80 mb-1">Workshop</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Wrench className="text-orange-400" size={24} /> Create Job Order
          </h1>
        </div>
      </div>

      <form action={handleSubmit} className="rounded-2xl border p-7 space-y-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div>
          <label htmlFor="vehicleId" className={labelCls}>Select Vehicle <span className="text-rose-500 normal-case">*</span></label>
          <select id="vehicleId" required name="vehicleId" className={selectCls} style={fieldStyle}>
            <option value="">— Select a Vehicle —</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.customer.firstName} {v.customer.lastName} — {v.year} {v.make} {v.model} ({v.licensePlate})
              </option>
            ))}
          </select>
          <p className="text-[11px] t-dim mt-1.5">Format: Owner — Year Make Model (Reg. No.)</p>
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>Service / Problem <span className="text-rose-500 normal-case">*</span></label>
          <input id="description" name="description" type="text" list="services-list" required
            placeholder="e.g. Oil Change, Brake Repair..."
            className={inputCls} style={fieldStyle} />
          <datalist id="services-list">{SERVICE_TYPES.map((s) => <option key={s} value={s} />)}</datalist>
          <p className="text-[11px] t-dim mt-1.5">Type or pick from common service types</p>
        </div>

        <div>
          <label htmlFor="technicianId" className={labelCls}>Assign Mech / Tech <span className="t-dim normal-case font-normal">(optional)</span></label>
          <select id="technicianId" name="technicianId" className={selectCls} style={fieldStyle}>
            <option value="">— Unassigned —</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="notes" className={labelCls}>Notes <span className="t-dim normal-case font-normal">(optional)</span></label>
          <textarea id="notes" name="notes" rows={3}
            placeholder="Special instructions, observed issues..."
            className={`${inputCls} resize-none`} style={fieldStyle} />
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton label="Create Job" pendingLabel="Creating..."
            className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25" />
        </div>
      </form>
    </div>
  );
}
