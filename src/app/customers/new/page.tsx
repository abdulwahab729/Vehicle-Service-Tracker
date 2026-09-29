import { createCustomer } from '@/actions/customer';
import { Users, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const inputCls = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/40 transition-all";
const labelCls = "block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5";

export default function NewCustomerPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    await createCustomer({
      firstName: formData.get('firstName') as string,
      lastName:  (formData.get('lastName') as string) || undefined,
      email:     (formData.get('email') as string) || undefined,
      phone:     formData.get('phone') as string,
      address:   (formData.get('address') as string) || undefined,
    });
    redirect('/customers');
  }

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-in">
      <div className="flex items-center gap-3">
        <Link href="/customers" className="p-2 rounded-xl t-muted hover:t-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400/80 mb-1">Customers</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="text-indigo-400" size={24} /> Add New Customer
          </h1>
        </div>
      </div>

      <form action={handleSubmit} className="rounded-2xl border p-7 space-y-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className={labelCls}>First Name <span className="text-rose-500 normal-case">*</span></label>
            <input id="firstName" required name="firstName" type="text" placeholder="Ahmad"
              className={inputCls} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
          </div>
          <div>
            <label htmlFor="lastName" className={labelCls}>Last Name</label>
            <input id="lastName" name="lastName" type="text" placeholder="Raza"
              className={inputCls} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className={labelCls}>Phone Number <span className="text-rose-500 normal-case">*</span></label>
          <input id="phone" required name="phone" type="tel" placeholder="03XX-XXXXXXX"
            pattern="^((\+92)?(0092)?(0)?)(3[0-9]{2})-?([0-9]{7})$"
            title="Pakistani phone number (e.g. 0300-1234567)"
            className={inputCls} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
          <p className="text-[11px] t-dim mt-1.5">Pakistani format: 0321-1234567 or +923211234567</p>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>Email <span className="t-dim normal-case font-normal">(optional)</span></label>
          <input id="email" name="email" type="email" placeholder="ahmad@example.com"
            className={inputCls} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
        </div>

        <div>
          <label htmlFor="address" className={labelCls}>Address <span className="t-dim normal-case font-normal">(optional)</span></label>
          <input id="address" name="address" type="text" placeholder="e.g. Gulshan-e-Iqbal, Karachi"
            className={inputCls} style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton label="Save Customer" pendingLabel="Saving..."
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25" />
        </div>
      </form>
    </div>
  );
}
