import React, { useState, useEffect } from 'react';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface ReviewSectionProps {
  appId: string;
  appTitle: string;
  onReviewStatsUpdated?: (newRating: number, newCount: number) => void;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  appId,
  appTitle,
  onReviewStatsUpdated,
}) => {
  const { user, isAdmin, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [distribution, setDistribution] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Review Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await api.getReviews(appId);
      setReviews(data.reviews || []);
      setDistribution(data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
      setTotalCount(data.total || 0);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [appId]);

  // Check if current user already reviewed this app
  const userExistingReview = user ? reviews.find((r) => r.userId === user.id) : null;

  const handleOpenReviewForm = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    if (userExistingReview) {
      setRating(userExistingReview.rating);
      setTitle(userExistingReview.title || '');
      setComment(userExistingReview.comment);
    } else {
      setRating(5);
      setTitle('');
      setComment('');
    }
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (!comment || comment.trim().length < 5) {
      setFormError('Please enter at least 5 characters for your review.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setFormSuccess('');

    try {
      const res = await api.postReview(appId, { rating, title, comment });
      setFormSuccess('Your review has been published!');
      if (onReviewStatsUpdated && res.appRating !== undefined) {
        onReviewStatsUpdated(res.appRating, res.appReviewCount);
      }
      setTimeout(() => {
        setIsFormOpen(false);
        loadReviews();
      }, 1000);
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(reviewId);
      loadReviews();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  // Compute average score
  const avgScore =
    totalCount > 0
      ? (
          (distribution[5] * 5 +
            distribution[4] * 4 +
            distribution[3] * 3 +
            distribution[2] * 2 +
            distribution[1] * 1) /
          totalCount
        ).toFixed(1)
      : '5.0';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            <span>Ratings & Community Reviews</span>
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Verified ratings from authentic ZX9Store users
          </p>
        </div>

        <button
          onClick={handleOpenReviewForm}
          className="py-2.5 px-5 rounded-full font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          <span>{userExistingReview ? 'Edit My Review' : 'Write a Review'}</span>
        </button>
      </div>

      {/* Review Form Drawer / Modal */}
      {isFormOpen && (
        <div className="my-6 p-5 rounded-2xl bg-black/40 border border-white/10 animate-in fade-in">
          <h4 className="text-sm font-bold text-white mb-3">
            {userExistingReview ? 'Update Your Rating & Feedback' : `Rate & Review ${appTitle}`}
          </h4>

          {formError && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1.5">
                Your Star Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 text-white/30 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          active ? 'text-amber-400 fill-amber-400' : 'text-white/30'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-semibold text-amber-400 ml-2">
                  {rating === 5 && 'Outstanding (5 Stars)'}
                  {rating === 4 && 'Very Good (4 Stars)'}
                  {rating === 3 && 'Average (3 Stars)'}
                  {rating === 2 && 'Poor (2 Stars)'}
                  {rating === 1 && 'Terrible (1 Star)'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Headline / Title (Optional)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best media player on Android with zero ads"
                className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 mb-1">
                Review Details & Experience
              </label>
              <textarea
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe performance, battery usage, UI experience, or any feedback for the developer..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-5 rounded-full font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span>Publish Review</span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="py-2 px-4 rounded-full font-medium text-xs text-white/60 hover:text-white bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ratings Distribution Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-6 items-center">
        {/* Big Score */}
        <div className="md:col-span-4 text-center md:text-left flex flex-col items-center md:items-start justify-center">
          <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight">
            {avgScore}
          </span>
          <div className="flex items-center gap-1 mt-2 text-amber-400">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-5 h-5 ${
                  s <= Math.round(Number(avgScore))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-white/50 mt-2">
            Based on <span className="font-semibold text-white/80">{totalCount}</span> user reviews
          </p>
        </div>

        {/* 5-Star Distribution Bars */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((starNum) => {
            const count = distribution[starNum] || 0;
            const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
            return (
              <div key={starNum} className="flex items-center gap-3 text-xs">
                <span className="w-4 font-semibold text-white/60 text-right">{starNum}</span>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 flex-shrink-0" />
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-10 font-mono text-[11px] text-white/50 text-right">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
        {isLoading ? (
          <div className="py-8 text-center text-white/40 text-xs flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            <span>Loading reviews...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-white/50 text-xs">
            No reviews yet. Be the first to share your thoughts on this APK!
          </div>
        ) : (
          reviews.map((rev) => {
            const isOwn = user?.id === rev.userId;
            const canDelete = isOwn || isAdmin;
            return (
              <div
                key={rev.id}
                className="p-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-md space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${rev.username}`}
                      alt={rev.username}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-white/10 bg-black/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{rev.username}</span>
                        {isOwn && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            You
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
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
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg text-white/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title={isAdmin ? 'Admin: Remove review' : 'Delete my review'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {rev.title && (
                  <h5 className="font-semibold text-xs text-white/90 pt-1">{rev.title}</h5>
                )}

                <p className="text-xs text-white/60 leading-relaxed">{rev.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
