import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Download,
  Star,
  ShieldCheck,
  Bookmark,
  Share2,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Layers,
  Cpu,
  FileCheck,
  CheckCircle2,
  HardDrive,
  Info,
  Sparkles,
  Tag,
  Check,
  Smartphone,
  Monitor
} from 'lucide-react';
import { AppItem } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AppCard } from '../components/AppCard';
import { ScreenshotsLightbox } from '../components/ScreenshotsLightbox';
import { VideoPlayer } from '../components/VideoPlayer';
import { ReviewSection } from '../components/ReviewSection';

interface AppDetailsPageProps {
  appIdOrSlug: string;
  onBack: () => void;
  onOpenApp: (app: AppItem) => void;
  onDownload: (app: AppItem, platform?: 'android' | 'windows') => void;
}

export const AppDetailsPage: React.FC<AppDetailsPageProps> = ({
  appIdOrSlug,
  onBack,
  onOpenApp,
  onDownload,
}) => {
  const { isBookmarked, toggleBookmark } = useAuth();
  const [app, setApp] = useState<AppItem | null>(null);
  const [relatedApps, setRelatedApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setIsLoading(true);
        const data = await api.getApp(appIdOrSlug);
        setApp(data.app);
        setRelatedApps(data.relatedApps || []);
      } catch (err) {
        console.error('Failed to load app details:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [appIdOrSlug]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading app package details...</span>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="py-24 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">APK Not Found</h3>
        <p className="text-slate-400 text-xs">The requested application is not available or has been unpublished.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleReviewStatsUpdated = (newRating: number, newCount: number) => {
    setApp((prev) => (prev ? { ...prev, rating: newRating, reviewCount: newCount } : null));
  };

  const formatDownloads = (num: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const bookmarked = isBookmarked(app.id);

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Top Back navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Store</span>
      </button>

      {/* Main Hero Header Card */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          {/* Large App Icon */}
          <div className="relative flex-shrink-0">
            <img
              src={app.iconUrl}
              alt={app.title}
              referrerPolicy="no-referrer"
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-2xl border-2 border-white/10 p-0.5 bg-black/40"
            />
            {app.isVerifiedSafe && (
              <div className="absolute -bottom-2 -right-2 p-1 rounded-full bg-emerald-500 text-black shadow-lg border-2 border-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
            )}
          </div>

          {/* Title & Metadata */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {app.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-white/5 text-white/70 border border-white/10">
                v{app.version}
              </span>
              {app.featured && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ★ Editor's Choice
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              {app.title}
            </h1>

            <p className="text-sm font-semibold text-indigo-400">
              Developed by <span className="text-white/80">{app.developer}</span>
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-white/70 pt-2 border-t border-white/10">
              <div>
                <div className="flex items-center gap-1 font-bold text-yellow-400 text-base">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{app.rating.toFixed(1)}</span>
                </div>
                <span className="text-[11px] text-white/40">{app.reviewCount} Ratings</span>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <div className="font-bold text-white text-base">
                  {formatDownloads(app.downloadCount)}
                </div>
                <span className="text-[11px] text-white/40">Downloads</span>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <div className="font-mono font-bold text-indigo-300 text-base">
                  {app.uploadedFileSize || app.size}
                </div>
                <span className="text-[11px] text-white/40">
                  {app.platform === 'windows' ? 'PC Size' : 'Package Size'}
                </span>
              </div>

              <div className="h-8 w-px bg-white/10" />

              <div>
                <div className="font-bold text-cyan-300 text-base">
                  {app.platform === 'windows' ? (app.windowsVersion || 'Windows 10/11') : (app.minAndroidVersion || 'Android 8.0+')}
                </div>
                <span className="text-[11px] text-white/40">Target OS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              {/* If platform is Android or Both */}
              {(app.platform === 'android' || app.platform === 'both' || !app.platform) && (
                <button
                  onClick={() => onDownload(app, 'android')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 transform active:scale-95"
                >
                  <Smartphone className="w-4 h-4 text-emerald-300" />
                  <span>DOWNLOAD APK ({app.uploadedFileSize || app.size})</span>
                </button>
              )}

              {/* If platform is Windows or Both */}
              {(app.platform === 'windows' || app.platform === 'both') && (
                <button
                  onClick={() => onDownload(app, 'windows')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 transform active:scale-95"
                >
                  <Monitor className="w-4 h-4 text-cyan-200" />
                  <span>DOWNLOAD FOR PC ({app.windowsFileSize || app.size})</span>
                </button>
              )}

              <button
                onClick={() => toggleBookmark(app.id)}
                className={`p-3.5 rounded-xl border font-semibold text-xs transition-colors flex items-center gap-2 ${
                  bookmarked
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:bg-white/10'
                }`}
                title={bookmarked ? 'Saved in bookmarks' : 'Add to bookmarks'}
              >
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">{bookmarked ? 'Saved' : 'Bookmark'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-semibold"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span className="hidden sm:inline">{copiedLink ? 'Link Copied!' : 'Share'}</span>
              </button>

              {app.officialWebsiteUrl && (
                <a
                  href={app.officialWebsiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2 text-xs font-semibold"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline">Official Site</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media: Video Player + Screenshots Lightbox */}
      <div className="space-y-6">
        {app.previewVideoUrl && (
          <VideoPlayer
            videoUrl={app.previewVideoUrl}
            videoType={app.videoType}
            thumbnailUrl={app.screenshots && app.screenshots[0]}
            appTitle={app.title}
          />
        )}

        {app.screenshots && app.screenshots.length > 0 && (
          <ScreenshotsLightbox screenshots={app.screenshots} appTitle={app.title} />
        )}
      </div>

      {/* Description & Key Features */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight mb-3">About this App</h3>
          <p className={`text-white/70 text-xs sm:text-sm leading-relaxed ${!isDescriptionExpanded ? 'line-clamp-4' : ''}`}>
            {app.description}
          </p>
          {app.description && app.description.length > 200 && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              {isDescriptionExpanded ? 'Read less' : 'Read more...'}
            </button>
          )}
        </div>

        {/* Features Checklist */}
        {app.features && app.features.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Key Features & Highlights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {app.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {app.tags && app.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-semibold text-white/50 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Tags:
            </span>
            {app.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white/5 border border-white/10 text-white/70"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* What's New / Changelog Card */}
      {app.changelog && (
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">What's New in Version {app.version}</h3>
          </div>
          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-mono whitespace-pre-line bg-white/5 p-4 rounded-2xl border border-white/10">
            {app.changelog}
          </p>
        </div>
      )}

      {/* Technical Specifications Table */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 shadow-xl backdrop-blur-md">
        <h3 className="text-lg font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-indigo-400" />
          <span>Technical Specifications & Integrity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[11px]">Platform</span>
            <span className="font-semibold text-white mt-0.5 flex items-center gap-1.5 capitalize">
              {app.platform === 'both' ? 'Android & Windows (PC)' : app.platform || 'Android'}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[11px]">Package Name / App ID</span>
            <span className="font-mono text-white/90 break-all font-semibold mt-0.5 block">
              {app.packageName}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[11px]">Package Size</span>
            <span className="font-mono text-indigo-300 font-semibold mt-0.5 block">
              {app.uploadedFileSize || app.size}
            </span>
          </div>

          {(app.platform === 'android' || app.platform === 'both' || !app.platform) && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/40 block text-[11px]">Minimum Android OS</span>
              <span className="text-emerald-300 font-semibold mt-0.5 block">
                {app.minAndroidVersion || 'Android 8.0+'}
              </span>
            </div>
          )}

          {(app.platform === 'windows' || app.platform === 'both') && (
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-white/40 block text-[11px]">Windows Compatibility</span>
              <span className="text-blue-300 font-semibold mt-0.5 block">
                {app.windowsVersion || 'Windows 10 / 11 64-bit'}
              </span>
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-white/40 block text-[11px]">Updated Date</span>
            <span className="text-white/80 font-semibold mt-0.5 block">
              {app.updateDate || app.uploadDate}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 sm:col-span-2">
            <span className="text-white/40 block text-[11px]">SHA-256 Checksum Signature</span>
            <span className="font-mono text-[11px] text-emerald-400 break-all mt-0.5 block">
              {app.sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </span>
          </div>
        </div>
      </div>

      {/* User Reviews & Ratings Section */}
      <ReviewSection
        appId={app.id}
        appTitle={app.title}
        onReviewStatsUpdated={handleReviewStatsUpdated}
      />

      {/* Related Apps in Same Category */}
      {relatedApps.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">
              More in {app.category}
            </h3>
            <span className="text-xs text-slate-400">Handpicked alternatives</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedApps.map((rel) => (
              <AppCard
                key={rel.id}
                app={rel}
                onOpenDetails={onOpenApp}
                onQuickDownload={onDownload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
