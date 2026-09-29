'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getTechnicians() {
  return await prisma.user.findMany({
    where: { role: 'TECHNICIAN' },
    orderBy: { name: 'asc' }
  })
}

export async function getActiveJobs() {
  return await prisma.jobOrder.findMany({
    where: { status: { not: 'COMPLETED' } },
    include: { vehicle: { include: { customer: true } }, technician: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function getJobById(id: string) {
  return await prisma.jobOrder.findUnique({
    where: { id },
    include: { vehicle: { include: { customer: true } }, technician: true }
  })
}

export async function createJob(data: { vehicleId: string, description: string, notes?: string, userId?: string }) {
  const job = await prisma.jobOrder.create({
    data
  })
  revalidatePath('/jobs')
  return job
}

export async function updateJobStatus(id: string, status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED') {
  const job = await prisma.jobOrder.update({
    where: { id },
    data: { status },
    include: { vehicle: true }
  })

  if (status === 'COMPLETED') {
    // Ensure an invoice is created for this completed job
    const existingInvoice = await prisma.invoice.findUnique({
      where: { jobOrderId: id }
    })

    if (!existingInvoice) {
      await prisma.invoice.create({
        data: {
          customerId: job.vehicle.customerId,
          jobOrderId: job.id,
          status: 'DRAFT',
          totalAmount: 0,
        }
      })
    }
  }

  revalidatePath('/jobs')
  return job
}

export async function assignTechnician(jobId: string, userId: string | null) {
  const job = await prisma.jobOrder.update({
    where: { id: jobId },
    data: { userId }
  })
  revalidatePath('/jobs')
  return job
}

export async function deleteJob(id: string) {
  await prisma.jobPart.deleteMany({ where: { jobOrderId: id } })
  await prisma.serviceRecord.deleteMany({ where: { jobOrderId: id } })
  await prisma.invoice.deleteMany({ where: { jobOrderId: id } })
  await prisma.jobOrder.delete({ where: { id } })

  revalidatePath('/jobs')
}
