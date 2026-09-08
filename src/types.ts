export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash?: string;
  avatarUrl: string;
  bio?: string;
  role: 'user' | 'admin';
  createdAt: string;
  bookmarks: string[];
  downloadHistory: { appId: string; downloadedAt: string }[];
}

export type PlatformType = 'android' | 'windows' | 'both';
export type DownloadType = 'external' | 'upload';
export type VideoSourceType = 'youtube' | 'direct' | 'mp4' | 'none';

export interface AppItem {
  id: string;
  slug: string;
  title: string;
  developer: string;
  category: string;
  version: string;
  size: string;
  platform?: PlatformType;
  
  // Primary / Android Download configuration
  downloadType?: DownloadType;
  downloadUrl: string;
  externalDownloadUrl?: string;
  uploadedFileName?: string;
  uploadedFileSize?: string;
  minAndroidVersion?: string;
  packageName?: string;
  
  // Windows specific download configuration (when platform is 'windows' or 'both')
  windowsVersion?: string;
  windowsDownloadType?: DownloadType;
  windowsDownloadUrl?: string;
  windowsExternalUrl?: string;
  windowsFileName?: string;
  windowsFileSize?: string;

  // Content & Media
  shortDescription: string;
  description: string;
  features: string[];
  changelog: string;
  iconUrl: string;
  screenshots: string[];
  previewVideoUrl?: string;
  videoType?: VideoSourceType;
  officialWebsiteUrl?: string;
  tags: string[];
  uploadDate: string;
  updateDate: string;
  featured: boolean;
  trending: boolean;
  published: boolean;
  rating: number;
  reviewCount: number;
  downloadCount: number;
  sha256?: string;
  isVerifiedSafe: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  appCount?: number;
  gradient?: string;
}

export interface Review {
  id: string;
  appId: string;
  userId: string;
  username: string;
  userAvatar: string;
  rating: number;
  title?: string;
  comment: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DownloadLog {
  id: string;
  appId: string;
  appName?: string;
  timestamp: string;
  dateStr: string; // YYYY-MM-DD
  ipHash?: string;
}

export interface AdminStats {
  totalApps: number;
  totalUsers: number;
  totalReviews: number;
  totalDownloads: number;
  todayDownloads: number;
  featuredAppsCount: number;
  downloadsByDate?: { date: string; downloads: number }[];
  downloadTrends?: { date: string; downloads: number }[];
  topApps?: { id: string; title: string; downloads: number; rating: number; iconUrl: string }[];
  categoryStats?: { category: string; count: number; downloads: number }[];
  categoryBreakdown?: { category: string; count: number; downloads: number }[];
  recentReviews?: Review[];
  recentUsers?: { id: string; username: string; email: string; role: string; createdAt: string; avatarUrl: string }[];
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  token: string;
}
