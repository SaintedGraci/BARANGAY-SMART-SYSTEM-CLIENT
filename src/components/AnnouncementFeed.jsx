import { useState, useEffect } from 'react';
import { Search, Filter, Plus, Megaphone, Loader2 } from 'lucide-react';
import AnnouncementPost from './AnnouncementPost';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'Urgent', label: 'Emergency' },
  { id: 'High', label: 'Important' },
  { id: 'events', label: 'Events' },
  { id: 'Medium', label: 'Advisories' },
  { id: 'Low', label: 'General' },
  { id: 'Archived', label: 'Archived' },
];

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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

  const isAdmin = ['admin', 'captain', 'secretary'].includes(userRole);

  useEffect(() => {
    if (!announcements) return;

    let filtered = announcements;

    // Filter by category/priority
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'Archived') {
        filtered = filtered.filter(a => a.status === 'Archived');
      } else {
        filtered = filtered.filter(a => 
          a.priority === selectedCategory && a.status !== 'Archived'
        );
      }
    } else {
      // Show only active announcements by default
      filtered = filtered.filter(a => a.status === 'Active');
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    // Sort: pinned first, then by date
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    setFilteredAnnouncements(filtered);
  }, [announcements, selectedCategory, searchQuery]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Skeleton Loading */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
            <div className="flex gap-3">
              <div className="w-11 h-11 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-24"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-3 bg-slate-200 rounded w-full"></div>
              <div className="h-3 bg-slate-200 rounded w-5/6"></div>
            </div>
            <div className="mt-4 h-48 bg-slate-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Barangay Announcements
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              Stay updated with the latest news, events, advisories, and important information from Barangay Bakilid.
            </p>
          </div>
          
          {isAdmin && onCreateNew && (
            <button
              onClick={onCreateNew}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              <Plus className="w-5 h-5" />
              <span>Create Announcement</span>
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="mt-6 space-y-4">
          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Feed Container */}
      <div className="max-w-3xl mx-auto">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
              <Megaphone className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              No announcements yet
            </h3>
            <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'No announcements match your search. Try different keywords.'
                : 'There are currently no published announcements from Barangay Bakilid.'}
            </p>
            {isAdmin && onCreateNew && !searchQuery && (
              <button
                onClick={onCreateNew}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Announcement
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredAnnouncements.map((announcement, index) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
