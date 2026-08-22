import { useState, useEffect } from 'react';
import { Search, Plus, Megaphone, Loader2, Bell } from 'lucide-react';
import AnnouncementPost from './AnnouncementPost';
import { cn } from '../lib/utils';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = [
  { id: 'all',        label: 'All Posts',   emoji: '📋' },
  { id: 'Emergency',  label: 'Emergency',   emoji: '🚨' },
  { id: 'Important',  label: 'Important',   emoji: '⭐' },
  { id: 'Events',     label: 'Events',      emoji: '🎉' },
  { id: 'Advisories', label: 'Advisories',  emoji: '📢' },
  { id: 'General',    label: 'General',     emoji: '📌' },
  { id: 'Archived',   label: 'Archived',    emoji: '🗄️' },
];

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 border-l-4 border-l-slate-200 p-5 animate-pulse shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 bg-slate-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 bg-slate-200 rounded w-36" />
          <div className="h-3 bg-slate-200 rounded w-24" />
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-slate-200 rounded w-4/5" />
        <div className="h-3.5 bg-slate-200 rounded w-full" />
        <div className="h-3.5 bg-slate-200 rounded w-3/4" />
      </div>
      <div className="h-52 bg-slate-200 rounded-xl" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AnnouncementFeed({
  announcements,
  loading,
  userRole,
  onCreateNew,
  onEdit,
  onDelete,
  onPin,
  onArchive,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [filtered, setFiltered] = useState([]);

  const isAdmin = ['admin', 'captain', 'secretary'].includes(userRole);

  // ── Filtering ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!announcements) return;

    let result = [...announcements];

    if (activeTab === 'Archived') {
      result = result.filter((a) => a.status === 'Archived');
    } else if (activeTab !== 'all') {
      result = result.filter(
        (a) => a.category === activeTab && a.status !== 'Archived'
      );
    } else {
      result = result.filter((a) => a.status === 'Active');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFiltered(result);
  }, [announcements, activeTab, searchQuery]);

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* ── Header card ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top gradient stripe */}
        <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />

        <div className="p-5 sm:p-6">
          {/* Title row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                  Announcements
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Latest news & updates from Barangay Bakilid
                </p>
              </div>
            </div>

            {isAdmin && onCreateNew && (
              <button
                onClick={onCreateNew}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold text-sm shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                New Announcement
              </button>
            )}
          </div>

          {/* Search */}
          <div className="relative mt-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-0.5 -mx-1 px-1 scrollbar-none">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                )}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Feed ── */}
      <div className="max-w-2xl mx-auto space-y-5">
        {filtered.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 py-16 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-2xl mb-4">
              <Megaphone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {searchQuery ? 'No results found' : 'No announcements yet'}
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto mb-5">
              {searchQuery
                ? 'Try different keywords or clear the search.'
                : 'There are no posts in this category right now.'}
            </p>
            {isAdmin && onCreateNew && !searchQuery && (
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create First Post
              </button>
            )}
          </div>
        ) : (
          filtered.map((announcement, index) => (
            <AnnouncementPost
              key={announcement.id}
              announcement={announcement}
              userRole={userRole}
              onEdit={onEdit}
              onDelete={onDelete}
              onPin={onPin}
              onArchive={onArchive}
              isFirstFew={index < 3}
            />
          ))
        )}
      </div>
    </div>
  );
}
