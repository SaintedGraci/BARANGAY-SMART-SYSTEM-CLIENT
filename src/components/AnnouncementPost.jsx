import { useState } from 'react';
import { Edit3, Trash2, Pin, Archive, MoreVertical, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';

// Priority badges with modern styling
const PRIORITY_CONFIG = {
  Urgent: { emoji: '🔴', label: 'EMERGENCY', className: 'bg-rose-100 text-rose-800 border-rose-300' },
  High: { emoji: '🟠', label: 'IMPORTANT', className: 'bg-orange-100 text-orange-800 border-orange-300' },
  Medium: { emoji: '🔵', label: 'ADVISORY', className: 'bg-blue-100 text-blue-800 border-blue-300' },
  Low: { emoji: '⚪', label: 'GENERAL', className: 'bg-slate-100 text-slate-700 border-slate-300' },
};

export default function AnnouncementPost({ announcement, userRole, onEdit, onDelete, onPin, onArchive }) {
  const [showMenu, setShowMenu] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  const isAdmin = ['admin', 'captain', 'secretary'].includes(userRole);
  const priorityConfig = PRIORITY_CONFIG[announcement.priority] || PRIORITY_CONFIG.Low;
  
  // Determine if content should be expandable (more than 300 chars)
  const isLongContent = announcement.description.length > 300;
  const displayContent = (expanded || !isLongContent) 
    ? announcement.description 
    : announcement.description.substring(0, 300) + '...';

  const formatPostTime = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return postDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch(action) {
      case 'edit': onEdit?.(announcement); break;
      case 'pin': onPin?.(announcement); break;
      case 'archive': onArchive?.(announcement); break;
      case 'delete': onDelete?.(announcement); break;
    }
  };

  const isVideo = (path) => {
    if (!path) return false;
    const videoExts = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExts.some(ext => path.toLowerCase().endsWith(ext));
  };

  return (
    <>
      <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        {/* Post Header */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                BB
              </div>
            </div>

            {/* Header Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">Barangay Bakilid</h4>
                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      Official Announcement
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-500">{formatPostTime(announcement.createdAt)}</span>
                    {announcement.updatedAt !== announcement.createdAt && (
                      <>
                        <span className="text-xs text-slate-400">· Edited</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Admin Menu */}
                {isAdmin && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-5 h-5 text-slate-500" />
                    </button>
                    
                    {showMenu && (
                      <>
                        <div 
                          className="fixed inset-0 z-10" 
                          onClick={() => setShowMenu(false)}
                        />
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20">
                          <button
                            onClick={() => handleMenuAction('edit')}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Edit3 className="w-4 h-4" />
                            Edit Announcement
                          </button>
                          {announcement.isPinned ? (
                            <button
                              onClick={() => handleMenuAction('pin')}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pin className="w-4 h-4" />
                              Unpin Announcement
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMenuAction('pin')}
                              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                            >
                              <Pin className="w-4 h-4" />
                              Pin Announcement
                            </button>
                          )}
                          <button
                            onClick={() => handleMenuAction('archive')}
                            className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" />
                            Archive Announcement
                          </button>
                          <hr className="my-1 border-slate-200" />
                          <button
                            onClick={() => handleMenuAction('delete')}
                            className="w-full px-4 py-2 text-left text-sm text-rose-700 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Announcement
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Priority Badge & Title */}
          <div className="mt-4">
            {announcement.isPinned && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 mb-2">
                <Pin className="w-3.5 h-3.5 fill-blue-700" />
                Pinned
              </div>
            )}
            
            {announcement.priority && announcement.priority !== 'Low' && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border mb-3 ${priorityConfig.className}`}>
                <span>{priorityConfig.emoji}</span>
                {priorityConfig.label}
              </div>
            )}

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {announcement.title}
            </h3>
          </div>

          {/* Content */}
          <div className="mt-3">
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
              {displayContent}
            </p>
            {isLongContent && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                {expanded ? 'See less' : 'See more'}
              </button>
            )}
          </div>
        </div>

        {/* Media */}
        {announcement.imagePath && (
          <div className="relative bg-slate-50">
            {isVideo(announcement.imagePath) ? (
              <video
                controls
                className="w-full max-h-[600px]"
                poster={announcement.imagePath.replace(/\.[^/.]+$/, '') + '-thumb.jpg'}
              >
                <source src={announcement.imagePath} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div 
                className="cursor-pointer"
                onClick={() => setShowLightbox(true)}
              >
                <OptimizedImage
                  src={announcement.imagePath}
                  alt={announcement.title}
                  width="800"
                  height="600"
                  className="w-full max-h-[600px] object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', announcement.imagePath);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Post Footer - Interactions */}
        <div className="border-t border-slate-200 px-4 sm:px-5 py-3">
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span className="hidden sm:inline">Helpful</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Comment</span>
            </button>
          </div>
        </div>
      </article>

      {/* Image Lightbox */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-slate-300 p-2"
            onClick={() => setShowLightbox(false)}
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={announcement.imagePath}
            alt={announcement.title}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
