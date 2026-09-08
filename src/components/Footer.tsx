import React from 'react';
import {
  ShieldCheck,
  Download,
  Lock,
  FileText,
  Mail,
  Heart,
  Globe,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, payload?: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-white/10 bg-black/40 backdrop-blur-md text-white/50 text-xs mt-20">
      {/* Top trust badges */}
      <div className="border-b border-white/10 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">100% Virus & Malware Free</h4>
              <p className="text-white/40 text-[11px] mt-0.5">All APKs signature verified and hash checked</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">High-Speed Verified Mirrors</h4>
              <p className="text-white/40 text-[11px] mt-0.5">Direct external links: GitHub, MediaFire, F-Droid</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Strict Copyright & DMCA Compliance</h4>
              <p className="text-white/40 text-[11px] mt-0.5">Zero pirated or modified APKs allowed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Col 1: Brand info */}
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-sm text-white shadow-md">
                ZX
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                9<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Store</span>
              </span>
            </div>
            <p className="text-white/50 text-xs leading-relaxed max-w-sm">
              The premier Android APK marketplace for open-source tools, emulators, privacy messengers, and power utilities. Built with precision, security, and developer freedom.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium pt-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>All external hosting links verified active</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Explore
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Discover Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apps')} className="hover:text-white transition-colors">
                  All APK Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('categories')} className="hover:text-white transition-colors">
                  Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apps', { trending: true })} className="hover:text-white transition-colors">
                  Top Charts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apps', { featured: true })} className="hover:text-white transition-colors">
                  Featured APKs
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & DMCA */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Legal & Policy
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('dmca')} className="hover:text-white transition-colors">
                  DMCA / Copyright
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Admin */}
          <div>
            <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
              Admin & Portals
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-amber-400 text-amber-300 font-semibold transition-colors">
                  Admin Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('profile')} className="hover:text-white transition-colors">
                  User Profile
                </button>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Open Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>© 2026 ZX9Store. All product names, logos, and brands are property of their respective owners.</p>
          <p className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-semibold text-white/60">Google AI Studio</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
