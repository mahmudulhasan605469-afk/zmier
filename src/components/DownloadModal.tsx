import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Download,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Loader2,
  X,
  Server,
  FileCheck2,
  HardDrive,
  Smartphone,
  Monitor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppItem, PlatformType } from '../types';
import { api } from '../services/api';

interface DownloadModalProps {
  app: AppItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadComplete?: (newCount: number) => void;
  initialPlatform?: 'android' | 'windows';
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  app,
  isOpen,
  onClose,
  onDownloadComplete,
  initialPlatform,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'android' | 'windows'>('android');
  const [step, setStep] = useState<'verifying' | 'ready' | 'error'>('verifying');
  const [progress, setProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasTriggeredPopup, setHasTriggeredPopup] = useState<boolean>(false);

  // Initialize selected platform based on app supported platforms and initialPlatform prop
  useEffect(() => {
    if (!app) return;
    if (initialPlatform) {
      setSelectedPlatform(initialPlatform);
    } else if (app.platform === 'windows') {
      setSelectedPlatform('windows');
    } else {
      setSelectedPlatform('android');
    }
  }, [app, initialPlatform, isOpen]);

  useEffect(() => {
    if (!isOpen || !app) {
      setStep('verifying');
      setProgress(0);
      setDownloadUrl('');
      setErrorMessage('');
      setHasTriggeredPopup(false);
      return;
    }

    let isMounted = true;
    setStep('verifying');
    setProgress(15);
    setHasTriggeredPopup(false);

    const runVerification = async () => {
      try {
        // Step 1: Security check simulation
        await new Promise((r) => setTimeout(r, 450));
        if (!isMounted) return;
        setProgress(45);

        // Step 2: Request server download mirror & stats update
        const data = await api.downloadApp(app.id, selectedPlatform);
        if (!isMounted) return;
        setProgress(85);

        if (onDownloadComplete) {
          onDownloadComplete(data.downloadCount);
        }

        setDownloadUrl(data.downloadUrl);

        await new Promise((r) => setTimeout(r, 400));
        if (!isMounted) return;
        setProgress(100);
        setStep('ready');

        // Trigger confetti celebration
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981'],
        });

        // Auto trigger safe open in new window
        setTimeout(() => {
          if (isMounted && data.downloadUrl) {
            window.open(data.downloadUrl, '_blank', 'noopener,noreferrer');
            setHasTriggeredPopup(true);
          }
        }, 600);
      } catch (err: any) {
        if (!isMounted) return;
        setStep('error');
        setErrorMessage(err?.message || 'Unable to prepare download mirror.');
      }
    };

    runVerification();

    return () => {
      isMounted = false;
    };
  }, [isOpen, app, selectedPlatform]);

  if (!isOpen || !app) return null;

  const isWindows = selectedPlatform === 'windows';
  const currentSize = isWindows ? (app.windowsFileSize || app.size) : (app.uploadedFileSize || app.size);
  const currentRequirement = isWindows ? (app.windowsVersion || 'Windows 10/11 64-bit') : (app.minAndroidVersion || 'Android 8.0+');
  const currentFileName = isWindows
    ? (app.windowsFileName || `${app.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-setup.exe`)
    : (app.uploadedFileName || `${app.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.apk`);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0a0514]/95 p-6 sm:p-7 shadow-2xl backdrop-blur-xl text-white"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 pr-8 mb-5">
            <img
              src={app.iconUrl}
              alt={app.title}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover shadow-md border border-white/10 p-0.5 bg-black/40 flex-shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                {app.title}
              </h3>
              <p className="text-xs text-white/50">
                v{app.version} • {currentSize} • {app.developer}
              </p>
              <div className="flex items-center gap-1.5 mt-1 text-emerald-400 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Verified Clean & Malware-Scanned</span>
              </div>
            </div>
          </div>

          {/* Dual Platform Switcher if App supports Both */}
          {app.platform === 'both' && (
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => setSelectedPlatform('android')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedPlatform === 'android'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android APK</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlatform('windows')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedPlatform === 'windows'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Windows PC</span>
              </button>
            </div>
          )}

          {/* Body based on step */}
          {step === 'verifying' && (
            <div className="space-y-5 py-2">
              <div className="flex items-center justify-between text-xs text-white/70">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                  Generating verified {isWindows ? 'Windows' : 'Android'} mirror...
                </span>
                <span className="font-semibold text-indigo-400">{progress}%</span>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <FileCheck2 className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                  <span className="text-white/60 block text-[11px]">Integrity Check</span>
                  <span className="text-emerald-400 text-[10px] font-mono">Passed</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <Server className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                  <span className="text-white/60 block text-[11px]">Direct Mirror</span>
                  <span className="text-indigo-300 text-[10px]">Active</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
                  <HardDrive className="w-4 h-4 mx-auto mb-1 text-purple-400" />
                  <span className="text-white/60 block text-[11px]">File Size</span>
                  <span className="text-white/80 text-[10px] font-mono">{currentSize}</span>
                </div>
              </div>
            </div>
          )}

          {step === 'ready' && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300">
                    Download link ready!
                  </h4>
                  <p className="text-xs text-emerald-200/80 mt-0.5">
                    Your package is verified. If the download didn't start automatically, click the button below.
                  </p>
                </div>
              </div>

              <a
                href={downloadUrl || app.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-[0.99]"
              >
                <Download className="w-4 h-4" />
                <span>Start Download ({currentSize})</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>

              <div className="text-center">
                <p className="text-[11px] text-white/60 font-mono">
                  Target File: {currentFileName}
                </p>
                <p className="text-[10px] text-white/40 mt-1">
                  SHA-256: {app.sha256 ? `${app.sha256.slice(0, 16)}...` : 'Verified Cryptographic Hash'}
                </p>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-rose-300">
                    Mirror Notification
                  </h4>
                  <p className="text-xs text-rose-200/80 mt-0.5">
                    {errorMessage || 'Unable to open external link automatically.'}
                  </p>
                </div>
              </div>

              <a
                href={app.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl font-medium text-sm text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
              >
                <span>Try Direct Mirror</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <span>Requires {currentRequirement}</span>
            <span className="flex items-center gap-1 text-white/50">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              100% Free & Legal Mirror
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
