import { getVehicles } from '@/actions/vehicle';
import { Car, ArrowLeft, Wrench } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

async function getVehicleById(id: string) {
  const vehicles = await getVehicles();
  return vehicles.find((v) => v.id === id) ?? null;
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);

  if (!vehicle) notFound();

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4">
        <Link href="/vehicles" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
            <Car className="text-teal-500" size={32} />
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Owner: {vehicle.customer.firstName} {vehicle.customer.lastName}
          </p>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 backdrop-blur-xl">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Vehicle Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <InfoRow label="Make" value={vehicle.make} />
          <InfoRow label="Model" value={vehicle.model} />
          <InfoRow label="Year" value={String(vehicle.year)} />
          <InfoRow label="Registration No." value={vehicle.licensePlate} mono />
          <InfoRow label="Color" value={vehicle.color ?? '—'} />
          <InfoRow label="Chassis / VIN" value={vehicle.vin ?? '—'} mono />
        </div>
      </div>

      {/* Quick action */}
      <div className="flex gap-4">
        <Link
          href="/jobs/new"
          className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-orange-500/20"
        >
          <Wrench size={18} />
          Create Job Order for this Vehicle
        </Link>
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
