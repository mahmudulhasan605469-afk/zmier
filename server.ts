import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/routes';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Local uploads directory configuration (Self-Hosted PC storage)
  const uploadRoot = process.env.UPLOAD_DIR
    ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'uploads');

  // Specific categorized storage folders for Windows PC SSD storage
  const uploadSubdirs = [
    uploadRoot,
    path.join(uploadRoot, 'apk'),
    path.join(uploadRoot, 'exe'),
    path.join(uploadRoot, 'zip'),
    path.join(uploadRoot, 'rar'),
    path.join(uploadRoot, 'pdf'),
    path.join(uploadRoot, 'iso'),
    path.join(uploadRoot, 'images'),
    path.join(uploadRoot, 'videos'),
    path.join(uploadRoot, 'apps'),
    path.join(uploadRoot, 'icons'),
    path.join(uploadRoot, 'screenshots'),
  ];

  // Automatically create all self-hosted upload storage directories on PC
  for (const dir of uploadSubdirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (dirErr) {
      console.error(`Failed to create directory: ${dir}`, dirErr);
    }
  }

  // Ensure local data directory exists for local database storage
  const dataDir = process.env.DATA_DIR
    ? path.resolve(process.cwd(), process.env.DATA_DIR)
    : path.join(process.cwd(), 'data');
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  } catch (dataErr) {
    console.error(`Failed to create data directory: ${dataDir}`, dataErr);
  }

  // Middlewares
  app.use(cors());
  app.use(express.json({ limit: '1024mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1024mb' }));

  // Secure Static Uploads Serving with Path Traversal Protection
  app.use('/uploads', (req, res, next) => {
    // Sanitize path against directory traversal
    const safeRelPath = path.normalize(req.path).replace(/^(\.\.[\/\\])+/, '');
    const absoluteFilePath = path.join(uploadRoot, safeRelPath);

    // Verify requested path resides strictly within the configured upload root
    if (!absoluteFilePath.startsWith(uploadRoot)) {
      return res.status(403).json({ error: 'Access denied: Path traversal detected' });
    }
    next();
  }, express.static(uploadRoot, {
    dotfiles: 'deny',
    index: false,
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }));

  // API Routes FIRST
  app.use('/api', apiRouter);

  // Health check & diagnostics endpoint
  app.get('/api/health', (_req, res) => {
    const checkDir = (dirPath: string) => ({
      path: dirPath,
      exists: fs.existsSync(dirPath),
      writable: (() => {
        try {
          fs.accessSync(dirPath, fs.constants.W_OK);
          return true;
        } catch {
          return false;
        }
      })(),
    });

    const folderDiagnostics = {
      root: checkDir(uploadRoot),
      apk: checkDir(path.join(uploadRoot, 'apk')),
      exe: checkDir(path.join(uploadRoot, 'exe')),
      zip: checkDir(path.join(uploadRoot, 'zip')),
      rar: checkDir(path.join(uploadRoot, 'rar')),
      pdf: checkDir(path.join(uploadRoot, 'pdf')),
      iso: checkDir(path.join(uploadRoot, 'iso')),
      images: checkDir(path.join(uploadRoot, 'images')),
      videos: checkDir(path.join(uploadRoot, 'videos')),
      data: checkDir(dataDir),
    };

    const dbFile = path.join(dataDir, 'store.json');

    res.json({
      status: 'ok',
      store: 'ZX9Store Self-Hosted Edition',
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      workingDirectory: process.cwd(),
      storage: {
        uploadDir: uploadRoot,
        dataDir: dataDir,
        databaseFile: dbFile,
        databaseExists: fs.existsSync(dbFile),
        folders: folderDiagnostics,
      },
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`🚀 ZX9Store Server running on http://localhost:${PORT}`);
    console.log(`📁 Local PC Uploads: ${uploadRoot}`);
    console.log(`💾 Local PC Database: ${path.join(dataDir, 'store.json')}`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
