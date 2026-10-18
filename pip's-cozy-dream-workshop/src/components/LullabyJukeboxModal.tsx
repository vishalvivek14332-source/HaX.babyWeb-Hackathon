import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music, Sparkles, Heart, X } from 'lucide-react';
import { musicBox, LULLABY_TRACKS, MelodyTrack } from '../utils/audio';
import { LullabyState } from '../types';

interface LullabyJukeboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  lullabyState: LullabyState;
  onToggleLullaby: () => void;
  onToggleMute: () => void;
}

export function LullabyJukeboxModal({
  isOpen,
  onClose,
  lullabyState,
  onToggleLullaby,
  onToggleMute,
}: LullabyJukeboxModalProps) {
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.65);
  const [favoriteTrackId, setFavoriteTrackId] = useState<string>(() => {
    try {
      return localStorage.getItem('pip_fav_lullaby') || 'brahms';
    } catch {
      return 'brahms';
    }
  });

  useEffect(() => {
    const unsub = musicBox.subscribe((st) => {
      setActiveTrackIndex(st.currentTrackIndex);
      setVolume(st.volume);
    });
    return () => unsub();
  }, []);

  const handleSelectTrack = (index: number) => {
    musicBox.setTrack(index);
    if (!lullabyState.isPlaying) {
      musicBox.start();
    }
    musicBox.playNamedNote('C5', 0.4);
  };

  const handleNext = () => {
    musicBox.nextTrack();
    if (!lullabyState.isPlaying) musicBox.start();
  };

  const handlePrev = () => {
    musicBox.prevTrack();
    if (!lullabyState.isPlaying) musicBox.start();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    musicBox.setVolume(val);
  };

  const handleToggleFavorite = (trackId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteTrackId(trackId);
    try {
      localStorage.setItem('pip_fav_lullaby', trackId);
    } catch {
      // Ignore
    }
    musicBox.playNamedNote('G5', 0.5);
  };

  if (!isOpen) return null;

  const currentTrack: MelodyTrack = LULLABY_TRACKS[activeTrackIndex] || LULLABY_TRACKS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[92vh] rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] shadow-2xl flex flex-col overflow-hidden text-[#38201a] dark:text-[#f8eef2]"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 20px 60px rgba(163, 64, 99, 0.25)',
        }}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#a34063] via-[#8c3352] to-[#71223e] text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-xl shadow-xs">
              🎵
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-200 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>MIDNIGHT NURSERY JUKEBOX</span>
              </div>
              <h3
                className="font-editorial text-xl sm:text-2xl font-black tracking-wide"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Bedtime Melodies & Lullabies
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Jukebox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Active Player Controller Card */}
        <div className="p-4 sm:p-5 bg-[#fff0e5] dark:bg-[#2c1830] border-b border-[#ecd3c1] dark:border-[#523359] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0">
              {/* Spinning/pulsing disk icon */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#fbcfe8] to-[#fde68a] border-2 border-[#a34063] flex items-center justify-center text-2xl shadow-xs shrink-0 ${
                  lullabyState.isPlaying ? 'animate-spin-slow' : ''
                }`}
              >
                🎶
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-extrabold tracking-wider text-[#a34063] dark:text-[#f49bb8] block">
                  {currentTrack.category} • {currentTrack.tempo} BPM
                </span>
                <h4
                  className="font-editorial text-base sm:text-lg font-bold truncate text-[#38201a] dark:text-[#f8eef2]"
                  style={{ fontFamily: "'Fraunces', serif" }}
                >
                  {currentTrack.title}
                </h4>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center gap-3 self-center sm:self-auto">
              {/* Prev */}
              <button
                type="button"
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#3d1e44] border border-[#ecd3c1] dark:border-[#523359] text-[#a34063] dark:text-[#f49bb8] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Previous Melody"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              {/* Play / Pause Main Button */}
              <button
                type="button"
                onClick={onToggleLullaby}
                className="px-5 py-2.5 rounded-full bg-[#a34063] hover:bg-[#862a4b] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {lullabyState.isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Play Tune</span>
                  </>
                )}
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-white dark:bg-[#3d1e44] border border-[#ecd3c1] dark:border-[#523359] text-[#a34063] dark:text-[#f49bb8] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Next Melody"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              {/* Mute button */}
              <button
                type="button"
                onClick={onToggleMute}
                className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-2xs ${
                  lullabyState.isMuted
                    ? 'bg-red-100 text-red-600 border-red-300'
                    : 'bg-white dark:bg-[#3d1e44] text-[#8b6154] dark:text-[#f8eef2] border-[#ecd3c1]'
                }`}
                title={lullabyState.isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {lullabyState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Volume Slider Bar */}
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-[#ecd3c1]/60 dark:border-[#523359]/60 text-xs">
            <span className="text-[11px] font-bold text-[#8b6154] dark:text-[#d4b0be]">Volume:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-32 sm:w-48 h-1.5 bg-[#ecd3c1] rounded-lg appearance-none cursor-pointer accent-[#a34063]"
            />
            <span className="text-[11px] font-bold text-[#a34063] dark:text-[#f49bb8]">
              {Math.round(volume * 100)}%
            </span>
            {lullabyState.isPlaying && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Playing Chimes ✨</span>
              </span>
            )}
          </div>
        </div>

        {/* Scrollable Tracklist */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8b6154] dark:text-[#d4b0be]">
              All Available Melodies ({LULLABY_TRACKS.length} Set)
            </span>
            <span className="text-[11px] text-[#8b6154] dark:text-[#d4b0be]">
              Synthesized with Web Audio API
            </span>
          </div>

          {LULLABY_TRACKS.map((track, idx) => {
            const isCurrent = activeTrackIndex === idx;
            const isFavorite = favoriteTrackId === track.id;

            return (
              <div
                key={track.id}
                onClick={() => handleSelectTrack(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                  isCurrent
                    ? 'bg-[#fce7ed] dark:bg-[#431d3e] border-[#a34063] shadow-xs'
                    : 'bg-white dark:bg-[#2b1730] border-[#ecd3c1] dark:border-[#523359] hover:border-[#a34063]/50 hover:bg-[#fffaf5]'
                }`}
              >
                {/* Track Index & Title */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                      isCurrent
                        ? 'bg-[#a34063] text-white shadow-xs'
                        : 'bg-[#fff0e5] dark:bg-[#3d1e44] text-[#8b6154] dark:text-[#d4b0be]'
                    }`}
                  >
                    {isCurrent && lullabyState.isPlaying ? '▶' : `0${idx + 1}`}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-bold text-sm sm:text-base text-[#38201a] dark:text-[#f8eef2] truncate">
                        {track.title}
                      </h5>
                      {isFavorite && (
                        <span className="px-1.5 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300 text-[10px] font-bold shrink-0">
                          ♥ Fav
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#5a382e] dark:text-[#d4b0be] line-clamp-1">
                      {track.description}
                    </p>
                  </div>
                </div>

                {/* Right Actions: Favorite Heart & Play indicator */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(track.id, e)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isFavorite
                        ? 'text-pink-600 bg-pink-50 border-pink-200'
                        : 'text-[#8b6154] hover:text-pink-600 border-transparent hover:bg-pink-50'
                    }`}
                    title={isFavorite ? 'Your favorite melody' : 'Set as favorite'}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                      isCurrent && lullabyState.isPlaying
                        ? 'bg-[#a34063] text-white shadow-xs'
                        : 'bg-[#fff0e5] dark:bg-[#3d1e44] text-[#8b6154] dark:text-[#d4b0be] group-hover:bg-[#a34063] group-hover:text-white'
                    }`}
                  >
                    {isCurrent && lullabyState.isPlaying ? 'Playing' : 'Listen'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-[#fff8f1] dark:bg-[#1f1022] border-t border-[#ecd3c1] dark:border-[#523359] text-center text-xs text-[#8b6154] dark:text-[#d4b0be] flex items-center justify-between px-5">
          <span>✨ Pip weaves each note from soft starlight</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-[#ecd3c1] dark:bg-[#3d1e44] text-[#38201a] dark:text-[#f8eef2] font-bold text-xs hover:bg-[#a34063] hover:text-white transition-colors cursor-pointer"
          >
            Close Jukebox
          </button>
        </div>
      </div>
    </div>
  );
}
