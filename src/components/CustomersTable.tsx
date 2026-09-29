'use client';

import { useState } from 'react';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteCustomer } from '@/actions/customer';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Customer = {
  id: string; firstName: string; lastName: string | null;
  email: string | null; phone: string; address: string | null; createdAt: Date;
};

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.firstName.toLowerCase().includes(q) || c.lastName.toLowerCase().includes(q) ||
      c.phone.includes(q) || (c.email ?? '').toLowerCase().includes(q) ||
      (c.address ?? '').toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.firstName} ${deleteTarget?.lastName}?`}
        description="This will permanently delete the customer along with all their vehicles, job orders, service records, and invoices. This action cannot be undone."
        onConfirm={async () => { await deleteCustomer(deleteTarget!.id); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Search bar */}
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-dim" size={16} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <span className="text-xs t-dim font-medium tabular-nums">
            {filtered.length} / {customers.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim"
                style={{ borderColor: 'var(--border)' }}>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Contact</th>
                <th className="px-6 py-3">Address</th>
                <th className="px-6 py-3">Added On</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-14 text-center text-sm t-dim">
                  {query ? `No customers match "${query}"` : 'No customers found. Click "Add Customer" to create one.'}
                </td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="border-b table-row-hover last:border-0 group"
                  style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="font-semibold t-primary text-sm">{c.firstName} {c.lastName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium t-secondary">{c.phone}</div>
                    <div className="text-xs t-dim mt-0.5">{c.email || 'No email'}</div>
                  </td>
                  <td className="px-6 py-4 text-sm t-muted max-w-[180px] truncate">{c.address || '—'}</td>
                  <td className="px-6 py-4 text-xs t-dim font-medium">
                    {new Date(c.createdAt).toLocaleDateString('en-PK')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(c)}
                        title="Delete customer"
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link href={`/customers/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-semibold transition-all">
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
