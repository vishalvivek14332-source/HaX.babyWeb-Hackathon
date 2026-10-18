import React, { useEffect, useRef, useState } from 'react';

interface PipAnimationCanvasProps {
  className?: string;
  isHovered?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
  fullSection?: boolean;
}

const TOTAL_FRAMES = 300;
const FRAME_PREFIX = 'frames/ezgif-frame-';
const FRAME_EXT = '.jpg';
const BASE_FPS = 24;

export const PipAnimationCanvas: React.FC<PipAnimationCanvasProps> = ({
  className = '',
  isHovered = false,
  isPlaying = true,
  onClick,
  fullSection = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ambientCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedFirst, setLoadedFirst] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);

  const currentFrameRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(isPlaying);
  isPlayingRef.current = isPlaying;

  // Helper to format frame path
  const getFrameSrc = (index: number) => {
    const pad = String(index + 1).padStart(3, '0');
    return `${FRAME_PREFIX}${pad}${FRAME_EXT}`;
  };

  // Image preloader
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFrameSrc(0);
    firstImg.onload = () => {
      if (isCancelled) return;
      imagesRef.current[0] = firstImg;
      loadedCount++;
      setLoadedFirst(true);
      setLoadPercent(1);
    };

    // Stream the remaining frames in batches
    const BATCH_SIZE = 12;
    const loadRemaining = async () => {
      for (let i = 1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
        if (isCancelled) break;
        const promises = [];
        for (let j = i; j < Math.min(TOTAL_FRAMES, i + BATCH_SIZE); j++) {
          promises.push(
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = getFrameSrc(j);
              img.onload = () => {
                if (!isCancelled) {
                  imagesRef.current[j] = img;
                  loadedCount++;
                  setLoadPercent(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
                }
                resolve();
              };
              img.onerror = () => resolve();
            })
          );
        }
        await Promise.all(promises);
      }
    };

    loadRemaining();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ambientCanvas = ambientCanvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    const ambientCtx = ambientCanvas ? ambientCanvas.getContext('2d', { alpha: true }) : null;
    if (!ctx) return;

    let animId: number;
    let lastTime = performance.now();

    const drawFrame = (pos: number) => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;

      const clamped = Math.max(0, Math.min(TOTAL_FRAMES - 1, pos));
      const baseIdx = Math.floor(clamped);
      const nextIdx = Math.min(TOTAL_FRAMES - 1, baseIdx + 1);
      const t = clamped - baseIdx;

      let img1 = imagesRef.current[baseIdx];
      let img2 = imagesRef.current[nextIdx];

      // Fallback to nearest loaded if base is not ready yet
      if (!img1 || !img1.complete || img1.naturalWidth === 0) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = imagesRef.current[baseIdx - offset];
          if (prev && prev.complete && prev.naturalWidth !== 0) {
            img1 = prev;
            break;
          }
          const next = imagesRef.current[baseIdx + offset];
          if (next && next.complete && next.naturalWidth !== 0) {
            img1 = next;
            break;
          }
        }
      }

      if (!img1 || !img1.complete || img1.naturalWidth === 0) return;

      // Draw base frame (cover fit inside canvas)
      const imgW = img1.naturalWidth || 1920;
      const imgH = img1.naturalHeight || 1080;
      const ratio = Math.max(w / imgW, h / imgH);
      const destW = Math.ceil(imgW * ratio);
      const destH = Math.ceil(imgH * ratio);
      const shiftX = Math.floor((w - destW) / 2);
      const shiftY = Math.floor((h - destH) / 2);

      ctx.globalAlpha = 1.0;
      ctx.drawImage(img1, 0, 0, imgW, imgH, shiftX, shiftY, destW, destH);

      // Smooth cross-dissolve to next frame
      if (t > 0.02 && baseIdx !== nextIdx && img2 && img2.complete && img2.naturalWidth !== 0) {
        ctx.globalAlpha = t;
        ctx.drawImage(img2, 0, 0, imgW, imgH, shiftX, shiftY, destW, destH);
      }
      ctx.globalAlpha = 1.0;

      // Ambient backlight glow (if ambient canvas exists)
      if (ambientCanvas && ambientCtx) {
        const ambW = ambientCanvas.width;
        const ambH = ambientCanvas.height;
        if (ambW > 0 && ambH > 0) {
          ambientCtx.clearRect(0, 0, ambW, ambH);
          ambientCtx.drawImage(img1, 0, 0, imgW, imgH, 0, 0, ambW, ambH);
        }
      }
    };

    const loop = (timestamp: number) => {
      const dt = Math.min(0.1, (timestamp - lastTime) / 1000);
      lastTime = timestamp;

      if (isPlayingRef.current) {
        currentFrameRef.current = (currentFrameRef.current + dt * BASE_FPS) % TOTAL_FRAMES;
      }

      drawFrame(currentFrameRef.current);
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  // Responsive Canvas Sizing with DPR
  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      const ambient = ambientCanvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);

      if (rect.width > 0 && rect.height > 0) {
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);

        if (ambient) {
          ambient.width = Math.round(rect.width * 0.4);
          ambient.height = Math.round(rect.height * 0.4);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (fullSection) {
    return (
      <div
        ref={containerRef}
        className={`absolute inset-0 w-full h-full overflow-hidden bg-[#0b0d18] pointer-events-none z-0 ${className}`}
      >
        {/* Main Full-Bleed Section Canvas with warm magical twilight lighting */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover block pointer-events-none"
          style={{
            imageRendering: 'auto',
            filter: 'brightness(1.04) contrast(1.04) saturate(1.15)',
          }}
          aria-label="Pip the skull baby animated throughout the entire hero section"
        />

        {/* Loading Progress Bar */}
        {loadPercent < 100 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-black/40 z-20 pointer-events-none">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-pink-500 to-amber-300 transition-all duration-300"
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative rounded-3xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] w-full max-w-[540px] shadow-2xl border-2 border-[var(--border-subtle)] bg-[#0b0d18] transition-transform duration-300 ${
        isHovered ? 'scale-[1.02]' : 'scale-100'
      } ${className}`}
    >
      {/* Ambient Backlight Glow Canvas */}
      <canvas
        ref={ambientCanvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full filter blur-2xl opacity-60 scale-110 pointer-events-none"
      />

      {/* Main Animation Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full object-cover block cursor-pointer"
        aria-label="Pip the skull baby animation on fluffy clouds with a glowing star and music box"
      />

      {/* Subtle Bottom Starlight Badge */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-amber-200 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Pip's Dream Sequence · 300 Frames</span>
      </div>

      {/* Loading Progress Bar (if still buffering) */}
      {loadPercent < 100 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/30 z-30 pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-pink-500 transition-all duration-300"
            style={{ width: `${loadPercent}%` }}
          />
        </div>
      )}
    </div>
  );
};
