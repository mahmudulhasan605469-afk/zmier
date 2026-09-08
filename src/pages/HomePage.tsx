import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Clock,
  ArrowRight,
  ShieldCheck,
  DownloadCloud,
  Layers,
  Gamepad2,
  Wrench,
  MessageSquare,
  Camera,
  Tv,
  Briefcase,
  Cpu
} from 'lucide-react';
import { AppItem, Category } from '../types';
import { api } from '../services/api';
import { HeroBanner } from '../components/HeroBanner';
import { AppCard } from '../components/AppCard';

interface HomePageProps {
  onOpenDetails: (app: AppItem) => void;
  onQuickDownload: (app: AppItem) => void;
  onNavigate: (view: string, payload?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenDetails,
  onQuickDownload,
  onNavigate,
}) => {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [appsRes, catsRes] = await Promise.all([
          api.getApps({ limit: 100 }),
          api.getCategories(),
        ]);
        setApps(appsRes.apps);
        setCategories(catsRes);
      } catch (err) {
        console.error('Failed to load store data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredApps = apps.filter((a) => a.featured);
  const trendingApps = apps.filter((a) => a.trending);
  const mostDownloaded = [...apps].sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 8);
  const latestApps = [...apps].sort((a, b) => new Date(b.uploadDate || b.updateDate).getTime() - new Date(a.uploadDate || a.updateDate).getTime()).slice(0, 8);

  const filteredDisplayApps =
    selectedCategory === 'All'
      ? apps.slice(0, 12)
      : apps.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Featured Hero Carousel */}
      <HeroBanner
        featuredApps={featuredApps.length > 0 ? featuredApps : apps.slice(0, 3)}
        onOpenDetails={onOpenDetails}
        onDownload={onQuickDownload}
      />

      {/* 2. Category Quick Pills Bar */}
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">Browse by Category</h3>
          </div>
          <button
            onClick={() => onNavigate('categories')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View all categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            🌟 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.name
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat.name} ({cat.appCount || 0})
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Filtered Grid / Quick Showcase */}
      {selectedCategory !== 'All' && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {selectedCategory} Applications
            </h3>
            <span className="text-xs text-white/50">{filteredDisplayApps.length} APKs found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredDisplayApps.map((app) => (
              <AppCard
                key={app.id}
                app={app}
                onOpenDetails={onOpenDetails}
                onQuickDownload={onQuickDownload}
              />
            ))}
          </div>
        </section>
      )}

      {/* 4. Trending & Hot Shelf */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Trending & Hot APKs</h3>
              <p className="text-xs text-white/50">Fastest rising downloads this week</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('apps', { trending: true })}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>See more</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trendingApps.slice(0, 8).map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onOpenDetails={onOpenDetails}
              onQuickDownload={onQuickDownload}
            />
          ))}
        </div>
      </section>

      {/* 5. Most Downloaded Powerhouses */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Most Downloaded Essentials</h3>
              <p className="text-xs text-white/50">Community favorites with over 100k+ downloads</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('apps', { sort: 'downloads' })}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View top charts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {mostDownloaded.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onOpenDetails={onOpenDetails}
              onQuickDownload={onQuickDownload}
            />
          ))}
        </div>
      </section>

      {/* 6. Security Guarantee Banner */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
          <div className="md:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              100% Certified Safe & Legal Mirroring
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Every APK is Cryptographically Verified & Scanned
            </h3>
            <p className="text-xs sm:text-sm text-white/60 leading-relaxed max-w-xl">
              ZX9Store guarantees that every linked APK binary matches official cryptographic developer keys (SHA-256 integrity). No injected spyware, zero telemetry mods, and zero pirated binaries.
            </p>
          </div>
          <div className="md:col-span-4 flex items-center justify-center md:justify-end">
            <button
              onClick={() => onNavigate('dmca')}
              className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/10 transition-all shadow-lg backdrop-blur-sm"
            >
              Read Security & DMCA Policy
            </button>
          </div>
        </div>
      </div>

      {/* 7. Latest Releases & Recently Updated */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Recently Updated & New Releases</h3>
              <p className="text-xs text-white/50">Fresh changelogs and latest version bumps</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('apps', { sort: 'latest' })}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            <span>View all new</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {latestApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onOpenDetails={onOpenDetails}
              onQuickDownload={onQuickDownload}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
