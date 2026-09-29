import { createVehicle } from '@/actions/vehicle';
import { getCustomers } from '@/actions/customer';
import { Car, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { VehicleForm } from '@/components/VehicleForm';

export default async function NewVehiclePage() {
  const customers = await getCustomers();

  async function handleSubmit(formData: FormData) {
    'use server';
    
    let make = formData.get('make') as string;
    let model = formData.get('model') as string;
    
    if (make === 'Other') {
      make = (formData.get('manualMake') as string) || 'Unknown';
      model = (formData.get('manualModel') as string) || 'Unknown';
    }

    await createVehicle({
      customerId:   formData.get('customerId') as string,
      make:         make,
      model:        model,
      year:         parseInt(formData.get('year') as string),
      licensePlate: (formData.get('licensePlate') as string).toUpperCase(),
      vin:          (formData.get('vin') as string) || undefined,
      color:        (formData.get('color') as string) || undefined,
    });
    redirect('/vehicles');
  }

  return (
    <div className="max-w-xl mx-auto space-y-7 animate-in">
      <div className="flex items-center gap-3">
        <Link href="/vehicles" className="p-2 rounded-xl t-muted hover:t-primary hover:bg-black/5 dark:hover:bg-white/5 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-400/80 mb-1">Vehicles</p>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Car className="text-teal-400" size={24} /> Register Vehicle
          </h1>
        </div>
      </div>

      <VehicleForm customers={customers} action={handleSubmit} />
    </div>
  );
}
