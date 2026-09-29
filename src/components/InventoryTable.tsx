'use client';

import { useState } from 'react';
import { Search, AlertCircle, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deletePart } from '@/actions/part';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Part = {
  id: string; name: string; description: string | null;
  partNumber: string; unitPrice: number; stockLevel: number;
};

export function InventoryTable({ parts }: { parts: Part[] }) {
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Part | null>(null);

  const filtered = parts.filter((p) => {
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.partNumber.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        description={`Part #${deleteTarget?.partNumber} will be permanently removed from inventory. Any job history referencing this part will also be cleaned up. This action cannot be undone.`}
        onConfirm={async () => { await deletePart(deleteTarget!.id); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-dim" size={16} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by part name or number..."
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <span className="text-xs t-dim font-medium tabular-nums">{filtered.length} / {parts.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim" style={{ borderColor: 'var(--border)' }}>
                <th className="px-6 py-3">Part Name</th>
                <th className="px-6 py-3">Part No. / SKU</th>
                <th className="px-6 py-3">Unit Price</th>
                <th className="px-6 py-3">Stock Level</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-14 text-center text-sm t-dim">
                  {query ? `No parts match "${query}"` : 'No parts in inventory. Click "Add Part" to create one.'}
                </td></tr>
              ) : filtered.map((part) => (
                <tr key={part.id} className="border-b table-row-hover last:border-0 group" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="font-semibold t-primary text-sm">{part.name}</div>
                    <div className="text-xs t-dim max-w-[180px] truncate mt-0.5">{part.description || '—'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-300 px-2 py-1 rounded-lg"
                      style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                      {part.partNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400 text-sm">
                    Rs. {part.unitPrice.toLocaleString('en-PK')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-extrabold tabular-nums ${part.stockLevel <= 10 ? 'text-rose-500' : 't-primary'}`}>
                        {part.stockLevel}
                      </span>
                      {part.stockLevel <= 10 && (
                        <span className="flex items-center gap-1 text-[11px] text-rose-500 font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(244,63,94,0.10)', border: '1px solid rgba(244,63,94,0.22)' }}>
                          <AlertCircle size={11} /> Low
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(part)}
                        title="Delete part"
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link href={`/inventory/${part.id}`}
                        className="inline-flex items-center gap-1 text-xs text-purple-500 hover:text-purple-400 font-semibold transition-all">
                        Edit <ChevronRight size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
