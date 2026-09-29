import { getInvoices } from '@/actions/invoice';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import { InvoicesTable } from '@/components/InvoicesTable';

export default async function InvoicesPage() {
  const invoices = await getInvoices();
  return (
    <div className="space-y-7 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-rose-400/80 mb-2">Billing</p>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <FileText className="text-rose-400" size={30} /> Invoices
          </h1>
          <p className="t-muted mt-1 text-sm">Generate invoices, track payments, and manage billing.</p>
        </div>
        <Link href="/invoices/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Create Invoice
        </Link>
      </div>
      <InvoicesTable invoices={invoices} />
    </div>
  );
}
