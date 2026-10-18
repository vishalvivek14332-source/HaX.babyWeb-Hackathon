import React, { useState, useEffect } from 'react';
import { DreamMode, LullabyState } from './types';
import { musicBox } from './utils/audio';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { MeetPip } from './components/MeetPip';
import { CreationsSection } from './components/Creations/CreationsSection';
import { OriginStory } from './components/OriginStory';
import { Gallery } from './components/Gallery';
import { Footer } from './components/Footer';
import { EasterEggModal } from './components/EasterEggModal';

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

  // 3. Easter Egg Modal State
  const [isEasterEggOpen, setIsEasterEggOpen] = useState(false);

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
        currentTrackTitle: st.currentTrackTitle,
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
    <div className={`min-h-screen ${dreamMode === 'night' ? 'theme-night' : 'theme-day'} transition-colors duration-500`}>
      {/* Top Floating Pill Navigation */}
      <Navigation
        dreamMode={dreamMode}
        onToggleDreamMode={handleToggleDreamMode}
        lullabyState={lullabyState}
        onToggleLullaby={handleToggleLullaby}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Landmark (Sections 1-5 & 7 matching whole.png) */}
      <main>
        {/* Section 1: Hero Section */}
        <Hero
          lullabyState={lullabyState}
          onToggleLullaby={handleToggleLullaby}
          onEasterEggTrigger={handleEasterEggTrigger}
        />

        {/* Section 2: About Pip Section */}
        <MeetPip />

        {/* Section 3: Creations / Projects Section */}
        <CreationsSection
          lullabyState={lullabyState}
          onToggleLullaby={handleToggleLullaby}
        />

        {/* Section 4: Origin Story Section */}
        <OriginStory />

        {/* Section 5: Gallery Section */}
        <Gallery />
      </main>

      {/* Section 7: Footer Section */}
      <Footer />

      {/* Section 6: Secret Easter Egg Modal */}
      <EasterEggModal
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />
    </div>
  );
}
