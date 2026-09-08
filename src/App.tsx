import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  Layers,
  LayoutGrid,
  TrendingUp,
  User as UserIcon,
  Shield,
  Search,
  Sparkles
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { DownloadModal } from './components/DownloadModal';
import { HomePage } from './pages/HomePage';
import { AppsPage } from './pages/AppsPage';
import { AppDetailsPage } from './pages/AppDetailsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { LegalPages } from './pages/LegalPages';
import { AppItem } from './types';

function MainApp() {
  const { user, isAdmin, openAuthModal } = useAuth();
  const { theme } = useTheme();

  // Navigation state
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewPayload, setViewPayload] = useState<any>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected App for details & download
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [downloadState, setDownloadState] = useState<{ app: AppItem; platform?: 'android' | 'windows' } | null>(null);

  const handleNavigate = (view: string, payload?: any) => {
    setCurrentView(view);
    setViewPayload(payload || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAppDetails = (app: AppItem) => {
    setSelectedApp(app);
    setCurrentView('app-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickDownload = (app: AppItem, platform?: 'android' | 'windows') => {
    setDownloadState({ app, platform });
  };

  const handleSearchFocus = () => {
    if (currentView !== 'apps') {
      setCurrentView('apps');
      setViewPayload({ search: searchQuery });
    }
  };

  // Keyboard shortcut listener for search '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === '/' || (e.ctrlKey && e.key === 'k') || (e.metaKey && e.key === 'k')) &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        setCurrentView('apps');
        const inputEl = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputEl) inputEl.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#05020a] text-white flex flex-col selection:bg-indigo-500 selection:text-white relative overflow-x-hidden">
      {/* Atmospheric Ambient Glow Orbs */}
      <div className="fixed top-[-120px] right-[-120px] w-[550px] h-[550px] bg-purple-900/20 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed bottom-[-120px] left-[-120px] w-[550px] h-[550px] bg-indigo-900/20 rounded-full blur-[130px] pointer-events-none z-0" />
      <div className="fixed top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-blue-950/15 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Top Navigation Bar */}
      <div className="relative z-30">
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          onSearchFocus={handleSearchFocus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedApp?.id || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && (
              <HomePage
                onOpenDetails={handleOpenAppDetails}
                onQuickDownload={handleQuickDownload}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'apps' && (
              <AppsPage
                initialCategory={viewPayload?.category || 'All'}
                initialTrending={viewPayload?.trending || false}
                initialFeatured={viewPayload?.featured || false}
                initialSearch={searchQuery || viewPayload?.search || ''}
                onOpenDetails={handleOpenAppDetails}
                onQuickDownload={handleQuickDownload}
              />
            )}

            {currentView === 'app-details' && selectedApp && (
              <AppDetailsPage
                appIdOrSlug={selectedApp.slug || selectedApp.id}
                onBack={() => handleNavigate('home')}
                onOpenApp={handleOpenAppDetails}
                onDownload={handleQuickDownload}
              />
            )}

            {currentView === 'categories' && (
              <CategoriesPage
                onSelectCategory={(catName) => {
                  handleNavigate('apps', { category: catName });
                }}
              />
            )}

            {currentView === 'profile' && (
              <UserProfilePage
                initialTab={viewPayload?.tab || 'profile'}
                onOpenApp={handleOpenAppDetails}
                onQuickDownload={handleQuickDownload}
              />
            )}

            {currentView === 'admin' && (
              <AdminDashboardPage onOpenApp={handleOpenAppDetails} />
            )}

            {['dmca', 'privacy', 'terms', 'contact'].includes(currentView) && (
              <LegalPages pageType={currentView as any} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <div className="relative z-10">
        <Footer onNavigate={handleNavigate} />
      </div>

      {/* Mobile Bottom Quick Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#05020a]/90 backdrop-blur-xl border-t border-white/10 px-2 py-2 flex items-center justify-around text-[10px] font-semibold text-white/60">
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            currentView === 'home' ? 'text-indigo-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover</span>
        </button>

        <button
          onClick={() => handleNavigate('apps')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            currentView === 'apps' ? 'text-indigo-400 font-bold' : 'hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>APKs</span>
        </button>

        <button
          onClick={() => handleNavigate('categories')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
            currentView === 'categories' ? 'text-indigo-400 font-bold' : 'hover:text-white'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Categories</span>
        </button>

        {user ? (
          <button
            onClick={() => handleNavigate('profile')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              currentView === 'profile' ? 'text-indigo-400 font-bold' : 'hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>Profile</span>
          </button>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="flex flex-col items-center gap-1 p-1.5 rounded-xl hover:text-white transition-colors"
          >
            <UserIcon className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() => handleNavigate('admin')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-colors ${
              currentView === 'admin' ? 'text-amber-400 font-bold' : 'text-amber-300/80 hover:text-amber-300'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin</span>
          </button>
        )}
      </div>

      {/* Global Auth Modal */}
      <AuthModal />

      {/* Global Download Verification & Countdown Modal */}
      {downloadState && (
        <DownloadModal
          app={downloadState.app}
          initialPlatform={downloadState.platform}
          isOpen={true}
          onClose={() => setDownloadState(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
