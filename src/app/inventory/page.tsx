import { getParts } from '@/actions/part';
import { Package, Plus } from 'lucide-react';
import Link from 'next/link';
import { InventoryTable } from '@/components/InventoryTable';

export default async function InventoryPage() {
  const parts = await getParts();
  return (
    <div className="space-y-7 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-400/80 mb-2">Stock</p>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Package className="text-purple-400" size={30} /> Inventory
          </h1>
          <p className="t-muted mt-1 text-sm">Manage spare parts, stock levels, and pricing.</p>
        </div>
        <Link href="/inventory/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Add Part
        </Link>
      </div>
      <InventoryTable parts={parts} />
    </div>
  );
}
