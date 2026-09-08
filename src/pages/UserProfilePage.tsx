import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Bookmark,
  MessageSquare,
  KeyRound,
  Shield,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  Clock,
  Sparkles,
  Camera
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AppItem, Review } from '../types';
import { api } from '../services/api';
import { AppCard } from '../components/AppCard';

interface UserProfilePageProps {
  initialTab?: 'profile' | 'bookmarks' | 'reviews' | 'security';
  onOpenApp: (app: AppItem) => void;
  onQuickDownload: (app: AppItem) => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  initialTab = 'profile',
  onOpenApp,
  onQuickDownload,
}) => {
  const { user, updateProfile, openAuthModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookmarks' | 'reviews' | 'security'>(initialTab);

  // Profile fields
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Data lists
  const [bookmarks, setBookmarks] = useState<AppItem[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Status flags
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    try {
      setIsLoadingData(true);
      const [bms, revs] = await Promise.all([
        api.getBookmarks(),
        api.getMyReviews(),
      ]);
      setBookmarks(bms);
      setReviews(revs);
    } catch (err) {
      console.error('Failed to load user data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, activeTab]);

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-white">Sign In Required</h3>
        <p className="text-slate-400 text-xs">Please log in to manage your profile, bookmarks, and reviews.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-xs text-white"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({ username, bio, avatarUrl });
      setSuccessMsg('Profile updated successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await updateProfile({ currentPassword, newPassword });
      setSuccessMsg('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMyReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(reviewId);
      loadUserData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const regenerateAvatar = () => {
    const seed = `${username}_${Date.now()}`;
    setAvatarUrl(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(seed)}`);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Ambient Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative group">
          <img
            src={avatarUrl || user.avatarUrl}
            alt={user.username}
            referrerPolicy="no-referrer"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-2xl border border-white/10 bg-black/50 p-1"
          />
          <button
            onClick={regenerateAvatar}
            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg transition-transform hover:scale-110"
            title="Generate new avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2 relative z-10">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {user.username}
            </h1>
            {user.role === 'admin' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                🛡️ Store Administrator
              </span>
            )}
          </div>
          <p className="text-xs text-white/50 font-mono">{user.email}</p>
          <p className="text-xs text-white/70 max-w-xl leading-relaxed">
            {user.bio || 'Android power user and verified APK downloader.'}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-white/50 pt-2">
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{bookmarks.length} Bookmarks</span>
            <span>•</span>
            <span>{reviews.length} Reviews</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('profile');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bookmarks');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'bookmarks'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved APKs ({bookmarks.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('reviews');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'reviews'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>My Written Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('security');
            setSuccessMsg('');
            setErrorMsg('');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
            activeTab === 'security'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password</span>
        </button>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: Edit Profile */}
      {activeTab === 'profile' && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4">Profile Information</h3>
          <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Display Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Bio / Status Message
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="A short note about yourself or favorite Android software..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Save Profile</span>}
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Your Saved Bookmarks</h3>
            <span className="text-xs text-white/50">{bookmarks.length} apps saved</span>
          </div>

          {isLoadingData ? (
            <div className="py-16 text-center text-white/40 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Loading saved bookmarks...</span>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="py-16 text-center rounded-3xl border border-white/10 bg-white/5 p-8 space-y-2 backdrop-blur-md">
              <Bookmark className="w-8 h-8 text-white/30 mx-auto" />
              <p className="text-sm font-bold text-white">No saved bookmarks yet</p>
              <p className="text-xs text-white/50">Click the bookmark icon on any APK card to keep it handy here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {bookmarks.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onOpenDetails={onOpenApp}
                  onQuickDownload={onQuickDownload}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: My Written Reviews */}
      {activeTab === 'reviews' && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white mb-2">My Community Reviews</h3>

          {isLoadingData ? (
            <div className="py-16 text-center text-white/40 flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
              <span>Loading reviews...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-16 text-center text-white/50 text-xs">
              You haven't written any reviews yet. Open any app details page to share your experience!
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md flex items-start justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    {rev.appIcon && (
                      <img
                        src={rev.appIcon}
                        alt="App"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-white/10 bg-black/40 flex-shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-xs text-white">{rev.appTitle || 'App'}</h4>
                      <div className="flex items-center gap-1 my-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'
                            }`}
                          />
                        ))}
                        <span className="text-[10px] text-white/40 ml-2">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rev.title && <p className="text-xs font-semibold text-white/90">{rev.title}</p>}
                      <p className="text-xs text-white/60 mt-1 leading-relaxed">{rev.comment}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteMyReview(rev.id)}
                    className="p-2 text-white/40 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex-shrink-0"
                    title="Delete review"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Security / Password */}
      {activeTab === 'security' && (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4">Change Password</h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                New Password (min. 6 characters)
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-6 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Update Password</span>}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
