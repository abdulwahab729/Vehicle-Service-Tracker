'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function addTechnician(name: string, phone?: string) {
  const newTech = await prisma.user.create({
    data: {
      name,
      phone,
      role: 'TECHNICIAN',
      password: 'defaultPassword', // Assuming a default password, should ideally send invite or setup later
    }
  })
  revalidatePath('/staff')
  revalidatePath('/jobs/new')
  revalidatePath('/jobs')
  return newTech
}

export async function deleteTechnician(id: string) {
  // Can only delete if they aren't tied to active/completed jobs where the foreign key is set
  // To avoid breaking history, maybe we shouldn't strictly delete unless there's 0 jobs, 
  // or we nullify their jobs. For this simple MVP, we just delete them and rely on Prisma
  // foreign key constraints. Wait, jobs.userId is nullable, so we can set it to null or Prisma can 
  // do it if we defined onDelete: SetNull. But Prisma schema doesn't have onDelete: SetNull.
  // So we manually set userId to null for their jobs before deleting.
  
  await prisma.jobOrder.updateMany({
    where: { userId: id },
    data: { userId: null }
  });

  await prisma.user.delete({
    where: { id }
  })
  
  revalidatePath('/staff')
  revalidatePath('/jobs/new')
  revalidatePath('/jobs')
}
