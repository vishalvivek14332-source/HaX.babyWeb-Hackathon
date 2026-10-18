import React, { useState, useEffect } from 'react';
import { Sparkles, Heart, Moon, Star, X, Edit3, Check } from 'lucide-react';

export function VisitorMemoryToast() {
  const [visitCount, setVisitCount] = useState(1);
  const [visitorName, setVisitorName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const storedCount = parseInt(localStorage.getItem('pip_visit_count') || '0', 10);
      const newCount = storedCount + 1;
      localStorage.setItem('pip_visit_count', newCount.toString());
      setVisitCount(newCount);

      const storedName = localStorage.getItem('pip_visitor_name') || '';
      setVisitorName(storedName);
      setTempName(storedName);

      // Show toast with gentle delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);

      return () => clearTimeout(timer);
    } catch {
      // LocalStorage unavailable
      setVisitCount(1);
    }
  }, []);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tempName.trim().slice(0, 30);
    setVisitorName(clean);
    setIsEditingName(false);
    try {
      localStorage.setItem('pip_visitor_name', clean);
    } catch {
      // Ignore
    }
  };

  if (!isVisible || isDismissed) return null;

  return (
    <aside
      aria-label="Pip's Welcome Greeting"
      className="fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)] rounded-3xl p-4 sm:p-5 bg-[#fff8f1]/95 dark:bg-[#231526]/95 backdrop-blur-md border-2 border-[#ecd3c1] dark:border-[#523359] shadow-2xl transition-all duration-500 animate-slide-up"
      style={{
        boxShadow: '0 12px 36px rgba(163, 64, 99, 0.18)',
      }}
    >
      <div className="flex items-start gap-3.5">
        {/* Pip Avatar Icon */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#ffebe2] dark:bg-[#381c3e] border border-[#ecd3c1] shrink-0 shadow-xs">
          <img
            src="artwork/pip_card_personality_v2.png"
            alt="Pip greeting you"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[#a34063] dark:text-[#f49bb8] text-xs font-bold uppercase tracking-wider">
                {visitCount === 1 ? '✨ First-Time Dreamer' : `🌙 Visit #${visitCount}`}
              </span>
            </div>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[#8b6154] hover:text-[#38201a] dark:text-[#d4b0be] dark:hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss greeting"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Personalized Message */}
          {isEditingName ? (
            <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="What's your dream name?"
                className="w-full text-xs px-2.5 py-1.5 rounded-xl border border-[#ecd3c1] bg-white text-[#38201a] focus:outline-hidden focus:border-[#a34063]"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 rounded-xl bg-[#a34063] text-white text-xs font-bold hover:bg-[#8b3452] cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div>
              <p
                className="text-xs sm:text-sm font-semibold text-[#38201a] dark:text-[#f8eef2] leading-snug"
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {visitCount === 1 ? (
                  <>
                    "Welcome, new dreamer! I'm Pip. I keep the night warm and lullabies soft for your sleep."
                  </>
                ) : visitorName ? (
                  <>
                    "Welcome back, <span className="text-[#a34063] dark:text-[#f49bb8] font-bold">{visitorName}</span>! Pip kept your star warm on the cloud windowsill!"
                  </>
                ) : (
                  <>
                    "You returned! Pip is so delighted to see you again for visit #{visitCount}!"
                  </>
                )}
              </p>

              <div className="flex items-center gap-3 mt-2.5">
                <button
                  onClick={() => setIsEditingName(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#a34063] dark:text-[#f49bb8] hover:underline cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{visitorName ? 'Change Name' : 'Set My Dreamer Name'}</span>
                </button>
                <span className="text-[11px] text-[#8b6154] dark:text-[#bda2af]">•</span>
                <span className="text-[11px] text-[#8b6154] dark:text-[#bda2af]">Sweet dreams ✨</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
