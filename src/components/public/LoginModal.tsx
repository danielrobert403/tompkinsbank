import React, { useState } from 'react';
import { useBanking } from '../../context/BankingContext';
import { TompkinsLogo } from '../TompkinsLogo';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, setActivePage } = useBanking();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);

      if (res.success) {
        onClose();
      } else {
        setErrorMessage(res.message);
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex flex-col justify-between items-center animate-in fade-in duration-200">
      {/* Background: Full-screen sunlit forest road wallpaper from uploaded asset */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/assets/aistudio/image_360d8650.png')` }}
      >
        <div className="absolute inset-0 bg-black/15 backdrop-brightness-95"></div>
      </div>

      {/* Top spacer & close button */}
      <div className="relative z-10 w-full max-w-5xl px-4 py-4 flex justify-end">
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-all hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Centered White Card (Exact replica of image_360d8650.png) */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 my-auto bg-white rounded-lg shadow-2xl p-8 sm:p-10 flex flex-col items-center border border-white/60">
        
        {/* Tompkins Logo with Acorn & Oak Leaf */}
        <div className="mb-8 pt-2">
          <TompkinsLogo size="xl" textColor="text-[#004732]" />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="w-full mb-4 p-3 bg-rose-50 border border-rose-200 rounded text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="w-full space-y-6" autoComplete="off">
          {/* Username Field */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Username
            </label>
            <div className="border-b border-slate-300 focus-within:border-[#004732] transition-colors pb-1">
              <input
                type="text"
                placeholder=""
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                required
                autoComplete="off"
                autoCapitalize="none"
                spellCheck="false"
                className="w-full text-slate-800 placeholder-slate-400 text-base py-1 focus:outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="border-b border-slate-300 focus-within:border-[#004732] transition-colors pb-1 flex items-center justify-between">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder=""
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                required
                autoComplete="new-password"
                className="w-full text-slate-800 placeholder-slate-400 text-base py-1 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-800 focus:outline-none ml-2"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Forgot link */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => alert('Password reset verification instructions have been dispatched to registered customer email.')}
              className="text-xs font-bold tracking-wider uppercase text-[#004732] hover:underline"
            >
              FORGOT?
            </button>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 rounded-md bg-[#004732] hover:bg-[#003B26] text-white font-medium text-base shadow-sm transition-all duration-200 hover:shadow disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer: Privacy policy */}
      <footer className="relative z-10 w-full bg-white/95 py-4 text-center shadow-inner border-t border-slate-200/40">
        <a
          href="#privacy"
          onClick={(e) => {
            e.preventDefault();
            alert('Tompkins Community Bank respects your privacy and protects your sensitive financial data with 256-bit encryption.');
          }}
          className="text-xs sm:text-sm font-medium text-[#004732] hover:underline"
        >
          Privacy policy
        </a>
      </footer>
    </div>
  );
};
