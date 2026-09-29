import { getVehicles } from '@/actions/vehicle';
import { Car, Plus } from 'lucide-react';
import Link from 'next/link';
import { VehiclesTable } from '@/components/VehiclesTable';

export default async function VehiclesPage() {
  const vehicles = await getVehicles();
  return (
    <div className="space-y-7 animate-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400/80 mb-2">Fleet</p>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Car className="text-teal-400" size={30} /> Vehicles
          </h1>
          <p className="t-muted mt-1 text-sm">Browse and manage customer vehicles in the garage.</p>
        </div>
        <Link href="/vehicles/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold shadow-lg shadow-teal-500/25 transition-all hover:-translate-y-0.5">
          <Plus size={16} /> Register Vehicle
        </Link>
      </div>
      <VehiclesTable vehicles={vehicles} />
    </div>
  );
}
