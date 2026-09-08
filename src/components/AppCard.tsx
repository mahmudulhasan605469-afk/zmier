import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Star, Download, ShieldCheck, Bookmark, Check, Loader2, Smartphone, Monitor } from 'lucide-react';
import { AppItem } from '../types';
import { useAuth } from '../context/AuthContext';

interface AppCardProps {
  app: AppItem;
  onOpenDetails: (app: AppItem) => void;
  onQuickDownload?: (app: AppItem) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onOpenDetails, onQuickDownload }) => {
  const { isBookmarked, toggleBookmark } = useAuth();
  const [isBookmarkedLocal, setIsBookmarkedLocal] = useState(() => isBookmarked(app.id));
  const [isDownloading, setIsDownloading] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const result = await toggleBookmark(app.id);
    setIsBookmarkedLocal(result);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickDownload) {
      setIsDownloading(true);
      onQuickDownload(app);
      setTimeout(() => setIsDownloading(false), 1000);
    } else {
      onOpenDetails(app);
    }
  };

  const formatDownloads = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={() => onOpenDetails(app)}
      className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-4 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40 cursor-pointer"
    >
      {/* Top badges & bookmark */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="relative">
          <img
            src={app.iconUrl}
            alt={app.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-14 h-14 rounded-2xl object-cover shadow-md border border-white/10 bg-black/40 group-hover:scale-105 transition-transform duration-300"
          />
          {app.isVerifiedSafe && (
            <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-emerald-500 text-black shadow">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {app.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Featured
            </span>
          )}
          {app.trending && !app.featured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Hot 🔥
            </span>
          )}
          <button
            onClick={handleBookmarkClick}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarkedLocal
                ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-400'
                : 'border-white/10 text-white/40 hover:text-white hover:bg-white/10'
            }`}
            title={isBookmarkedLocal ? 'Saved in Bookmarks' : 'Save to Bookmarks'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarkedLocal ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 text-sm sm:text-base">
            {app.title}
          </h4>
        </div>
        <div className="flex items-center justify-between text-[11px] text-white/50 mt-1">
          <span className="truncate">{app.developer}</span>
          <span className="flex items-center gap-1 font-mono text-[10px] text-white/40">
            {app.platform === 'windows' ? (
              <span className="flex items-center gap-1 text-blue-400">
                <Monitor className="w-3 h-3" /> PC
              </span>
            ) : app.platform === 'both' ? (
              <span className="flex items-center gap-1 text-purple-400">
                <Smartphone className="w-3 h-3" />+<Monitor className="w-3 h-3" />
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <Smartphone className="w-3 h-3" /> APK
              </span>
            )}
          </span>
        </div>

        <p className="text-xs text-white/60 line-clamp-2 mt-2 leading-relaxed">
          {app.shortDescription}
        </p>
      </div>

      {/* Meta Specs */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 font-semibold text-yellow-400">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{app.rating.toFixed(1)}</span>
          </div>
          <span className="text-white/20">•</span>
          <span>{formatDownloads(app.downloadCount)} dl</span>
        </div>
        <div className="text-[11px] font-mono text-white/60">
          {app.uploadedFileSize || app.windowsFileSize || app.size}
        </div>
      </div>

      {/* Download Action Button */}
      <div className="mt-3">
        <button
          onClick={handleDownloadClick}
          disabled={isDownloading}
          className={`w-full py-2 px-3 rounded-xl font-semibold text-xs text-white shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] ${
            app.platform === 'windows'
              ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/20 group-hover:shadow-blue-600/30'
              : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20 group-hover:shadow-indigo-600/30'
          }`}
        >
          {isDownloading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <>
              {app.platform === 'windows' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-blue-200" />
                  <span>DOWNLOAD FOR PC</span>
                </>
              ) : app.platform === 'both' ? (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>GET APK / PC</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>DOWNLOAD APK</span>
                </>
              )}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
