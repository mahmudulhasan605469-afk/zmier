import { AppItem, Category, Review, User, AdminStats, AuthResponse } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('zx9_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async register(data: { username: string; email: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to register');
    return json;
  },

  async login(data: { emailOrUsername: string; password: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to login');
    return json;
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to get current user');
    return json;
  },

  async updateProfile(data: { username?: string; bio?: string; avatarUrl?: string; currentPassword?: string; newPassword?: string }): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update profile');
    return json;
  },

  async forgotPassword(email: string): Promise<{ message: string; demoNotice?: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to process request');
    return json;
  },

  // Apps
  async getApps(params: {
    search?: string;
    category?: string;
    sort?: string;
    tag?: string;
    featured?: boolean;
    trending?: boolean;
    page?: number;
    limit?: number;
  } = {}): Promise<{ apps: AppItem[]; total: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.category && params.category !== 'All') query.set('category', params.category);
    if (params.sort) query.set('sort', params.sort);
    if (params.tag) query.set('tag', params.tag);
    if (params.featured) query.set('featured', 'true');
    if (params.trending) query.set('trending', 'true');
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/apps?${query.toString()}`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch apps');
    return json;
  },

  async getApp(idOrSlug: string): Promise<{ app: AppItem; relatedApps: AppItem[]; isBookmarked: boolean }> {
    const res = await fetch(`${API_BASE}/apps/${idOrSlug}`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch app');
    return json;
  },

  async downloadApp(id: string, platform?: 'android' | 'windows'): Promise<{ success: boolean; downloadCount: number; downloadUrl: string; downloadType?: string; ticket: string }> {
    const res = await fetch(`${API_BASE}/apps/${id}/download`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ platform }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Download failed');
    return json;
  },

  // Upload APIs with real-time percentage progress
  async uploadFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; fileName: string; storedFileName: string; fileSize: string; sizeBytes: number; url: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload/file`, true);

      const token = localStorage.getItem('zx9_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            reject(new Error('Invalid response from server'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'File upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error during file upload'));
      xhr.ontimeout = () => reject(new Error('File upload timed out'));

      const formData = new FormData();
      formData.append('file', file);
      xhr.send(formData);
    });
  },

  async uploadIcon(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; fileName: string; url: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload/icon`, true);

      const token = localStorage.getItem('zx9_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'Icon upload failed'));
          } catch {
            reject(new Error('Icon upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      const formData = new FormData();
      formData.append('icon', file);
      xhr.send(formData);
    });
  },

  async uploadScreenshots(
    files: File[],
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; urls: string[]; count: number }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload/screenshot`, true);

      const token = localStorage.getItem('zx9_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'Screenshot upload failed'));
          } catch {
            reject(new Error('Screenshot upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      const formData = new FormData();
      for (const file of files) {
        formData.append('screenshots', file);
      }
      xhr.send(formData);
    });
  },

  async uploadVideo(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ success: boolean; fileName: string; url: string }> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_BASE}/upload/video`, true);

      const token = localStorage.getItem('zx9_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch {
            reject(new Error('Invalid response'));
          }
        } else {
          try {
            const errData = JSON.parse(xhr.responseText);
            reject(new Error(errData.error || 'Video upload failed'));
          } catch {
            reject(new Error('Video upload failed'));
          }
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      const formData = new FormData();
      formData.append('video', file);
      xhr.send(formData);
    });
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch categories');
    return json;
  },

  // Reviews
  async getReviews(appId: string): Promise<{ reviews: Review[]; total: number; distribution: Record<number, number> }> {
    const res = await fetch(`${API_BASE}/reviews/${appId}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch reviews');
    return json;
  },

  async postReview(appId: string, data: { rating: number; title?: string; comment: string }): Promise<{ review: Review; appRating: number; appReviewCount: number }> {
    const res = await fetch(`${API_BASE}/reviews/${appId}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to post review');
    return json;
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete review');
    return json;
  },

  // User Actions
  async getBookmarks(): Promise<AppItem[]> {
    const res = await fetch(`${API_BASE}/user/bookmarks`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch bookmarks');
    return json;
  },

  async toggleBookmark(appId: string): Promise<{ isBookmarked: boolean; bookmarks: string[] }> {
    const res = await fetch(`${API_BASE}/user/bookmarks/${appId}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update bookmark');
    return json;
  },

  async getMyReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/user/my-reviews`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch user reviews');
    return json;
  },

  // Admin APIs
  async getAdminStats(): Promise<AdminStats> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch admin stats');
    return json;
  },

  async createAdminApp(appData: Partial<AppItem>): Promise<AppItem> {
    const res = await fetch(`${API_BASE}/admin/apps`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(appData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create app');
    return json;
  },

  async updateAdminApp(id: string, appData: Partial<AppItem>): Promise<AppItem> {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(appData),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update app');
    return json;
  },

  async deleteAdminApp(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/apps/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete app');
    return json;
  },

  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch users');
    return json;
  },

  async updateAdminUser(id: string, data: { role?: string; bio?: string; username?: string }): Promise<User> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update user');
    return json;
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete user');
    return json;
  },

  async getAdminReviews(): Promise<Review[]> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch reviews');
    return json;
  },

  async deleteAdminReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete review');
    return json;
  },

  async getAdminCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch categories');
    return json;
  },

  async createAdminCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create category');
    return json;
  },

  async updateAdminCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update category');
    return json;
  },

  async deleteAdminCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete category');
    return json;
  },

  // Aliases for admin actions
  async createApp(appData: Partial<AppItem>): Promise<AppItem> {
    return this.createAdminApp(appData);
  },

  async updateApp(id: string, appData: Partial<AppItem>): Promise<AppItem> {
    return this.updateAdminApp(id, appData);
  },

  async deleteApp(id: string): Promise<{ success: boolean }> {
    return this.deleteAdminApp(id);
  },

  async updateUserRole(userId: string, role: string): Promise<User> {
    return this.updateAdminUser(userId, { role });
  },

  async deleteUser(userId: string): Promise<{ success: boolean }> {
    return this.deleteAdminUser(userId);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    return this.createAdminCategory(data);
  }
};
