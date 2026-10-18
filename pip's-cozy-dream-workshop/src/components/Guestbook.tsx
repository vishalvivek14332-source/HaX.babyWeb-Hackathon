import React, { useState, useEffect } from 'react';
import { Send, Heart, Star, Moon, Cloud, CheckCircle, Sparkles, Trash2, User } from 'lucide-react';
import { GuestbookEntry } from '../types';
import { useAuth } from '../context/AuthContext';

const INITIAL_WORKSHOP_LOGS: GuestbookEntry[] = [
  {
    id: 'log-1',
    name: 'Pip (Dream Engineer)',
    message: 'Welcome to my little workshop! Leave a bedtime wish before you sleep, and I will pack a warm star for your dreams.',
    seal: '⭐ Star Wish',
    date: 'Midnight Nursery Ledger',
    isLocalOnly: false,
  },
  {
    id: 'log-2',
    name: 'Sleepy Cloudlet #07',
    message: 'Thank you for the warm B-flat lullaby. All the little storm clouds turned into lavender puffballs.',
    seal: '☁️ Cloud Hug',
    date: 'Yesterday at Twilight',
    isLocalOnly: false,
  },
];

export function Guestbook() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('pip_guestbook_wishes');
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_WORKSHOP_LOGS;
  });

  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('pip_visitor_name') || '';
    } catch {
      return '';
    }
  });

  // Sync with logged in user
  useEffect(() => {
    if (user) {
      if (user.nickname || user.username) {
        setName(user.nickname || user.username);
      }
      if (user.seal) {
        setSelectedSeal(user.seal);
      }
    }
  }, [user]);

  const [message, setMessage] = useState('');
  const [selectedSeal, setSelectedSeal] = useState('⭐ Star Wish');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Fetch from real backend API on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/wishes')
      .then((res) => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setEntries(data);
          setIsBackendConnected(true);
          try {
            localStorage.setItem('pip_guestbook_wishes', JSON.stringify(data));
          } catch {
            // Ignore
          }
        }
      })
      .catch(() => {
        // Fallback to local storage (e.g. static hosting)
        setIsBackendConnected(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('pip_guestbook_wishes', JSON.stringify(entries));
    } catch {
      // Storage unavailable
    }
  }, [entries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedName = name.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName) {
      setErrorMessage('Please enter your name or a bedtime nickname.');
      return;
    }

    if (!trimmedMessage || trimmedMessage.length < 3) {
      setErrorMessage('Please write a bedtime wish (at least 3 characters).');
      return;
    }

    if (trimmedMessage.length > 200) {
      setErrorMessage('Bedtime wishes must be under 200 characters.');
      return;
    }

    setIsSubmitting(true);

    // Save visitor name into memory
    try {
      localStorage.setItem('pip_visitor_name', trimmedName);
    } catch {
      // Ignore
    }

    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          message: trimmedMessage,
          seal: selectedSeal,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          setEntries((prev) => [data.entry, ...prev.filter((item) => item.id !== data.entry.id)]);
          setIsBackendConnected(true);
        }
        setMessage('');
        setIsSubmitting(false);
        setSuccessMessage('Your wish was delivered live to Pip\'s Midnight Nursery ledger! ⭐');
        setTimeout(() => setSuccessMessage(null), 5000);
        return;
      }
    } catch {
      // Fallback local save
    }

    // Local fallback if backend unavailable
    const newEntry: GuestbookEntry = {
      id: `wish-${Date.now()}`,
      name: trimmedName,
      message: trimmedMessage,
      seal: selectedSeal,
      date: 'Just now in local dream journal',
      isLocalOnly: true,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setMessage('');
    setIsSubmitting(false);
    setSuccessMessage('Your bedtime wish was saved safely in your dream journal! ✨');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleClearLocalWishes = () => {
    setEntries(INITIAL_WORKSHOP_LOGS);
    try {
      localStorage.removeItem('pip_guestbook_wishes');
    } catch {
      // Ignore
    }
  };

  const seals = [
    { label: '⭐ Star Wish' },
    { label: '🌙 Moon Blessing' },
    { label: '☁️ Cloud Hug' },
    { label: '🎵 Tiny Lullaby' },
  ];

  return (
    <section id="guestbook" className="py-16 md:py-24 border-b border-[var(--border-subtle)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent-primary)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>NURSERY GUESTBOOK</span>
          </div>
          <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text-main)] mb-4">
            Leave a Bedtime Wish
          </h2>
          <p className="text-[var(--text-muted)] text-base sm:text-lg leading-relaxed">
            Send a peaceful thought into the night. Pip keeps these warm in the workshop dream journal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Form */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-editorial text-xl font-bold text-[var(--text-main)]">
                  Inscribe Your Wish
                </h3>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isBackendConnected
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{isBackendConnected ? 'Live Ledger' : 'Local Journal'}</span>
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-6">
                Wishes are synchronized with Pip's Midnight Nursery ledger and preserved in your bedtime journal.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="guest-name" className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1.5">
                    Your Name or Sleepy Moniker
                  </label>
                  <input
                    id="guest-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dreamer Luna, Sleepy Rowan"
                    maxLength={40}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/20 text-sm text-[var(--text-main)] placeholder-[var(--text-soft)] transition-all outline-none"
                  />
                </div>

                {/* Seal / Badge Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)] mb-1.5">
                    Choose a Dream Seal
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {seals.map((s) => (
                      <button
                        type="button"
                        key={s.label}
                        onClick={() => setSelectedSeal(s.label)}
                        className={`py-2 px-2.5 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                          selectedSeal === s.label
                            ? 'border-[var(--border-focus)] bg-[var(--bg-surface-elevated)] font-semibold text-[var(--accent-primary)] shadow-xs'
                            : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:bg-[var(--bg-surface-soft)]'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="guest-message" className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">
                      Your Bedtime Wish
                    </label>
                    <span className="text-[10px] text-[var(--text-soft)]">
                      {message.length}/200
                    </span>
                  </div>
                  <textarea
                    id="guest-message"
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="May tonight bring soft blankets and quiet stars..."
                    maxLength={200}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus:border-[var(--border-focus)] focus:ring-2 focus:ring-[var(--border-focus)]/20 text-sm text-[var(--text-main)] placeholder-[var(--text-soft)] transition-all outline-none resize-none"
                  />
                </div>

                {/* Error & Success Feedback */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500 font-medium">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl font-medium text-white bg-[var(--accent-primary)] hover:opacity-95 active:scale-98 focus:outline-none focus:ring-2 focus:ring-[var(--border-focus)] transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Tucking in Wish…' : 'Seal & Send Wish'}</span>
                </button>
              </form>

              {/* Local Storage Disclaimer */}
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-soft)]">
                <span>Stored locally in this browser</span>
                {entries.some((e) => e.isLocalOnly) && (
                  <button
                    onClick={handleClearLocalWishes}
                    className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear my wishes</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Ledger Stream */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-editorial text-xl font-bold text-[var(--text-main)]">
                  Workshop Dream Journal
                </h3>
                <span className="text-xs text-[var(--text-soft)]">
                  {entries.length} recorded {entries.length === 1 ? 'wish' : 'wishes'}
                </span>
              </div>

              <div className="space-y-4 max-h-[480px] overflow-y-auto pr-2">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-editorial font-bold text-sm text-[var(--text-main)]">
                          {entry.name}
                        </span>
                        {entry.isLocalOnly && (
                          <span className="text-[10px] text-[var(--accent-primary)] font-semibold">
                            (Your Wish)
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-[var(--text-soft)]">
                        {entry.seal}
                      </span>
                    </div>

                    <p className="text-sm text-[var(--text-muted)] font-serif italic leading-relaxed mb-2">
                      “{entry.message}”
                    </p>

                    <div className="text-[10px] text-[var(--text-soft)]">
                      {entry.date}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
