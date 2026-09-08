import React, { useState, useEffect } from 'react';
import {
  Shield,
  Layers,
  Download,
  Users,
  MessageSquare,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  ExternalLink,
  TrendingUp,
  Star,
  Search,
  Sparkles,
  BarChart2,
  FolderPlus,
  RefreshCw,
  X,
  AlertCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminStats, AppItem, Category, User, Review } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AddEditAppModal } from '../components/admin/AddEditAppModal';
import { DeleteAppModal } from '../components/admin/DeleteAppModal';

interface AdminDashboardPageProps {
  onOpenApp?: (app: AppItem) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onOpenApp }) => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [apps, setApps] = useState<AppItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Tab state: 'overview' | 'apps' | 'users' | 'reviews' | 'categories'
  const [currentTab, setCurrentTab] = useState<'overview' | 'apps' | 'users' | 'reviews' | 'categories'>('overview');

  // App Modal State
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppItem | null>(null);

  // Delete App Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appToDelete, setAppToDelete] = useState<AppItem | null>(null);

  // Category Modal State
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Folder');

  // Helpers
  const [appSearch, setAppSearch] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [statsData, appsData, catsData, usersData, revsData] = await Promise.all([
        api.getAdminStats(),
        api.getApps({ limit: 100 }),
        api.getCategories(),
        api.getAdminUsers(),
        api.getAdminReviews(),
      ]);
      setStats(statsData);
      setApps(appsData.apps);
      setCategories(catsData);
      setUsers(usersData);
      setReviews(revsData);
    } catch (err: any) {
      console.error('Failed to load admin data:', err);
      setActionError(err.message || 'Failed to load admin information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 w-16 h-16 mx-auto flex items-center justify-center">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Administrator Access Required</h2>
        <p className="text-slate-400 text-xs max-w-md mx-auto">
          You must be signed in with an administrator account to access the store management portal.
        </p>
      </div>
    );
  }

  const handleOpenAddApp = () => {
    setEditingApp(null);
    setIsAppModalOpen(true);
  };

  const handleOpenEditApp = (app: AppItem) => {
    setEditingApp(app);
    setIsAppModalOpen(true);
  };

  const handleOpenDeleteApp = (app: AppItem) => {
    setAppToDelete(app);
    setIsDeleteModalOpen(true);
  };

  const handleToggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change user role to "${newRole}"?`)) return;
    try {
      await api.updateUserRole(userId, newRole);
      setActionSuccess('User role updated!');
      loadAllData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (!confirm(`Delete user "${username}"?`)) return;
    try {
      await api.deleteUser(userId);
      setActionSuccess(`Deleted user "${username}"`);
      loadAllData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Permanently remove this review?')) return;
    try {
      await api.deleteReview(reviewId);
      setActionSuccess('Review deleted');
      loadAllData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to delete review');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCategory({ name: catName, description: catDesc, iconName: catIcon });
      setActionSuccess(`Created category "${catName}"`);
      setCatName('');
      setCatDesc('');
      setIsCatModalOpen(false);
      loadAllData();
    } catch (err: any) {
      setActionError(err.message || 'Failed to create category');
    }
  };

  const filteredApps = apps.filter(
    (a) =>
      a.title.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.developer.toLowerCase().includes(appSearch.toLowerCase()) ||
      a.category.toLowerCase().includes(appSearch.toLowerCase())
  );

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-8 pb-24">
      {/* Admin Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Store Control Center
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-400">Master Admin: {user?.username}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            ZX9Store Administration
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenAddApp}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-bold text-xs text-white shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publish New APK</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            currentTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Analytics & Overview</span>
        </button>

        <button
          onClick={() => setCurrentTab('apps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            currentTab === 'apps'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Manage APKs ({apps.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            currentTab === 'users'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('reviews')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            currentTab === 'reviews'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reviews Moderation ({reviews.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('categories')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            currentTab === 'categories'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <FolderPlus className="w-4 h-4" />
          <span>Categories ({categories.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Analytics */}
      {currentTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Total Published APKs</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalApps}</p>
                <p className="text-[10px] text-emerald-400 font-medium mt-1">100% verified packages</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400">
                <Layers className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Total Downloads</p>
                <p className="text-3xl font-extrabold text-white mt-1">
                  {stats.totalDownloads >= 1000 ? `${(stats.totalDownloads / 1000).toFixed(1)}k` : stats.totalDownloads}
                </p>
                <p className="text-[10px] text-blue-400 font-medium mt-1">Direct verified mirrors</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400">
                <Download className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Registered Accounts</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalUsers}</p>
                <p className="text-[10px] text-purple-400 font-medium mt-1">Active community members</p>
              </div>
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold text-slate-400">Community Reviews</p>
                <p className="text-3xl font-extrabold text-white mt-1">{stats.totalReviews}</p>
                <p className="text-[10px] text-amber-400 font-medium mt-1">Moderated ratings</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
                <MessageSquare className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Daily Download Activity */}
            <div className="lg:col-span-8 p-6 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Daily Download Activity (Last 7 Days)</h3>
                  <p className="text-[11px] text-slate-400">Real-time external mirror requests</p>
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.downloadsByDate || stats.downloadTrends || []}>
                    <defs>
                      <linearGradient id="colorDownloads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="downloads"
                      stroke="#6366f1"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorDownloads)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-4 p-6 rounded-3xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md shadow-xl">
              <h3 className="text-sm font-bold text-white mb-2">Category Distribution</h3>
              <p className="text-[11px] text-slate-400 mb-4">Apps across categories</p>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryStats || stats.categoryBreakdown || []}
                      dataKey="count"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      {(stats.categoryStats || stats.categoryBreakdown || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        fontSize: '12px',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Manage APKs */}
      {currentTab === 'apps' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                placeholder="Search APKs by name or developer..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleOpenAddApp}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New App</span>
            </button>
          </div>

          <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-xl overflow-hidden backdrop-blur-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">App</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Version & Size</th>
                    <th className="py-3 px-4">Downloads</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Flags</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredApps.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={a.iconUrl}
                            alt={a.title}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-white truncate max-w-[180px]">{a.title}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{a.developer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {a.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div>v{a.version}</div>
                        <div className="text-slate-500 text-[10px]">{a.size}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-300">
                        {a.downloadCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 font-bold text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{a.rating.toFixed(1)}</span>
                          <span className="text-slate-500 font-normal">({a.reviewCount})</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {a.featured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">
                              Featured
                            </span>
                          )}
                          {a.trending && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-500/20 text-rose-300">
                              Hot
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            id={`view-app-btn-${a.id}`}
                            onClick={() => onOpenApp?.(a)}
                            className="p-1.5 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/70 transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="View app in store"
                          >
                            <Eye className="w-3.5 h-3.5 text-indigo-400" />
                            <span>View</span>
                          </button>
                          <button
                            id={`edit-app-btn-${a.id}`}
                            onClick={() => handleOpenEditApp(a)}
                            className="p-1.5 px-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/70 transition-colors flex items-center gap-1 text-xs font-semibold"
                            title="Edit app"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
                            <span>Edit</span>
                          </button>
                          <button
                            id={`delete-app-btn-${a.id}`}
                            onClick={() => handleOpenDeleteApp(a)}
                            className="p-1.5 px-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-colors flex items-center gap-1 text-xs font-bold shadow-sm shadow-rose-950/40"
                            title="Delete app"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Users & Roles */}
      {currentTab === 'users' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-xl overflow-hidden backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.username}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-bold text-white">{u.username}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{u.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          u.role === 'admin'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {u.role === 'admin' ? '🛡️ Administrator' : 'User'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleUserRole(u.id, u.role)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold"
                        >
                          {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                        </button>
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Reviews Moderation */}
      {currentTab === 'reviews' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 shadow-xl p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">All Store Reviews</h3>
            <span className="text-xs text-slate-400">{reviews.length} reviews posted</span>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-white">{rev.username}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <span className="text-[11px] text-indigo-400 font-semibold">{rev.appTitle || rev.appId}</span>
                    <span className="text-[10px] text-slate-500">•</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3 h-3 ${
                            s <= rev.rating ? 'fill-current' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {rev.title && <p className="text-xs font-semibold text-slate-200 mt-1">{rev.title}</p>}
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rev.comment}</p>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Posted on {new Date(rev.createdAt).toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteReview(rev.id)}
                  className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900 text-rose-300"
                  title="Remove review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Categories */}
      {currentTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white">Store Categories</h3>
            <button
              onClick={() => setIsCatModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-2xl border border-slate-700/60 bg-slate-900/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-sm">{c.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{c.description}</p>
                  <span className="text-[11px] text-indigo-400 font-mono mt-1 block">
                    {c.appCount || 0} Apps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add/Edit App */}
      <AddEditAppModal
        isOpen={isAppModalOpen}
        editingApp={editingApp}
        categories={categories}
        onClose={() => {
          setIsAppModalOpen(false);
          setEditingApp(null);
        }}
        onSuccess={(savedApp) => {
          setActionSuccess(
            editingApp
              ? `Successfully updated "${savedApp.title}"!`
              : `Successfully published "${savedApp.title}" to ZX9Store!`
          );
          loadAllData();
        }}
      />

      {/* Modal: Delete App Confirmation */}
      <DeleteAppModal
        isOpen={isDeleteModalOpen}
        app={appToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAppToDelete(null);
        }}
        onSuccess={(deletedApp) => {
          setActionSuccess('App deleted successfully.');
          loadAllData();
        }}
      />

      {/* Modal: Add Category */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Add New Category</h3>
              <button onClick={() => setIsCatModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="e.g. Productivity"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  required
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="e.g. Note-taking, office and task manager APKs"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
