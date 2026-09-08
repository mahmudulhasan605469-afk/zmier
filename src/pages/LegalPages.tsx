import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

interface LegalPageProps {
  pageType: 'dmca' | 'privacy' | 'terms' | 'contact';
}

export const LegalPages: React.FC<LegalPageProps> = ({ pageType }) => {
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 pb-20 space-y-8">
      {/* 1. DMCA Page */}
      {pageType === 'dmca' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">DMCA & Copyright Compliance Policy</h1>
              <p className="text-xs text-slate-400">Digital Millennium Copyright Act (17 U.S.C. § 512)</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              <strong>ZX9Store</strong> respects the intellectual property rights of others and strictly complies with the Digital Millennium Copyright Act (DMCA) and international copyright legislation.
            </p>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs">Direct Hosting Disclaimer:</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ZX9Store is an index and discovery directory. We do <strong>NOT</strong> host proprietary copyrighted Android binary files on our private servers. All download links direct users to verified external mirrors (e.g. GitHub Releases, Official Developer Mirrors, F-Droid repositories, MediaFire). We do not provide cracks, modified paid apps (MODs), software keygens, or unauthorized copies.
              </p>
            </div>

            <h3 className="text-base font-bold text-white pt-2">Filing a DMCA Takedown Notice</h3>
            <p>
              If you are a copyright owner or an authorized agent and believe that content indexed on ZX9Store infringes upon your copyright, please provide a written notice containing the following details:
            </p>

            <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-400 text-xs">
              <li>A physical or electronic signature of a person authorized to act on behalf of the copyright owner.</li>
              <li>Identification of the copyrighted work claimed to have been infringed.</li>
              <li>Identification of the material that is claimed to be infringing and URL links to where it is located on ZX9Store.</li>
              <li>Your contact information, including physical address, telephone number, and email address.</li>
              <li>A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized.</li>
              <li>A statement under penalty of perjury that the information in the notification is accurate.</li>
            </ul>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
              <span className="text-xs text-slate-400">Designated DMCA Agent:</span>
              <span className="font-mono text-xs text-indigo-400">legal@zx9store.com</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Privacy Policy */}
      {pageType === 'privacy' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Privacy Policy</h1>
              <p className="text-xs text-slate-400">Last updated: August 2026</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              Your privacy is paramount at ZX9Store. This Privacy Policy explains what information we collect, how we protect it, and your rights as a user.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Information We Collect</h3>
            <p>
              We only collect standard information necessary to provide account services, including your chosen username, email address, password hash (encrypted via bcrypt), and app reviews you choose to publish. We do not track or sell personal device information.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. Secure Authentication</h3>
            <p>
              User passwords are cryptographically hashed using salted bcrypt prior to storage. Session authentication tokens (JWT) are handled strictly to keep your session secure.
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Cookies & Local Preferences</h3>
            <p>
              We use local storage only to remember your UI preferences (e.g. Dark/Light mode theme) and to persist your active authentication session.
            </p>

            <h3 className="text-base font-bold text-white pt-2">4. Third-Party Links</h3>
            <p>
              External download mirrors and developer websites linked through our store have independent privacy policies. We encourage reviewing the terms of external repositories.
            </p>
          </div>
        </div>
      )}

      {/* 3. Terms of Service */}
      {pageType === 'terms' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Terms of Service</h1>
              <p className="text-xs text-slate-400">Terms and acceptable usage conditions</p>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              By accessing or using ZX9Store, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our service.
            </p>

            <h3 className="text-base font-bold text-white pt-2">1. Permitted Use</h3>
            <p>
              ZX9Store is provided for personal, non-commercial software discovery. You agree not to abuse the review system with spam, abusive speech, or unauthorized links.
            </p>

            <h3 className="text-base font-bold text-white pt-2">2. Verified Binaries & Software Integrity</h3>
            <p>
              While we verify package signatures and scan checksums (SHA-256), Android applications downloaded via external mirrors should be installed with standard security awareness.
            </p>

            <h3 className="text-base font-bold text-white pt-2">3. Account Moderation</h3>
            <p>
              Store administrators reserve the right to suspend accounts or remove reviews that violate community guidelines.
            </p>
          </div>
        </div>
      )}

      {/* 4. Contact Us */}
      {pageType === 'contact' && (
        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/80 p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 text-purple-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Contact ZX9Store Support</h1>
              <p className="text-xs text-slate-400">Submit developer inquiries, feedback, or mirror requests</p>
            </div>
          </div>

          {isSent ? (
            <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Message Sent Successfully</h3>
              <p className="text-xs text-slate-300">
                Thank you for contacting ZX9Store! Our team will respond to your email within 24–48 hours.
              </p>
              <button
                onClick={() => setIsSent(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Subject / Reason for Inquiry</label>
                <input
                  type="text"
                  required
                  value={contactSubject}
                  onChange={(e) => setContactSubject(e.target.value)}
                  placeholder="e.g. Developer APK submission request / Broken mirror link"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Message</label>
                <textarea
                  rows={5}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Provide package details, error logs, or partnership questions..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-indigo-600/30 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
