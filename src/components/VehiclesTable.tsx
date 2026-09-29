'use client';

import { useState } from 'react';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteVehicle } from '@/actions/vehicle';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Vehicle = {
  id: string; make: string; model: string; year: number;
  licensePlate: string; vin: string | null; color: string | null;
  customer: { firstName: string; lastName: string | null };
};

export function VehiclesTable({ vehicles }: { vehicles: Vehicle[] }) {
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null);

  const filtered = vehicles.filter((v) => {
    const q = query.toLowerCase();
    return (
      v.make.toLowerCase().includes(q) || v.model.toLowerCase().includes(q) ||
      v.licensePlate.toLowerCase().includes(q) || (v.vin ?? '').toLowerCase().includes(q) ||
      (v.color ?? '').toLowerCase().includes(q) ||
      `${v.customer.firstName} ${v.customer.lastName}`.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title={`Delete ${deleteTarget?.year} ${deleteTarget?.make} ${deleteTarget?.model}?`}
        description={`This will permanently remove the vehicle (${deleteTarget?.licensePlate}) along with all its job orders, service records, and invoices. This action cannot be undone.`}
        onConfirm={async () => { await deleteVehicle(deleteTarget!.id); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-dim" size={16} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by plate, make, model, or owner..."
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <span className="text-xs t-dim font-medium tabular-nums">{filtered.length} / {vehicles.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim" style={{ borderColor: 'var(--border)' }}>
                <th className="px-6 py-3">Vehicle</th>
                <th className="px-6 py-3">Reg. No.</th>
                <th className="px-6 py-3">Owner</th>
                <th className="px-6 py-3">Chassis / VIN</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-14 text-center text-sm t-dim">
                  {query ? `No vehicles match "${query}"` : 'No vehicles found. Click "Register Vehicle" to add one.'}
                </td></tr>
              ) : filtered.map((v) => (
                <tr key={v.id} className="border-b table-row-hover last:border-0 group" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="font-semibold t-primary text-sm">{v.year} {v.make} {v.model}</div>
                    <div className="text-xs t-dim mt-0.5">{v.color || 'Unknown color'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-widest text-teal-600 dark:text-teal-300"
                      style={{ background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)' }}>
                      {v.licensePlate}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium t-secondary">
                    {v.customer.firstName} {v.customer.lastName}
                  </td>
                  <td className="px-6 py-4 text-xs font-mono t-dim">{v.vin || '—'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(v)}
                        title="Delete vehicle"
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link href={`/vehicles/${v.id}`}
                        className="inline-flex items-center gap-1 text-xs text-teal-500 hover:text-teal-400 font-semibold transition-all">
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
