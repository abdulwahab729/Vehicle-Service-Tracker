'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getInvoices() {
  return await prisma.invoice.findMany({
    include: { 
      customer: true, 
      jobOrder: { 
        include: { 
          vehicle: true, 
          partsUsed: { include: { part: true } } 
        } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  })
}

export async function createInvoice(data: { customerId: string, jobOrderId: string, totalAmount: number, taxAmount?: number, discount?: number, dueDate?: Date }) {
  const invoice = await prisma.invoice.create({
    data
  })
  revalidatePath('/invoices')
  return invoice
}

export async function updateInvoiceAmount(id: string, totalAmount: number, partsAmount?: number) {
  const current = await prisma.invoice.findUnique({ where: { id } });
  
  const invoice = await prisma.invoice.update({
    where: { id },
    data: { 
      totalAmount, 
      partsAmount: partsAmount ?? 0,
      status: current?.status === 'DRAFT' ? 'UNPAID' : undefined
    }
  })
  revalidatePath(`/invoices/${id}`)
  revalidatePath('/invoices')
  return invoice
}

export async function markInvoicePaid(id: string) {
  const invoice = await prisma.invoice.update({
    where: { id },
    data: { status: 'PAID', paidDate: new Date() }
  })
  revalidatePath('/invoices')
  return invoice
}

export async function deleteInvoice(id: string) {
  await prisma.invoice.delete({ where: { id } })
  revalidatePath('/invoices')
}
