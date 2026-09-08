import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { User, AppItem, Category, Review, DownloadLog, AdminStats } from '../src/types';

interface DatabaseSchema {
  users: User[];
  apps: AppItem[];
  categories: Category[];
  reviews: Review[];
  downloads: DownloadLog[];
}

const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.cwd(), process.env.DATA_DIR)
  : path.join(process.cwd(), 'data');

const DB_FILE = process.env.DATABASE_FILE
  ? path.resolve(process.cwd(), process.env.DATABASE_FILE)
  : path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Games', slug: 'games', iconName: 'Gamepad2', description: 'Action, RPG, Strategy, Arcade & Puzzle games', gradient: 'from-amber-500 to-rose-500' },
  { id: 'cat-2', name: 'Tools', slug: 'tools', iconName: 'Wrench', description: 'Essential utilities, system managers & browsers', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'cat-3', name: 'Social', slug: 'social', iconName: 'MessageSquare', description: 'Chat, messaging, communities & networking', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'cat-4', name: 'Entertainment', slug: 'entertainment', iconName: 'Tv', description: 'Streaming, IPTV, home theater & media hubs', gradient: 'from-purple-500 to-indigo-500' },
  { id: 'cat-5', name: 'Productivity', slug: 'productivity', iconName: 'Briefcase', description: 'Office, notes, email, calendars & task planners', gradient: 'from-blue-600 to-violet-600' },
  { id: 'cat-6', name: 'Photography', slug: 'photography', iconName: 'Camera', description: 'Pro camera, filters, RAW capture & photo editors', gradient: 'from-pink-500 to-rose-600' },
  { id: 'cat-7', name: 'Video', slug: 'video', iconName: 'Video', description: 'Video players, 4K decoders & screen recorders', gradient: 'from-red-500 to-orange-500' },
  { id: 'cat-8', name: 'Music', slug: 'music', iconName: 'Music', description: 'High-res audio players, equalizers & synthesizers', gradient: 'from-fuchsia-500 to-purple-600' },
  { id: 'cat-9', name: 'Education', slug: 'education', iconName: 'GraduationCap', description: 'Language learning, science, reference & e-readers', gradient: 'from-amber-400 to-orange-500' },
  { id: 'cat-10', name: 'Utility', slug: 'utility', iconName: 'Cpu', description: 'Terminal emulators, system diagnostics & dev tools', gradient: 'from-teal-500 to-emerald-600' },
  { id: 'cat-11', name: 'Security', slug: 'security', iconName: 'ShieldCheck', description: 'VPNs, encrypted vaults, 2FA authenticators', gradient: 'from-indigo-600 to-blue-700' },
];

const INITIAL_APPS: AppItem[] = [
  {
    id: 'app-vlc',
    slug: 'vlc-for-android',
    title: 'VLC for Android',
    developer: 'Videolabs',
    category: 'Video',
    version: '3.5.4',
    size: '34.8 MB',
    shortDescription: 'The best open-source multimedia player that plays almost all video & audio formats.',
    description: 'VLC for Android is a full audio and video player, with a complete database, an equalizer and filters, playing all weird audio and video formats. It plays most local video and audio files, as well as network streams (including adaptive streaming), DVD ISOs, like the desktop version of VLC. All formats are supported, including MKV, MP4, AVI, MOV, Ogg, FLAC, TS, M2TS, Wv and AAC.',
    features: [
      'Plays all video formats including 4K/8K Ultra HD & HDR10',
      'Multi-track audio and subtitle support (.srt, .ssa, embedded)',
      'Hardware acceleration for ARMv7, ARMv8, x86 and x86_64',
      'Picture-in-Picture (PiP) mode and background playback',
      'Network stream support: HLS, RTSP, RTMP, MMS and SMB network shares',
      '10-band audio equalizer with custom presets and bass boost'
    ],
    changelog: 'v3.5.4: Fixed subtitle rendering on Android 14, enhanced SMBv3 streaming performance, and improved playback engine for AV1 codecs.',
    iconUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
    ],
    previewVideoUrl: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
    videoType: 'youtube',
    downloadUrl: 'https://get.videolan.org/vlc-android/3.5.4/VLC-Android-3.5.4-arm64-v8a.apk',
    officialWebsiteUrl: 'https://www.videolan.org/vlc/download-android.html',
    tags: ['Media Player', 'Open Source', '4K Video', 'Subtitles', 'No Ads'],
    uploadDate: '2026-01-15',
    updateDate: '2026-02-18',
    featured: true,
    trending: true,
    published: true,
    rating: 4.8,
    reviewCount: 342,
    downloadCount: 184500,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'org.videolan.vlc',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    isVerifiedSafe: true
  },
  {
    id: 'app-retroarch',
    slug: 'retroarch-plus',
    title: 'RetroArch Plus 64-bit',
    developer: 'Libretro',
    category: 'Games',
    version: '1.18.0',
    size: '88.2 MB',
    shortDescription: 'Frontend for emulators, game engines and media players with next-gen shader support.',
    description: 'RetroArch is an open-source project that makes use of a powerful development interface called Libretro. Libretro is an interface that allows you to make cross-platform applications that can use rich features such as OpenGL, cross-platform camera support, location support, and more in the future. Run classic games from NES, SNES, PS1, N64, GBA, PSP, Arcade and dozens of other classic systems.',
    features: [
      'Comprehensive Core Downloader for 80+ classic console emulators',
      'Next-gen CRT, scanline, and upscale shader presets',
      'Netplay lobby for online multiplayer with rollback netcode',
      'Custom overlay controllers and Bluetooth gamepad support',
      'Real-time rewinding, quick save states, and cheats database',
      'Dynamic run-ahead for zero input lag response'
    ],
    changelog: 'v1.18.0: Added Vulkan 1.3 HDR renderer, improved latency engine, redesigned mobile touch overlays, and updated core manager.',
    iconUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=800&auto=format&fit=crop&q=80'
    ],
    previewVideoUrl: 'https://www.youtube.com/watch?v=J_jKj0gG02g',
    videoType: 'youtube',
    downloadUrl: 'https://buildbot.libretro.com/stable/1.18.0/android/RetroArch_ra32.apk',
    officialWebsiteUrl: 'https://www.retroarch.com',
    tags: ['Emulator', 'Retro Gaming', 'Libretro', 'Vulkan', 'Gamepad'],
    uploadDate: '2026-01-10',
    updateDate: '2026-02-20',
    featured: true,
    trending: true,
    published: true,
    rating: 4.7,
    reviewCount: 289,
    downloadCount: 96400,
    minAndroidVersion: 'Android 8.0+',
    packageName: 'com.retroarch.aarch64',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    isVerifiedSafe: true
  },
  {
    id: 'app-signal',
    slug: 'signal-private-messenger',
    title: 'Signal Private Messenger',
    developer: 'Signal Foundation',
    category: 'Social',
    version: '7.4.2',
    size: '52.6 MB',
    shortDescription: 'State-of-the-art end-to-end encrypted messaging and crystal clear voice/video calls.',
    description: 'Millions of people use Signal every day for free and instantaneous communication anywhere in the world. Send and receive high-fidelity messages, participate in HD voice/video calls, and explore a growing set of new features that help you stay connected. Signal’s advanced privacy-preserving technology is always enabled, so you can focus on sharing the moments that matter with the people who matter to you.',
    features: [
      'End-to-End encryption powered by the open source Signal Protocol',
      'Disappearing messages with custom expiry timers',
      'Encrypted group calls with up to 40 participants in HD audio',
      'Zero trackers, zero advertising, and no data harvesting',
      'Encrypted stickers, media sharing, and high resolution photo transfers'
    ],
    changelog: 'v7.4.2: Group call stability fixes, custom username privacy enhancements, and updated backup transfer protocol.',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
    ],
    previewVideoUrl: 'https://www.youtube.com/watch?v=7YvQ_rUj6s0',
    videoType: 'youtube',
    downloadUrl: 'https://updates.signal.org/android/Signal-Android-website-prod-universal-release-7.4.2.apk',
    officialWebsiteUrl: 'https://signal.org',
    tags: ['Privacy', 'Encrypted', 'Messenger', 'VoIP', 'Open Source'],
    uploadDate: '2026-01-20',
    updateDate: '2026-02-22',
    featured: true,
    trending: true,
    published: true,
    rating: 4.9,
    reviewCount: 512,
    downloadCount: 312000,
    minAndroidVersion: 'Android 6.0+',
    packageName: 'org.thoughtcrime.securesms',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    isVerifiedSafe: true
  },
  {
    id: 'app-termux',
    slug: 'termux-terminal',
    title: 'Termux Terminal & Linux Environment',
    developer: 'Fredrik Fornwall',
    category: 'Utility',
    version: '0.118.1',
    size: '97.4 MB',
    shortDescription: 'Full Linux environment with APT package management, Python, Node.js, Git, and Clang.',
    description: 'Termux is an Android terminal emulator and Linux environment application that works directly with no rooting or setup required. A minimal base system is installed automatically - additional packages are available using the APT package manager. Use Bash and Zsh shells, edit files with Nano, Vim and Emacs, access servers over SSH, and develop in C with Clang, make and gdb.',
    features: [
      'Full APT/PKG package manager with over 2,000 Linux packages',
      'Compile software with Clang, Rust, Go, Python 3, and Node.js',
      'SSH client & server with key authentication support',
      'Custom hardware keyboard shortcuts and extra on-screen keys row',
      'Termux:API support to access device camera, sensors, and battery'
    ],
    changelog: 'v0.118.1: Upgraded bootstrap packages, improved terminal font rendering, and resolved Android 14 phantom process manager limits.',
    iconUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://github.com/termux/termux-app/releases/download/v0.118.1/termux-app_v0.118.1+github-debug_universal.apk',
    officialWebsiteUrl: 'https://termux.dev',
    tags: ['Linux', 'Terminal', 'Developer', 'SSH', 'Python', 'Git'],
    uploadDate: '2026-01-05',
    updateDate: '2026-02-14',
    featured: false,
    trending: true,
    published: true,
    rating: 4.9,
    reviewCount: 418,
    downloadCount: 245000,
    minAndroidVersion: 'Android 7.0+',
    packageName: 'com.termux',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    isVerifiedSafe: true
  },
  {
    id: 'app-bitwarden',
    slug: 'bitwarden-password-manager',
    title: 'Bitwarden Password Vault',
    developer: 'Bitwarden Inc.',
    category: 'Security',
    version: '2026.1.0',
    size: '41.5 MB',
    shortDescription: 'Secure, open-source password manager with biometric auto-fill and 2FA generator.',
    description: 'Bitwarden is the easiest and safest way to store all of your logins and passwords while conveniently keeping them synced between all of your devices. Bitwarden stores all of your logins in an encrypted vault that syncs across all of your devices. Because it is fully encrypted before it ever leaves your device, only you have access to your data. End-to-end zero knowledge encryption.',
    features: [
      'Zero-knowledge AES-256 bit end-to-end encryption with Argon2id',
      'Biometric authentication (Fingerprint, Face Unlock)',
      'Integrated TOTP 2-Factor Authenticator generator',
      'Secure password generator with entropy measurement',
      'Secure notes, credit cards, and encrypted file attachments'
    ],
    changelog: 'v2026.1.0: Passkey autofill support, redesigned vault navigation, and improved hardware security key (FIDO2) integration.',
    iconUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
    ],
    previewVideoUrl: 'https://www.youtube.com/watch?v=F3n3h_b_504',
    videoType: 'youtube',
    downloadUrl: 'https://github.com/bitwarden/mobile/releases/download/v2026.1.0/com.x8bit.bitwarden.apk',
    officialWebsiteUrl: 'https://bitwarden.com',
    tags: ['Security', 'Passwords', '2FA', 'Encryption', 'Passkeys'],
    uploadDate: '2026-01-12',
    updateDate: '2026-02-19',
    featured: true,
    trending: false,
    published: true,
    rating: 4.9,
    reviewCount: 480,
    downloadCount: 168000,
    minAndroidVersion: 'Android 8.0+',
    packageName: 'com.x8bit.bitwarden',
    sha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    isVerifiedSafe: true
  },
  {
    id: 'app-kodi',
    slug: 'kodi-media-center',
    title: 'Kodi Media Center',
    developer: 'XBMC Foundation',
    category: 'Entertainment',
    version: '21.0 Omega',
    size: '72.3 MB',
    shortDescription: 'Award-winning home theater software and entertainment hub for digital media.',
    description: 'Kodi is a free and open-source media player software application developed by the XBMC Foundation. Kodi is available for multiple operating-systems and hardware platforms, featuring a 10-foot user interface for use with televisions and remote controls. It allows users to play and view most videos, music, podcasts, and all digital media files from local and network storage media.',
    features: [
      'Full PVR and Live TV frontend with Electronic Program Guide (EPG)',
      'Rich add-on ecosystem for music, movies, weather, and skins',
      'Universal remote control support with CEC HDMI integration',
      'Passthrough Dolby Atmos, DTS-HD Master Audio, and TrueHD',
      'Automated poster, banner, and metadata scraping'
    ],
    changelog: 'v21.0 Omega: FFmpeg 6.0 upgrade, enhanced Dolby Vision profile support, speed-improved skin engine, and updated controller profiles.',
    iconUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://mirrors.kodi.tv/releases/android/arm64-v8a/kodi-21.0-Omega-arm64-v8a.apk',
    officialWebsiteUrl: 'https://kodi.tv',
    tags: ['IPTV', 'Media Center', 'Streaming', 'Home Theater', 'Dolby'],
    uploadDate: '2026-01-08',
    updateDate: '2026-02-12',
    featured: true,
    trending: true,
    published: true,
    rating: 4.6,
    reviewCount: 310,
    downloadCount: 142000,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'org.xbmc.kodi',
    sha256: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    isVerifiedSafe: true
  },
  {
    id: 'app-shattered-pd',
    slug: 'shattered-pixel-dungeon',
    title: 'Shattered Pixel Dungeon',
    developer: '00-Evan',
    category: 'Games',
    version: '2.4.1',
    size: '18.7 MB',
    shortDescription: 'Roguelike dungeon crawler RPG with randomized levels, tactical turn-based combat.',
    description: 'Shattered Pixel Dungeon is a traditional roguelike RPG that is simple to get into but hard to master! Every game is a unique challenge, with five different heroes, randomized levels and enemies, and hundreds of items to collect and use. ShatteredPD is 100% free with no ads, no micro-transactions, and completely open source.',
    features: [
      '5 Playable Hero Classes: Warrior, Mage, Rogue, Huntress, and Duelist',
      'Over 150 unique weapons, armor, wands, rings, and artifacts',
      '50+ distinct dungeon floors with varied environmental hazards',
      'Tactical turn-based positioning with deep stealth mechanics',
      'Completely offline and ad-free experience'
    ],
    changelog: 'v2.4.1: Rebalanced Duelist weapon abilities, new alchemy recipes, performance optimizations for high refresh rate displays.',
    iconUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://github.com/00-Evan/shattered-pixel-dungeon/releases/download/v2.4.1/ShatteredPD-v2.4.1-Android.apk',
    officialWebsiteUrl: 'https://shatteredpixel.com',
    tags: ['Roguelike', 'RPG', 'Pixel Art', 'Offline', 'Indie Game'],
    uploadDate: '2026-01-25',
    updateDate: '2026-02-23',
    featured: false,
    trending: true,
    published: true,
    rating: 4.9,
    reviewCount: 620,
    downloadCount: 290000,
    minAndroidVersion: 'Android 4.4+',
    packageName: 'com.shatteredpixel.shatteredpixeldungeon',
    sha256: '2c624232cdd221771294dfbb310aca000a0df6ac9b66bb7dd9d966abf7470732',
    isVerifiedSafe: true
  },
  {
    id: 'app-open-camera',
    slug: 'open-camera-pro',
    title: 'Open Camera Pro',
    developer: 'Mark Harman',
    category: 'Photography',
    version: '1.53.0',
    size: '5.2 MB',
    shortDescription: 'Powerful open-source camera app with manual focus, ISO, exposure and RAW (DNG) capture.',
    description: 'Open Camera is a completely free, lightweight Camera app. Manual controls (optional Camera2 API): manual focus distance, manual ISO, manual exposure time, manual white balance temperature, burst mode, RAW (DNG) files support, slow motion video, and customizable UI buttons.',
    features: [
      'Full Camera2 API manual exposure, manual ISO, manual white balance',
      'RAW / DNG photo capture with lossless detail preservation',
      'Auto-level stabilization for perfectly straight photos every shot',
      'Configurable volume keys for zoom, exposure lock, or shutter',
      'Remote photo capture via voice trigger, whistle, or audio level'
    ],
    changelog: 'v1.53.0: Added Ultra-wide and Telephoto multi-camera selection for recent sensor modules, improved HDR fusion speed.',
    iconUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://sourceforge.net/projects/opencamera/files/latest/download',
    officialWebsiteUrl: 'https://opencamera.org.uk',
    tags: ['Camera', 'RAW DNG', 'Manual Controls', '4K Video', 'Photography'],
    uploadDate: '2026-01-18',
    updateDate: '2026-02-15',
    featured: false,
    trending: false,
    published: true,
    rating: 4.7,
    reviewCount: 220,
    downloadCount: 88000,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'net.sourceforge.opencamera',
    sha256: '19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7',
    isVerifiedSafe: true
  },
  {
    id: 'app-proton-mail',
    slug: 'proton-mail-encrypted',
    title: 'Proton Mail: Encrypted Email',
    developer: 'Proton AG',
    category: 'Productivity',
    version: '4.0.12',
    size: '38.4 MB',
    shortDescription: 'Swiss-based end-to-end encrypted email and calendar with zero-access encryption.',
    description: 'Proton Mail is the world’s largest encrypted email service with over 100 million users. Based in Switzerland, Proton Mail is protected by strict Swiss privacy laws. Your inbox is protected with zero-access encryption, meaning not even Proton can read your emails or attachments.',
    features: [
      'Swiss privacy jurisdiction with end-to-end PGP compatibility',
      'Integrated encrypted Proton Calendar with schedule invites',
      'Password protected emails for non-Proton email recipients',
      'Custom swipe gestures, spam filters, and folder management',
      'Zero advertising and zero data profiling'
    ],
    changelog: 'v4.0.12: Instant push notifications with battery conservation, offline cache synchronization, and dark mode tweaks.',
    iconUrl: 'https://images.unsplash.com/photo-1557200134-90327ee9fafa?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://proton.me/download/mail/android/ProtonMail-Android.apk',
    officialWebsiteUrl: 'https://proton.me/mail',
    tags: ['Email', 'Encrypted', 'Swiss Privacy', 'Calendar', 'Productivity'],
    uploadDate: '2026-01-28',
    updateDate: '2026-02-21',
    featured: true,
    trending: false,
    published: true,
    rating: 4.8,
    reviewCount: 380,
    downloadCount: 195000,
    minAndroidVersion: 'Android 6.0+',
    packageName: 'ch.protonmail.android',
    sha256: '9834876dcfb05cb167a5c24953eba58c4ac89b1adf57f28f2f9d09af107ee9f0',
    isVerifiedSafe: true
  },
  {
    id: 'app-mindustry',
    slug: 'mindustry-factory-strategy',
    title: 'Mindustry Tower Defense & Factory',
    developer: 'Anuken',
    category: 'Games',
    version: '7.0-146',
    size: '64.1 MB',
    shortDescription: 'Factory management, tower defense, resource logistics and multi-planet campaign.',
    description: 'Mindustry is a sandbox tower-defense and logistics simulation game. Create elaborate supply chains of conveyor belts to feed ammo into your turrets, produce materials to use for building, and defend your structures from waves of enemies. Play with your friends in cross-platform multiplayer co-op games, or challenge them in team-based PvP matches.',
    features: [
      'Over 250 factory tech tree blocks, drills, belts, pipes, and energy grids',
      'Planetary campaign across Serpulo and Erekir with custom maps',
      'Cross-platform LAN & Internet multiplayer with custom server browser',
      'Schematic creator to blueprint and share mega-factory modules',
      'Full logic processor programming for automated drone delivery networks'
    ],
    changelog: 'v7.0-146: Unit AI routing improvements, new sector maps on Erekir planet, and battery energy grid balance fixes.',
    iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://github.com/Anuken/Mindustry/releases/download/v146/Mindustry.apk',
    officialWebsiteUrl: 'https://mindustrygame.github.io',
    tags: ['Strategy', 'Factory', 'Tower Defense', 'Multiplayer', 'Sandbox'],
    uploadDate: '2026-01-14',
    updateDate: '2026-02-17',
    featured: false,
    trending: true,
    published: true,
    rating: 4.9,
    reviewCount: 540,
    downloadCount: 220000,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'io.anuke.mindustry',
    sha256: '499f57f49be5c18151ecbf3c16262a67e42d87e07663f7336f33ea8536f98725',
    isVerifiedSafe: true
  },
  {
    id: 'app-libreoffice-viewer',
    slug: 'libreoffice-document-viewer',
    title: 'LibreOffice Document Viewer',
    developer: 'The Document Foundation',
    category: 'Education',
    version: '7.6.2',
    size: '62.0 MB',
    shortDescription: 'High-fidelity document viewer for OpenDocument (ODT, ODS, ODP) and Microsoft Office files.',
    description: 'LibreOffice Viewer uses the exact same engine as LibreOffice for Windows, Mac, and Linux! This, combined with a new front-end based on Firefox for Android, reads documents similarly to LibreOffice desktop. Supports DOC, DOCX, XLS, XLSX, PPT, PPTX, ODT, ODS, ODP, and PDF.',
    features: [
      'Native LibreOffice core rendering engine for 100% layout fidelity',
      'Full support for OpenDocument (ODF) formats (.odt, .ods, .odp)',
      'Compatible with Microsoft Office 97-2021 and Office 365 formats',
      'Built-in search, zoom, presentation mode, and print to PDF',
      'Ad-free, tracker-free, and privacy-respecting'
    ],
    changelog: 'v7.6.2: Faster PDF rendering engine, improved font substitution fallback, and Android 14 scoped storage file picker.',
    iconUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1517842645767-c639042777db?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://download.documentfoundation.org/libreoffice/testing/7.6.2/android/LibreOfficeViewer.apk',
    officialWebsiteUrl: 'https://www.libreoffice.org',
    tags: ['Office', 'PDF', 'Word', 'Excel', 'OpenDocument', 'Education'],
    uploadDate: '2026-01-09',
    updateDate: '2026-02-11',
    featured: false,
    trending: false,
    published: true,
    rating: 4.5,
    reviewCount: 195,
    downloadCount: 74000,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'org.libreoffice.viewer',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    isVerifiedSafe: true
  },
  {
    id: 'app-syncthing',
    slug: 'syncthing-file-sync',
    title: 'Syncthing Private Cloud Sync',
    developer: 'Syncthing Community',
    category: 'Tools',
    version: '1.27.3',
    size: '26.8 MB',
    shortDescription: 'Continuous decentralized file synchronization between phone, tablet, and PC.',
    description: 'Syncthing replaces proprietary sync and cloud services with something open, trustworthy and decentralized. Your data is your data alone and you deserve to choose where it is stored, if it is shared with some third party and how it\'s transmitted over the Internet. Direct peer-to-peer encrypted sync without third party servers.',
    features: [
      'Direct peer-to-peer synchronization over local Wi-Fi or Internet',
      'TLS 1.3 encryption with cryptographic node certificates',
      'Selective folder sync with conflict versioning history',
      'Battery saving filters: sync only on Wi-Fi or when plugged in',
      'Zero central servers — your files stay exclusively on your hardware'
    ],
    changelog: 'v1.27.3: Updated Syncthing core to 1.27.3, optimized background sync wake locks, and fixed folder scanner on micro SD cards.',
    iconUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=256&auto=format&fit=crop&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
    ],
    downloadUrl: 'https://github.com/syncthing/syncthing-android/releases/download/v1.27.3/syncthing-fork-v1.27.3.apk',
    officialWebsiteUrl: 'https://syncthing.net',
    tags: ['File Sync', 'Backup', 'Private Cloud', 'P2P', 'Decentralized'],
    uploadDate: '2026-01-22',
    updateDate: '2026-02-16',
    featured: false,
    trending: false,
    published: true,
    rating: 4.8,
    reviewCount: 310,
    downloadCount: 115000,
    minAndroidVersion: 'Android 5.0+',
    packageName: 'com.github.catfriend1.syncthingfork',
    sha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    isVerifiedSafe: true
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    appId: 'app-vlc',
    userId: 'user-demo',
    username: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Plays every format without a hitch',
    comment: 'Been using VLC on my Samsung tablet and phone for years. 4K HDR playback is buttery smooth, subtitle sync is perfect, and zero annoying ads.',
    helpfulCount: 42,
    createdAt: '2026-02-10T14:30:00.000Z',
    updatedAt: '2026-02-10T14:30:00.000Z'
  },
  {
    id: 'rev-2',
    appId: 'app-vlc',
    userId: 'user-sarah',
    username: 'Sarah Chen',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'SMB network streaming is a game changer',
    comment: 'Streaming straight from my local NAS via SMB3 without having to transfer large movie files to my phone first is incredible.',
    helpfulCount: 19,
    createdAt: '2026-02-15T09:12:00.000Z',
    updatedAt: '2026-02-15T09:12:00.000Z'
  },
  {
    id: 'rev-3',
    appId: 'app-retroarch',
    userId: 'user-demo',
    username: 'Alex Rivera',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'The ultimate emulation beast',
    comment: 'Hooked up my 8BitDo controller and configured CRT-Royale shader. Playing PS1 and GBA classics feels identical to original CRT televisions.',
    helpfulCount: 35,
    createdAt: '2026-02-18T18:45:00.000Z',
    updatedAt: '2026-02-18T18:45:00.000Z'
  },
  {
    id: 'rev-4',
    appId: 'app-signal',
    userId: 'user-marcus',
    username: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Only messaging app I trust',
    comment: 'Crystal clear voice calls, disappearing messages, and zero corporate telemetry or advertising. Essential for daily communication.',
    helpfulCount: 28,
    createdAt: '2026-02-21T11:00:00.000Z',
    updatedAt: '2026-02-21T11:00:00.000Z'
  },
  {
    id: 'rev-5',
    appId: 'app-termux',
    userId: 'user-dev',
    username: 'Elena Rostova',
    userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=128&auto=format&fit=crop&q=80',
    rating: 5,
    title: 'Turns any Android device into a pocket workstation',
    comment: 'Installed Python, Node, Git and Vim. I can SSH into my cloud servers and debug deployments while traveling.',
    helpfulCount: 51,
    createdAt: '2026-02-14T20:20:00.000Z',
    updatedAt: '2026-02-14T20:20:00.000Z'
  }
];

class DatabaseService {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          users: parsed.users || [],
          apps: parsed.apps || INITIAL_APPS,
          categories: parsed.categories || DEFAULT_CATEGORIES,
          reviews: parsed.reviews || INITIAL_REVIEWS,
          downloads: parsed.downloads || []
        };
      }
    } catch (err) {
      console.error('Error loading DB file, reinitializing default:', err);
    }

    // Seed default admin and users
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('Admin@123456', salt);
    const userHash = bcrypt.hashSync('User@123456', salt);

    const initialUsers: User[] = [
      {
        id: 'user-admin',
        username: 'ZX9Admin',
        email: 'admin@zx9store.com',
        passwordHash: adminHash,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
        bio: 'ZX9Store Lead Moderator & Security Auditor',
        role: 'admin',
        createdAt: '2026-01-01T00:00:00.000Z',
        bookmarks: ['app-vlc', 'app-bitwarden', 'app-retroarch'],
        downloadHistory: []
      },
      {
        id: 'user-demo',
        username: 'Alex Rivera',
        email: 'user@zx9store.com',
        passwordHash: userHash,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256&auto=format&fit=crop&q=80',
        bio: 'Android enthusiast, power user, and open source contributor.',
        role: 'user',
        createdAt: '2026-01-15T10:00:00.000Z',
        bookmarks: ['app-vlc', 'app-termux'],
        downloadHistory: [
          { appId: 'app-vlc', downloadedAt: '2026-02-10T14:28:00.000Z' },
          { appId: 'app-retroarch', downloadedAt: '2026-02-18T18:40:00.000Z' }
        ]
      }
    ];

    // Seed past 7 days of download logs for rich analytics
    const initialDownloads: DownloadLog[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = Math.floor(120 + Math.random() * 80);
      for (let j = 0; j < count; j++) {
        const randomApp = INITIAL_APPS[Math.floor(Math.random() * INITIAL_APPS.length)];
        initialDownloads.push({
          id: `dl-${dateStr}-${j}`,
          appId: randomApp.id,
          appName: randomApp.title,
          timestamp: new Date(d.getTime() + Math.random() * 86400000).toISOString(),
          dateStr
        });
      }
    }

    const initialDb: DatabaseSchema = {
      users: initialUsers,
      apps: INITIAL_APPS,
      categories: DEFAULT_CATEGORIES,
      reviews: INITIAL_REVIEWS,
      downloads: initialDownloads
    };

    this.saveData(initialDb);
    return initialDb;
  }

  private saveData(data: DatabaseSchema) {
    try {
      const tmpFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (err) {
      console.error('Error saving DB file, fallback direct write:', err);
      try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      } catch (fallbackErr) {
        console.error('Fatal error saving DB file:', fallbackErr);
      }
    }
  }

  private persist() {
    this.saveData(this.data);
  }

  // USER METHODS
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserByUsername(username: string): User | undefined {
    return this.data.users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  }

  createUser(user: User): User {
    this.data.users.push(user);
    this.persist();
    return user;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const idx = this.data.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates };
    this.persist();
    return this.data.users[idx];
  }

  deleteUser(id: string): boolean {
    const len = this.data.users.length;
    this.data.users = this.data.users.filter((u) => u.id !== id);
    if (this.data.users.length !== len) {
      this.persist();
      return true;
    }
    return false;
  }

  // APP METHODS
  getApps(): AppItem[] {
    return this.data.apps;
  }

  getAppById(idOrSlug: string): AppItem | undefined {
    return this.data.apps.find((a) => a.id === idOrSlug || a.slug === idOrSlug);
  }

  createApp(app: AppItem): AppItem {
    this.data.apps.unshift(app);
    this.persist();
    return app;
  }

  updateApp(id: string, updates: Partial<AppItem>): AppItem | null {
    const idx = this.data.apps.findIndex((a) => a.id === id);
    if (idx === -1) return null;
    this.data.apps[idx] = { ...this.data.apps[idx], ...updates };
    this.persist();
    return this.data.apps[idx];
  }

  deleteApp(id: string): boolean {
    const app = this.data.apps.find((a) => a.id === id);
    if (!app) return false;

    // 1. Clean up locally uploaded files (APK, EXE, icons, screenshots, videos in subfolders)
    const uploadRoot = process.env.UPLOAD_DIR
      ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
      : path.join(process.cwd(), 'uploads');

    const urlsToClean: (string | undefined)[] = [
      app.downloadUrl,
      app.windowsDownloadUrl,
      app.iconUrl,
      app.previewVideoUrl,
      ...(app.screenshots || [])
    ];

    for (const url of urlsToClean) {
      if (url && typeof url === 'string' && url.includes('/uploads/')) {
        try {
          const rawRelPath = url.split('/uploads/').pop()?.split('?')[0];
          if (rawRelPath) {
            const safeRelPath = path.normalize(rawRelPath).replace(/^(\.\.[\/\\])+/, '');
            const filePath = path.join(uploadRoot, safeRelPath);
            if (filePath.startsWith(uploadRoot) && fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        } catch (err) {
          console.warn('Could not delete local file for app:', url, err);
        }
      }
    }

    // 2. Remove app from store collection
    this.data.apps = this.data.apps.filter((a) => a.id !== id);

    // 3. Remove associated reviews
    this.data.reviews = this.data.reviews.filter((r) => r.appId !== id);

    // 4. Remove download records
    this.data.downloads = this.data.downloads.filter((d) => d.appId !== id);

    // 5. Remove from user bookmarks
    this.data.users.forEach((u) => {
      if (u.bookmarks && u.bookmarks.includes(id)) {
        u.bookmarks = u.bookmarks.filter((b) => b !== id);
      }
    });

    this.persist();
    return true;
  }

  incrementDownload(appId: string, ipHash?: string): { success: boolean; newCount: number; downloadUrl: string } {
    const app = this.getAppById(appId);
    if (!app) return { success: false, newCount: 0, downloadUrl: '' };

    app.downloadCount = (app.downloadCount || 0) + 1;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const log: DownloadLog = {
      id: `dl-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      appId: app.id,
      appName: app.title,
      timestamp: now.toISOString(),
      dateStr,
      ipHash
    };

    this.data.downloads.push(log);
    // Keep max 5000 recent download logs for performance
    if (this.data.downloads.length > 5000) {
      this.data.downloads = this.data.downloads.slice(-5000);
    }
    this.persist();

    return { success: true, newCount: app.downloadCount, downloadUrl: app.downloadUrl };
  }

  // CATEGORY METHODS
  getCategories(): Category[] {
    // Count apps per category dynamically
    return this.data.categories.map((cat) => ({
      ...cat,
      appCount: this.data.apps.filter((a) => a.category.toLowerCase() === cat.name.toLowerCase() && a.published).length
    }));
  }

  createCategory(category: Category): Category {
    this.data.categories.push(category);
    this.persist();
    return category;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.persist();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const len = this.data.categories.length;
    this.data.categories = this.data.categories.filter((c) => c.id !== id);
    if (this.data.categories.length !== len) {
      this.persist();
      return true;
    }
    return false;
  }

  // REVIEW METHODS
  getReviewsByAppId(appId: string): Review[] {
    return this.data.reviews.filter((r) => r.appId === appId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getAllReviews(): Review[] {
    return [...this.data.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getUserReviews(userId: string): Review[] {
    return this.data.reviews.filter((r) => r.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  addReview(review: Review): Review {
    // Remove previous review if exists for this user + app
    this.data.reviews = this.data.reviews.filter((r) => !(r.appId === review.appId && r.userId === review.userId));
    this.data.reviews.unshift(review);
    
    // Recalculate app rating and review count
    this.recalcAppRating(review.appId);
    this.persist();
    return review;
  }

  deleteReview(id: string): boolean {
    const review = this.data.reviews.find((r) => r.id === id);
    if (!review) return false;
    const appId = review.appId;
    this.data.reviews = this.data.reviews.filter((r) => r.id !== id);
    this.recalcAppRating(appId);
    this.persist();
    return true;
  }

  private recalcAppRating(appId: string) {
    const appReviews = this.data.reviews.filter((r) => r.appId === appId);
    const app = this.data.apps.find((a) => a.id === appId);
    if (app) {
      app.reviewCount = appReviews.length;
      if (appReviews.length === 0) {
        app.rating = 5.0;
      } else {
        const sum = appReviews.reduce((acc, r) => acc + r.rating, 0);
        app.rating = parseFloat((sum / appReviews.length).toFixed(1));
      }
    }
  }

  // STATS & ANALYTICS
  getAdminStats(): AdminStats {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const todayDownloads = this.data.downloads.filter((d) => d.dateStr === todayStr).length;
    const totalDownloads = this.data.apps.reduce((sum, a) => sum + (a.downloadCount || 0), 0);

    // 7-day download trend
    const downloadsByDate: { date: string; downloads: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = this.data.downloads.filter((dl) => dl.dateStr === dateStr).length;
      downloadsByDate.push({ date: dateStr.slice(5), downloads: count });
    }

    // Top 5 apps by downloads
    const topApps = [...this.data.apps]
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 5)
      .map((a) => ({
        id: a.id,
        title: a.title,
        downloads: a.downloadCount || 0,
        rating: a.rating,
        iconUrl: a.iconUrl
      }));

    // Category distribution
    const categoryStats = this.data.categories.map((c) => {
      const catApps = this.data.apps.filter((a) => a.category.toLowerCase() === c.name.toLowerCase());
      const catDownloads = catApps.reduce((acc, a) => acc + (a.downloadCount || 0), 0);
      return {
        category: c.name,
        count: catApps.length,
        downloads: catDownloads
      };
    });

    const recentReviews = this.getAllReviews().slice(0, 8);
    const recentUsers = this.data.users.slice(-8).reverse().map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt,
      avatarUrl: u.avatarUrl
    }));

    return {
      totalApps: this.data.apps.length,
      totalUsers: this.data.users.length,
      totalReviews: this.data.reviews.length,
      totalDownloads,
      todayDownloads,
      featuredAppsCount: this.data.apps.filter((a) => a.featured).length,
      downloadsByDate,
      downloadTrends: downloadsByDate,
      topApps,
      categoryStats,
      categoryBreakdown: categoryStats,
      recentReviews,
      recentUsers
    };
  }
}

export const db = new DatabaseService();
