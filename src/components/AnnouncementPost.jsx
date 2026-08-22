import { useState, useEffect } from 'react';
import {
  Edit3, Trash2, Pin, Archive, MoreHorizontal,
  ThumbsUp, MessageSquare, X, Send, Globe, Clock,
  AlertTriangle, Info, Star, Calendar, Megaphone
} from 'lucide-react';
import OptimizedImage from './ui/OptimizedImage';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { cn } from '../lib/utils';
import { announcementsAPI } from '../services/api';

// ─── Category / Priority config ──────────────────────────────────────────────
const CATEGORY_CONFIG = {
  Emergency: {
    label: 'Emergency',
    icon: AlertTriangle,
    pill: 'bg-red-50 text-red-700 border-red-200',
    accent: 'border-l-red-500',
    dot: 'bg-red-500',
    glow: 'shadow-red-100',
  },
  Important: {
    label: 'Important',
    icon: Star,
    pill: 'bg-amber-50 text-amber-700 border-amber-200',
    accent: 'border-l-amber-500',
    dot: 'bg-amber-500',
    glow: 'shadow-amber-100',
  },
  Events: {
    label: 'Event',
    icon: Calendar,
    pill: 'bg-purple-50 text-purple-700 border-purple-200',
    accent: 'border-l-purple-500',
    dot: 'bg-purple-500',
    glow: 'shadow-purple-100',
  },
  Advisories: {
    label: 'Advisory',
    icon: Info,
    pill: 'bg-blue-50 text-blue-700 border-blue-200',
    accent: 'border-l-blue-400',
    dot: 'bg-blue-400',
    glow: 'shadow-blue-100',
  },
  General: {
    label: 'General',
    icon: Megaphone,
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
    glow: 'shadow-emerald-100',
  },
};

// Map legacy priority → category key
const PRIORITY_TO_CATEGORY = {
  Urgent: 'Emergency',
  High: 'Important',
  Medium: 'Advisories',
  Low: 'General',
};

function resolveCategory(announcement) {
  if (announcement.category && CATEGORY_CONFIG[announcement.category]) {
    return announcement.category;
  }
  return PRIORITY_TO_CATEGORY[announcement.priority] || 'General';
}

// ─── Time formatter ───────────────────────────────────────────────────────────
function formatPostTime(date) {
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
    year: postDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

// ─── Reaction animation component ─────────────────────────────────────────────
function HelpfulBubble({ show }) {
  if (!show) return null;
  return (
    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-emerald-600 animate-bounce pointer-events-none select-none">
      +1 👍
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AnnouncementPost({
  announcement,
  userRole,
  onEdit,
  onDelete,
  onPin,
  onArchive,
  isFirstFew = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingReaction, setLoadingReaction] = useState(false);
  const [loadingComment, setLoadingComment] = useState(false);
  const [showBubble, setShowBubble] = useState(false);

  const isAdmin = ['admin', 'captain', 'secretary'].includes(userRole);
  const categoryKey = resolveCategory(announcement);
  const catConfig = CATEGORY_CONFIG[categoryKey];
  const CategoryIcon = catConfig.icon;

  const isLongContent = announcement.description.length > 280;
  const displayContent =
    expanded || !isLongContent
      ? announcement.description
      : announcement.description.substring(0, 280) + '…';

  const isVideo = (path) => {
    if (!path) return false;
    return ['.mp4', '.webm', '.ogg', '.mov'].some((ext) =>
      path.toLowerCase().endsWith(ext)
    );
  };

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (announcement) {
      setIsHelpful(announcement.isHelpful || false);
      setHelpfulCount(announcement.helpfulCount || 0);
    }
  }, [announcement?.id, announcement?.isHelpful, announcement?.helpfulCount]);

  useEffect(() => {
    if (announcement?.id) fetchComments();
  }, [announcement?.id]);

  useEffect(() => {
    if (showComments && announcement?.id) fetchComments();
  }, [showComments, announcement?.id]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const fetchComments = async () => {
    try {
      const res = await announcementsAPI.getComments(announcement.id);
      setComments(res.data.data.comments);
    } catch (err) {
      console.error('Fetch comments error:', err);
    }
  };

  const handleReaction = async () => {
    if (loadingReaction) return;
    setLoadingReaction(true);

    const prev = isHelpful;
    const prevCount = helpfulCount;
    setIsHelpful(!isHelpful);
    setHelpfulCount(isHelpful ? helpfulCount - 1 : helpfulCount + 1);

    if (!isHelpful) {
      setShowBubble(true);
      setTimeout(() => setShowBubble(false), 1200);
    }

    try {
      const res = await announcementsAPI.toggleReaction(announcement.id);
      setIsHelpful(res.data.data.isHelpful);
      setHelpfulCount(res.data.data.helpfulCount);
    } catch (err) {
      console.error('Reaction error:', err);
      setIsHelpful(prev);
      setHelpfulCount(prevCount);
    } finally {
      setLoadingReaction(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || loadingComment) return;
    setLoadingComment(true);
    try {
      await announcementsAPI.addComment(announcement.id, newComment.trim());
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Add comment error:', err);
    } finally {
      setLoadingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await announcementsAPI.deleteComment(announcement.id, commentId);
      await fetchComments();
    } catch (err) {
      console.error('Delete comment error:', err);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Card ── */}
      <article
        className={cn(
          'group relative bg-white rounded-2xl border border-slate-200/80',
          'shadow-sm hover:shadow-lg transition-all duration-300',
          'border-l-4',
          catConfig.accent,
          catConfig.glow && `hover:${catConfig.glow}`,
          announcement.isPinned && 'ring-2 ring-blue-200 ring-offset-1'
        )}
      >
        {/* ── Pinned banner ── */}
        {announcement.isPinned && (
          <div className="flex items-center gap-2 px-4 pt-3 pb-0 text-xs font-semibold text-blue-600">
            <Pin className="w-3.5 h-3.5 fill-blue-500" />
            Pinned Post
          </div>
        )}

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-0 sm:px-5">
          <div className="flex items-center gap-3">
            {/* Official barangay avatar */}
            <div className="relative">
              <Avatar className="w-11 h-11 ring-2 ring-emerald-500/30">
                <AvatarFallback className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-bold text-sm">
                  BB
                </AvatarFallback>
              </Avatar>
              {/* Online-style verified dot */}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-bold text-slate-900 text-sm leading-tight">
                  Barangay Bakilid
                </span>
                {/* Official badge */}
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-semibold">
                  <Globe className="w-2.5 h-2.5" />
                  Official
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{formatPostTime(announcement.createdAt)}</span>
                {announcement.updatedAt !== announcement.createdAt && (
                  <span className="text-slate-400">· Edited</span>
                )}
              </div>
            </div>
          </div>

          {/* Category pill */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
                catConfig.pill
              )}
            >
              <CategoryIcon className="w-3 h-3" />
              {catConfig.label}
            </span>

            {/* Admin actions dropdown */}
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none"
                    aria-label="More options"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onEdit?.(announcement)}
                    className="text-slate-700"
                  >
                    <Edit3 className="w-4 h-4 text-slate-500" />
                    Edit Announcement
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onPin?.(announcement)}
                    className="text-slate-700"
                  >
                    <Pin className="w-4 h-4 text-slate-500" />
                    {announcement.isPinned ? 'Unpin Post' : 'Pin to Top'}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onArchive?.(announcement)}
                    className="text-slate-700"
                  >
                    <Archive className="w-4 h-4 text-slate-500" />
                    Archive Post
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete?.(announcement)}
                    className="text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* ── Category pill (mobile only) ── */}
        <div className="sm:hidden px-4 pt-2">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
              catConfig.pill
            )}
          >
            <CategoryIcon className="w-3 h-3" />
            {catConfig.label}
          </span>
        </div>

        {/* ── Title & Body ── */}
        <div className="px-4 pt-3 pb-0 sm:px-5">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug mb-2">
            {announcement.title}
          </h3>
          <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed whitespace-pre-wrap">
            {displayContent}
          </p>
          {isLongContent && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="mt-1.5 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              {expanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>

        {/* ── Media ── */}
        {(announcement.imagePath || announcement.mediumUrl || announcement.largeUrl) && (
          <div className="mt-3 overflow-hidden bg-slate-50">
            {isVideo(announcement.imagePath || announcement.largeUrl) ? (
              <video
                controls
                className="w-full max-h-[560px]"
                poster={
                  (announcement.imagePath || announcement.largeUrl).replace(
                    /\.[^/.]+$/,
                    ''
                  ) + '-thumb.jpg'
                }
              >
                <source
                  src={announcement.imagePath || announcement.largeUrl}
                  type="video/mp4"
                />
              </video>
            ) : (
              <button
                className="w-full block focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                onClick={() => setShowLightbox(true)}
                aria-label="View full image"
              >
                <OptimizedImage
                  src={announcement.mediumUrl || announcement.imagePath || announcement.largeUrl}
                  srcSet={
                    announcement.thumbnailUrl && announcement.mediumUrl && announcement.largeUrl
                      ? `${announcement.thumbnailUrl} 400w, ${announcement.mediumUrl} 800w, ${announcement.largeUrl} 1200w`
                      : undefined
                  }
                  sizes="(max-width: 768px) 100vw, 800px"
                  alt={announcement.title}
                  width="800"
                  height="600"
                  eager={isFirstFew}
                  className="w-full max-h-[560px] object-cover hover:brightness-95 transition-[filter] duration-200"
                  onError={() => console.error('Failed to load image:', announcement.imagePath)}
                />
              </button>
            )}
          </div>
        )}

        {/* ── Reaction + comment tally bar ── */}
        <div className="flex items-center justify-between px-4 sm:px-5 pt-3 pb-1 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            {helpfulCount > 0 && (
              <>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 shadow-sm">
                  <ThumbsUp className="w-3 h-3 fill-white text-white" />
                </span>
                <span className="font-medium text-slate-600">{helpfulCount}</span>
              </>
            )}
          </div>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-slate-500 hover:text-slate-800 hover:underline transition-colors text-xs font-medium"
          >
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="mx-4 sm:mx-5 border-t border-slate-100" />

        {/* ── Action buttons ── */}
        <div className="flex items-center px-2 sm:px-3 py-1">
          {/* Helpful */}
          <div className="relative flex-1">
            <HelpfulBubble show={showBubble} />
            <button
              onClick={handleReaction}
              disabled={loadingReaction}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold',
                'transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
                isHelpful
                  ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <ThumbsUp
                className={cn(
                  'w-4 h-4 sm:w-5 sm:h-5 transition-all duration-200',
                  isHelpful
                    ? 'fill-emerald-600 text-emerald-600 scale-110'
                    : 'text-slate-500'
                )}
              />
              <span>Helpful</span>
            </button>
          </div>

          {/* Comment */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold',
              'transition-all duration-200',
              showComments
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            )}
          >
            <MessageSquare
              className={cn(
                'w-4 h-4 sm:w-5 sm:h-5 transition-colors',
                showComments ? 'text-blue-600' : 'text-slate-500'
              )}
            />
            <span>Comment</span>
          </button>
        </div>

        {/* ── Comment section ── */}
        {showComments && (
          <div className="border-t border-slate-100 bg-slate-50/60 rounded-b-2xl px-4 sm:px-5 py-4 space-y-4">
            {/* Input row */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2.5">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                  {userRole ? userRole.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-emerald-400 focus-within:border-transparent transition-all">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment…"
                  className="flex-1 text-sm text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim() || loadingComment}
                  className={cn(
                    'p-1.5 rounded-full transition-all duration-200',
                    newComment.trim()
                      ? 'text-emerald-600 hover:bg-emerald-50'
                      : 'text-slate-300 cursor-not-allowed'
                  )}
                  aria-label="Post comment"
                >
                  {loadingComment ? (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </form>

            {/* Comments list */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="py-6 text-center">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No comments yet. Be the first!</p>
                </div>
              ) : (
                comments.map((comment) => {
                  const userName =
                    comment.user?.fullName || comment.user?.username || 'Unknown';
                  const initials = userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <div key={comment.id} className="flex items-start gap-2.5 group/comment">
                      <Avatar className="w-8 h-8 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {userName}
                              </p>
                              <p className="text-sm text-slate-700 mt-0.5 break-words leading-relaxed">
                                {comment.comment}
                              </p>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="flex-shrink-0 p-1 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover/comment:opacity-100"
                                aria-label="Delete comment"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 px-1">
                          {new Date(comment.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </article>

      {/* ── Lightbox ── */}
      {showLightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            onClick={() => setShowLightbox(false)}
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={announcement.largeUrl || announcement.imagePath || announcement.mediumUrl}
            alt={announcement.title}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
