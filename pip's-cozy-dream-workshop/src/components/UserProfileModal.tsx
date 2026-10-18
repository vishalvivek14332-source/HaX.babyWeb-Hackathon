import React from 'react';
import { User, LogOut, Music, Sparkles, X, Heart, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { musicBox, LULLABY_TRACKS } from '../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJukebox: () => void;
}

export function UserProfileModal({ isOpen, onClose, onOpenJukebox }: UserProfileModalProps) {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  const handlePlayFavorite = () => {
    const trackIdx = LULLABY_TRACKS.findIndex((t) => t.title === user.favoriteLullaby);
    if (trackIdx !== -1) {
      musicBox.setTrack(trackIdx);
      musicBox.start();
    } else {
      musicBox.setTrack(0);
      musicBox.start();
    }
    onClose();
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-2xl overflow-hidden text-[#38201a] dark:text-[#f8eef2]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(163, 64, 99, 0.28)',
        }}
      >
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#a34063] to-[#862a4b] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-200" />
            <h3 className="font-bold text-base" style={{ fontFamily: "'Fraunces', serif" }}>
              My Dreamer Pass
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 text-center">
          {/* Avatar Seal */}
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-[#fbcfe8] to-[#fde68a] border-3 border-[#a34063] flex items-center justify-center text-4xl shadow-md mb-3">
            {user.seal ? user.seal.split(' ')[0] : '⭐'}
          </div>

          <h4 className="font-editorial text-xl font-black text-[#38201a] dark:text-[#f8eef2]" style={{ fontFamily: "'Fraunces', serif" }}>
            {user.nickname || user.username}
          </h4>
          <span className="text-xs text-[#8b6154] dark:text-[#d4b0be] block mb-4">
            @{user.username} • Certified Dreamer
          </span>

          <div className="space-y-2.5 text-left bg-white/80 dark:bg-[#2e1c33]/80 rounded-2xl p-4 border border-[#ecd3c1] dark:border-[#523359] text-xs mb-5">
            <div className="flex items-center justify-between">
              <span className="text-[#8b6154] dark:text-[#d4b0be] font-bold">Dream Seal:</span>
              <span className="font-bold text-[#a34063] dark:text-[#f49bb8]">{user.seal || '⭐ Star Wish'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[#8b6154] dark:text-[#d4b0be] font-bold">Favorite Melody:</span>
              <span className="font-bold text-[#38201a] dark:text-[#f8eef2] truncate max-w-[160px]">
                {user.favoriteLullaby || "Pip's Sleepy Starlight Melody"}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handlePlayFavorite}
              className="w-full py-2.5 rounded-full font-bold text-white bg-[#a34063] hover:bg-[#862a4b] text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Play My Favorite Melody</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenJukebox();
              }}
              className="w-full py-2.5 rounded-full font-bold text-[#38201a] dark:text-[#f8eef2] bg-[#fff0e5] dark:bg-[#381c3e] border border-[#ecd3c1] hover:bg-[#fce7ed] text-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <span>Browse Full 6-Music Set 🎶</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-full font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Dreamland</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
