import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "AutoTrack Pro - Garage Management System",
  description: "Premium vehicle service and maintenance tracker for Pakistani garages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="mesh-bg min-h-screen text-slate-100" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>
        <ThemeProvider>
          <AppShell>
            {children}
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
