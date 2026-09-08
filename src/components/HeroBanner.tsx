import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Download,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { AppItem } from '../types';

interface HeroBannerProps {
  featuredApps: AppItem[];
  onOpenDetails: (app: AppItem) => void;
  onDownload: (app: AppItem) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  featuredApps,
  onOpenDetails,
  onDownload,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredApps.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredApps.length]);

  if (!featuredApps || featuredApps.length === 0) return null;

  const currentApp = featuredApps[currentIndex] || featuredApps[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredApps.length) % featuredApps.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredApps.length);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl p-6 sm:p-8 md:p-10 mb-8 backdrop-blur-md">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentApp.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-indigo-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white tracking-wider uppercase">
                FEATURED
              </span>
              <span className="text-white/60 text-[10px] tracking-widest font-mono uppercase">
                VERSION {currentApp.version}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED CLEAN
              </span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 tracking-tight leading-tight text-white">
                {currentApp.title.split(' ')[0]} <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                  {currentApp.title.split(' ').slice(1).join(' ') || 'Pro Edition'}
                </span>
              </h1>
              <p className="text-xs font-semibold text-white/50 tracking-wide uppercase">
                {currentApp.developer} • {currentApp.category}
              </p>
            </div>

            <p className="text-white/70 text-sm sm:text-base line-clamp-2 leading-relaxed max-w-2xl">
              {currentApp.shortDescription}
            </p>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/70 pt-1">
              <div className="flex items-center gap-1 font-bold text-yellow-400">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{currentApp.rating.toFixed(1)}</span>
                <span className="text-white/40 font-normal">({currentApp.reviewCount})</span>
              </div>
              <span className="text-white/20">•</span>
              <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded-md text-white/80 font-mono">
                {currentApp.size}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-white/60 text-xs">Android {currentApp.minAndroidVersion}+</span>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onDownload(currentApp)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download APK</span>
              </button>

              <button
                onClick={() => onOpenDetails(currentApp)}
                className="backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-8 py-3 rounded-xl text-sm transition-all flex items-center gap-2"
              >
                <Layers className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
          </div>

          {/* Right Visual / Screenshots Showcase */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative group cursor-pointer w-full max-w-sm" onClick={() => onOpenDetails(currentApp)}>
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
              <div className="relative rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={currentApp.iconUrl}
                    alt={currentApp.title}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/10 bg-black/40"
                  />
                  <div className="min-w-0">
                    <h3 className="font-bold text-white text-base truncate">{currentApp.title}</h3>
                    <p className="text-xs text-indigo-400 truncate">{currentApp.developer}</p>
                    <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Signature Checked</span>
                    </div>
                  </div>
                </div>

                {/* Screenshot snippet */}
                {currentApp.screenshots && currentApp.screenshots[0] && (
                  <div className="rounded-2xl overflow-hidden border border-white/10 relative aspect-video bg-black/40">
                    <img
                      src={currentApp.screenshots[0]}
                      alt="App Screenshot"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                      <span className="text-[11px] font-medium text-white/80 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3 text-indigo-400" />
                        Click to preview full media & video
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Navigation Buttons & Dots */}
      <div className="relative z-10 flex items-center justify-between mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          {featuredApps.map((app, idx) => (
            <button
              key={app.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-indigo-500'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Previous featured app"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Next featured app"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
