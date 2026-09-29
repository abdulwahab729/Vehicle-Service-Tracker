import Link from "next/link";
import { Car, Users, Wrench, Package, FileText, TrendingUp, ArrowUpRight, Bell } from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";

function formatRelativeDate(date: Date): string {
  const diffMs   = Date.now() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffH    = Math.floor(diffMs / 3600000);
  const diffD    = Math.floor(diffMs / 86400000);
  if (diffMins < 1)  return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffH < 24)    return `${diffH}h ago`;
  if (diffD === 1)   return "Yesterday";
  if (diffD < 7)     return `${diffD} days ago`;
  return new Date(date).toLocaleDateString("en-PK");
}

export default async function Dashboard() {
  const stats = await getDashboardStats();

  const STATUS_BADGE: Record<string, string> = {
    PENDING:     "badge-pending",
    IN_PROGRESS: "badge-progress",
    COMPLETED:   "badge-complete",
    CANCELLED:   "badge-cancel",
  };
  const STATUS_LABELS: Record<string, string> = {
    PENDING: "Pending", IN_PROGRESS: "In Progress",
    COMPLETED: "Completed", CANCELLED: "Cancelled",
  };

  return (
    <div className="space-y-8 animate-in">

      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-2">
            AutoTrack Pro
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Dashboard
          </h1>
          <p className="t-muted mt-1.5 text-base">
            آج کی سرگرمیاں — {new Date().toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-0.5"
        >
          <Wrench size={16} />
          New Job Order
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <StatCard
          title="Active Jobs"
          value={stats.activeJobsCount}
          icon={Wrench}
          sub="Pending + In Progress"
          gradient="from-blue-600/30 to-blue-800/10"
          iconBg="bg-blue-500/20 text-blue-500"
          glow="shadow-blue-500/10"
          href="/jobs"
        />
        <StatCard
          title="Serviced This Week"
          value={stats.vehiclesServicedThisWeek}
          icon={Car}
          sub="Completed jobs"
          gradient="from-teal-600/30 to-teal-800/10"
          iconBg="bg-teal-500/20 text-teal-500"
          glow="shadow-teal-500/10"
          href="/jobs"
        />
        <StatCard
          title="New Customers"
          value={stats.newCustomersThisWeek}
          icon={Users}
          sub="This week"
          gradient="from-indigo-600/30 to-indigo-800/10"
          iconBg="bg-indigo-500/20 text-indigo-500"
          glow="shadow-indigo-500/10"
          href="/customers"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockCount}
          icon={Package}
          sub={stats.lowStockCount > 0 ? "Needs restocking" : "All levels OK"}
          gradient={stats.lowStockCount > 0 ? "from-rose-600/30 to-rose-800/10" : "from-emerald-600/30 to-emerald-800/10"}
          iconBg={stats.lowStockCount > 0 ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500"}
          glow={stats.lowStockCount > 0 ? "shadow-rose-500/10" : "shadow-emerald-500/10"}
          href="/inventory"
        />
        <StatCard
          title="Upcoming Reminders"
          value={stats.upcomingRemindersCount}
          icon={Bell}
          sub="Due in 30 days"
          gradient="from-yellow-600/30 to-yellow-800/10"
          iconBg="bg-yellow-500/20 text-yellow-500"
          glow="shadow-yellow-500/10"
          href="/reminders"
        />
      </div>

      {/* Revenue Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Total Revenue */}
        <div className="relative overflow-hidden rounded-2xl border p-6 shimmer"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-500 shadow-lg shadow-emerald-500/10">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider t-muted mb-1">Total Revenue (Paid)</p>
              <p className="text-3xl font-extrabold t-primary tracking-tight tabular-nums">
                Rs.&nbsp;{stats.totalRevenuePaid.toLocaleString("en-PK")}
              </p>
              <p className="text-xs t-dim mt-1">All-time paid invoices</p>
            </div>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="relative overflow-hidden rounded-2xl border p-6 shimmer"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/15 text-amber-500 shadow-lg shadow-amber-500/10">
              <FileText size={22} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider t-muted mb-1">Pending Payments</p>
              <p className="text-3xl font-extrabold t-primary tracking-tight tabular-nums">
                Rs.&nbsp;{stats.unpaidInvoicesAmount.toLocaleString("en-PK")}
              </p>
              <p className="text-xs t-dim mt-1">Unpaid / overdue invoices</p>
            </div>
            <Link
              href="/invoices"
              className="flex items-center gap-1 text-xs text-amber-500 hover:text-amber-400 font-semibold transition-colors"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Jobs + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Jobs Table */}
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b flex items-center justify-between"
            style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-base font-bold">Recent Service Orders</h2>
            <Link href="/jobs" className="text-xs text-blue-500 hover:text-blue-400 font-semibold flex items-center gap-1 transition-colors">
              View all <ArrowUpRight size={13} />
            </Link>
          </div>

          {stats.recentJobs.length === 0 ? (
            <div className="py-16 text-center t-dim">
              <Wrench size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No jobs yet.</p>
              <Link href="/jobs/new" className="text-xs text-blue-500 hover:underline mt-1 inline-block">
                Create the first one →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-[11px] font-semibold uppercase tracking-widest t-dim"
                    style={{ borderColor: 'var(--border)' }}>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Vehicle</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentJobs.map((job) => (
                    <tr key={job.id}
                      className="border-b table-row-hover last:border-0"
                      style={{ borderColor: 'var(--border)' }}>
                      <td className="px-6 py-3.5">
                        <Link
                          href={`/customers/${job.vehicle.customer.id}`}
                          className="font-semibold t-secondary hover:text-blue-500 transition-colors text-sm"
                        >
                          {job.vehicle.customer.firstName} {job.vehicle.customer.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-3.5 text-sm text-blue-500 font-medium">
                        {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_BADGE[job.status] ?? 'badge-pending'}`}>
                          {STATUS_LABELS[job.status] ?? job.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs t-dim font-medium">
                        {formatRelativeDate(job.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border overflow-hidden"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-base font-bold">Quick Actions</h2>
          </div>
          <div className="p-4 space-y-2">
            {[
              { href: "/jobs/new",       label: "Create Job Order",   icon: Wrench,   color: "hover:border-orange-500/40 hover:bg-orange-500/5",  iconCl: "text-orange-500" },
              { href: "/customers/new",  label: "Add New Customer",   icon: Users,    color: "hover:border-indigo-500/40 hover:bg-indigo-500/5",  iconCl: "text-indigo-500" },
              { href: "/vehicles/new",   label: "Register Vehicle",   icon: Car,      color: "hover:border-teal-500/40 hover:bg-teal-500/5",      iconCl: "text-teal-500" },
              { href: "/invoices/new",   label: "Generate Invoice",   icon: FileText, color: "hover:border-rose-500/40 hover:bg-rose-500/5",      iconCl: "text-rose-500" },
              { href: "/inventory/new",  label: "Add Inventory Part", icon: Package,  color: "hover:border-purple-500/40 hover:bg-purple-500/5",  iconCl: "text-purple-500" },
              { href: "/reminders/new",  label: "Schedule Reminder",  icon: Bell,     color: "hover:border-yellow-500/40 hover:bg-yellow-500/5",  iconCl: "text-yellow-500" },
            ].map(({ href, label, icon: Icon, color, iconCl }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all group ${color}`}
                style={{ borderColor: 'var(--border)' }}
              >
                <span className={`${iconCl} group-hover:scale-110 transition-transform`}>
                  <Icon size={17} />
                </span>
                <span className="text-sm font-medium t-secondary group-hover:t-primary transition-colors">
                  {label}
                </span>
                <ArrowUpRight size={14} className="ml-auto t-dim group-hover:t-muted transition-colors" />
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, sub, gradient, iconBg, glow, href }: {
  title: string; value: number; icon: React.ElementType;
  sub: string; gradient: string; iconBg: string; glow: string; href: string;
}) {
  return (
    <Link
      href={href}
      className={`relative overflow-hidden rounded-2xl border p-5 block group transition-all hover:-translate-y-0.5 hover:shadow-xl ${glow} shimmer`}
      style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-80 transition-opacity pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold uppercase tracking-wider t-muted">{title}</p>
          <span className={`p-2 rounded-xl ${iconBg}`}>
            <Icon size={16} />
          </span>
        </div>
        <p className="text-4xl font-extrabold t-primary tabular-nums tracking-tight">{value}</p>
        <p className="text-xs t-dim mt-2 font-medium">{sub}</p>
      </div>
    </Link>
  );
}
