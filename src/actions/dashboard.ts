'use server'

import { prisma } from '@/lib/prisma'

export async function getDashboardStats() {
  const now = new Date()

  // Start of current week (Monday)
  const startOfWeek = new Date(now)
  startOfWeek.setHours(0, 0, 0, 0)
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7))

  // Start of today
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const [
    activeJobsCount,
    vehiclesServicedThisWeek,
    newCustomersThisWeek,
    lowStockCount,
    recentJobs,
    totalRevenue,
    unpaidInvoices,
    upcomingRemindersCount,
  ] = await Promise.all([
    // Active jobs (not completed/cancelled)
    prisma.jobOrder.count({
      where: { status: { in: ['PENDING', 'IN_PROGRESS'] } },
    }),

    // Vehicles with completed jobs this week
    prisma.jobOrder.count({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: startOfWeek },
      },
    }),

    // New customers this week
    prisma.customer.count({
      where: { createdAt: { gte: startOfWeek } },
    }),

    // Low stock parts (stock <= 10)
    prisma.part.count({
      where: { stockLevel: { lte: 10 } },
    }),

    // Recent 5 jobs
    prisma.jobOrder.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          include: { customer: true },
        },
      },
    }),

    // Total revenue from PAID invoices (all time)
    prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: 'PAID' },
    }),

    // Unpaid invoices amount
    prisma.invoice.aggregate({
      _sum: { totalAmount: true },
      where: { status: { in: ['UNPAID', 'OVERDUE'] } },
    }),

    // Upcoming reminders (due in next 30 days)
    prisma.maintenanceReminder.count({
      where: {
        status: 'PENDING',
        dueDate: {
          lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      },
    }),
  ])

  return {
    activeJobsCount,
    vehiclesServicedThisWeek,
    newCustomersThisWeek,
    lowStockCount,
    recentJobs,
    totalRevenuePaid: totalRevenue._sum.totalAmount ?? 0,
    unpaidInvoicesAmount: unpaidInvoices._sum.totalAmount ?? 0,
    upcomingRemindersCount,
  }
}
