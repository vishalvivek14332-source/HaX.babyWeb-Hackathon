import React, { useState } from 'react';
import { User, Lock, Sparkles, X, Heart, Star, Moon, Cloud, Music, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LULLABY_TRACKS } from '../utils/audio';

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, openAuthModal, closeAuthModal, login, signup } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [seal, setSeal] = useState('⭐ Star Wish');
  const [favoriteLullaby, setFavoriteLullaby] = useState("Pip's Sleepy Starlight Melody");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const seals = [
    { label: '⭐ Star Wish', icon: '⭐' },
    { label: '🌙 Moon Blessing', icon: '🌙' },
    { label: '☁️ Cloud Hug', icon: '☁️' },
    { label: '🎵 Tiny Lullaby', icon: '🎵' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(username.trim(), password);
      setIsSubmitting(false);
      if (res.success) {
        setSuccess('Welcome back to the Midnight Nursery! ⭐');
        setTimeout(() => {
          closeAuthModal();
        }, 800);
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } else {
      const res = await signup({
        username: username.trim(),
        password,
        nickname: nickname.trim() || username.trim(),
        seal,
        favoriteLullaby,
      });
      setIsSubmitting(false);
      if (res.success) {
        setSuccess('Your Dreamer Pass has been inscribed! Welcome to Pip\'s world ✨');
        setTimeout(() => {
          closeAuthModal();
        }, 900);
      } else {
        setError(res.error || 'Failed to sign up');
      }
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    const res = await login('dreamer', 'password');
    setIsSubmitting(false);
    if (res.success) {
      setSuccess('Logged in as demo dreamer Luna Starweaver! ✨');
      setTimeout(() => closeAuthModal(), 800);
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={closeAuthModal}
    >
      <div
        className="relative max-w-md w-full rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-2xl overflow-hidden text-[#38201a] dark:text-[#f8eef2]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(163, 64, 99, 0.28)',
        }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#a34063] via-[#8c3352] to-[#71223e] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl shadow-xs">
              {isLogin ? '🔑' : '✨'}
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NURSERY PASS</span>
              </div>
              <h3
                className="font-editorial text-xl font-bold tracking-wide"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {isLogin ? 'Sign In to Your Dream Journal' : 'Create Your Dreamer Pass'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#ecd3c1] dark:border-[#523359] bg-[#fff0e5] dark:bg-[#2c1830] p-1.5">
          <button
            type="button"
            onClick={() => {
              openAuthModal('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isLogin
                ? 'bg-white dark:bg-[#3d1e44] text-[#a34063] dark:text-[#f49bb8] shadow-xs'
                : 'text-[#8b6154] dark:text-[#d4b0be] hover:bg-white/40'
            }`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              openAuthModal('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isLogin
                ? 'bg-white dark:bg-[#3d1e44] text-[#a34063] dark:text-[#f49bb8] shadow-xs'
                : 'text-[#8b6154] dark:text-[#d4b0be] hover:bg-white/40'
            }`}
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Create Dreamer Pass (Sign Up)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5">
          {/* Quick Demo Login Pill */}
          {isLogin && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs">
              <span className="text-amber-800 dark:text-amber-300 font-semibold">
                Want to try right now?
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] cursor-pointer shadow-xs"
              >
                1-Click Demo Login
              </button>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#a34063] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. starlight_dreamer"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#1a0f1d] border border-[#ecd3c1] dark:border-[#523359] text-xs sm:text-sm text-[#38201a] dark:text-[#f8eef2] placeholder-[#8b6154]/60 focus:outline-hidden focus:border-[#a34063]"
              />
            </div>
          </div>

          {/* Nickname Field (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be] mb-1">
                Dreamer Nickname
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g. Dreamer Luna, Sleepy Rowan"
                maxLength={30}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1a0f1d] border border-[#ecd3c1] dark:border-[#523359] text-xs sm:text-sm text-[#38201a] dark:text-[#f8eef2] placeholder-[#8b6154]/60 focus:outline-hidden focus:border-[#a34063]"
              />
            </div>
          )}

          {/* Password Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#a34063] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#1a0f1d] border border-[#ecd3c1] dark:border-[#523359] text-xs sm:text-sm text-[#38201a] dark:text-[#f8eef2] placeholder-[#8b6154]/60 focus:outline-hidden focus:border-[#a34063]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8b6154] hover:text-[#a34063] cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Dream Seal Picker (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be] mb-1">
                Choose Your Dream Seal
              </label>
              <div className="grid grid-cols-2 gap-2">
                {seals.map((s) => (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => setSeal(s.label)}
                    className={`py-2 px-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer flex items-center gap-1.5 ${
                      seal === s.label
                        ? 'border-[#a34063] bg-[#fce7ed] dark:bg-[#431d3e] font-bold text-[#a34063] dark:text-[#f49bb8]'
                        : 'border-[#ecd3c1] dark:border-[#523359] bg-white dark:bg-[#1a0f1d] hover:bg-[#fff0e5]'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Lullaby Picker (Signup only) */}
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be] mb-1">
                Favorite Bedtime Melody
              </label>
              <select
                value={favoriteLullaby}
                onChange={(e) => setFavoriteLullaby(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#1a0f1d] border border-[#ecd3c1] dark:border-[#523359] text-xs font-semibold text-[#38201a] dark:text-[#f8eef2] focus:outline-hidden focus:border-[#a34063]"
              >
                {LULLABY_TRACKS.map((t) => (
                  <option key={t.id} value={t.title}>
                    {t.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Feedback Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold animate-fade-in">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-full font-bold text-white bg-[#a34063] hover:bg-[#862a4b] active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {isSubmitting ? (
              <span>Connecting to Ledger...</span>
            ) : isLogin ? (
              <>
                <span>Sign In to Dreamland</span>
                <span>→</span>
              </>
            ) : (
              <>
                <span>Inscribe Dreamer Pass</span>
                <span>★</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
