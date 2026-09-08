# 🚀 ZX9Store — Self-Hosted App Store & PC SSD File Server

ZX9Store is a modern, high-performance, full-stack application store and file-hosting platform designed to run directly on your **own Windows PC** or local server without any dependency on external cloud databases (Firebase, Supabase, Cloud SQL), browser storage, or third-party web-maker hosting.

---

## 🌟 Key Architecture & Capabilities

- **100% Self-Hosted & Local Storage**: All application records, reviews, accounts, categories, and binary packages are saved directly onto your Windows PC SSD (e.g. `E:\DX9Store`).
- **Organized Local SSD File Storage**:
  - `uploads/apk/` — Android packages (`.apk`, `.xapk`, `.apks`)
  - `uploads/exe/` — Windows executable installers (`.exe`, `.msi`)
  - `uploads/zip/` — Archive files (`.zip`, `.7z`, `.tar`, `.gz`, `.pkg`)
  - `uploads/rar/` — RAR archive files (`.rar`)
  - `uploads/pdf/` — PDF documents and software manuals (`.pdf`)
  - `uploads/iso/` — Disk images and container builds (`.iso`, `.dmg`, `.bin`, `.appimage`)
  - `uploads/images/` — Application icons and screenshot galleries (`.png`, `.jpg`, `.webp`, `.svg`, `.ico`)
  - `uploads/videos/` — Video trailers and gameplay clips (`.mp4`, `.webm`, `.mkv`, `.mov`)
- **Local Embedded Database**: Persistent JSON database engine (`data/store.json`) with safe atomic writes (`.tmp` write + rename) to protect against power-cuts and data corruption.
- **Path Traversal & Security Protection**: File serving is strictly sandboxed within your configured `uploads/` directory, preventing unauthorized access to the rest of your Windows PC filesystem.
- **Zero Cloud Lock-In**: Export or copy the entire project folder to any other Windows, Linux, or Mac computer and run it immediately with zero configuration headaches.

---

## 📋 System Requirements

- **Operating System**: Windows 10 / Windows 11 (or Windows Server 2019/2022, macOS, Linux)
- **Node.js**: Version 18.18+ or 20.x+ LTS ([Download Node.js for Windows](https://nodejs.org/))
- **Package Manager**: `npm` (comes bundled with Node.js)

---

## 🛠️ Step-by-Step Windows PC Setup Guide

### Step 1: Install Node.js on Your PC
If not already installed:
1. Visit [https://nodejs.org](https://nodejs.org) and download the **LTS** installer for Windows (`.msi`).
2. Run the installer and complete the setup.
3. Open **Command Prompt (`cmd`)** or **PowerShell** and verify:
   ```cmd
   node -v
   npm -v
   ```

### Step 2: Extract / Move the Project Folder to Your SSD
Extract the downloaded ZIP directly to your preferred drive and path, for example:
```
E:\DX9Store
```

Open **Command Prompt (`cmd`)** or **PowerShell** and switch to that directory:
```cmd
E:
cd E:\DX9Store
```

### Step 3: Install Dependencies
Run the following command to install all backend and frontend packages:
```cmd
npm install
```

### Step 4: Configure Environment Variables (`.env`)
Create your local `.env` configuration file from the template:

**On Windows Command Prompt:**
```cmd
copy .env.example .env
```
**On Windows PowerShell:**
```powershell
Copy-Item .env.example .env
```

Open `.env` in Notepad or your preferred text editor:
```env
PORT=3000
DATA_DIR=./data
DATABASE_FILE=./data/store.json
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=314572800
JWT_SECRET=zx9store-self-hosted-secure-jwt-secret-2026
SESSION_SECRET=zx9store-self-hosted-session-secret-2026
APP_URL=http://localhost:3000
```
*(Note: You can also specify full absolute Windows paths like `UPLOAD_DIR=E:/DX9Store/uploads` and `DATA_DIR=E:/DX9Store/data`).*

### Step 5: Start the Server

#### Development Mode (with Live Reloading)
```cmd
npm run dev
```

#### Production Mode (Optimized Build)
```cmd
npm run build
npm start
```

When started, the server automatically verifies and creates the following directory structure on your SSD if it does not already exist:
- `E:\DX9Store\uploads\apk`
- `E:\DX9Store\uploads\exe`
- `E:\DX9Store\uploads\zip`
- `E:\DX9Store\uploads\rar`
- `E:\DX9Store\uploads\pdf`
- `E:\DX9Store\uploads\iso`
- `E:\DX9Store\uploads\images`
- `E:\DX9Store\uploads\videos`
- `E:\DX9Store\data`

### Step 6: Open the Store in Your Browser
Open your web browser (Chrome, Edge, Firefox, Brave) and visit:
```
http://localhost:3000
```

---

## 🔍 Server Health Check & Diagnostics

You can verify the backend status and local disk directories at any time by visiting:
```
http://localhost:3000/api/health
```

The response provides complete diagnostics, including:
- Backend operational status (`status: "ok"`)
- Local directory existence and write permissions for each folder
- Embedded database status and record counts
- Server uptime and memory footprint

---

## 🔐 Default Administrator & User Accounts

Upon first launch, the local database automatically initializes with the following default accounts:

### 👑 Administrator Account
- **Email**: `admin@zx9store.com`
- **Password**: `Admin@123456`
- **Role**: `admin` (Full access to Admin Dashboard, Add/Edit/Delete Apps, Local File Uploads, Category & User Management)

### 👤 Standard User Account
- **Email**: `user@zx9store.com`
- **Password**: `User@123456`
- **Role**: `user` (Browsing, downloading, writing reviews, submitting ratings, bookmarking)

*(You can change passwords or register new accounts directly from the store UI).*

---

## 📁 Directory Structure & File Storage on Your SSD

```
E:\DX9Store\
├── data\
│   └── store.json           <-- Local database file (users, apps, reviews, downloads)
├── uploads\                 <-- Physical local storage on your SSD
│   ├── apk\                 <-- Android APK packages
│   ├── exe\                 <-- Windows EXE & MSI installers
│   ├── zip\                 <-- ZIP, 7Z, TAR archives
│   ├── rar\                 <-- RAR archive files
│   ├── pdf\                 <-- PDF documentation & manuals
│   ├── iso\                 <-- ISO & disk image builds
│   ├── images\              <-- App icons and gallery screenshots
│   └── videos\              <-- Video clips and preview trailers
├── server\
│   ├── db.ts                <-- Local database engine with atomic persistence
│   └── routes.ts            <-- REST API routes (Auth, Apps, Uploads, Analytics)
├── src\                     <-- React + Tailwind frontend source code
├── server.ts                <-- Express server entry point & static file streamer
├── package.json
├── .env.example             <-- Configuration blueprint
└── README.md
```

---

## 💾 Backing Up & Moving Your Data

Because all files and database records reside physically inside your project folder on your SSD:
1. **To Backup**: Copy the `E:\DX9Store\data\` and `E:\DX9Store\uploads\` directories to an external SSD or backup drive.
2. **To Move to Another PC**: Copy the `E:\DX9Store` folder to the new computer, install Node.js, run `npm install`, and start the server with `npm run dev`. All files, apps, reviews, and accounts are 100% preserved.

---

## 🌐 Optional: Accessing Your PC Store Over LAN / Internet

### Within Your Home/Office Network (LAN):
Find your Windows PC's local IP (e.g. `ipconfig` -> `192.168.1.50`). Other devices on the same Wi-Fi can open:
```
http://192.168.1.50:3000
```

### Over the Internet (via Cloudflare Tunnel — Free & No Port Forwarding):
1. Download `cloudflared` for Windows from [Cloudflare](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/).
2. Run in Command Prompt / PowerShell:
   ```cmd
   cloudflared tunnel --url http://localhost:3000
   ```
3. Cloudflare gives you a public HTTPS URL (e.g. `https://your-store.trycloudflare.com`).

---

## 🛡️ Security Features

- **Path Traversal Protection**: Every file request is normalized and verified against `uploadRoot`. Requests containing `../` or attempting to access PC system files outside `uploads/` are blocked with HTTP 403.
- **File Validation & Extension Filtering**: Upload endpoints strictly validate file extensions.
- **Bcrypt Password Hashing**: Passwords are salted and hashed (10 rounds) before saving to the database.
- **Protected Admin Routes**: Managing apps, uploading files, or deleting records requires a valid administrator JWT token.

---

## 📜 License
Self-Hosted & Private — Complete ownership of your data and files on your PC SSD.
