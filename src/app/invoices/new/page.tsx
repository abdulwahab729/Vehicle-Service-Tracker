import { createInvoice } from '@/actions/invoice';
import { getCustomers } from '@/actions/customer';
import { getActiveJobs } from '@/actions/job';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const selectCls = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-rose-500/40 transition-all";
const labelCls  = "block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5";
const fieldStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)' };

export default async function NewInvoicePage() {
  const customers = await getCustomers();
  const jobs      = await getActiveJobs();

  async function handleSubmit(formData: FormData) {
    'use server';
    await createInvoice({
      customerId:  formData.get('customerId') as string,
      jobOrderId:  formData.get('jobOrderId') as string,
      totalAmount: parseFloat(formData.get('totalAmount') as string),
    });
    redirect('/invoices');
  }

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-in">
      <div className="flex items-center gap-3">
        <Link href="/invoices" className="p-2 rounded-xl t-muted hover:t-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400/80 mb-1">Billing</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <FileText className="text-rose-400" size={24} /> Generate Invoice
          </h1>
        </div>
      </div>

      <form action={handleSubmit} className="rounded-2xl border p-7 space-y-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div>
          <label htmlFor="customerId" className={labelCls}>Billed Customer <span className="text-rose-500 normal-case">*</span></label>
          <select id="customerId" required name="customerId" className={selectCls} style={fieldStyle}>
            <option value="">— Select a Customer —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.phone})</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="jobOrderId" className={labelCls}>Associated Job Order <span className="text-rose-500 normal-case">*</span></label>
          <select id="jobOrderId" required name="jobOrderId" className={selectCls} style={fieldStyle}>
            <option value="">— Select a Job Order —</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.vehicle.customer.firstName} {j.vehicle.customer.lastName} — {j.vehicle.licensePlate} — {j.description}
              </option>
            ))}
          </select>
          <p className="text-[11px] t-dim mt-1.5">Each job can only be invoiced once.</p>
        </div>

        <div>
          <label htmlFor="totalAmount" className={labelCls}>Total Amount (Rs.) <span className="text-rose-500 normal-case">*</span></label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-bold t-muted">Rs.</span>
            <input id="totalAmount" required name="totalAmount" type="number" step="1" min="0" placeholder="0"
              className="themed-input w-full pl-14 pr-4 py-4 rounded-xl text-3xl font-extrabold outline-none focus:ring-2 focus:ring-rose-500/40 transition-all tabular-nums"
              style={fieldStyle} />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton label="Issue Invoice" pendingLabel="Generating..."
            className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-500/25" />
        </div>
      </form>
    </div>
  );
}
