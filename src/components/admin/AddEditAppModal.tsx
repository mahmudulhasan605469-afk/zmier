import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  Link,
  Smartphone,
  Monitor,
  Layers,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Loader2,
  FileCode,
  Check,
  Globe,
  Tag as TagIcon,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { AppItem, Category, PlatformType, DownloadType, VideoSourceType } from '../../types';
import { api } from '../../services/api';

interface AddEditAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedApp: AppItem) => void;
  editingApp?: AppItem | null;
  categories: Category[];
}

export const AddEditAppModal: React.FC<AddEditAppModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingApp,
  categories,
}) => {
  // --- Platform Selection ---
  const [platform, setPlatform] = useState<PlatformType>(
    editingApp?.platform || 'android'
  );

  // --- Core Metadata State ---
  const [title, setTitle] = useState(editingApp?.title || '');
  const [developer, setDeveloper] = useState(editingApp?.developer || '');
  const [category, setCategory] = useState(editingApp?.category || categories[0]?.name || 'Tools');
  const [version, setVersion] = useState(editingApp?.version || '1.0.0');
  const [shortDescription, setShortDescription] = useState(editingApp?.shortDescription || '');
  const [description, setDescription] = useState(editingApp?.description || '');
  const [changelog, setChangelog] = useState(editingApp?.changelog || '');
  const [officialWebsiteUrl, setOfficialWebsiteUrl] = useState(editingApp?.officialWebsiteUrl || '');

  // --- Android Specifics ---
  const [packageName, setPackageName] = useState(
    editingApp?.packageName || 'com.example.app'
  );
  const [minAndroidVersion, setMinAndroidVersion] = useState(
    editingApp?.minAndroidVersion || 'Android 8.0+'
  );
  const [androidDownloadType, setAndroidDownloadType] = useState<DownloadType>(
    editingApp?.downloadType || 'external'
  );
  const [androidExternalUrl, setAndroidExternalUrl] = useState(
    editingApp?.externalDownloadUrl || (editingApp?.downloadType !== 'upload' ? editingApp?.downloadUrl : '') || ''
  );
  const [androidUploadProgress, setAndroidUploadProgress] = useState<number | null>(null);
  const [androidUploadedFile, setAndroidUploadedFile] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(
    editingApp?.downloadType === 'upload' && editingApp?.downloadUrl
      ? {
          name: editingApp.uploadedFileName || 'app-release.apk',
          size: editingApp.uploadedFileSize || editingApp.size || '35.0 MB',
          url: editingApp.downloadUrl,
        }
      : null
  );

  // --- Windows Specifics ---
  const [windowsVersion, setWindowsVersion] = useState(
    editingApp?.windowsVersion || 'Windows 10/11 64-bit'
  );
  const [windowsDownloadType, setWindowsDownloadType] = useState<DownloadType>(
    editingApp?.windowsDownloadType || 'external'
  );
  const [windowsExternalUrl, setWindowsExternalUrl] = useState(
    editingApp?.windowsExternalUrl || (editingApp?.windowsDownloadType !== 'upload' ? editingApp?.windowsDownloadUrl : '') || ''
  );
  const [windowsUploadProgress, setWindowsUploadProgress] = useState<number | null>(null);
  const [windowsUploadedFile, setWindowsUploadedFile] = useState<{
    name: string;
    size: string;
    url: string;
  } | null>(
    editingApp?.windowsDownloadType === 'upload' && editingApp?.windowsDownloadUrl
      ? {
          name: editingApp.windowsFileName || 'setup.exe',
          size: editingApp.windowsFileSize || editingApp.size || '75.0 MB',
          url: editingApp.windowsDownloadUrl,
        }
      : null
  );

  // --- App Icon ---
  const [iconMode, setIconMode] = useState<'upload' | 'url'>('url');
  const [iconUrl, setIconUrl] = useState(
    editingApp?.iconUrl ||
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80'
  );
  const [iconUploadProgress, setIconUploadProgress] = useState<number | null>(null);
  const [iconFileName, setIconFileName] = useState<string>('');

  // --- Screenshots ---
  const [screenshots, setScreenshots] = useState<string[]>(
    editingApp?.screenshots && editingApp.screenshots.length > 0
      ? editingApp.screenshots
      : [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80',
        ]
  );
  const [newScreenshotUrl, setNewScreenshotUrl] = useState('');
  const [screenshotUploadProgress, setScreenshotUploadProgress] = useState<number | null>(null);

  // --- Video Trailer ---
  const [videoType, setVideoType] = useState<VideoSourceType>(
    editingApp?.videoType || (editingApp?.previewVideoUrl ? 'youtube' : 'none')
  );
  const [previewVideoUrl, setPreviewVideoUrl] = useState(editingApp?.previewVideoUrl || '');
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [uploadedVideoName, setUploadedVideoName] = useState('');

  // --- Features & Tags ---
  const [features, setFeatures] = useState<string[]>(
    editingApp?.features && editingApp.features.length > 0
      ? editingApp.features
      : ['High-Performance Engine', 'Clean Dark Mode Interface', 'Zero Ads & Telemetry']
  );
  const [newFeatureInput, setNewFeatureInput] = useState('');

  const [tags, setTags] = useState<string[]>(
    editingApp?.tags && editingApp.tags.length > 0
      ? editingApp.tags
      : ['utility', 'verified', 'fast']
  );
  const [tagInput, setTagInput] = useState('');

  // --- Badges & Status ---
  const [featured, setFeatured] = useState(Boolean(editingApp?.featured));
  const [trending, setTrending] = useState(Boolean(editingApp?.trending));
  const [isVerifiedSafe, setIsVerifiedSafe] = useState(
    editingApp?.isVerifiedSafe !== undefined ? editingApp.isVerifiedSafe : true
  );
  const [published, setPublished] = useState(
    editingApp?.published !== undefined ? editingApp.published : true
  );

  // --- UI and Error Handling ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'general' | 'platform_download' | 'media' | 'details'>('general');

  const fileInputAndroidRef = useRef<HTMLInputElement>(null);
  const fileInputWindowsRef = useRef<HTMLInputElement>(null);
  const fileInputIconRef = useRef<HTMLInputElement>(null);
  const fileInputScreenshotsRef = useRef<HTMLInputElement>(null);
  const fileInputVideoRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // --- File Upload Handlers ---

  const handleAndroidFileUpload = async (file: File) => {
    try {
      setAndroidUploadProgress(0);
      setErrorMessage('');
      const res = await api.uploadFile(file, (percent) => {
        setAndroidUploadProgress(percent);
      });
      setAndroidUploadedFile({
        name: res.fileName,
        size: res.fileSize,
        url: res.url,
      });
      setAndroidUploadProgress(null);
    } catch (err: any) {
      console.error('Android file upload error:', err);
      setAndroidUploadProgress(null);
      setErrorMessage(err.message || 'Failed to upload Android file.');
    }
  };

  const handleWindowsFileUpload = async (file: File) => {
    try {
      setWindowsUploadProgress(0);
      setErrorMessage('');
      const res = await api.uploadFile(file, (percent) => {
        setWindowsUploadProgress(percent);
      });
      setWindowsUploadedFile({
        name: res.fileName,
        size: res.fileSize,
        url: res.url,
      });
      setWindowsUploadProgress(null);
    } catch (err: any) {
      console.error('Windows file upload error:', err);
      setWindowsUploadProgress(null);
      setErrorMessage(err.message || 'Failed to upload Windows file.');
    }
  };

  const handleIconUpload = async (file: File) => {
    try {
      setIconUploadProgress(0);
      setErrorMessage('');
      const res = await api.uploadIcon(file, (percent) => {
        setIconUploadProgress(percent);
      });
      setIconUrl(res.url);
      setIconFileName(res.fileName);
      setIconUploadProgress(null);
    } catch (err: any) {
      console.error('Icon upload error:', err);
      setIconUploadProgress(null);
      setErrorMessage(err.message || 'Failed to upload app icon.');
    }
  };

  const handleScreenshotsUpload = async (files: FileList) => {
    try {
      setScreenshotUploadProgress(0);
      setErrorMessage('');
      const fileArray = Array.from(files);
      const res = await api.uploadScreenshots(fileArray, (percent) => {
        setScreenshotUploadProgress(percent);
      });
      setScreenshots((prev) => [...prev, ...res.urls]);
      setScreenshotUploadProgress(null);
    } catch (err: any) {
      console.error('Screenshot upload error:', err);
      setScreenshotUploadProgress(null);
      setErrorMessage(err.message || 'Failed to upload screenshots.');
    }
  };

  const handleVideoUpload = async (file: File) => {
    try {
      setVideoUploadProgress(0);
      setErrorMessage('');
      const res = await api.uploadVideo(file, (percent) => {
        setVideoUploadProgress(percent);
      });
      setPreviewVideoUrl(res.url);
      setUploadedVideoName(res.fileName);
      setVideoType('mp4');
      setVideoUploadProgress(null);
    } catch (err: any) {
      console.error('Video upload error:', err);
      setVideoUploadProgress(null);
      setErrorMessage(err.message || 'Failed to upload video trailer.');
    }
  };

  // --- Features & Tags Helpers ---

  const handleAddFeature = () => {
    if (newFeatureInput.trim()) {
      setFeatures([...features, newFeatureInput.trim()]);
      setNewFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    const clean = tagInput.trim().toLowerCase().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleMoveScreenshot = (index: number, direction: 'left' | 'right') => {
    const newIdx = direction === 'left' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= screenshots.length) return;
    const updated = [...screenshots];
    const temp = updated[index];
    updated[index] = updated[newIdx];
    updated[newIdx] = temp;
    setScreenshots(updated);
  };

  const handleRemoveScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index));
  };

  // --- Form Submission ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!title.trim()) {
      setErrorMessage('App Title is required.');
      setActiveTab('general');
      return;
    }
    if (!developer.trim()) {
      setErrorMessage('Developer name is required.');
      setActiveTab('general');
      return;
    }

    // Android download validation if platform includes Android
    let resolvedAndroidDownloadUrl = '';
    if (platform === 'android' || platform === 'both') {
      if (androidDownloadType === 'upload') {
        if (!androidUploadedFile?.url) {
          setErrorMessage('Please upload the Android APK file or switch to External Link.');
          setActiveTab('platform_download');
          return;
        }
        resolvedAndroidDownloadUrl = androidUploadedFile.url;
      } else {
        if (!androidExternalUrl.trim()) {
          setErrorMessage('Please provide an External Download URL for Android or switch to Uploaded File.');
          setActiveTab('platform_download');
          return;
        }
        resolvedAndroidDownloadUrl = androidExternalUrl.trim();
      }
    }

    // Windows download validation if platform includes Windows
    let resolvedWindowsDownloadUrl = '';
    if (platform === 'windows' || platform === 'both') {
      if (windowsDownloadType === 'upload') {
        if (!windowsUploadedFile?.url) {
          setErrorMessage('Please upload the Windows installer/file or switch to External Link.');
          setActiveTab('platform_download');
          return;
        }
        resolvedWindowsDownloadUrl = windowsUploadedFile.url;
      } else {
        if (!windowsExternalUrl.trim()) {
          setErrorMessage('Please provide an External Download URL for Windows or switch to Uploaded File.');
          setActiveTab('platform_download');
          return;
        }
        resolvedWindowsDownloadUrl = windowsExternalUrl.trim();
      }
    }

    // Calculate Primary Size
    let resolvedSize = '25.0 MB';
    if (platform === 'windows') {
      resolvedSize = windowsUploadedFile?.size || '75.0 MB';
    } else {
      resolvedSize = androidUploadedFile?.size || '35.0 MB';
    }

    const payload: Partial<AppItem> = {
      title: title.trim(),
      developer: developer.trim(),
      category,
      version: version.trim() || '1.0.0',
      size: resolvedSize,
      platform,
      // Android Config
      downloadType: androidDownloadType,
      downloadUrl: resolvedAndroidDownloadUrl || resolvedWindowsDownloadUrl,
      externalDownloadUrl: androidDownloadType === 'external' ? androidExternalUrl.trim() : undefined,
      uploadedFileName: androidDownloadType === 'upload' ? androidUploadedFile?.name : undefined,
      uploadedFileSize: androidDownloadType === 'upload' ? androidUploadedFile?.size : undefined,
      packageName: packageName.trim() || `com.${developer.toLowerCase().replace(/[^a-z0-9]/g, '')}.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      minAndroidVersion: minAndroidVersion.trim() || 'Android 8.0+',
      // Windows Config
      windowsVersion: platform !== 'android' ? windowsVersion.trim() : undefined,
      windowsDownloadType: windowsDownloadType,
      windowsDownloadUrl: resolvedWindowsDownloadUrl || undefined,
      windowsExternalUrl: windowsDownloadType === 'external' ? windowsExternalUrl.trim() : undefined,
      windowsFileName: windowsDownloadType === 'upload' ? windowsUploadedFile?.name : undefined,
      windowsFileSize: windowsDownloadType === 'upload' ? windowsUploadedFile?.size : undefined,
      // Metadata & Media
      iconUrl: iconUrl.trim() || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80',
      screenshots,
      previewVideoUrl: videoType !== 'none' && previewVideoUrl ? previewVideoUrl.trim() : undefined,
      videoType: videoType,
      shortDescription: shortDescription.trim() || `${title} for ${platform === 'both' ? 'Android and Windows' : platform}.`,
      description: description.trim() || shortDescription.trim() || `${title} provides great utilities and high performance.`,
      changelog: changelog.trim() || `Initial version ${version} release on ZX9Store.`,
      officialWebsiteUrl: officialWebsiteUrl.trim() || undefined,
      features,
      tags,
      featured,
      trending,
      isVerifiedSafe,
      published,
    };

    try {
      setIsSubmitting(true);
      let saved: AppItem;
      if (editingApp) {
        saved = await api.updateApp(editingApp.id, payload);
      } else {
        saved = await api.createApp(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err: any) {
      console.error('Failed to save app:', err);
      setErrorMessage(err.message || 'Failed to save application');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative max-w-4xl w-full my-auto rounded-3xl border border-white/10 bg-[#0a0514] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Title & Navigation Tabs */}
        <div className="p-6 border-b border-white/10 bg-black/40 flex-shrink-0 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {editingApp ? 'EDIT APPLICATION' : 'PUBLISH NEW APP'}
              </span>
              {editingApp && (
                <span className="text-xs text-white/50 font-mono">ID: {editingApp.id}</span>
              )}
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight mt-1">
              {editingApp ? editingApp.title : 'Store Application Creator'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-black/20 px-6 gap-2 overflow-x-auto flex-shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'general'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. General Info</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('platform_download')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'platform_download'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>2. Platform & Downloads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'media'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>3. Icon, Screenshots & Video</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>4. Features & Badges</span>
          </button>
        </div>

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-white">
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <p className="font-semibold text-xs">Form Validation Error</p>
                <p className="text-[11px] text-rose-200/80 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ================= TAB 1: GENERAL INFO ================= */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    App Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Proton VPN, Nova Launcher, OBS Studio"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    Developer / Author <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={developer}
                    onChange={(e) => setDeveloper(e.target.value)}
                    placeholder="e.g. Proton AG, TeslaCoil Software"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    Store Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    Version Number <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="e.g. 2.4.1"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1.5">
                  Short Tagline / Summary
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="One sentence description highlighted on app cards"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-white/80 font-semibold mb-1.5">
                  Full Application Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed overview of what the application does, features, setup instructions..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    Changelog / What's New
                  </label>
                  <textarea
                    rows={2}
                    value={changelog}
                    onChange={(e) => setChangelog(e.target.value)}
                    placeholder="• Added dark mode support&#10;• Bug fixes and speed improvements"
                    className="w-full px-4 py-2 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-white/80 font-semibold mb-1.5">
                    Official Website / Repository URL
                  </label>
                  <input
                    type="url"
                    value={officialWebsiteUrl}
                    onChange={(e) => setOfficialWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PLATFORM & DOWNLOADS ================= */}
          {activeTab === 'platform_download' && (
            <div className="space-y-6">
              {/* Platform Selector Cards */}
              <div>
                <label className="block text-white font-bold mb-2">
                  Target Platform Architecture <span className="text-rose-400">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPlatform('android')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      platform === 'android'
                        ? 'border-emerald-500 bg-emerald-500/10 text-white'
                        : 'border-white/10 bg-black/30 text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Smartphone className={`w-6 h-6 ${platform === 'android' ? 'text-emerald-400' : 'text-white/40'}`} />
                    <div>
                      <h4 className="font-bold text-sm">Android APK</h4>
                      <p className="text-[11px] text-white/50">Mobile phones & tablets</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPlatform('windows')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      platform === 'windows'
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-white/10 bg-black/30 text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Monitor className={`w-6 h-6 ${platform === 'windows' ? 'text-blue-400' : 'text-white/40'}`} />
                    <div>
                      <h4 className="font-bold text-sm">Windows PC</h4>
                      <p className="text-[11px] text-white/50">EXE, MSI & ZIP packages</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPlatform('both')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                      platform === 'both'
                        ? 'border-purple-500 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-black/30 text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Layers className={`w-6 h-6 ${platform === 'both' ? 'text-purple-400' : 'text-white/40'}`} />
                    <div>
                      <h4 className="font-bold text-sm">Both (Dual Platform)</h4>
                      <p className="text-[11px] text-white/50">Android APK & PC Installer</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ANDROID DOWNLOAD SECTION */}
              {(platform === 'android' || platform === 'both') && (
                <div className="p-5 rounded-3xl border border-emerald-500/20 bg-emerald-950/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-emerald-400" />
                      <h3 className="font-bold text-sm text-white">Android Package & Download Setup</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                      APK / AAB
                    </span>
                  </div>

                  {/* Android package metadata */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Android Package Name (App ID)
                      </label>
                      <input
                        type="text"
                        value={packageName}
                        onChange={(e) => setPackageName(e.target.value)}
                        placeholder="com.developer.appname"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-white/70 font-semibold mb-1">
                        Minimum Android OS
                      </label>
                      <input
                        type="text"
                        value={minAndroidVersion}
                        onChange={(e) => setMinAndroidVersion(e.target.value)}
                        placeholder="e.g. Android 8.0+ (Oreo)"
                        className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Download Type Selector */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Android Download Type <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setAndroidDownloadType('external')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          androidDownloadType === 'external'
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                        }`}
                      >
                        <Link className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="font-bold text-xs">External Link</div>
                          <div className="text-[10px] text-white/50">MediaFire, Drive, Dropbox, GitHub</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setAndroidDownloadType('upload')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          androidDownloadType === 'upload'
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                        }`}
                      >
                        <UploadCloud className="w-4 h-4 text-indigo-400" />
                        <div>
                          <div className="font-bold text-xs">Uploaded File</div>
                          <div className="text-[10px] text-white/50">Upload APK directly from your PC</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* External Link Input for Android */}
                  {androidDownloadType === 'external' && (
                    <div className="space-y-1.5">
                      <label className="block text-white/80 font-semibold">
                        External Download URL <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={androidExternalUrl}
                        onChange={(e) => setAndroidExternalUrl(e.target.value)}
                        placeholder="https://github.com/.../release.apk or https://mediafire.com/file/..."
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                      />
                      <p className="text-[11px] text-white/40">
                        Paste any direct legal download mirror. The user clicking "Download Now" will be routed safely to this URL.
                      </p>
                    </div>
                  )}

                  {/* File Upload Box for Android */}
                  {androidDownloadType === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputAndroidRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleAndroidFileUpload(e.target.files[0]);
                          }
                        }}
                        accept=".apk,.xapk,.aab,.zip,.rar"
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputAndroidRef.current?.click()}
                        className="p-6 border-2 border-dashed border-white/20 hover:border-emerald-500/60 rounded-3xl bg-black/40 hover:bg-emerald-950/20 transition-all cursor-pointer text-center space-y-2"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-white text-xs">
                          {androidUploadedFile ? 'Replace APK File' : 'Click or Drag & Drop APK File'}
                        </h4>
                        <p className="text-[11px] text-white/50">
                          Supports APK, XAPK, AAB, ZIP (Max: 300MB)
                        </p>
                      </div>

                      {/* Upload Progress Bar */}
                      {androidUploadProgress !== null && (
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-indigo-300">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Uploading Android Package to Server...
                            </span>
                            <span className="font-bold text-indigo-400">{androidUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-200"
                              style={{ width: `${androidUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Uploaded File Status Pill */}
                      {androidUploadedFile && androidUploadProgress === null && (
                        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-white text-xs">{androidUploadedFile.name}</div>
                              <div className="text-[10px] text-emerald-300">
                                Size: {androidUploadedFile.size} • Uploaded & Stored on Server
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAndroidUploadedFile(null)}
                            className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* WINDOWS DOWNLOAD SECTION */}
              {(platform === 'windows' || platform === 'both') && (
                <div className="p-5 rounded-3xl border border-blue-500/20 bg-blue-950/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-blue-400" />
                      <h3 className="font-bold text-sm text-white">Windows PC Package & Download Setup</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300">
                      EXE / MSI / ZIP / RAR / ISO
                    </span>
                  </div>

                  {/* Windows compatibility metadata */}
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      Windows OS Compatibility
                    </label>
                    <input
                      type="text"
                      value={windowsVersion}
                      onChange={(e) => setWindowsVersion(e.target.value)}
                      placeholder="e.g. Windows 10/11 64-bit, Windows 7+"
                      className="w-full px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Windows Download Type Selector */}
                  <div>
                    <label className="block text-white font-semibold mb-2">
                      Windows Download Type <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setWindowsDownloadType('external')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          windowsDownloadType === 'external'
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                        }`}
                      >
                        <Link className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="font-bold text-xs">External Link</div>
                          <div className="text-[10px] text-white/50">MediaFire, GitHub Release, Mega, Drive</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWindowsDownloadType('upload')}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                          windowsDownloadType === 'upload'
                            ? 'border-blue-500 bg-blue-500/20 text-white'
                            : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                        }`}
                      >
                        <UploadCloud className="w-4 h-4 text-blue-400" />
                        <div>
                          <div className="font-bold text-xs">Uploaded File</div>
                          <div className="text-[10px] text-white/50">Upload EXE, MSI, ZIP, RAR, ISO from PC</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* External Link for Windows */}
                  {windowsDownloadType === 'external' && (
                    <div className="space-y-1.5">
                      <label className="block text-white/80 font-semibold">
                        Windows Download URL <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={windowsExternalUrl}
                        onChange={(e) => setWindowsExternalUrl(e.target.value)}
                        placeholder="https://github.com/.../setup.exe or https://download.example.com/win"
                        className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white font-mono placeholder:text-white/30 focus:outline-none focus:border-blue-500"
                      />
                      <p className="text-[11px] text-white/40">
                        Direct download mirror for PC users clicking "Download for PC".
                      </p>
                    </div>
                  )}

                  {/* File Upload Box for Windows */}
                  {windowsDownloadType === 'upload' && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputWindowsRef}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleWindowsFileUpload(e.target.files[0]);
                          }
                        }}
                        accept=".exe,.msi,.zip,.rar,.7z,.pdf,.iso"
                        className="hidden"
                      />

                      <div
                        onClick={() => fileInputWindowsRef.current?.click()}
                        className="p-6 border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-3xl bg-black/40 hover:bg-blue-950/20 transition-all cursor-pointer text-center space-y-2"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
                          <UploadCloud className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-white text-xs">
                          {windowsUploadedFile ? 'Replace Windows File' : 'Click or Drag & Drop PC File'}
                        </h4>
                        <p className="text-[11px] text-white/50">
                          Supports EXE, MSI, ZIP, RAR, ISO, PDF (Max: 300MB)
                        </p>
                      </div>

                      {/* Upload Progress Bar */}
                      {windowsUploadProgress !== null && (
                        <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-blue-300">
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Uploading Windows File to Server...
                            </span>
                            <span className="font-bold text-blue-400">{windowsUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 transition-all duration-200"
                              style={{ width: `${windowsUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Uploaded File Status Pill */}
                      {windowsUploadedFile && windowsUploadProgress === null && (
                        <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <div>
                              <div className="font-bold text-white text-xs">{windowsUploadedFile.name}</div>
                              <div className="text-[10px] text-blue-300">
                                Size: {windowsUploadedFile.size} • Uploaded & Stored on Server
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setWindowsUploadedFile(null)}
                            className="p-1.5 text-white/40 hover:text-rose-400 rounded-lg"
                            title="Remove file"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: MEDIA (ICON, SCREENSHOTS, VIDEO) ================= */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* SECTION 1: APP ICON */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-indigo-400" />
                    <span>App Icon</span>
                  </h3>
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
                    <button
                      type="button"
                      onClick={() => setIconMode('upload')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        iconMode === 'upload' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Upload Icon
                    </button>
                    <button
                      type="button"
                      onClick={() => setIconMode('url')}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        iconMode === 'url' ? 'bg-indigo-600 text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      Icon URL
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Icon Live Preview */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80'}
                      alt="Icon Preview"
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-white/10 shadow-lg bg-black/60"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    {iconMode === 'upload' ? (
                      <div>
                        <input
                          type="file"
                          ref={fileInputIconRef}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleIconUpload(e.target.files[0]);
                            }
                          }}
                          accept="image/png,image/jpeg,image/webp,image/svg+xml"
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputIconRef.current?.click()}
                          className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-indigo-500 bg-black/40 hover:bg-white/5 text-white/70 hover:text-white flex items-center justify-center gap-2"
                        >
                          <UploadCloud className="w-4 h-4 text-indigo-400" />
                          <span>{iconFileName ? `Selected: ${iconFileName} (Click to change)` : 'Upload PNG, JPG, WEBP or SVG'}</span>
                        </button>
                        {iconUploadProgress !== null && (
                          <p className="text-[11px] text-indigo-400 mt-1">Uploading: {iconUploadProgress}%</p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <input
                          type="url"
                          value={iconUrl}
                          onChange={(e) => setIconUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    )}
                    <p className="text-[11px] text-white/40">
                      Recommended: 512x512 PNG, square ratio with rounded corners applied automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: SCREENSHOTS */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-indigo-400" />
                      <span>App Screenshots Gallery</span>
                    </h3>
                    <p className="text-[11px] text-white/50 mt-0.5">
                      Upload multiple showcase screenshots or add image URLs ({screenshots.length} added)
                    </p>
                  </div>

                  <input
                    type="file"
                    ref={fileInputScreenshotsRef}
                    multiple
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleScreenshotsUpload(e.target.files);
                      }
                    }}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputScreenshotsRef.current?.click()}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Batch</span>
                  </button>
                </div>

                {/* Screenshot URL input */}
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={newScreenshotUrl}
                    onChange={(e) => setNewScreenshotUrl(e.target.value)}
                    placeholder="Or paste screenshot image URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newScreenshotUrl.trim()) {
                        setScreenshots([...screenshots, newScreenshotUrl.trim()]);
                        setNewScreenshotUrl('');
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                {screenshotUploadProgress !== null && (
                  <p className="text-[11px] text-indigo-400">Uploading screenshots... {screenshotUploadProgress}%</p>
                )}

                {/* Screenshots List / Grid */}
                {screenshots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                    {screenshots.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black/60 aspect-[16/10]"
                      >
                        <img
                          src={src}
                          alt={`Screenshot ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveScreenshot(idx, 'left')}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveScreenshot(idx)}
                            className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === screenshots.length - 1}
                            onClick={() => handleMoveScreenshot(idx, 'right')}
                            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-30 text-white"
                            title="Move Right"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-2 text-[10px] font-mono text-white/70 bg-black/60 px-1 rounded">
                          #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-white/40 border border-dashed border-white/10 rounded-2xl">
                    No screenshots added yet. Add at least 1 or 2 screenshots to show users.
                  </div>
                )}
              </div>

              {/* SECTION 3: VIDEO TRAILER */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Film className="w-4 h-4 text-purple-400" />
                    <span>Video Trailer / Gameplay</span>
                  </h3>
                  <span className="text-[11px] text-white/50">Optional</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'none', label: 'No Video' },
                    { id: 'youtube', label: 'YouTube URL' },
                    { id: 'direct', label: 'Direct Video URL' },
                    { id: 'mp4', label: 'Upload MP4' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVideoType(v.id as VideoSourceType)}
                      className={`p-2.5 rounded-xl border text-center font-semibold text-xs transition-all ${
                        videoType === v.id
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-black/40 text-white/60 hover:text-white'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                {videoType === 'youtube' && (
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      YouTube Video URL
                    </label>
                    <input
                      type="url"
                      value={previewVideoUrl}
                      onChange={(e) => setPreviewVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {videoType === 'direct' && (
                  <div>
                    <label className="block text-white/70 font-semibold mb-1">
                      Direct MP4 / WEBM Link
                    </label>
                    <input
                      type="url"
                      value={previewVideoUrl}
                      onChange={(e) => setPreviewVideoUrl(e.target.value)}
                      placeholder="https://example.com/videos/trailer.mp4"
                      className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                )}

                {videoType === 'mp4' && (
                  <div className="space-y-2">
                    <input
                      type="file"
                      ref={fileInputVideoRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleVideoUpload(e.target.files[0]);
                        }
                      }}
                      accept="video/mp4,video/webm"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputVideoRef.current?.click()}
                      className="w-full py-3 px-4 rounded-xl border border-dashed border-white/20 hover:border-purple-500 bg-black/40 hover:bg-white/5 text-white/70 hover:text-white flex items-center justify-center gap-2"
                    >
                      <Film className="w-4 h-4 text-purple-400" />
                      <span>{uploadedVideoName ? `Video: ${uploadedVideoName}` : 'Upload MP4 / WEBM Video Trailer'}</span>
                    </button>
                    {videoUploadProgress !== null && (
                      <p className="text-[11px] text-purple-400">Uploading video: {videoUploadProgress}%</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: FEATURES, TAGS & BADGES ================= */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Features Bullet List Builder */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Key Features Checklist</span>
                  </h3>
                  <span className="text-[11px] text-white/50">{features.length} points</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newFeatureInput}
                    onChange={(e) => setNewFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. End-to-End Encryption, Zero Log Policy, High FPS Support..."
                    className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                  >
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 text-white/80">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-white/40 hover:text-rose-400 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags Chip Editor */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <TagIcon className="w-4 h-4 text-indigo-400" />
                    <span>Search Tags & Keywords</span>
                  </h3>
                  <span className="text-[11px] text-white/50">{tags.length} tags</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type a tag and click Add or press Enter..."
                    className="flex-1 px-4 py-2 rounded-xl bg-black/50 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs"
                  >
                    Add Tag
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5"
                    >
                      #{t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="hover:text-rose-300"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Visibility & Badges Toggles */}
              <div className="p-5 rounded-3xl border border-white/10 bg-black/30 space-y-4">
                <h3 className="font-bold text-sm text-white">Store Badges & Publishing State</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Featured on Carousel</div>
                      <div className="text-[10px] text-white/50">Highlighted in the top homepage banners</div>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={trending}
                      onChange={(e) => setTrending(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Trending Flame Badge</div>
                      <div className="text-[10px] text-white/50">Displayed in high-velocity popular feed</div>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={isVerifiedSafe}
                      onChange={(e) => setIsVerifiedSafe(e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Verified Safe Software</div>
                      <div className="text-[10px] text-white/50">Shows green Verified Integrity Shield</div>
                    </div>
                  </label>

                  <label className="p-3.5 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/5">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                    <div>
                      <div className="font-bold text-white text-xs">Published in Public Store</div>
                      <div className="text-[10px] text-white/50">Visible immediately to all users</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold text-xs transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              {activeTab !== 'details' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeTab === 'general') setActiveTab('platform_download');
                    else if (activeTab === 'platform_download') setActiveTab('media');
                    else if (activeTab === 'media') setActiveTab('details');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Next Step</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all transform active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Package...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingApp ? 'Update Application' : 'Publish Application'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
