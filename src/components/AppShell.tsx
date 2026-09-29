'use client';
import { useState, useEffect } from 'react';
import { Menu, Gauge } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Persist collapsed state across page loads
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === 'true') setSidebarCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setSidebarCollapsed((prev) => {
      localStorage.setItem('sidebar-collapsed', String(!prev));
      return !prev;
    });
  };

  // Close mobile drawer on route change
  useEffect(() => {
    const handleRouteChange = () => setSidebarOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen">

      {/* ── Backdrop for mobile/tablet drawer ─────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ────────────────────────────────────── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapse}
      />

      {/* ── Main content ───────────────────────────────── */}
      <main
        className={`flex-1 min-h-screen flex flex-col transition-[margin] duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}
      >
        {/* Mobile / tablet sticky top-bar */}
        <header
          className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <button
            id="sidebar-hamburger-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            className="p-2.5 rounded-xl transition-all hover:bg-white/5 active:scale-95"
            style={{ border: '1px solid var(--border)' }}
          >
            <Menu size={20} className="t-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/40">
              <Gauge size={14} className="text-white" />
            </div>
            <span className="text-sm font-bold gradient-text">AutoTrack Pro</span>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
