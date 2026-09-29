import { getActiveJobs } from '@/actions/job';
import { Wrench, Plus } from 'lucide-react';
import Link from 'next/link';
import { JobsTable } from '@/components/JobsTable';

export default async function JobsPage() {
  const jobs = await getActiveJobs();
  return (
    <div className="space-y-7 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400/80 mb-2">Workshop</p>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Wrench className="text-orange-400" size={30} /> Job Orders
          </h1>
          <p className="t-muted mt-1 text-sm">Manage active repairs, assign mechanics, and update statuses.</p>
        </div>
        <Link href="/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Create Job
        </Link>
      </div>
      <JobsTable jobs={jobs} />
    </div>
  );
}
