import { getInvoices, markInvoicePaid, updateInvoiceAmount } from '@/actions/invoice';
import { FileText, ArrowLeft, CheckCircle, Car, Wrench, Package } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { SubmitButton } from '@/components/SubmitButton';

const STATUS_STYLES: Record<string, string> = {
  PAID: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50',
  UNPAID: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800/50',
  OVERDUE: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50',
  DRAFT: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
};

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoices = await getInvoices();
  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) notFound();

  async function handleMarkPaid() {
    'use server';
    await markInvoicePaid(id);
    revalidatePath(`/invoices/${id}`);
    redirect('/invoices');
  }

  const job = invoice.jobOrder;
  const vehicle = job?.vehicle;
  // @ts-expect-error - partsUsed is fetched in getInvoices now
  const partsUsed = job?.partsUsed || [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dbPartsTotal = partsUsed.reduce((sum: number, pu: any) => sum + (pu.priceAtUse * pu.quantity), 0);
  const partsTotal = invoice.partsAmount || dbPartsTotal;
  const laborCharges = Math.max(0, (invoice.totalAmount || 0) - partsTotal);

  async function handleUpdateAmount(formData: FormData) {
    'use server';
    const laborStr = formData.get('laborAmount') as string;
    const labor = parseFloat(laborStr) || 0;
    
    const partsStr = formData.get('partsAmount') as string;
    const parts = parseFloat(partsStr) || 0;

    // We calculate total amount dynamically based on parts + labor
    const total = labor + parts;
    await updateInvoiceAmount(id, total, parts);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/invoices" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <FileText className="text-rose-500" size={32} />
            Invoice #{invoice.id.split('-')[0].toUpperCase()}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {invoice.customer.firstName} {invoice.customer.lastName}
          </p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl space-y-8">
        
        {/* Header & Status */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Invoice Details</h2>
          <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${STATUS_STYLES[invoice.status] ?? STATUS_STYLES.DRAFT}`}>
            {invoice.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <InfoRow label="Customer" value={`${invoice.customer.firstName} ${invoice.customer.lastName}`} />
            <InfoRow label="Invoice #" value={invoice.id.split('-')[0].toUpperCase()} mono />
            <InfoRow
              label="Date Issued"
              value={new Date(invoice.issuedDate).toLocaleDateString('en-PK', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            />
          </div>
          
          {/* Job & Vehicle Info */}
          <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Car size={14} /> Vehicle
              </p>
              <p className="text-slate-900 dark:text-white font-medium">
                {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Wrench size={14} /> Job Service
              </p>
              <p className="text-slate-900 dark:text-white font-medium">
                {job?.description || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Parts Used */}
        {partsUsed.length > 0 && (
          <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
              <Package size={16} /> Parts Used
            </h3>
            <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 font-medium">Part Name</th>
                    <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                    <th className="px-4 py-3 font-medium text-right">Qty</th>
                    <th className="px-4 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {partsUsed.map((pu: any) => (
                    <tr key={pu.id} className="text-slate-700 dark:text-slate-300">
                      <td className="px-4 py-3">{pu.part.name}</td>
                      <td className="px-4 py-3 text-right">Rs. {pu.priceAtUse.toLocaleString('en-PK')}</td>
                      <td className="px-4 py-3 text-right">{pu.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">Rs. {(pu.priceAtUse * pu.quantity).toLocaleString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Amount Field (Editable if not PAID) */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <form action={handleUpdateAmount} className="flex flex-col sm:flex-row sm:items-end gap-6">
            
            {/* Parts Total (Editable) */}
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="partsAmount" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Parts Total
              </label>
              {invoice.status === 'PAID' ? (
                <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums py-3">
                  Rs. {partsTotal.toLocaleString('en-PK')}
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">Rs.</span>
                  <input 
                    id="partsAmount" 
                    name="partsAmount" 
                    type="number" 
                    step="1" 
                    min="0"
                    defaultValue={partsTotal || ''} 
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-lg font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/40 transition-all tabular-nums"
                  />
                </div>
              )}
            </div>

            {/* Labor Charges (Editable) */}
            <div className="flex-1 max-w-[180px]">
              <label htmlFor="laborAmount" className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                Labor Charges
              </label>
              {invoice.status === 'PAID' ? (
                <div className="text-xl font-bold text-slate-900 dark:text-white tabular-nums py-3">
                  Rs. {laborCharges.toLocaleString('en-PK')}
                </div>
              ) : (
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">Rs.</span>
                  <input 
                    id="laborAmount" 
                    name="laborAmount" 
                    type="number" 
                    step="1" 
                    min="0"
                    defaultValue={laborCharges || ''} 
                    placeholder="0"
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-lg font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500/40 transition-all tabular-nums"
                  />
                </div>
              )}
            </div>

            {/* Final Total Amount (Calculated) */}
            <div className="flex-1 max-w-[200px]">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-2">
                Final Total
              </label>
              <div className="text-3xl font-extrabold text-rose-600 dark:text-rose-500 tabular-nums">
                Rs. {invoice.totalAmount.toLocaleString('en-PK')}
              </div>
            </div>
            
            {invoice.status !== 'PAID' && (
              <SubmitButton 
                label="Save Pricing" 
                pendingLabel="Saving..."
                className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white text-sm font-semibold transition-all h-[52px]" 
              />
            )}
          </form>
        </div>

        {/* Mark as Paid Action */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {invoice.status !== 'PAID' ? (
            <form action={handleMarkPaid}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all"
              >
                <CheckCircle size={18} />
                Mark as Paid
              </button>
            </form>
          ) : (
            <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-2">
              <CheckCircle size={16} />
              Paid on {invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Unknown date'}
            </p>
          )}
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
