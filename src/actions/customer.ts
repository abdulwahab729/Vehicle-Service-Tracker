'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getCustomers() {
  return await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  })
}

export async function getCustomerById(id: string) {
  return await prisma.customer.findUnique({
    where: { id },
    include: { vehicles: true, invoices: true }
  })
}

export async function createCustomer(data: { firstName: string, lastName?: string, email?: string, phone: string, address?: string }) {
  const customer = await prisma.customer.create({
    data
  })
  revalidatePath('/customers')
  return customer
}

export async function deleteCustomer(id: string) {
  // Must delete related records in order due to FK constraints:
  // JobPart → ServiceRecord → Invoice → JobOrder → Vehicle → Customer
  const vehicles = await prisma.vehicle.findMany({ where: { customerId: id }, select: { id: true } })
  const vehicleIds = vehicles.map((v) => v.id)

  const jobs = await prisma.jobOrder.findMany({ where: { vehicleId: { in: vehicleIds } }, select: { id: true } })
  const jobIds = jobs.map((j) => j.id)

  await prisma.jobPart.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.serviceRecord.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.invoice.deleteMany({ where: { jobOrderId: { in: jobIds } } })
  await prisma.jobOrder.deleteMany({ where: { id: { in: jobIds } } })
  await prisma.serviceRecord.deleteMany({ where: { vehicleId: { in: vehicleIds } } })
  await prisma.vehicle.deleteMany({ where: { id: { in: vehicleIds } } })
  await prisma.invoice.deleteMany({ where: { customerId: id } })
  await prisma.customer.delete({ where: { id } })

  revalidatePath('/customers')
}
