import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Star,
  Layers,
  X,
  Loader2,
  Filter,
  Check
} from 'lucide-react';
import { AppItem, Category } from '../types';
import { api } from '../services/api';
import { AppCard } from '../components/AppCard';

interface AppsPageProps {
  initialCategory?: string;
  initialTrending?: boolean;
  initialFeatured?: boolean;
  initialSearch?: string;
  onOpenDetails: (app: AppItem) => void;
  onQuickDownload: (app: AppItem) => void;
}

export const AppsPage: React.FC<AppsPageProps> = ({
  initialCategory = 'All',
  initialTrending = false,
  initialFeatured = false,
  initialSearch = '',
  onOpenDetails,
  onQuickDownload,
}) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sort, setSort] = useState<string>(initialTrending ? 'downloads' : 'popular');
  const [minRating, setMinRating] = useState<number>(0);
  const [isTrendingOnly, setIsTrendingOnly] = useState<boolean>(initialTrending);
  const [isFeaturedOnly, setIsFeaturedOnly] = useState<boolean>(initialFeatured);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await api.getCategories();
        setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    loadCategories();
  }, []);

  const loadApps = async () => {
    try {
      setIsLoading(true);
      const res = await api.getApps({
        search: searchTerm,
        category: category !== 'All' ? category : undefined,
        sort,
        featured: isFeaturedOnly ? true : undefined,
        trending: isTrendingOnly ? true : undefined,
        limit: 100,
      });
      let filtered = res.apps;
      if (minRating > 0) {
        filtered = filtered.filter((a) => a.rating >= minRating);
      }
      setApps(filtered);
    } catch (err) {
      console.error('Failed to load apps:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadApps();
  }, [searchTerm, category, sort, minRating, isTrendingOnly, isFeaturedOnly]);

  const clearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setSort('popular');
    setMinRating(0);
    setIsTrendingOnly(false);
    setIsFeaturedOnly(false);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    category !== 'All' ||
    sort !== 'popular' ||
    minRating > 0 ||
    isTrendingOnly ||
    isFeaturedOnly;

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-indigo-400" />
            <span>APK Marketplace Directory</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore and download safe, verified Android APK packages
          </p>
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="self-start md:self-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Filter Control Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md shadow-xl space-y-4">
        {/* Search row */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by app title, developer, description, or tag..."
            className="w-full pl-5 pr-10 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-colors"
          />
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <Search className="w-4 h-4" />
          </div>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-9 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdowns & Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="All" className="bg-[#0a0514] text-white">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name} className="bg-[#0a0514] text-white">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">
              Sort By
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value="popular" className="bg-[#0a0514] text-white">Most Downloaded</option>
              <option value="rating" className="bg-[#0a0514] text-white">Highest Rated</option>
              <option value="latest" className="bg-[#0a0514] text-white">Latest Release</option>
              <option value="updated" className="bg-[#0a0514] text-white">Recently Updated</option>
              <option value="az" className="bg-[#0a0514] text-white">Name: A to Z</option>
              <option value="za" className="bg-[#0a0514] text-white">Name: Z to A</option>
            </select>
          </div>

          {/* Rating filter */}
          <div>
            <label className="block text-[11px] font-semibold text-white/50 mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full py-2 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              <option value={0} className="bg-[#0a0514] text-white">Any Rating</option>
              <option value={4.5} className="bg-[#0a0514] text-white">★ 4.5 & up</option>
              <option value={4.0} className="bg-[#0a0514] text-white">★ 4.0 & up</option>
              <option value={3.5} className="bg-[#0a0514] text-white">★ 3.5 & up</option>
            </select>
          </div>

          {/* Quick Toggles */}
          <div className="flex items-end gap-2 pb-0.5">
            <button
              onClick={() => setIsTrendingOnly(!isTrendingOnly)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                isTrendingOnly
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <span>🔥 Trending</span>
            </button>
            <button
              onClick={() => setIsFeaturedOnly(!isFeaturedOnly)}
              className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                isFeaturedOnly
                  ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <span>⭐ Featured</span>
            </button>
          </div>
        </div>
      </div>

      {/* App Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs">Filtering APKs...</span>
        </div>
      ) : apps.length === 0 ? (
        <div className="py-20 text-center space-y-3 rounded-3xl border border-slate-800 bg-slate-900/40 p-8">
          <p className="text-lg font-bold text-white">No APKs matched your criteria</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search terms, changing the category filter, or resetting to view all available applications.
          </p>
          <button
            onClick={clearFilters}
            className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <span className="font-semibold text-slate-200">{apps.length}</span> results
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {apps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpenDetails={onOpenDetails}
                onQuickDownload={onQuickDownload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
