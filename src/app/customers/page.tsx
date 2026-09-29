import { getCustomers } from '@/actions/customer';
import { Users, Plus } from 'lucide-react';
import Link from 'next/link';
import { CustomersTable } from '@/components/CustomersTable';

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className="space-y-7 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400/80 mb-2">Management</p>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Users className="text-indigo-400" size={30} /> Customers
          </h1>
          <p className="t-muted mt-1 text-sm">Manage your client base and contact information.</p>
        </div>
        <Link href="/customers/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Add Customer
        </Link>
      </div>
      <CustomersTable customers={customers} />
    </div>
  );
}
