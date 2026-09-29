'use client';

import { useState } from 'react';
import { Search, ChevronRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { deleteJob } from '@/actions/job';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

type Job = {
  id: string; description: string; status: string; createdAt: Date;
  vehicle: { year: number; make: string; model: string; licensePlate: string; customer: { firstName: string; lastName: string | null } };
  technician: { name: string } | null;
};

const STATUS_BADGE: Record<string, string> = {
  PENDING:     'badge-pending',
  IN_PROGRESS: 'badge-progress',
  COMPLETED:   'badge-complete',
  CANCELLED:   'badge-cancel',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pending', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
};

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Job | null>(null);

  const filtered = jobs.filter((j) => {
    const q = query.toLowerCase();
    return (
      j.description.toLowerCase().includes(q) ||
      j.vehicle.make.toLowerCase().includes(q) || j.vehicle.model.toLowerCase().includes(q) ||
      j.vehicle.licensePlate.toLowerCase().includes(q) ||
      `${j.vehicle.customer.firstName} ${j.vehicle.customer.lastName}`.toLowerCase().includes(q) ||
      j.status.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        title="Delete this job order?"
        description={`"${deleteTarget?.description}" will be permanently deleted along with its invoice and service record. This action cannot be undone.`}
        onConfirm={async () => { await deleteJob(deleteTarget!.id); }}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        <div className="px-5 py-4 border-b flex items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 t-dim" size={16} />
            <input
              type="text" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by vehicle, customer, or status..."
              className="themed-input w-full pl-9 pr-4 py-2 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-orange-500/40 transition-all"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
            />
          </div>
          <span className="text-xs t-dim font-medium tabular-nums">{filtered.length} / {jobs.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim" style={{ borderColor: 'var(--border)' }}>
                <th className="px-6 py-3">Job Details</th>
                <th className="px-6 py-3">Vehicle / Owner</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Mech / Tech</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-14 text-center text-sm t-dim">
                  {query ? `No jobs match "${query}"` : 'No jobs found. Click "Create Job" to start one.'}
                </td></tr>
              ) : filtered.map((job) => (
                <tr key={job.id} className="border-b table-row-hover last:border-0 group" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-6 py-4">
                    <div className="font-semibold t-primary text-sm max-w-[200px] truncate">{job.description}</div>
                    <div className="text-xs t-dim mt-0.5">{new Date(job.createdAt).toLocaleDateString('en-PK')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium t-secondary">{job.vehicle.year} {job.vehicle.make} {job.vehicle.model}</div>
                    <div className="text-xs t-dim mt-0.5">
                      {job.vehicle.customer.firstName} {job.vehicle.customer.lastName} · <span className="font-mono">{job.vehicle.licensePlate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_BADGE[job.status] ?? 'badge-pending'}`}>
                      {STATUS_LABELS[job.status] ?? job.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm t-muted">
                    {job.technician ? job.technician.name : <span className="italic t-dim">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setDeleteTarget(job)}
                        title="Delete job"
                        className="inline-flex items-center gap-1 text-xs text-rose-500 hover:text-rose-400 font-semibold transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                      <Link href={`/jobs/${job.id}`}
                        className="inline-flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400 font-semibold transition-all">
                        Manage <ChevronRight size={14} />
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
