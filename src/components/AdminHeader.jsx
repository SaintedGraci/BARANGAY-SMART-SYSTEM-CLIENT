import { useState, useEffect } from 'react';
import { Menu, LayoutDashboard, RefreshCw, Cloud, CloudRain, Sun, CloudSnow } from 'lucide-react';
import DateTimeWidget from './DateTimeWidget';
import WeatherWidget from './WeatherWidget';

const TAB_DESCRIPTIONS = {
  overview: 'Monitor daily barangay operations, requests, residents, and service activity.',
  analytics: 'View detailed analytics and insights about barangay operations.',
  requests: 'Review and update document requests submitted by residents.',
  complaints: 'Review and manage complaints filed by residents.',
  residents: 'Manage registered residents and account access.',
  verifications: 'Approve or reject new resident registrations with supporting documents.',
  announcements: 'Publish, edit, archive, or remove announcements for residents.',
  logs: 'Inspect system logs, errors, warnings, and security events.',
  reports: 'View service analytics and administrative reporting summaries.',
  users: 'Manage system users, roles, and permissions.',
};

export default function AdminHeader({ activeTab, menuItems, user, onMenuClick, isSidebarOpen, onRefresh }) {
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeMenuItem = menuItems.find((item) => item.id === activeTab);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setLastUpdated(new Date().toLocaleTimeString());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getRoleBadge = () => {
    const role = user?.role;
    if (role === 'admin') return { label: '🔧 System Admin', class: 'bg-purple-100 text-purple-700' };
    if (role === 'captain') return { label: '🏛️ Captain', class: 'bg-blue-100 text-blue-700' };
    if (role === 'secretary') return { label: '📋 Secretary', class: 'bg-green-100 text-green-700' };
    return { label: '👥 Staff', class: 'bg-slate-100 text-slate-700' };
  };

  const badge = getRoleBadge();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
        {/* Left: Menu button + Title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenuClick}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <LayoutDashboard className="h-4 w-4" />
                <span className="hidden sm:inline">Admin Console</span>
              </div>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.class}`}>
                {badge.label}
              </span>
            </div>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
              {activeMenuItem?.name || 'Dashboard'}
            </h2>
            <p className="hidden sm:block mt-0.5 text-xs text-slate-500 truncate">{TAB_DESCRIPTIONS[activeTab]}</p>
          </div>
        </div>

        {/* Right: Weather, DateTime, Last Updated, Refresh */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Weather Widget - Hidden on small screens */}
          <div className="hidden xl:block">
            <WeatherWidget />
          </div>

          {/* DateTime Widget - Hidden on mobile */}
          <div className="hidden md:block">
            <DateTimeWidget />
          </div>

          {/* Last Updated */}
          <div className="hidden sm:block rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Updated</p>
            <p className="text-xs font-bold text-slate-950">{lastUpdated}</p>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-3 sm:px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
