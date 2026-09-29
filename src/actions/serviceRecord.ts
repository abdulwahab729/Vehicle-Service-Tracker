'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getServiceRecords(vehicleId: string) {
  return await prisma.serviceRecord.findMany({
    where: { vehicleId },
    orderBy: { date: 'desc' }
  })
}

export async function createServiceRecord(data: { vehicleId: string, jobOrderId?: string, mileage: number, serviceDone: string, technician: string, notes?: string }) {
  const record = await prisma.serviceRecord.create({
    data
  })
  revalidatePath(`/vehicles/${data.vehicleId}`)
  return record
}
