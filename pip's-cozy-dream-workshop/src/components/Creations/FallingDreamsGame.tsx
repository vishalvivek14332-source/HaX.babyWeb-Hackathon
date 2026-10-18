import React, { useState, useEffect, useRef } from 'react';
import { musicBox } from '../../utils/audio';

interface FallingItem {
  id: number;
  x: number; // percentage 5 - 95%
  y: number; // percentage 0 - 100%
  speed: number;
  type: 'star' | 'moon' | 'cloud' | 'heart';
  points: number;
  icon: string;
}

export function FallingDreamsGame() {
  const [activeTab, setActiveTab] = useState<'catch' | 'stack' | 'rattle'>('catch');

  // --- Game 1: Catch Falling Dreams State ---
  const [basketX, setBasketX] = useState(50); // percentage 0-100%
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    try {
      return parseInt(localStorage.getItem('pip_dream_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [items, setItems] = useState<FallingItem[]>([]);
  const [isCatching, setIsCatching] = useState(false);
  const [catchFeedback, setCatchFeedback] = useState<string | null>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // --- Game 2: Stack the Blocks State ---
  const [tower, setTower] = useState<{ id: number; color: string; label: string; offset: number }[]>([
    { id: 1, color: '#fbcfe8', label: 'Cloud Base', offset: 0 },
  ]);
  const [blockOffset, setBlockOffset] = useState(0);
  const [swingDir, setSwingDir] = useState(1);
  const [stackFeedback, setStackFeedback] = useState<string | null>(null);

  // --- Game 3: Rattle Sounds State ---
  const [rattleShake, setRattleShake] = useState(false);
  const [rattleCount, setRattleCount] = useState(0);

  // -------------------------------------------------------------
  // Loop for Catch Falling Dreams
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'catch' || !isCatching) return;

    // Spawn falling dreams periodically
    const spawnTimer = setInterval(() => {
      const types: ('star' | 'moon' | 'cloud' | 'heart')[] = ['star', 'moon', 'cloud', 'heart'];
      const chosen = types[Math.floor(Math.random() * types.length)];
      const config = {
        star: { points: 10, icon: '⭐' },
        moon: { points: 20, icon: '🌙' },
        cloud: { points: 15, icon: '☁️' },
        heart: { points: 25, icon: '💖' },
      }[chosen];

      const newItem: FallingItem = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 85) + 8,
        y: 0,
        speed: Math.random() * 0.8 + 1.2,
        type: chosen,
        points: config.points,
        icon: config.icon,
      };

      setItems((prev) => [...prev.slice(-12), newItem]);
    }, 1100);

    // Frame update for item positions and basket collision
    const frameInterval = setInterval(() => {
      setItems((prev) => {
        const next: FallingItem[] = [];

        for (const item of prev) {
          const newY = item.y + item.speed;

          // Check if item reached the basket height (around 82% - 94%)
          if (newY >= 82 && newY <= 94) {
            // Check horizontal collision with basket (basket width ~ 18%)
            if (Math.abs(item.x - basketX) < 12) {
              // CAUGHT!
              setScore((s) => {
                const newScore = s + item.points;
                if (newScore > highScore) {
                  setHighScore(newScore);
                  try {
                    localStorage.setItem('pip_dream_highscore', newScore.toString());
                  } catch {
                    // Ignore
                  }
                }
                return newScore;
              });

              // Play chime
              if (item.type === 'star') musicBox.playNamedNote('E5', 0.5);
              else if (item.type === 'moon') musicBox.playNamedNote('G5', 0.6);
              else if (item.type === 'cloud') musicBox.playNamedNote('C5', 0.5);
              else musicBox.playNamedNote('C6', 0.7);

              setCatchFeedback(`+${item.points} ${item.icon}`);
              setTimeout(() => setCatchFeedback(null), 800);
              continue; // Don't add to next
            }
          }

          if (newY < 100) {
            next.push({ ...item, y: newY });
          }
        }
        return next;
      });
    }, 35);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(frameInterval);
    };
  }, [activeTab, isCatching, basketX, highScore]);

  // Handle pointer/touch drag on game canvas
  const handleGameAreaPointer = (e: React.PointerEvent) => {
    if (!gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setBasketX(Math.max(8, Math.min(92, x)));
  };

  // -------------------------------------------------------------
  // Loop for Stack the Blocks swinging arm
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeTab !== 'stack') return;
    const interval = setInterval(() => {
      setBlockOffset((prev) => {
        let next = prev + swingDir * 2;
        if (next > 40) {
          setSwingDir(-1);
          next = 40;
        } else if (next < -40) {
          setSwingDir(1);
          next = -40;
        }
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [activeTab, swingDir]);

  const handleDropBlock = () => {
    const colors = ['#fde68a', '#fed7aa', '#bbf7d0', '#c7d2fe', '#fbcfe8'];
    const labels = ['Lavender Star', 'Marshmallow Dream', 'Soft Blanket', 'Moon Milk', 'Cloud Pillow'];
    const chosenColor = colors[tower.length % colors.length];
    const chosenLabel = labels[tower.length % labels.length];

    // Compute wobble difference from previous block
    const lastOffset = tower[tower.length - 1]?.offset || 0;
    const diff = Math.abs(blockOffset - lastOffset);

    if (diff > 28 && tower.length > 2) {
      // Tumble!
      musicBox.playNamedNote('D3', 0.7);
      setStackFeedback('Oh no! The tower tumbled gently like fluffy feathers. Pip caught them all! ☁️');
      setTower([{ id: 1, color: '#fbcfe8', label: 'Cloud Base', offset: 0 }]);
      setTimeout(() => setStackFeedback(null), 2500);
      return;
    }

    musicBox.playNamedNote('E5', 0.6);
    setTimeout(() => musicBox.playNamedNote('G5', 0.6), 80);

    setTower((prev) => [
      ...prev,
      {
        id: Date.now(),
        color: chosenColor,
        label: chosenLabel,
        offset: blockOffset,
      },
    ]);
    setStackFeedback(`Block #${tower.length + 1} stacked snugly! ✨`);
    setTimeout(() => setStackFeedback(null), 1500);
  };

  // -------------------------------------------------------------
  // Rattle Handler
  // -------------------------------------------------------------
  const handleShakeRattle = () => {
    setRattleShake(true);
    setRattleCount((c) => c + 1);
    musicBox.playNamedNote('B5', 0.7);
    setTimeout(() => musicBox.playNamedNote('E6', 0.7), 100);
    setTimeout(() => musicBox.playNamedNote('G6', 0.7), 200);
    setTimeout(() => setRattleShake(false), 500);
  };

  return (
    <div className="w-full rounded-3xl bg-[#fff8f1] dark:bg-[#231526] border-2 border-[#ecd3c1] dark:border-[#523359] p-5 sm:p-7 shadow-lg flex flex-col select-none">
      {/* Top Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-[#ecd3c1] pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#a34063] uppercase tracking-wider">
            <span>🎮</span>
            <span>PLAYABLE MINI-GAMES</span>
          </div>
          <h3 className="font-editorial text-xl sm:text-2xl font-black text-[#38201a] dark:text-[#f8eef2]" style={{ fontFamily: "'Fraunces', serif" }}>
            Pip's Dream Playground
          </h3>
        </div>

        {/* Game Mode Selector Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#fff0e5] dark:bg-[#381c3e] border border-[#ecd3c1]">
          <button
            onClick={() => setActiveTab('catch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'catch'
                ? 'bg-[#a34063] text-white shadow-xs'
                : 'text-[#5a382e] dark:text-[#f8eef2] hover:bg-white/50'
            }`}
          >
            ⭐ Catch Dreams
          </button>
          <button
            onClick={() => setActiveTab('stack')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stack'
                ? 'bg-[#a34063] text-white shadow-xs'
                : 'text-[#5a382e] dark:text-[#f8eef2] hover:bg-white/50'
            }`}
          >
            🧱 Stack Blocks
          </button>
          <button
            onClick={() => setActiveTab('rattle')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rattle'
                ? 'bg-[#a34063] text-white shadow-xs'
                : 'text-[#5a382e] dark:text-[#f8eef2] hover:bg-white/50'
            }`}
          >
            🔔 Star Rattle
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------- */}
      {/* Tab 1: Catch Falling Dreams */}
      {/* -------------------------------------------------------- */}
      {activeTab === 'catch' && (
        <div className="flex flex-col">
          {/* Game Stats Bar */}
          <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#5a382e] dark:text-[#f8eef2]">
            <div className="flex items-center gap-4">
              <span>Score: <strong className="text-[#a34063] text-base">{score}</strong></span>
              <span>Best: <strong>{highScore}</strong></span>
            </div>
            <button
              onClick={() => {
                setIsCatching(!isCatching);
                if (!isCatching) setScore(0);
              }}
              className="px-4 py-1.5 rounded-full bg-[#a34063] text-white font-bold hover:bg-[#8b3452] cursor-pointer shadow-xs text-xs"
            >
              {isCatching ? 'Pause Game' : '▶ Start Catching'}
            </button>
          </div>

          {/* Interactive Game Canvas Area */}
          <div
            ref={gameAreaRef}
            onPointerMove={handleGameAreaPointer}
            onPointerDown={handleGameAreaPointer}
            className="relative w-full aspect-[500/280] rounded-2xl bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2e1065] overflow-hidden border border-[#523359] shadow-inner cursor-ew-resize touch-none"
          >
            {/* Background constellation */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <span className="absolute top-6 left-12 text-amber-200">✦</span>
              <span className="absolute top-14 right-20 text-pink-300">★</span>
              <span className="absolute bottom-10 left-32 text-indigo-200">✦</span>
            </div>

            {/* Falling Dream Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="absolute text-xl sm:text-2xl transition-transform pointer-events-none select-none filter drop-shadow-[0_2px_8px_rgba(253,230,138,0.5)]"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {item.icon}
              </div>
            ))}

            {/* Catch Feedback Pop */}
            {catchFeedback && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-amber-400 text-slate-900 font-extrabold text-xs shadow-lg animate-bounce pointer-events-none">
                {catchFeedback}
              </div>
            )}

            {/* Player's Pip Cloud Basket */}
            <div
              className="absolute bottom-3 transition-transform ease-out pointer-events-none"
              style={{
                left: `${basketX}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="relative flex flex-col items-center">
                {/* Pip Peek */}
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/50 -mb-2 shadow-xs">
                  <img src="artwork/pip_card_personality_v2.png" alt="Pip" className="w-full h-full object-cover" />
                </div>
                {/* Fluffy Cloud Basket */}
                <div className="px-5 py-2.5 rounded-full bg-white/95 text-slate-800 text-xs font-bold border-2 border-[#f472b6] shadow-xl flex items-center gap-1.5 whitespace-nowrap">
                  <span>🧺</span>
                  <span>Cloud Basket</span>
                </div>
              </div>
            </div>

            {/* Idle Overlay */}
            {!isCatching && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center text-center p-4">
                <span className="text-3xl mb-2">⭐</span>
                <h4 className="font-editorial text-lg font-bold text-white mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
                  Catch Falling Dreams
                </h4>
                <p className="text-xs text-amber-200 font-semibold mb-3 max-w-xs">
                  Drag Pip's cloud basket left and right to catch stars, moons, and cloud snacks before they slip away!
                </p>
                <button
                  onClick={() => {
                    setIsCatching(true);
                    setScore(0);
                  }}
                  className="px-6 py-2 rounded-full bg-[#f472b6] text-white font-bold text-xs hover:bg-[#e11d48] cursor-pointer shadow-lg"
                >
                  ▶ Start Catching
                </button>
              </div>
            )}
          </div>
          <p className="text-[11px] text-center text-[#8b6154] dark:text-[#bda2af] mt-2">
            Tip: Move your mouse or drag your finger across the sky to move the basket!
          </p>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* Tab 2: Stack the Blocks */}
      {/* -------------------------------------------------------- */}
      {activeTab === 'stack' && (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-between w-full mb-3 text-xs font-bold text-[#5a382e] dark:text-[#f8eef2]">
            <span>Height: <strong>{tower.length} blocks high</strong></span>
            <button
              onClick={handleDropBlock}
              className="px-5 py-1.5 rounded-full bg-[#a34063] text-white font-bold hover:bg-[#8b3452] cursor-pointer shadow-xs text-xs flex items-center gap-1.5"
            >
              <span>⬇️</span>
              <span>Drop Block Now!</span>
            </button>
          </div>

          {/* Stacking Tower Canvas */}
          <div className="relative w-full aspect-[500/280] rounded-2xl bg-gradient-to-b from-[#fff0e5] to-[#fce7ed] dark:from-[#2e1830] dark:to-[#1a0f1d] overflow-hidden border border-[#ecd3c1] dark:border-[#523359] flex flex-col justify-end items-center p-4 shadow-inner">
            {/* Swinging Drop Target */}
            <div
              className="absolute top-4 transition-transform ease-linear"
              style={{
                transform: `translateX(${blockOffset * 2.8}px)`,
              }}
            >
              <div className="px-4 py-2 rounded-xl bg-[#a34063] text-white text-xs font-bold shadow-md flex items-center gap-1">
                <span>🧱</span>
                <span>Ready to Drop</span>
              </div>
            </div>

            {/* Stacked Blocks */}
            <div className="flex flex-col-reverse items-center gap-1.5 max-h-[190px] overflow-hidden w-full">
              {tower.map((b) => (
                <div
                  key={b.id}
                  className="px-6 py-2.5 rounded-2xl border-2 border-black/10 shadow-sm text-xs font-bold text-[#38201a] transition-all"
                  style={{
                    backgroundColor: b.color,
                    transform: `translateX(${b.offset * 1.5}px)`,
                    width: '160px',
                    textAlign: 'center',
                  }}
                >
                  {b.label}
                </div>
              ))}
            </div>
          </div>

          {stackFeedback && (
            <div className="mt-2 text-xs font-bold text-[#a34063] dark:text-[#f49bb8] animate-fade-in text-center">
              {stackFeedback}
            </div>
          )}
          <p className="text-[11px] text-center text-[#8b6154] dark:text-[#bda2af] mt-2">
            Click "Drop Block Now!" when the swinging block lines up with the tower!
          </p>
        </div>
      )}

      {/* -------------------------------------------------------- */}
      {/* Tab 3: Rattle Sounds */}
      {/* -------------------------------------------------------- */}
      {activeTab === 'rattle' && (
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <div
            onClick={handleShakeRattle}
            className={`w-36 h-36 rounded-full bg-gradient-to-tr from-[#fde68a] to-[#fed7aa] border-4 border-[#f59e0b] shadow-xl flex flex-col items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all select-none mb-4 ${
              rattleShake ? 'animate-bounce' : ''
            }`}
          >
            <span className="text-5xl">🔔</span>
            <span className="text-xs font-extrabold text-[#78350f] mt-1 uppercase tracking-wider">
              Pip's Rattle
            </span>
          </div>

          <h4 className="font-editorial text-lg font-bold text-[#38201a] dark:text-[#f8eef2] mb-1" style={{ fontFamily: "'Fraunces', serif" }}>
            Moonlight Chime Rattle
          </h4>
          <p className="text-xs text-[#5a382e] dark:text-[#d4b0be] max-w-sm mb-4">
            Tap the rattle to ring sweet starlight chimes across the Midnight Nursery. Shaken <strong>{rattleCount}</strong> times!
          </p>

          <button
            onClick={handleShakeRattle}
            className="px-6 py-2.5 rounded-full bg-[#a34063] text-white font-bold text-xs hover:bg-[#8b3452] cursor-pointer shadow-md"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Shake the Rattle ✨
          </button>
        </div>
      )}
    </div>
  );
}
