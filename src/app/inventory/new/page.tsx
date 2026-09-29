import { createPart } from '@/actions/part';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const inputCls  = "themed-input w-full px-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500/40 transition-all";
const labelCls  = "block text-xs font-semibold uppercase tracking-wider t-muted mb-1.5";
const fieldStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)' };

export default function NewPartPage() {
  async function handleSubmit(formData: FormData) {
    'use server';
    await createPart({
      name:        formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      partNumber:  (formData.get('partNumber') as string).toUpperCase(),
      stockLevel:  parseInt(formData.get('stockLevel') as string),
      unitPrice:   parseFloat(formData.get('unitPrice') as string),
    });
    redirect('/inventory');
  }

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-in">
      <div className="flex items-center gap-3">
        <Link href="/inventory" className="p-2 rounded-xl t-muted hover:t-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/80 mb-1">Inventory</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Package className="text-purple-400" size={24} /> Add Inventory Item
          </h1>
        </div>
      </div>

      <form action={handleSubmit} className="rounded-2xl border p-7 space-y-5"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className={labelCls}>Part Name <span className="text-rose-500 normal-case">*</span></label>
            <input id="name" required name="name" type="text" placeholder="e.g. Engine Oil Filter"
              className={inputCls} style={fieldStyle} />
          </div>
          <div>
            <label htmlFor="partNumber" className={labelCls}>Part No. / SKU <span className="text-rose-500 normal-case">*</span></label>
            <input id="partNumber" required name="partNumber" type="text" placeholder="TOY-OIL-001"
              className={`${inputCls} uppercase font-mono`} style={fieldStyle} />
          </div>
        </div>

        <div>
          <label htmlFor="description" className={labelCls}>Description <span className="t-dim normal-case font-normal">(optional)</span></label>
          <textarea id="description" name="description" rows={2}
            placeholder="Compatible vehicles, specifications..."
            className={`${inputCls} resize-none`} style={fieldStyle} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stockLevel" className={labelCls}>Initial Stock <span className="text-rose-500 normal-case">*</span></label>
            <input id="stockLevel" required name="stockLevel" type="number" min="0" defaultValue="0"
              className={inputCls} style={fieldStyle} />
            <p className="text-[11px] t-dim mt-1.5">Alert at ≤ 10 units</p>
          </div>
          <div>
            <label htmlFor="unitPrice" className={labelCls}>Unit Price (Rs.) <span className="text-rose-500 normal-case">*</span></label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold t-muted">Rs.</span>
              <input id="unitPrice" required name="unitPrice" type="number" step="1" min="0" placeholder="0"
                className={`${inputCls} pl-10`} style={fieldStyle} />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton label="Add Part" pendingLabel="Adding..."
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/25" />
        </div>
      </form>
    </div>
  );
}
