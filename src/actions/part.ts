'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getParts() {
  return await prisma.part.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function createPart(data: { name: string, description?: string, partNumber: string, stockLevel: number, unitPrice: number }) {
  const part = await prisma.part.create({
    data
  })
  revalidatePath('/inventory')
  return part
}

export async function updatePartStock(id: string, newStock: number) {
  const part = await prisma.part.update({
    where: { id },
    data: { stockLevel: newStock }
  })
  revalidatePath('/inventory')
  return part
}

export async function deletePart(id: string) {
  // Remove job-part associations first
  await prisma.jobPart.deleteMany({ where: { partId: id } })
  await prisma.part.delete({ where: { id } })
  revalidatePath('/inventory')
}
