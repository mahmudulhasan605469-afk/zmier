import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ScreenshotsLightboxProps {
  screenshots: string[];
  appTitle: string;
}

export const ScreenshotsLightbox: React.FC<ScreenshotsLightboxProps> = ({
  screenshots,
  appTitle,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!screenshots || screenshots.length === 0) return null;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! - 1 + screenshots.length) % screenshots.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeIdx !== null) {
      setActiveIdx((prev) => (prev! + 1) % screenshots.length);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 sm:p-5 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
            <ImageIcon className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">App Screenshots & Interface</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {screenshots.length} {screenshots.length === 1 ? 'Preview' : 'Previews'}
        </span>
      </div>

      {/* Horizontal scroll strip */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
        {screenshots.map((src, idx) => (
          <div
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className="group relative flex-shrink-0 w-64 sm:w-80 aspect-video rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 cursor-pointer shadow-md hover:border-indigo-500/70 transition-all hover:scale-[1.02]"
          >
            <img
              src={src}
              alt={`${appTitle} Screenshot ${idx + 1}`}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="p-2.5 rounded-full bg-slate-900/80 text-white border border-slate-600">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeIdx !== null && (
          <div
            onClick={() => setActiveIdx(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center"
            >
              {/* Close button */}
              <button
                onClick={() => setActiveIdx(null)}
                className="absolute top-2 right-2 sm:-top-12 sm:right-0 p-2 text-slate-300 hover:text-white rounded-full bg-slate-800/80 hover:bg-slate-700 transition-colors z-20"
                aria-label="Close fullscreen"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 max-h-[80vh] flex items-center justify-center">
                <img
                  src={screenshots[activeIdx]}
                  alt={`${appTitle} Preview ${activeIdx + 1}`}
                  referrerPolicy="no-referrer"
                  className="max-h-[80vh] w-auto object-contain"
                />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between w-full mt-4 px-2 text-sm text-slate-300">
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors text-white font-medium"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="font-mono text-xs text-slate-400">
                  {activeIdx + 1} of {screenshots.length}
                </span>

                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors text-white font-medium"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
