import { getCustomerById } from '@/actions/customer';
import { Users, ArrowLeft, Car, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/customers" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            {customer.firstName} {customer.lastName}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Customer Profile</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Contact Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InfoRow label="Full Name" value={`${customer.firstName} ${customer.lastName}`} />
          <InfoRow label="Phone" value={customer.phone} />
          <InfoRow label="Email" value={customer.email ?? '—'} />
          <InfoRow label="Address" value={customer.address ?? '—'} />
          <InfoRow
            label="Customer Since"
            value={new Date(customer.createdAt).toLocaleDateString('en-PK', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          />
        </div>
      </div>

      {/* Vehicles */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Car className="text-teal-500" size={20} />
            Vehicles ({customer.vehicles.length})
          </h2>
          <Link href="/vehicles/new" className="text-sm text-teal-500 hover:text-teal-400 font-medium transition-colors">
            + Register Vehicle
          </Link>
        </div>
        {customer.vehicles.length === 0 ? (
          <p className="text-slate-500 text-sm">No vehicles registered for this customer.</p>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {customer.vehicles.map((v: any) => (
              <div key={v.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {v.year} {v.make} {v.model}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{v.color ?? 'Unknown color'}</div>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm font-mono font-bold tracking-widest">
                  {v.licensePlate}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="text-rose-500" size={20} />
            Invoices ({customer.invoices.length})
          </h2>
          <Link href="/invoices/new" className="text-sm text-rose-500 hover:text-rose-400 font-medium transition-colors">
            + Create Invoice
          </Link>
        </div>
        {customer.invoices.length === 0 ? (
          <p className="text-slate-500 text-sm">No invoices for this customer.</p>
        ) : (
          <div className="space-y-3">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {customer.invoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                <div>
                  <div className="font-mono text-sm text-slate-500">{inv.id.split('-')[0].toUpperCase()}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {new Date(inv.issuedDate).toLocaleDateString('en-PK')}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-slate-900 dark:text-white">
                    Rs. {inv.totalAmount.toLocaleString('en-PK')}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    inv.status === 'PAID' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  }`}>
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-slate-900 dark:text-white font-medium">{value}</p>
    </div>
  );
}
