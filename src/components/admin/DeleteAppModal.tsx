import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';
import { AppItem } from '../../types';
import { api } from '../../services/api';

interface DeleteAppModalProps {
  isOpen: boolean;
  app: AppItem | null;
  onClose: () => void;
  onSuccess: (deletedApp: AppItem) => void;
}

export const DeleteAppModal: React.FC<DeleteAppModalProps> = ({
  isOpen,
  app,
  onClose,
  onSuccess,
}) => {
  const [confirmInput, setConfirmInput] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Reset confirmation input on open/close or target change
  useEffect(() => {
    if (isOpen) {
      setConfirmInput('');
      setErrorMessage('');
      setIsDeleting(false);
    }
  }, [isOpen, app]);

  if (!isOpen || !app) return null;

  const isConfirmed = confirmInput.trim() === 'DELETE';

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConfirmed || isDeleting) return;

    try {
      setIsDeleting(true);
      setErrorMessage('');
      await api.deleteApp(app.id);
      onSuccess(app);
      onClose();
    } catch (err: any) {
      console.error('Delete app failed:', err);
      setErrorMessage(err?.message || 'Failed to delete application.');
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        id="delete-app-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          id="delete-app-modal-container"
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-rose-500/30 bg-[#0c0612]/95 p-6 sm:p-7 shadow-2xl shadow-rose-950/50 backdrop-blur-xl text-white"
        >
          {/* Ambient red hazard glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-600/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-amber-600/10 rounded-full blur-[90px] pointer-events-none" />

          {/* Close button */}
          <button
            id="close-delete-modal-btn"
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                ⚠️ Delete App
              </h3>
              <p className="text-xs text-rose-300/80 font-medium">
                Permanent Store Removal
              </p>
            </div>
          </div>

          <p className="text-sm text-slate-300 font-medium mt-3">
            Are you sure you want to delete this app?
          </p>

          {/* App Card Preview */}
          <div className="mt-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center gap-3.5">
            <img
              src={app.iconUrl}
              alt={app.title}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-2xl object-cover border border-white/15 bg-black/40 p-0.5 flex-shrink-0 shadow-md"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">
                {app.title}
              </h4>
              <p className="text-xs text-slate-400 truncate mt-0.5 font-medium">
                {app.developer}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[10px]">
                  {app.category}
                </span>
                <span>•</span>
                <span className="font-mono text-indigo-300">v{app.version}</span>
              </div>
            </div>
          </div>

          {/* Warning notes */}
          <div className="mt-4 p-3 rounded-xl bg-rose-950/30 border border-rose-500/20 flex items-start gap-2.5 text-[11px] text-rose-200/80 leading-relaxed">
            <ShieldAlert className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p>
              This will permanently delete the app, remove it from all categories, search, home, recommendations, delete all associated reviews, and clean up server-stored files.
            </p>
          </div>

          {errorMessage && (
            <div className="mt-3 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-200">
              {errorMessage}
            </div>
          )}

          {/* Form with DELETE verification */}
          <form onSubmit={handleDelete} className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="confirm-delete-input"
                className="block text-xs font-bold text-slate-300 mb-1.5"
              >
                Type <span className="font-mono text-rose-400 font-extrabold bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">DELETE</span> to confirm
              </label>
              <input
                id="confirm-delete-input"
                type="text"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
                placeholder="Type DELETE"
                autoFocus
                disabled={isDeleting}
                className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white font-mono text-sm tracking-wider placeholder-slate-600 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors uppercase"
              />
              <div className="flex items-center justify-between text-[11px] mt-1.5 text-slate-500">
                <span>Case-sensitive confirmation required</span>
                {confirmInput.length > 0 && (
                  <span
                    className={
                      isConfirmed ? 'text-emerald-400 font-semibold' : 'text-amber-400'
                    }
                  >
                    {isConfirmed ? '✓ Match verified' : 'Must match "DELETE"'}
                  </span>
                )}
              </div>
            </div>

            {/* Actions: Cancel and Delete App */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                id="cancel-delete-app-btn"
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                id="confirm-delete-app-btn"
                type="submit"
                disabled={!isConfirmed || isDeleting}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
                  isConfirmed && !isDeleting
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-rose-600/30 transform active:scale-95 cursor-pointer'
                    : 'bg-slate-800/80 border border-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                }`}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Deleting App...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete App</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
