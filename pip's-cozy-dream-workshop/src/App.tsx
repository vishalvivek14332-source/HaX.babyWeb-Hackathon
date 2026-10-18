import React, { useState, useEffect } from 'react';
import { DreamMode, LullabyState } from './types';
import { musicBox } from './utils/audio';
import { AuthProvider } from './context/AuthContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { MeetPip } from './components/MeetPip';
import { CreationsSection } from './components/Creations/CreationsSection';
import { OriginStory } from './components/OriginStory';
import { Gallery } from './components/Gallery';
import { Guestbook } from './components/Guestbook';
import { Footer } from './components/Footer';
import { EasterEggModal } from './components/EasterEggModal';
import { StarlightCursor } from './components/StarlightCursor';
import { VisitorMemoryToast } from './components/VisitorMemoryToast';
import { PipChatCompanion } from './components/PipChatCompanion';
import { LullabyJukeboxModal } from './components/LullabyJukeboxModal';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { DreamerPassSection } from './components/DreamerPassSection';

export default function App() {
  // 1. Dream Mode (Theme state: Cozy Daydream vs Midnight Dream)
  const [dreamMode, setDreamMode] = useState<DreamMode>(() => {
    try {
      const saved = localStorage.getItem('pip_dream_mode');
      if (saved === 'day' || saved === 'night') return saved;
    } catch {
      // Storage unavailable
    }
    return 'day'; // Default to Cozy Daydream
  });

  // 2. Lullaby Audio State (Web Audio music box)
  const [lullabyState, setLullabyState] = useState<LullabyState>({
    isPlaying: false,
    isMuted: false,
    volume: 0.65,
    currentTrackTitle: "Pip's Sleepy Starlight Melody",
  });

  // 3. Modal States
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);
  const [isJukeboxOpen, setIsJukeboxOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Sync theme with DOM and localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pip_dream_mode', dreamMode);
    } catch {
      // Ignore
    }
    const root = document.documentElement;
    if (dreamMode === 'night') {
      root.classList.remove('theme-day');
      root.classList.add('theme-night');
    } else {
      root.classList.remove('theme-night');
      root.classList.add('theme-day');
    }
  }, [dreamMode]);

  // Subscribe to real-time musicBox audio state
  useEffect(() => {
    const unsubscribe = musicBox.subscribe((st) => {
      setLullabyState((prev) => ({
        ...prev,
        isPlaying: st.isPlaying,
        isMuted: st.isMuted,
        volume: st.volume,
        currentTrackTitle: st.currentTrackTitle,
        currentTrackId: st.currentTrackId,
        currentTrackIndex: st.currentTrackIndex,
      }));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleToggleDreamMode = () => {
    setDreamMode((prev) => (prev === 'day' ? 'night' : 'day'));
  };

  const handleToggleLullaby = () => {
    musicBox.toggle();
  };

  const handleToggleMute = () => {
    musicBox.toggleMute();
  };

  const handleEasterEggTrigger = () => {
    setIsEasterEggOpen(true);
  };

  return (
    <AuthProvider>
      <div className={`min-h-screen ${dreamMode === 'night' ? 'theme-night' : 'theme-day'} transition-colors duration-500 relative`}>
        {/* Tier 2: Flashlight / Nightlight Starlight Cursor */}
        <StarlightCursor dreamMode={dreamMode} />

        {/* Top Floating Pill Navigation with Jukebox and Auth controls */}
        <Navigation
          dreamMode={dreamMode}
          onToggleDreamMode={handleToggleDreamMode}
          lullabyState={lullabyState}
          onToggleLullaby={handleToggleLullaby}
          onToggleMute={handleToggleMute}
          onOpenJukebox={() => setIsJukeboxOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Main Content Landmark */}
        <main>
          {/* Section 1: Hero Section with Day/Night Mood Expression */}
          <Hero
            lullabyState={lullabyState}
            onToggleLullaby={handleToggleLullaby}
            onEasterEggTrigger={handleEasterEggTrigger}
            dreamMode={dreamMode}
          />

          {/* Section 2: About Pip Section with 3D model, cursor tracking & Day/Night expression */}
          <MeetPip dreamMode={dreamMode} />

          {/* Section 3: Creations / Projects Section with SVG route map, falling dreams game & Jukebox trigger */}
          <CreationsSection
            lullabyState={lullabyState}
            onToggleLullaby={handleToggleLullaby}
            onOpenJukebox={() => setIsJukeboxOpen(true)}
          />

          {/* Section 4: Origin Story Section with Scroll-Driven story & 3D Interactive Storybook */}
          <OriginStory />

          {/* Section 5: Gallery Section */}
          <Gallery />

          {/* Section 6: Dreamer Pass Authentication (Sign In & Sign Up) */}
          <DreamerPassSection />

          {/* Section 7: Live Dream Guestbook with Real Backend Ledger */}
          <Guestbook />
        </main>

        {/* Section 7: Footer Section */}
        <Footer />

        {/* Tier 3: Returning Visitor Memory Toast */}
        <VisitorMemoryToast />

        {/* Tier 3: Bedside Pip Chat Companion */}
        <PipChatCompanion />

        {/* Tier 1: Secret Easter Egg Modal */}
        <EasterEggModal
          isOpen={isEasterEggOpen}
          onClose={() => setIsEasterEggOpen(false)}
        />

        {/* New: Bedtime Melodies Jukebox Modal (Set of 6 musics) */}
        <LullabyJukeboxModal
          isOpen={isJukeboxOpen}
          onClose={() => setIsJukeboxOpen(false)}
          lullabyState={lullabyState}
          onToggleLullaby={handleToggleLullaby}
          onToggleMute={handleToggleMute}
        />

        {/* New: Dreamer Authentication Modal (Sign In & Sign Up) */}
        <AuthModal />

        {/* New: Dreamer Pass Profile Modal */}
        <UserProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          onOpenJukebox={() => setIsJukeboxOpen(true)}
        />
      </div>
    </AuthProvider>
  );
}
