import React, { useState } from 'react';
import { User, Lock, Sparkles, Check, Heart, Music, LogOut, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { musicBox, LULLABY_TRACKS } from '../utils/audio';

export function DreamerPassSection() {
  const { user, login, signup, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [seal, setSeal] = useState('⭐ Star Wish');
  const [favoriteLullaby, setFavoriteLullaby] = useState("Pip's Sleepy Starlight Melody");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (activeTab === 'login') {
      const res = await login(username.trim(), password);
      setIsSubmitting(false);
      if (res.success) {
        setSuccess('Welcome back to the Midnight Nursery! ⭐');
        setTimeout(() => setSuccess(null), 4000);
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
        setTimeout(() => setSuccess(null), 4000);
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
      setTimeout(() => setSuccess(null), 4000);
    } else {
      setError(res.error || 'Demo login failed');
    }
  };

  const handlePlayFavorite = () => {
    if (!user) return;
    const trackIdx = LULLABY_TRACKS.findIndex((t) => t.title === user.favoriteLullaby);
    musicBox.setTrack(trackIdx !== -1 ? trackIdx : 0);
    musicBox.start();
  };

  return (
    <section id="auth" className="py-20 md:py-28 relative bg-[#fffaf5] dark:bg-[#1a0f1d] border-b border-[#ecd3c1] dark:border-[#523359]">
      {/* Background celestial sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <span className="absolute top-10 left-[10%] text-amber-300 text-xl">✦</span>
        <span className="absolute top-20 right-[15%] text-pink-300 text-2xl">★</span>
        <span className="absolute bottom-12 left-[20%] text-indigo-300 text-base">✦</span>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div
            className="inline-flex items-center gap-2 mb-3 text-xs sm:text-[13px] font-extrabold uppercase tracking-[0.16em] text-[#a34063] dark:text-[#f49bb8]"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NURSERY AUTHENTICATION & CITIZENSHIP</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <h2
            className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] dark:text-[#f8eef2] tracking-tight mb-4"
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          >
            {user ? 'Your Dreamer Pass is Active ✨' : 'Claim Your Dreamer Pass'}
          </h2>
          <p
            className="text-base sm:text-lg text-[#5a382e] dark:text-[#d4b0be] font-semibold leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            {user
              ? `Welcome back, ${user.nickname || user.username}! Your starry seal is officially recorded in Pip's ledger.`
              : 'Sign in or register your dreamer pass to save your favorite lullaby, claim your dream seal, and sync your wishes.'}
          </p>
        </div>

        {/* Content Box */}
        <div className="max-w-xl mx-auto">
          {user ? (
            /* Logged-In State Card */
            <div
              className="p-8 sm:p-10 rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-xl text-center relative overflow-hidden"
              style={{
                boxShadow: '0 16px 48px rgba(163, 64, 99, 0.16)',
              }}
            >
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-tr from-[#fbcfe8] to-[#fde68a] border-4 border-[#a34063] flex items-center justify-center text-5xl shadow-md mb-4">
                {user.seal ? user.seal.split(' ')[0] : '⭐'}
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3 border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>Verified Midnight Dreamer</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl font-black text-[#38201a] dark:text-[#f8eef2] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                {user.nickname || user.username}
              </h3>
              <span className="text-xs text-[#8b6154] dark:text-[#d4b0be] block mb-6 font-semibold">
                @{user.username}
              </span>

              <div className="grid grid-cols-2 gap-3 text-left bg-white dark:bg-[#2e1c33] p-4 rounded-2xl border border-[#ecd3c1] dark:border-[#523359] text-xs mb-6">
                <div>
                  <span className="text-[#8b6154] dark:text-[#d4b0be] block font-bold">Dream Seal</span>
                  <span className="font-bold text-[#a34063] dark:text-[#f49bb8] text-sm">{user.seal || '⭐ Star Wish'}</span>
                </div>
                <div>
                  <span className="text-[#8b6154] dark:text-[#d4b0be] block font-bold">Favorite Melody</span>
                  <span className="font-bold text-[#38201a] dark:text-[#f8eef2] text-sm truncate block">
                    {user.favoriteLullaby || "Pip's Sleepy Starlight Melody"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayFavorite}
                  className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-white bg-[#a34063] hover:bg-[#862a4b] text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <Music className="w-4 h-4" />
                  <span>Play My Favorite Melody</span>
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="w-full sm:w-auto px-5 py-3 rounded-full font-bold text-red-500 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Logged-Out Authentication Form */
            <div
              className="p-6 sm:p-8 rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-xl overflow-hidden"
              style={{
                boxShadow: '0 16px 48px rgba(163, 64, 99, 0.16)',
              }}
            >
              {/* Tab Selector */}
              <div className="flex border-b border-[#ecd3c1] dark:border-[#523359] bg-[#fff0e5] dark:bg-[#2c1830] p-1.5 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'login'
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
                    setActiveTab('signup');
                    setError(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    activeTab === 'signup'
                      ? 'bg-white dark:bg-[#3d1e44] text-[#a34063] dark:text-[#f49bb8] shadow-xs'
                      : 'text-[#8b6154] dark:text-[#d4b0be] hover:bg-white/40'
                  }`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Create Dreamer Pass (Sign Up)
                </button>
              </div>

              {/* 1-Click Demo Login Banner */}
              {activeTab === 'login' && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-between text-xs mb-5">
                  <span className="text-amber-800 dark:text-amber-300 font-bold">
                    Quick test as certified dreamer?
                  </span>
                  <button
                    type="button"
                    onClick={handleDemoLogin}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs"
                  >
                    1-Click Demo Login ✨
                  </button>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
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

                {/* Nickname (Signup only) */}
                {activeTab === 'signup' && (
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

                {/* Password */}
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
                {activeTab === 'signup' && (
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

                {/* Favorite Lullaby (Signup only) */}
                {activeTab === 'signup' && (
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

                {/* Error feedback */}
                {error && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-semibold animate-fade-in">
                    {error}
                  </div>
                )}

                {/* Success feedback */}
                {success && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 animate-fade-in">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-full font-bold text-white bg-[#a34063] hover:bg-[#862a4b] active:scale-98 transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 text-xs sm:text-sm"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {isSubmitting ? (
                    <span>Connecting to Ledger...</span>
                  ) : activeTab === 'login' ? (
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
          )}
        </div>
      </div>
    </section>
  );
}
