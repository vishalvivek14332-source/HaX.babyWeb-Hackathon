import React, { useState, useEffect } from 'react';
import { Menu, X, Music, User, Sparkles } from 'lucide-react';
import { DreamMode, LullabyState } from '../types';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  dreamMode: DreamMode;
  onToggleDreamMode: () => void;
  lullabyState: LullabyState;
  onToggleLullaby: () => void;
  onToggleMute: () => void;
  onOpenJukebox: () => void;
  onOpenProfile: () => void;
}

export function Navigation({
  dreamMode,
  onToggleDreamMode,
  lullabyState,
  onToggleLullaby,
  onToggleMute,
  onOpenJukebox,
  onOpenProfile,
}: NavigationProps) {
  const { user, openAuthModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { id: 'home', label: 'Home', href: '#hero' },
    { id: 'about', label: 'About', href: '#meet-pip' },
    { id: 'creations', label: 'Creations', href: '#creations' },
    { id: 'story', label: 'Story', href: '#origin-story' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'wishes', label: 'Wishes', href: '#guestbook' },
    { id: 'auth', label: 'Dreamer Pass', href: '#auth' },
  ];

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY < 400) {
        setActiveSection('home');
        return;
      }

      for (let i = navLinks.length - 1; i >= 1; i--) {
        const el = document.querySelector(navLinks[i].href);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(navLinks[i].id);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(id);

    if (href === '#hero' || href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-3.5 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className="pointer-events-auto w-full max-w-[1180px] flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 rounded-full transition-all duration-300"
        style={{
          background: 'rgba(255, 245, 237, 0.94)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '2px solid #ecd3c1',
          boxShadow: '0 12px 32px rgba(56, 32, 26, 0.12), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
        }}
      >
        {/* Left: Brand Logo (Exactly as in heronew.png) */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero', 'home')}
          className="flex flex-col items-start leading-none group text-[#38201a] no-underline focus:outline-none select-none pl-1"
          aria-label="Pip's Cozy Dream Workshop"
        >
          <div className="flex items-center gap-1 sm:gap-1.5 leading-none">
            <span className="text-[#e5a93c] text-xs sm:text-sm">★</span>
            <span
              className="text-xl sm:text-2xl font-extrabold text-[#38201a] tracking-tight group-hover:text-[#a34063] transition-colors"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Pip's
            </span>
            <span className="text-[#e5a93c] text-xs sm:text-sm">★</span>
          </div>
          <span
            className="text-[10px] sm:text-[11px] font-bold text-[#38201a] tracking-tight pl-0.5 mt-0.5"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Cozy Dream Workshop
          </span>
        </a>

        {/* Center: Menu Links (Exact styling from heronew.png) */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`text-[0.93rem] font-bold rounded-full transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-[#e8a5b2] text-[#4a2228] px-5 py-1.5 shadow-xs'
                    : 'text-[#4a2c26] hover:text-[#a34063] hover:bg-[#e8a5b2]/20 px-3.5 py-1.5'
                }`}
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {link.label}
              </a>
            );
          })}
        </div>

        {/* Right: Jukebox + Auth + Dream Mode Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Music Jukebox Trigger Button */}
          <button
            type="button"
            onClick={onOpenJukebox}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-bold text-xs bg-[#fce7ed] text-[#a34063] border border-[#f5c6d3] hover:bg-[#fbcfe8] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
            style={{ fontFamily: "'Outfit', sans-serif" }}
            title="Open Bedtime Melodies Jukebox (Set of 6 musics)"
          >
            <span className={lullabyState.isPlaying ? 'animate-bounce' : ''}>🎵</span>
            <span className="hidden sm:inline">Melodies (6)</span>
            {lullabyState.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#a34063] animate-ping" />
            )}
          </button>

          {/* Dreamer Pass Auth Button */}
          {user ? (
            <button
              type="button"
              onClick={onOpenProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold text-xs bg-[#fff0e5] text-[#46251e] border border-[#ecd3c1] hover:border-[#a34063] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              title="View your Dreamer Pass profile"
            >
              <span className="text-sm">{user.seal ? user.seal.split(' ')[0] : '⭐'}</span>
              <span className="max-w-[70px] sm:max-w-[100px] truncate">{user.nickname || user.username}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full font-bold text-xs bg-[#fff8f1] text-[#a34063] border border-[#ecd3c1] hover:bg-[#fce7ed] hover:border-[#a34063] hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xs"
              style={{ fontFamily: "'Outfit', sans-serif" }}
              title="Sign in or create a Dreamer Pass"
            >
              <span>🔑</span>
              <span>Sign In</span>
            </button>
          )}

          {/* Dream Mode Toggle */}
          <button
            onClick={onToggleDreamMode}
            type="button"
            aria-label="Toggle Dream Mode"
            className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-[0.85rem] text-[#fff6ee] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 cursor-pointer shadow-md"
            style={{
              backgroundColor: '#46251e',
              fontFamily: "'Outfit', sans-serif",
              boxShadow: '0 4px 14px rgba(70, 37, 30, 0.28)',
            }}
          >
            <span className="text-[#e5a93c] text-sm leading-none">🌙</span>
            <span className="hidden sm:inline">{dreamMode === 'day' ? 'Dream Mode' : 'Cozy Day'}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden p-1.5 rounded-full text-[#38201a] hover:bg-[#ecd3c1]/40 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="md:hidden pointer-events-auto absolute top-full mt-2 w-[calc(100%-2rem)] max-w-sm rounded-2xl p-4 shadow-xl border border-[#ecd3c1] flex flex-col gap-2 transition-all duration-300 animate-fade-in"
          style={{
            background: 'rgba(255, 245, 237, 0.98)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href, link.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#e8a5b2] text-[#4a2228]'
                    : 'text-[#4a2c26] hover:bg-[#e8a5b2]/20'
                }`}
                style={{ fontFamily: "'Quicksand', sans-serif" }}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}
