'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Users, Car, Wrench, Package, FileText,
  Gauge, Sun, Moon, Bell, X, ChevronLeft,
} from 'lucide-react';
import { useTheme } from './ThemeProvider';

const navItems = [
  { name: 'Dashboard',  href: '/',          icon: Home,     color: 'text-blue-400' },
  { name: 'Customers',  href: '/customers', icon: Users,    color: 'text-indigo-400' },
  { name: 'Vehicles',   href: '/vehicles',  icon: Car,      color: 'text-teal-400' },
  { name: 'Job Orders', href: '/jobs',      icon: Wrench,   color: 'text-orange-400' },
  { name: 'Inventory',  href: '/inventory', icon: Package,  color: 'text-purple-400' },
  { name: 'Invoices',   href: '/invoices',  icon: FileText, color: 'text-rose-400' },
  { name: 'Reminders',  href: '/reminders', icon: Bell,     color: 'text-yellow-400' },
  { name: 'Staff',      href: '/staff',     icon: Users,    color: 'text-pink-400' },
];

type SidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function Sidebar({
  isOpen = true,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';

  return (
    <aside
      className={`sidebar-bg h-screen fixed left-0 top-0 flex flex-col border-r z-50
        transition-all duration-300 ease-in-out
        lg:translate-x-0
        ${ isOpen ? 'translate-x-0' : '-translate-x-full' }
        ${ isCollapsed ? 'lg:w-16' : 'lg:w-64' }
        w-64`}
      style={{ borderColor: 'var(--border)' }}
    >

      {/* ── Logo / Brand + collapse toggle ────────────── */}
      <div
        className="px-3 py-4 border-b flex items-center gap-2 shrink-0"
        style={{ borderColor: 'var(--border)' }}
      >
        {/* Logo link */}
        <Link
          href="/"
          onClick={onClose}
          className={`flex items-center gap-3 group min-w-0 flex-1 ${
            isCollapsed ? 'lg:justify-center lg:flex-none' : ''
          }`}
          title="AutoTrack Pro"
        >
          <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/40 group-hover:shadow-blue-500/60 transition-shadow">
            <Gauge size={20} className="text-white" />
          </div>
          {/* Brand text — hidden when collapsed on desktop */}
          <div className={`min-w-0 transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
            <h1 className="text-base font-bold gradient-text leading-none whitespace-nowrap">AutoTrack Pro</h1>
            <p className="text-[10px] t-dim mt-0.5 font-medium tracking-wider uppercase">Garage System</p>
          </div>
        </Link>

        {/* ── Desktop collapse toggle (top, next to logo) ── */}
        {onToggleCollapse && (
          <button
            id="sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand menu' : 'Collapse menu'}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl shrink-0
              t-muted hover:t-primary hover:bg-white/10 active:scale-90
              transition-all duration-200"
            style={{ border: '1px solid var(--border)' }}
          >
            <ChevronLeft
              size={16}
              className={`transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        )}

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-xl t-muted hover:t-primary hover:bg-white/10 transition-all shrink-0"
            style={{ border: '1px solid var(--border)' }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Live indicator ───────────────────────────── */}
      <div className={`px-3 py-2.5 flex items-center gap-2 shrink-0 ${isCollapsed ? 'lg:justify-center' : ''}`}>
        <span className="pulse-dot shrink-0" />
        <span className={`text-xs t-dim font-medium whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
          System Online
        </span>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 px-2 pb-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {/* Section label */}
        <p className={`text-[10px] t-dim font-semibold uppercase tracking-widest px-3 mb-2 mt-1 transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}>
          Navigation
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              title={isCollapsed ? item.name : undefined}
              className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}
                ${isActive ? 'nav-active' : 'hover:bg-white/5 dark:hover:bg-white/5'}`}
            >
              {/* Active left bar */}
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />
              )}

              {/* Icon */}
              <span className={`sidebar-icon-wrap p-1.5 rounded-lg transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-500/20 text-blue-400'
                  : `bg-white/5 dark:bg-white/5 ${item.color}`
              }`}>
                <Icon size={15} />
              </span>

              {/* Label — hidden on desktop when collapsed */}
              <span className={`text-sm font-medium whitespace-nowrap transition-all duration-300
                ${isActive ? 'text-blue-400' : ''}
                ${isCollapsed ? 'lg:hidden' : ''}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="p-2 border-t space-y-2 shrink-0" style={{ borderColor: 'var(--border)' }}>

        {/* Theme toggle — full when expanded, icon-only when collapsed */}
        {isCollapsed ? (
          /* Collapsed: just the pill button centered */
          <div className={`flex justify-center py-1 lg:flex hidden`}>
            <button
              id="theme-toggle-btn"
              onClick={toggle}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              style={{
                background: isDark
                  ? 'linear-gradient(135deg,#1e3050,#0f1c2e)'
                  : 'linear-gradient(135deg,#fde68a,#fbbf24)',
                border: `1px solid ${isDark ? 'rgba(79,142,247,0.3)' : 'rgba(251,191,36,0.5)'}`,
              }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full shadow-md flex items-center justify-center transition-all duration-300"
                style={{
                  left: isDark ? '2px' : 'calc(100% - 22px)',
                  background: isDark
                    ? 'linear-gradient(135deg,#4f8ef7,#6366f1)'
                    : 'linear-gradient(135deg,#fef3c7,#fcd34d)',
                }}
              >
                {isDark ? <Moon size={11} className="text-white" /> : <Sun size={11} className="text-amber-600" />}
              </span>
            </button>
          </div>
        ) : null}

        {/* Full theme toggle row — always visible when expanded, hidden on desktop when collapsed */}
        <div
          className={`px-3 py-2.5 flex items-center justify-between rounded-xl transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <span className="text-xs font-medium t-muted">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          <button
            id="theme-toggle-btn-full"
            onClick={toggle}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            style={{
              background: isDark
                ? 'linear-gradient(135deg,#1e3050,#0f1c2e)'
                : 'linear-gradient(135deg,#fde68a,#fbbf24)',
              border: `1px solid ${isDark ? 'rgba(79,142,247,0.3)' : 'rgba(251,191,36,0.5)'}`,
              boxShadow: isDark ? '0 0 12px rgba(79,142,247,0.2)' : '0 0 12px rgba(251,191,36,0.3)',
            }}
          >
            <Moon size={11} className="absolute left-1.5 top-1/2 -translate-y-1/2 text-blue-300 transition-opacity duration-200" style={{ opacity: isDark ? 1 : 0 }} />
            <Sun  size={11} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-amber-700 transition-opacity duration-200" style={{ opacity: isDark ? 0 : 1 }} />
            <span
              className="absolute top-0.5 w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-all duration-300"
              style={{
                left: isDark ? '2px' : 'calc(100% - 26px)',
                background: isDark ? 'linear-gradient(135deg,#4f8ef7,#6366f1)' : 'linear-gradient(135deg,#fef3c7,#fcd34d)',
                boxShadow: isDark ? '0 2px 8px rgba(79,142,247,0.5)' : '0 2px 8px rgba(251,191,36,0.6)',
              }}
            >
              {isDark ? <Moon size={12} className="text-white" /> : <Sun size={12} className="text-amber-600" />}
            </span>
          </button>
        </div>

        {/* Version tag — hidden when collapsed */}
        <div
          className={`px-3 py-2 rounded-xl transition-all duration-300 ${isCollapsed ? 'lg:hidden' : ''}`}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
        >
          <p className="text-[10px] t-dim uppercase tracking-wider font-semibold">Version</p>
          <p className="text-xs t-muted mt-0.5">AutoTrack Pro v1.0</p>
        </div>

      </div>
    </aside>
  );
}
