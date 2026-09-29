# AutoTrack Pro - User Guide & Handover Document

Welcome to **AutoTrack Pro**, your comprehensive Garage Management System. This guide will walk you through the core features of the application.

## 1. Dashboard
The dashboard provides a high-level overview of your garage operations.
- **Stat Cards**: View real-time numbers for Active Jobs, Vehicles Serviced, Total Revenue, and Pending Reminders.
- **Recent Activities**: A feed of the latest actions (e.g., invoices created, jobs completed) to keep you updated.

## 2. Customer Management
- **View Customers**: See a list of all your clients.
- **Customer Profiles**: Click into a customer to view their registered vehicles and invoice history.
- **Add/Edit**: Quickly register new customers to the system.

## 3. Vehicle Registry
- **Tracker**: Register vehicles with their Make, Model, Year, and License Plate.
- **Assignment**: Vehicles are tied to specific customers, allowing you to track the service history of a particular car over time.

## 4. Job Orders
- **Create Jobs**: Assign a vehicle to a mechanic/technician and describe the required service.
- **Status Tracking**: Update jobs from `PENDING` -> `IN_PROGRESS` -> `COMPLETED`.
- **Parts Used**: Add inventory parts to a job order, which will automatically be calculated in the final invoice.

## 5. Inventory Management
- **Stock Tracking**: Keep a catalog of your spare parts, their unit price, and current stock levels.
- **Low Stock Alerts**: (Future) Be notified when parts drop below a critical threshold.

## 6. Billing & Invoices
- **Generate Invoices**: Once a job is completed, generate a professional invoice.
- **Labor & Parts**: The system automatically pulls the parts used in the job order and calculates the total. You can manually adjust labor charges.
- **Status**: Track whether an invoice is `DRAFT`, `UNPAID`, `PAID`, or `OVERDUE`.

## 7. Reminders (CRM)
- **Automated Service Reminders**: Set up reminders for next oil changes, MOTs, or general servicing.
- **Statuses**: Track reminders (Pending, Sent, Completed) to ensure no customer is left behind.

---

## Project Handover Checklist
- [x] Application Source Code (Next.js, Prisma, Tailwind)
- [x] Database Schema (PostgreSQL)
- [x] Docker Containerization (Dockerfile, docker-compose.prod.yml)
- [x] Automated CI/CD Pipeline (.github/workflows/deploy.yml)
- [x] Touch-friendly Tablet UI implementation
- [x] Automated Database Backups configuration
- [x] Technical & User Documentation
