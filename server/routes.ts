import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { db } from './db';
import { AppItem, Review, User, Category, PlatformType, DownloadType } from '../src/types';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'zx9store-super-secret-jwt-key-2026';

// Self-Hosted PC Storage Directories (Supports Windows paths like E:\DX9Store\uploads)
const uploadRoot = process.env.UPLOAD_DIR
  ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
  : path.join(process.cwd(), 'uploads');

const apkDir = path.join(uploadRoot, 'apk');
const exeDir = path.join(uploadRoot, 'exe');
const zipDir = path.join(uploadRoot, 'zip');
const rarDir = path.join(uploadRoot, 'rar');
const pdfDir = path.join(uploadRoot, 'pdf');
const isoDir = path.join(uploadRoot, 'iso');
const imagesDir = path.join(uploadRoot, 'images');
const videosDir = path.join(uploadRoot, 'videos');
const appsDir = path.join(uploadRoot, 'apps');
const iconsDir = path.join(uploadRoot, 'icons');
const screenshotsDir = path.join(uploadRoot, 'screenshots');

const allSubdirs = [
  uploadRoot,
  apkDir,
  exeDir,
  zipDir,
  rarDir,
  pdfDir,
  isoDir,
  imagesDir,
  videosDir,
  appsDir,
  iconsDir,
  screenshotsDir
];

allSubdirs.forEach((dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.error(`Failed to create upload directory ${dir}:`, err);
  }
});

// Configurable Max File Size (Default: 300 MB)
const MAX_UPLOAD_SIZE = Number(process.env.MAX_FILE_SIZE) || 300 * 1024 * 1024;

// Dynamic Multer storage based on file extension
const appPackageStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    let targetDir = appsDir;
    if (ext === '.apk' || ext === '.xapk' || ext === '.apks') targetDir = apkDir;
    else if (ext === '.exe' || ext === '.msi') targetDir = exeDir;
    else if (ext === '.zip' || ext === '.7z' || ext === '.tar' || ext === '.gz') targetDir = zipDir;
    else if (ext === '.rar') targetDir = rarDir;
    else if (ext === '.pdf') targetDir = pdfDir;
    else if (ext === '.iso' || ext === '.dmg' || ext === '.bin' || ext === '.appimage') targetDir = isoDir;

    try {
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      cb(null, targetDir);
    } catch (err: any) {
      cb(err, targetDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// 1. App Package Storage (APK, EXE, ZIP, RAR, PDF, ISO, MSI, 7Z, DMG, etc.)
const allowedAppExtensions = new Set([
  '.apk', '.xapk', '.apks',
  '.exe', '.msi',
  '.zip', '.7z', '.tar', '.gz', '.pkg',
  '.rar',
  '.pdf',
  '.iso', '.dmg', '.bin', '.appimage'
]);

const uploadAppPackage = multer({
  storage: appPackageStorage,
  limits: { fileSize: MAX_UPLOAD_SIZE },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedAppExtensions.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type (${ext}). Allowed: APK, EXE, ZIP, RAR, PDF, ISO, MSI, 7Z`));
    }
  }
});

// Image storage (Icons & Screenshots into /uploads/images/)
const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
      }
      cb(null, imagesDir);
    } catch (err: any) {
      cb(err, imagesDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// 2. Icon Storage (PNG, JPG, JPEG, WEBP, SVG, ICO -> /uploads/images/)
const allowedIconExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico']);
const uploadIcon = multer({
  storage: imageStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max for icons
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedIconExtensions.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid icon format (${ext}). Allowed: PNG, JPG, WEBP, SVG, ICO`));
    }
  }
});

// 3. Screenshot Storage (PNG, JPG, JPEG, WEBP, GIF -> /uploads/images/)
const allowedScreenshotExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const uploadScreenshots = multer({
  storage: imageStorage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max per image
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedScreenshotExtensions.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid screenshot format (${ext}). Allowed: PNG, JPG, WEBP, GIF`));
    }
  }
});

// Video storage (/uploads/videos/)
const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    try {
      if (!fs.existsSync(videosDir)) {
        fs.mkdirSync(videosDir, { recursive: true });
      }
      cb(null, videosDir);
    } catch (err: any) {
      cb(err, videosDir);
    }
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

// 4. Video Storage (MP4, WEBM, MKV, MOV, AVI -> /uploads/videos/)
const allowedVideoExtensions = new Set(['.mp4', '.webm', '.mkv', '.mov', '.avi']);
const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 300 * 1024 * 1024 }, // 300MB max for videos
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedVideoExtensions.has(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid video format (${ext}). Allowed: MP4, WEBM, MKV, MOV`));
    }
  }
});

// Extend Express Request with authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Authentication Middleware
export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err || !decoded?.id) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User no longer exists' });
    }
    req.user = user;
    next();
  });
};

// Admin Guard Middleware
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    next();
  });
};

// Optional Auth (for identifying user if logged in)
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (!err && decoded?.id) {
      const user = db.getUserById(decoded.id);
      if (user) req.user = user;
    }
    next();
  });
};

const sanitizeUser = (user: User) => {
  const { passwordHash, ...rest } = user;
  return rest;
};

// ================= FILE UPLOAD ROUTES (SELF-HOSTED PC STORAGE) =================

// 1. App binary/package upload (APK, EXE, ZIP, RAR, PDF, ISO, etc. -> /uploads/apps/)
router.post('/upload/file', requireAdmin, uploadAppPackage.single('file'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file received' });
    }

    const sizeInBytes = req.file.size;
    let formattedSize = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    if (sizeInBytes < 1024 * 1024) {
      formattedSize = `${(sizeInBytes / 1024).toFixed(0)} KB`;
    }

    const subfolder = path.relative(uploadRoot, req.file.destination).replace(/\\/g, '/');
    const fileUrl = `/uploads/${subfolder ? subfolder + '/' : ''}${req.file.filename}`;

    return res.json({
      success: true,
      fileName: req.file.originalname,
      storedFileName: req.file.filename,
      fileSize: formattedSize,
      sizeBytes: sizeInBytes,
      url: fileUrl,
      mimetype: req.file.mimetype
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return res.status(500).json({ error: error.message || 'File upload failed' });
  }
});

// 2. App Icon upload (PNG, JPG, WEBP, SVG -> /uploads/images/)
router.post('/upload/icon', requireAdmin, uploadIcon.single('icon'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No icon file received' });
    }
    const subfolder = path.relative(uploadRoot, req.file.destination).replace(/\\/g, '/');
    return res.json({
      success: true,
      fileName: req.file.originalname,
      url: `/uploads/${subfolder ? subfolder + '/' : ''}${req.file.filename}`
    });
  } catch (error: any) {
    console.error('Icon upload error:', error);
    return res.status(500).json({ error: error.message || 'Icon upload failed' });
  }
});

// 3. Screenshots upload (multiple images -> /uploads/images/)
router.post('/upload/screenshot', requireAdmin, uploadScreenshots.array('screenshots', 12), (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No screenshot files received' });
    }
    const urls = files.map((f) => {
      const subfolder = path.relative(uploadRoot, f.destination).replace(/\\/g, '/');
      return `/uploads/${subfolder ? subfolder + '/' : ''}${f.filename}`;
    });
    return res.json({
      success: true,
      urls,
      count: urls.length
    });
  } catch (error: any) {
    console.error('Screenshot upload error:', error);
    return res.status(500).json({ error: error.message || 'Screenshot upload failed' });
  }
});

// 4. Video upload (MP4, WEBM -> /uploads/videos/)
router.post('/upload/video', requireAdmin, uploadVideo.single('video'), (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file received' });
    }
    const subfolder = path.relative(uploadRoot, req.file.destination).replace(/\\/g, '/');
    return res.json({
      success: true,
      fileName: req.file.originalname,
      url: `/uploads/${subfolder ? subfolder + '/' : ''}${req.file.filename}`
    });
  } catch (error: any) {
    console.error('Video upload error:', error);
    return res.status(500).json({ error: error.message || 'Video upload failed' });
  }
});

// 5. Delete a specific uploaded file (e.g., when replacing or cleaning up screenshots)
router.post('/upload/delete-file', requireAdmin, (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string' || !url.includes('/uploads/')) {
      return res.status(400).json({ error: 'Invalid local file URL provided' });
    }

    const relPath = url.split('/uploads/').pop()?.split('?')[0];
    if (!relPath) {
      return res.status(400).json({ error: 'Could not resolve file path' });
    }

    const safeRelPath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
    const absoluteFilePath = path.join(uploadRoot, safeRelPath);

    // Verify it resides in uploadRoot
    if (!absoluteFilePath.startsWith(uploadRoot)) {
      return res.status(403).json({ error: 'Path traversal forbidden' });
    }

    if (fs.existsSync(absoluteFilePath)) {
      fs.unlinkSync(absoluteFilePath);
      return res.json({ success: true, message: 'File deleted from local server storage' });
    }

    return res.json({ success: true, message: 'File does not exist or already removed' });
  } catch (err: any) {
    console.error('Error deleting local file:', err);
    return res.status(500).json({ error: err.message || 'Failed to delete local file' });
  }
});

// ================= AUTH ROUTES =================

router.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    if (db.getUserByEmail(email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (db.getUserByUsername(username)) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      username: username.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(username.trim())}`,
      bio: 'ZX9Store community member',
      role: 'user',
      createdAt: new Date().toISOString(),
      bookmarks: [],
      downloadHistory: []
    };

    db.createUser(newUser);

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(201).json({
      user: sanitizeUser(newUser),
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Failed to create account' });
  }
});

router.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res.status(400).json({ error: 'Email/Username and password are required' });
    }

    const user = db.getUserByEmail(emailOrUsername) || db.getUserByUsername(emailOrUsername);
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = bcrypt.compareSync(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({
      user: sanitizeUser(user),
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({ user: sanitizeUser(req.user) });
});

router.put('/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { username, bio, avatarUrl, currentPassword, newPassword } = req.body;
    const updates: Partial<User> = {};

    if (username && username.trim() !== req.user.username) {
      const existing = db.getUserByUsername(username.trim());
      if (existing && existing.id !== req.user.id) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      updates.username = username.trim();
    }

    if (bio !== undefined) updates.bio = bio;
    if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }
      if (!req.user.passwordHash || !bcrypt.compareSync(currentPassword, req.user.passwordHash)) {
        return res.status(400).json({ error: 'Current password incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }
      const salt = bcrypt.genSaltSync(10);
      updates.passwordHash = bcrypt.hashSync(newPassword, salt);
    }

    const updated = db.updateUser(req.user.id, updates);
    if (!updated) return res.status(404).json({ error: 'User not found' });

    return res.json({ user: sanitizeUser(updated) });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  const user = db.getUserByEmail(email);
  if (!user) {
    // For security, do not disclose if email exists or not
    return res.json({ message: 'If this email is registered, password reset instructions have been sent.' });
  }

  // Simulated password reset token
  return res.json({
    message: 'Password reset link sent to email. For testing, you may use password Admin@123456 or User@123456.',
    demoNotice: 'In test environment, you can log in with demo accounts directly from the login modal.'
  });
});

// ================= BOOKMARKS / USER DATA =================

router.get('/user/bookmarks', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const bookmarkedApps = db.getApps().filter((a) => req.user!.bookmarks?.includes(a.id));
  return res.json(bookmarkedApps);
});

router.post('/user/bookmarks/:appId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { appId } = req.params;
  const bookmarks = new Set(req.user.bookmarks || []);

  let isBookmarked = false;
  if (bookmarks.has(appId)) {
    bookmarks.delete(appId);
    isBookmarked = false;
  } else {
    bookmarks.add(appId);
    isBookmarked = true;
  }

  const updated = db.updateUser(req.user.id, { bookmarks: Array.from(bookmarks) });
  return res.json({ isBookmarked, bookmarks: updated?.bookmarks || [] });
});

router.get('/user/my-reviews', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const reviews = db.getUserReviews(req.user.id);
  const enriched = reviews.map((r) => {
    const app = db.getAppById(r.appId);
    return { ...r, appTitle: app?.title, appIcon: app?.iconUrl, appSlug: app?.slug };
  });
  return res.json(enriched);
});

// ================= APPS PUBLIC ROUTES =================

router.get('/apps', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      search,
      category,
      sort = 'popular',
      tag,
      featured,
      trending,
      limit = '50',
      page = '1'
    } = req.query;

    let apps = db.getApps();

    // Unless user is admin, only show published apps
    const isAdmin = req.user?.role === 'admin';
    if (!isAdmin) {
      apps = apps.filter((a) => a.published !== false);
    }

    if (category && category !== 'All') {
      apps = apps.filter((a) => a.category.toLowerCase() === String(category).toLowerCase());
    }

    if (tag) {
      apps = apps.filter((a) => a.tags?.some((t) => t.toLowerCase() === String(tag).toLowerCase()));
    }

    if (featured === 'true') {
      apps = apps.filter((a) => a.featured);
    }

    if (trending === 'true') {
      apps = apps.filter((a) => a.trending);
    }

    if (search && String(search).trim()) {
      const q = String(search).toLowerCase().trim();
      apps = apps.filter((a) =>
        a.title.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q) ||
        a.shortDescription.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sorting
    switch (sort) {
      case 'rating':
        apps.sort((a, b) => b.rating - a.rating || (b.reviewCount || 0) - (a.reviewCount || 0));
        break;
      case 'latest':
        apps.sort((a, b) => new Date(b.uploadDate || b.updateDate).getTime() - new Date(a.uploadDate || a.updateDate).getTime());
        break;
      case 'updated':
        apps.sort((a, b) => new Date(b.updateDate).getTime() - new Date(a.updateDate).getTime());
        break;
      case 'downloads':
      case 'popular':
        apps.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
        break;
      case 'az':
        apps.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        apps.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        apps.sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0));
    }

    const pageNum = parseInt(String(page), 10) || 1;
    const limitNum = parseInt(String(limit), 10) || 50;
    const total = apps.length;
    const paginated = apps.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    return res.json({
      apps: paginated,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Get apps error:', error);
    return res.status(500).json({ error: 'Failed to fetch apps' });
  }
});

router.get('/apps/:id_or_slug', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id_or_slug } = req.params;
  const app = db.getAppById(id_or_slug);

  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // Related apps in same category
  const relatedApps = db.getApps()
    .filter((a) => a.category.toLowerCase() === app.category.toLowerCase() && a.id !== app.id && a.published)
    .slice(0, 6);

  // Check if bookmarked
  const isBookmarked = req.user?.bookmarks?.includes(app.id) || false;

  return res.json({
    app,
    relatedApps,
    isBookmarked
  });
});

router.post('/apps/:id/download', (req: Request, res: Response) => {
  const { id } = req.params;
  const { platform } = req.body || {};
  const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const ipHash = bcrypt.hashSync(String(clientIp).slice(0, 16), 4);

  const result = db.incrementDownload(id, ipHash);
  if (!result.success) {
    return res.status(404).json({ error: 'App not found' });
  }

  const app = db.getAppById(id);
  let effectiveDownloadUrl = result.downloadUrl;
  let effectiveDownloadType = app?.downloadType || 'external';

  if (platform === 'windows' && app?.windowsDownloadUrl) {
    effectiveDownloadUrl = app.windowsDownloadUrl;
    effectiveDownloadType = app.windowsDownloadType || 'external';
  }

  return res.json({
    success: true,
    downloadCount: result.newCount,
    downloadUrl: effectiveDownloadUrl,
    downloadType: effectiveDownloadType,
    ticket: `zx9-ticket-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
  });
});

// ================= CATEGORIES ROUTES =================

router.get('/categories', (req: Request, res: Response) => {
  const categories = db.getCategories();
  return res.json(categories);
});

// ================= REVIEWS ROUTES =================

router.get('/reviews/:appId', (req: Request, res: Response) => {
  const { appId } = req.params;
  const reviews = db.getReviewsByAppId(appId);

  // Calculate rating distribution
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    distribution[star]++;
  });

  return res.json({
    reviews,
    total: reviews.length,
    distribution
  });
});

router.post('/reviews/:appId', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Must be logged in to review' });
    const { appId } = req.params;
    const { rating, title, comment } = req.body;

    const app = db.getAppById(appId);
    if (!app) return res.status(404).json({ error: 'App not found' });

    const numRating = Number(rating);
    if (!numRating || numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5 stars' });
    }

    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ error: 'Review comment must be at least 5 characters' });
    }

    const review: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      appId,
      userId: req.user.id,
      username: req.user.username,
      userAvatar: req.user.avatarUrl,
      rating: numRating,
      title: title ? title.trim() : undefined,
      comment: comment.trim(),
      helpfulCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.addReview(review);
    const updatedApp = db.getAppById(appId);

    return res.status(201).json({
      review: saved,
      appRating: updatedApp?.rating,
      appReviewCount: updatedApp?.reviewCount
    });
  } catch (error) {
    console.error('Post review error:', error);
    return res.status(500).json({ error: 'Failed to post review' });
  }
});

router.delete('/reviews/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
  const { id } = req.params;
  const allReviews = db.getAllReviews();
  const target = allReviews.find((r) => r.id === id);

  if (!target) return res.status(404).json({ error: 'Review not found' });

  // Only review author or admin can delete
  if (target.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Not authorized to delete this review' });
  }

  db.deleteReview(id);
  return res.json({ success: true, message: 'Review deleted' });
});

// ================= ADMIN DASHBOARD & MANAGEMENT ROUTES =================

router.get('/admin/stats', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getAdminStats();
  return res.json(stats);
});

// Admin App Management
router.post('/admin/apps', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      developer,
      category,
      version,
      size,
      platform,
      downloadType,
      downloadUrl,
      externalDownloadUrl,
      uploadedFileName,
      uploadedFileSize,
      minAndroidVersion,
      packageName,
      windowsVersion,
      windowsDownloadType,
      windowsDownloadUrl,
      windowsExternalUrl,
      windowsFileName,
      windowsFileSize,
      shortDescription,
      description,
      features,
      changelog,
      iconUrl,
      screenshots,
      previewVideoUrl,
      videoType,
      officialWebsiteUrl,
      tags,
      featured,
      trending,
      published,
      rating,
      sha256,
      isVerifiedSafe
    } = req.body;

    if (!title || !developer) {
      return res.status(400).json({ error: 'App Title and Developer are required' });
    }

    const appPlatform: PlatformType = platform === 'windows' || platform === 'both' ? platform : 'android';
    const primaryDlType: DownloadType = downloadType === 'upload' ? 'upload' : 'external';
    
    // Resolve primary download url
    const resolvedDownloadUrl = primaryDlType === 'upload' 
      ? (downloadUrl || '').trim() 
      : (externalDownloadUrl || downloadUrl || '').trim();

    // Resolve Windows download url if applicable
    const winDlType: DownloadType = windowsDownloadType === 'upload' ? 'upload' : 'external';
    const resolvedWinDownloadUrl = winDlType === 'upload'
      ? (windowsDownloadUrl || '').trim()
      : (windowsExternalUrl || windowsDownloadUrl || '').trim();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    const newApp: AppItem = {
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      slug,
      title: title.trim(),
      developer: developer.trim(),
      category: category || 'Tools',
      version: version || '1.0.0',
      size: size || uploadedFileSize || '15.0 MB',
      platform: appPlatform,
      downloadType: primaryDlType,
      downloadUrl: resolvedDownloadUrl || resolvedWinDownloadUrl || '#',
      externalDownloadUrl: externalDownloadUrl ? externalDownloadUrl.trim() : undefined,
      uploadedFileName: uploadedFileName || undefined,
      uploadedFileSize: uploadedFileSize || undefined,
      minAndroidVersion: minAndroidVersion || (appPlatform !== 'windows' ? 'Android 8.0+' : undefined),
      packageName: packageName || `com.${developer.toLowerCase().replace(/[^a-z0-9]/g, '')}.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      windowsVersion: windowsVersion || (appPlatform !== 'android' ? 'Windows 10/11 64-bit' : undefined),
      windowsDownloadType: winDlType,
      windowsDownloadUrl: resolvedWinDownloadUrl || undefined,
      windowsExternalUrl: windowsExternalUrl ? windowsExternalUrl.trim() : undefined,
      windowsFileName: windowsFileName || undefined,
      windowsFileSize: windowsFileSize || undefined,
      shortDescription: shortDescription || `${title} for ${appPlatform === 'both' ? 'Android & Windows' : appPlatform}.`,
      description: description || shortDescription || `${title} provides rich performance and utility.`,
      features: Array.isArray(features) ? features : (typeof features === 'string' ? features.split('\n').filter(Boolean) : []),
      changelog: changelog || 'Initial release on ZX9Store.',
      iconUrl: iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
      screenshots: Array.isArray(screenshots) ? screenshots : (screenshots ? [screenshots] : []),
      previewVideoUrl: previewVideoUrl || undefined,
      videoType: videoType || (previewVideoUrl ? 'youtube' : 'none'),
      officialWebsiteUrl: officialWebsiteUrl?.trim() || undefined,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []),
      uploadDate: new Date().toISOString().split('T')[0],
      updateDate: new Date().toISOString().split('T')[0],
      featured: Boolean(featured),
      trending: Boolean(trending),
      published: published !== false,
      rating: rating ? Number(rating) : 5.0,
      reviewCount: 0,
      downloadCount: 0,
      sha256: sha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      isVerifiedSafe: isVerifiedSafe !== false
    };

    const saved = db.createApp(newApp);
    return res.status(201).json(saved);
  } catch (error) {
    console.error('Create app error:', error);
    return res.status(500).json({ error: 'Failed to create app' });
  }
});

router.put('/admin/apps/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updateDate: new Date().toISOString().split('T')[0] };
    const updated = db.updateApp(id, updates);
    if (!updated) return res.status(404).json({ error: 'App not found' });
    return res.json(updated);
  } catch (error) {
    console.error('Update app error:', error);
    return res.status(500).json({ error: 'Failed to update app' });
  }
});

router.delete('/admin/apps/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteApp(id);
  if (!success) return res.status(404).json({ error: 'App not found' });
  return res.json({ success: true, message: 'App deleted successfully' });
});

// Admin Categories Management
router.get('/admin/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  return res.json(db.getCategories());
});

router.post('/admin/categories', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { name, iconName, description, gradient } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required' });

  const newCat: Category = {
    id: `cat-${Date.now()}`,
    name: name.trim(),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    iconName: iconName || 'Folder',
    description: description || `All ${name} applications and utilities`,
    gradient: gradient || 'from-blue-500 to-indigo-500'
  };

  const created = db.createCategory(newCat);
  return res.status(201).json(created);
});

router.put('/admin/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const updated = db.updateCategory(id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found' });
  return res.json(updated);
});

router.delete('/admin/categories/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteCategory(id);
  if (!success) return res.status(404).json({ error: 'Category not found' });
  return res.json({ success: true, message: 'Category deleted' });
});

// Admin Users Management
router.get('/admin/users', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const users = db.getUsers().map((u) => sanitizeUser(u));
  return res.json(users);
});

router.put('/admin/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { role, username, bio } = req.body;
  const updated = db.updateUser(id, { role, username, bio });
  if (!updated) return res.status(404).json({ error: 'User not found' });
  return res.json(sanitizeUser(updated));
});

router.delete('/admin/users/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (id === req.user?.id) {
    return res.status(400).json({ error: 'Cannot delete your own admin account' });
  }
  const success = db.deleteUser(id);
  if (!success) return res.status(404).json({ error: 'User not found' });
  return res.json({ success: true, message: 'User deleted' });
});

// Admin Reviews Management
router.get('/admin/reviews', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const reviews = db.getAllReviews();
  const enriched = reviews.map((r) => {
    const app = db.getAppById(r.appId);
    return { ...r, appTitle: app?.title, appIcon: app?.iconUrl };
  });
  return res.json(enriched);
});

router.delete('/admin/reviews/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const success = db.deleteReview(id);
  if (!success) return res.status(404).json({ error: 'Review not found' });
  return res.json({ success: true, message: 'Review deleted by admin' });
});

export default router;
