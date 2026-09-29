import { getJobById, updateJobStatus, assignTechnician, getTechnicians } from '@/actions/job';
import { Wrench, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, technicians] = await Promise.all([
    getJobById(id),
    getTechnicians()
  ]);

  if (!job) notFound();

  async function handleStatusUpdate(formData: FormData) {
    'use server';
    const status = formData.get('status') as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    await updateJobStatus(id, status);
    revalidatePath(`/jobs/${id}`);
    redirect('/jobs');
  }

  async function handleTechnicianUpdate(formData: FormData) {
    'use server';
    const technicianId = formData.get('technicianId') as string;
    await assignTechnician(id, technicianId === 'unassigned' ? null : technicianId);
    revalidatePath(`/jobs/${id}`);
  }

  const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const;
  const STATUS_LABELS: Record<string, string> = {
    PENDING: 'Pending',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
  };
  const STATUS_STYLES: Record<string, string> = {
    PENDING: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50',
    COMPLETED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50',
    CANCELLED: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/jobs" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Wrench className="text-orange-500" size={32} />
            Job Order
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {job.vehicle.year} {job.vehicle.make} {job.vehicle.model} ·{' '}
            {job.vehicle.customer.firstName} {job.vehicle.customer.lastName}
          </p>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Job Details</h2>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[job.status] ?? STATUS_STYLES.PENDING}`}>
            {STATUS_LABELS[job.status]}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <InfoRow label="Service / Problem" value={job.description} />
          <InfoRow label="Vehicle" value={`${job.vehicle.year} ${job.vehicle.make} ${job.vehicle.model}`} />
          <InfoRow label="Registration No." value={job.vehicle.licensePlate} mono />
          <InfoRow label="Owner" value={`${job.vehicle.customer.firstName} ${job.vehicle.customer.lastName}`} />
          <InfoRow label="Mech / Tech" value={job.technician?.name ?? 'Unassigned'} />
          <InfoRow
            label="Created On"
            value={new Date(job.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          />
        </div>

        {job.notes && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Notes</p>
            <p className="text-slate-700 dark:text-slate-300 text-sm">{job.notes}</p>
          </div>
        )}

        {/* Status Update Form */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Update Status</h3>
            <form action={handleStatusUpdate} className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="submit"
                  name="status"
                  value={s}
                  disabled={job.status === s}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${STATUS_STYLES[s]}`}
                >
                  {STATUS_LABELS[s]}
                </button>
              ))}
            </form>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Assign Mech / Tech</h3>
            <form action={handleTechnicianUpdate} className="flex gap-2">
              <select 
                name="technicianId" 
                defaultValue={job.userId || 'unassigned'}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 outline-none"
              >
                <option value="unassigned">— Unassigned —</option>
                {technicians.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
                Update
              </button>
            </form>
          </div>
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
