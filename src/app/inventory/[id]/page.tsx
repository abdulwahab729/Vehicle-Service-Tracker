import { getParts } from '@/actions/part';
import { updatePartStock } from '@/actions/part';
import { Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function InventoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parts = await getParts();
  const part = parts.find((p) => p.id === id);

  if (!part) notFound();

  async function handleStockUpdate(formData: FormData) {
    'use server';
    const newStock = parseInt(formData.get('stockLevel') as string);
    await updatePartStock(id, newStock);
    revalidatePath(`/inventory/${id}`);
    redirect('/inventory');
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/inventory" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Package className="text-purple-500" size={32} />
            {part.name}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-mono text-sm">{part.partNumber}</p>
        </div>
      </div>

      {/* Part Details */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl space-y-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Part Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <InfoRow label="Part Name" value={part.name} />
          <InfoRow label="Part No. / SKU" value={part.partNumber} mono />
          <InfoRow label="Unit Price" value={`Rs. ${part.unitPrice.toLocaleString('en-PK')}`} />
          <InfoRow label="Current Stock" value={String(part.stockLevel)} />
          {part.description && (
            <div className="col-span-2">
              <InfoRow label="Description" value={part.description} />
            </div>
          )}
        </div>

        {/* Stock Update Form */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Update Stock Level</h3>
          <form action={handleStockUpdate} className="flex gap-3 items-end">
            <div className="space-y-1 flex-1">
              <label htmlFor="stockLevel" className="text-xs text-slate-500">New Stock Level</label>
              <input
                id="stockLevel"
                name="stockLevel"
                type="number"
                min="0"
                defaultValue={part.stockLevel}
                required
                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-purple-500/30 transition-all"
            >
              Update Stock
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-slate-900 dark:text-white font-medium ${mono ? 'font-mono tracking-widest' : ''}`}>{value}</p>
    </div>
  );
}
