'use client';

import { useState } from 'react';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteInvoice } from '@/actions/invoice';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Invoice = {
  id: string; totalAmount: number; status: string;
  issuedDate: Date; customer: { firstName: string; lastName: string | null };
};

const STATUS_BADGE: Record<string, string> = {
  PAID:    'badge-paid',
  UNPAID:  'badge-unpaid',
  OVERDUE: 'badge-overdue',
  DRAFT:   'badge-draft',
};

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    const q = query.toLowerCase();
    return (
      `${inv.customer.firstName} ${inv.customer.lastName}`.toLowerCase().includes(q) ||
      inv.id.toLowerCase().includes(q) || inv.status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete this invoice?"
        description={`Invoice #${deleteTarget?.id.split('-')[0].toUpperCase()} for ${deleteTarget?.customer.firstName} ${deleteTarget?.customer.lastName} (Rs. ${deleteTarget?.totalAmount.toLocaleString('en-PK')}) will be permanently deleted. This action cannot be undone.`}
        onConfirm={async () => { await deleteInvoice(deleteTarget!.id); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-dim" size={16} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by customer name or status..."
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/40 transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <span className="text-xs t-dim font-medium tabular-nums">{filtered.length} / {invoices.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim" style={{ borderColor: 'var(--border)' }}>
                <th className="px-6 py-3">Invoice #</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Date Issued</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-14 text-center text-sm t-dim">
                  {query ? `No invoices match "${query}"` : 'No invoices generated yet.'}
                </td></tr>
              ) : filtered.map((invoice) => (
                <tr key={invoice.id} className="border-b table-row-hover last:border-0 group" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono font-bold t-muted tracking-wider">
                      #{invoice.id.split('-')[0].toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold t-primary text-sm">
                    {invoice.customer.firstName} {invoice.customer.lastName}
                  </td>
                  <td className="px-6 py-4 font-bold t-primary text-sm tabular-nums">
                    Rs. {invoice.totalAmount.toLocaleString('en-PK')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_BADGE[invoice.status] ?? 'badge-draft'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs t-dim font-medium">
                    {new Date(invoice.issuedDate).toLocaleDateString('en-PK')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(invoice)}
                        title="Delete invoice"
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link href={`/invoices/${invoice.id}`}
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-all">
                        View <ChevronRight size={14} />
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
