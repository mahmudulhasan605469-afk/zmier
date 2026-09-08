import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Gamepad2,
  Wrench,
  MessageSquare,
  Tv,
  Briefcase,
  Camera,
  Video,
  Music,
  GraduationCap,
  Cpu,
  ShieldCheck,
  Folder,
  ArrowRight,
  Loader2,
  Layers
} from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';

interface CategoriesPageProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'gamepad2':
      case 'game':
        return <Gamepad2 className="w-6 h-6" />;
      case 'wrench':
      case 'tool':
        return <Wrench className="w-6 h-6" />;
      case 'messagesquare':
      case 'social':
        return <MessageSquare className="w-6 h-6" />;
      case 'tv':
      case 'entertainment':
        return <Tv className="w-6 h-6" />;
      case 'briefcase':
      case 'productivity':
        return <Briefcase className="w-6 h-6" />;
      case 'camera':
      case 'photography':
        return <Camera className="w-6 h-6" />;
      case 'video':
        return <Video className="w-6 h-6" />;
      case 'music':
        return <Music className="w-6 h-6" />;
      case 'graduationcap':
      case 'education':
        return <GraduationCap className="w-6 h-6" />;
      case 'cpu':
      case 'utility':
        return <Cpu className="w-6 h-6" />;
      case 'shieldcheck':
      case 'security':
        return <ShieldCheck className="w-6 h-6" />;
      default:
        return <Folder className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Layers className="w-7 h-7 text-indigo-400" />
          <span>App Categories</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Explore curated collections of APKs organized by utility, games, privacy, and media
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          <span className="text-xs">Loading category catalogue...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              onClick={() => onSelectCategory(cat.name)}
              className="group relative rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 p-5 backdrop-blur-md transition-all hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/40 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl bg-gradient-to-tr ${
                      cat.gradient || 'from-indigo-600 to-purple-600'
                    } text-white shadow-md group-hover:scale-110 transition-transform`}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-white/70">
                    {cat.appCount || 0} APKs
                  </span>
                </div>

                <h3 className="font-bold text-base text-white group-hover:text-indigo-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-white/60 line-clamp-2 mt-1.5 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Browse APKs</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
