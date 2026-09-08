import React, { useState } from 'react';
import {
  Search,
  Sun,
  Moon,
  Bookmark,
  Shield,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Compass,
  LayoutGrid,
  TrendingUp,
  Sparkles,
  ChevronDown,
  Layers,
  FileCode
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, payload?: any) => void;
  onSearchFocus: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onSearchFocus,
  searchQuery,
  setSearchQuery,
}) => {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNav = (view: string, payload?: any) => {
    onNavigate(view, payload);
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              ZX
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                  9<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Store</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  APK
                </span>
              </div>
              <span className="text-[10px] text-white/40 font-medium tracking-wide">
                Verified Store & Mirrors
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <button
              onClick={() => handleNav('home')}
              className={`flex items-center gap-1.5 transition-colors ${
                currentView === 'home'
                  ? 'text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => handleNav('apps')}
              className={`flex items-center gap-1.5 transition-colors ${
                currentView === 'apps'
                  ? 'text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Apps</span>
            </button>

            <button
              onClick={() => handleNav('categories')}
              className={`flex items-center gap-1.5 transition-colors ${
                currentView === 'categories'
                  ? 'text-white font-semibold'
                  : 'hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Categories</span>
            </button>

            <button
              onClick={() => handleNav('apps', { trending: true })}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span>Trending</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`flex items-center gap-1.5 transition-colors ${
                  currentView === 'admin'
                    ? 'text-amber-400 font-bold'
                    : 'text-amber-300/70 hover:text-amber-300'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-xs hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={onSearchFocus}
                placeholder="Search apps, developers..."
                className="w-full bg-white/5 border border-white/10 rounded-full px-5 py-2 pr-10 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
                <Search className="w-4 h-4" />
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-9 top-1/2 -translate-y-1/2 p-0.5 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search icon trigger for small mobile */}
            <button
              onClick={onSearchFocus}
              className="sm:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* User Profile / Auth State */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-2 pr-4 py-1 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <img
                    src={user.avatarUrl}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full bg-indigo-500 object-cover border border-white/10"
                  />
                  <span className="text-xs font-semibold text-white max-w-[100px] truncate">
                    {user.username}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-white/10 bg-[#0a0514]/95 backdrop-blur-xl shadow-2xl p-2 text-xs text-white/90 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                      <p className="font-bold text-white line-clamp-1">{user.username}</p>
                      <p className="text-[11px] text-white/40 line-clamp-1">{user.email}</p>
                      {user.role === 'admin' && (
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          🛡️ Store Administrator
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-left transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-400" />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => handleNav('profile', { tab: 'bookmarks' })}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 text-left transition-colors"
                    >
                      <Bookmark className="w-4 h-4 text-blue-400" />
                      <span>Saved Bookmarks ({user.bookmarks?.length || 0})</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-500/10 text-amber-300 text-left transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-400" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}

                    <div className="border-t border-white/10 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-500/10 text-rose-400 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('login')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#05020a]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Search input */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps, developers..."
              className="w-full bg-white/5 border border-white/10 rounded-full pl-5 pr-10 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
              <Search className="w-4 h-4" />
            </div>
          </div>

          <button
            onClick={() => handleNav('home')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'home' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </button>

          <button
            onClick={() => handleNav('apps')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'apps' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Apps</span>
          </button>

          <button
            onClick={() => handleNav('categories')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentView === 'categories' ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-white/70 hover:bg-white/5'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => handleNav('apps', { trending: true })}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-rose-400" />
            <span>Top Charts</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Dashboard</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
