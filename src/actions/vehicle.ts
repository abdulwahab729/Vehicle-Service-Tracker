'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getVehicles() {
  return await prisma.vehicle.findMany({
    include: { customer: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createVehicle(data: { customerId: string, make: string, model: string, year: number, licensePlate: string, vin?: string, color?: string }) {
  const vehicle = await prisma.vehicle.create({
    data
  })
  revalidatePath('/vehicles')
  revalidatePath(`/customers/${data.customerId}`)
  return vehicle
}

export async function deleteVehicle(id: string) {
  // Cascade: JobPart → ServiceRecord → Invoice → JobOrder → ServiceRecord (vehicle-level) → Vehicle
  const jobs = await prisma.jobOrder.findMany({ where: { vehicleId: id }, select: { id: true } })
  const jobIds = jobs.map((j) => j.id)

  await prisma.jobPart.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.serviceRecord.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.invoice.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.jobOrder.deleteMany({ where: { id: { in: jobIds } } })
  await prisma.serviceRecord.deleteMany({ where: { vehicleId: id } })
  await prisma.vehicle.delete({ where: { id } })

  revalidatePath('/vehicles')
  revalidatePath('/customers')
}
