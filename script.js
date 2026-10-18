/**
 * PIP'S COZY DREAM WORKSHOP · JUNIOR DREAM ENGINEER
 * High-Performance 300-Frame Animation Engine with Autoplay & Smooth Scroll Scrubbing
 * Pixel-Perfect match to heronew.png with True 16:9 Aspect Ratio & Ambient Glow
 */

(function () {
  'use strict';

  // --- Configuration ---
  const TOTAL_FRAMES = 300;
  const FRAME_PATH_PREFIX = 'frames/ezgif-frame-';
  const FALLBACK_PATH_PREFIX = 'pipzipfile/ezgif-frame-';
  const FRAME_EXT = '.jpg';
  const BASE_FPS = 24;
  const LERP_FACTOR = 0.09; // Physical momentum damping

  // --- State ---
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let targetFrame = 0;
  let isPlaying = true; // Animation plays on the website
  let playbackSpeed = 1.0; // 0.5x, 1.0x, 1.5x, 2.0x
  let fitMode = 'cover'; // 'cover' (fills entire page length and width) or 'fit169' (strict 16:9)
  let isUserScrubbing = false;
  let isUserScrolling = false;
  let scrollTimeout = null;

  // --- DOM Elements ---
  const canvas = document.getElementById('animation-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const ambientCanvas = document.getElementById('ambient-canvas');
  const ambientCtx = ambientCanvas.getContext('2d', { alpha: true });

  const scrollLine = document.getElementById('scroll-line');
  const preloader = document.getElementById('preloader');
  const loaderProgressBar = document.getElementById('loader-progress-bar');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderCount = document.getElementById('loader-count');
  const loaderSkipBtn = document.getElementById('loader-skip-btn');

  // Hero & Navigation Elements
  const heroContent = document.getElementById('hero-content');
  const lullabyBtn = document.getElementById('lullaby-btn');
  const lullabyBtnText = document.getElementById('lullaby-btn-text');
  const playBtnSvg = document.getElementById('play-btn-svg');
  const dreamModeBtn = document.getElementById('dream-mode-btn');
  const dreamModeText = document.getElementById('dream-mode-text');
  const exploreBtn = document.getElementById('explore-btn');

  // Animation Dock Elements
  const dockPlayBtn = document.getElementById('dock-play-btn');
  const dockPlayIcon = document.getElementById('dock-play-icon');
  const dockFrameCounter = document.getElementById('dock-frame-counter');
  const dockScrubberTrack = document.getElementById('dock-scrubber-track');
  const dockScrubberBuffered = document.getElementById('dock-scrubber-buffered');
  const dockScrubberProgress = document.getElementById('dock-scrubber-progress');
  const dockScrubberThumb = document.getElementById('dock-scrubber-thumb');
  const dockSpeedBtn = document.getElementById('dock-speed-btn');
  const dockSpeedText = document.getElementById('dock-speed-text');
  const dockFitBtn = document.getElementById('dock-fit-btn');
  const dockFitText = document.getElementById('dock-fit-text');
  const dockSoundBtn = document.getElementById('dock-sound-btn');

  // Ambient Stardust Cursor
  const cursorCanvas = document.getElementById('cursor-canvas');
  const cursorCtx = cursorCanvas.getContext('2d');
  let stardustParticles = [];

  // --- Helper: Pad frame index to 3 digits ---
  function getFrameSrc(index, useFallback = false) {
    const pad = String(index + 1).padStart(3, '0');
    const prefix = useFallback ? FALLBACK_PATH_PREFIX : FRAME_PATH_PREFIX;
    return `${prefix}${pad}${FRAME_EXT}`;
  }

  // --- Canvas High-DPI Resizing ---
  let canvasWidth = window.innerWidth;
  let canvasHeight = window.innerHeight;
  let dpr = window.devicePixelRatio || 1;

  function resizeCanvas() {
    canvasWidth = window.innerWidth;
    canvasHeight = window.innerHeight;
    dpr = window.devicePixelRatio || 1;

    // Main Canvas
    canvas.width = Math.round(canvasWidth * dpr);
    canvas.height = Math.round(canvasHeight * dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.scale(dpr, dpr);

    // Ambient Canvas (lower resolution for high-performance blur)
    ambientCanvas.width = Math.round(canvasWidth * 0.5);
    ambientCanvas.height = Math.round(canvasHeight * 0.5);
    ambientCtx.imageSmoothingEnabled = true;
    ambientCtx.imageSmoothingQuality = 'medium';

    // Cursor Canvas
    cursorCanvas.width = canvasWidth;
    cursorCanvas.height = canvasHeight;

    renderFrame(currentFrame);
  }
  window.addEventListener('resize', resizeCanvas, { passive: true });

  // --- True 16:9 Uncropped Rendering & Edge-to-Edge Ambient Backdrop ---
  function drawImageFit(targetCtx, img, mode, alpha = 1.0) {
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const imgWidth = img.naturalWidth || 1920;
    const imgHeight = img.naturalHeight || 1080;

    let destW, destH, shiftX, shiftY;

    if (mode === 'fit169') {
      // Scale to fit fully inside viewport without cutting off edges (True 16:9)
      const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight);
      destW = imgWidth * ratio;
      destH = imgHeight * ratio;
      shiftX = (canvasWidth - destW) / 2;
      shiftY = (canvasHeight - destH) / 2;
    } else {
      // Cover mode: Fill screen length and width completely with zero borders
      const hRatio = canvasWidth / imgWidth;
      const vRatio = canvasHeight / imgHeight;
      const ratio = Math.max(hRatio, vRatio);
      destW = Math.ceil(imgWidth * ratio);
      destH = Math.ceil(imgHeight * ratio);
      shiftX = Math.floor((canvasWidth - destW) / 2);
      shiftY = Math.floor((canvasHeight - destH) / 2);
    }

    targetCtx.globalAlpha = alpha;
    targetCtx.drawImage(img, 0, 0, imgWidth, imgHeight, shiftX, shiftY, destW, destH);
  }

  function drawAmbientBackdrop(img) {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const w = ambientCanvas.width;
    const h = ambientCanvas.height;
    ambientCtx.clearRect(0, 0, w, h);
    ambientCtx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, w, h);
  }

  function drawNearestLoaded(clamped) {
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = images[clamped - offset];
      if (prev && prev.complete && prev.naturalWidth !== 0) {
        drawImageFit(ctx, prev, fitMode, 1.0);
        drawAmbientBackdrop(prev);
        return;
      }
      const next = images[clamped + offset];
      if (next && next.complete && next.naturalWidth !== 0) {
        drawImageFit(ctx, next, fitMode, 1.0);
        drawAmbientBackdrop(next);
        return;
      }
    }
  }

  /**
   * Sub-frame Temporal Cross-Dissolve Render:
   * Smoothly cross-fades adjacent frames for liquid 60fps motion.
   */
  function renderFrame(framePos) {
    const clampedPos = Math.max(0, Math.min(TOTAL_FRAMES - 1, framePos));
    const baseIdx = Math.floor(clampedPos);
    const nextIdx = Math.min(TOTAL_FRAMES - 1, baseIdx + 1);
    const t = clampedPos - baseIdx;

    const img1 = images[baseIdx];
    const img2 = images[nextIdx];

    ctx.fillStyle = '#0b0d18';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 1. Draw base frame
    if (img1 && img1.complete && img1.naturalWidth !== 0) {
      drawImageFit(ctx, img1, fitMode, 1.0);
      drawAmbientBackdrop(img1);
    } else {
      drawNearestLoaded(baseIdx);
    }

    // 2. Blend next frame with fractional alpha (smooth cross-dissolve)
    if (t > 0.015 && baseIdx !== nextIdx && img2 && img2.complete && img2.naturalWidth !== 0) {
      drawImageFit(ctx, img2, fitMode, t);
    }

    ctx.globalAlpha = 1.0;
  }

  // --- Asynchronous Image Preloading & GPU Decoding Pipeline ---
  async function loadAndDecodeImage(src, fallbackSrc) {
    const img = new Image();
    img.src = src;

    if ('decode' in img) {
      try {
        await img.decode();
        return img;
      } catch (err) {
        // Fallback to secondary path
        if (fallbackSrc) {
          const fallbackImg = new Image();
          fallbackImg.src = fallbackSrc;
          return new Promise((resolve) => {
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () => resolve(img);
          });
        }
      }
    }

    return new Promise((resolve) => {
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (fallbackSrc) {
          const fallbackImg = new Image();
          fallbackImg.src = fallbackSrc;
          fallbackImg.onload = () => resolve(fallbackImg);
          fallbackImg.onerror = () => resolve(null);
        } else {
          resolve(null);
        }
      };
    });
  }

  async function preloadImages() {
    try {
      // First frame renders instantly
      const firstImg = await loadAndDecodeImage(getFrameSrc(0), getFrameSrc(0, true));
      if (firstImg) {
        images[0] = firstImg;
        loadedCount++;
        resizeCanvas();
        renderFrame(0);
        updateLoaderProgress();
      }
    } catch (e) {
      // Continue
    }

    // Stream remaining frames in fast parallel batches
    const BATCH_SIZE = 12;
    for (let i = 1; i < TOTAL_FRAMES; i += BATCH_SIZE) {
      const batchPromises = [];
      for (let j = i; j < Math.min(TOTAL_FRAMES, i + BATCH_SIZE); j++) {
        batchPromises.push(
          loadAndDecodeImage(getFrameSrc(j), getFrameSrc(j, true)).then((img) => {
            if (img) images[j] = img;
            loadedCount++;
            updateLoaderProgress();
          })
        );
      }
      await Promise.all(batchPromises);
    }
  }

  function updateLoaderProgress() {
    const percent = Math.floor((loadedCount / TOTAL_FRAMES) * 100);
    if (loaderProgressBar) loaderProgressBar.style.width = `${percent}%`;
    if (loaderPercent) loaderPercent.textContent = `${percent}%`;
    if (loaderCount) loaderCount.textContent = `${loadedCount} / ${TOTAL_FRAMES} frames`;

    if (dockScrubberBuffered) {
      dockScrubberBuffered.style.width = `${percent}%`;
    }

    // Let user enter early once frames start arriving, and auto-dismiss quickly
    if (loadedCount >= 15) {
      finishLoading();
    } else if (loaderSkipBtn) {
      loaderSkipBtn.style.display = 'inline-flex';
    }

    if (loadedCount >= TOTAL_FRAMES) {
      finishLoading();
    }
  }

  function finishLoading() {
    if (!preloader || preloader.classList.contains('fade-out')) return;
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 850);
  }

  // Safety fallback: auto dismiss preloader within 1.5s so the site displays immediately
  setTimeout(() => {
    finishLoading();
  }, 1500);

  if (loaderSkipBtn) {
    loaderSkipBtn.addEventListener('click', finishLoading);
  }

  // --- Master Animation Loop (Continuous video-like autoplay) ---
  let lastTime = performance.now();
  let lastDrawnPos = -1;

  function animationLoop(timestamp) {
    const dt = Math.min(0.1, (timestamp - lastTime) / 1000); // delta in seconds
    lastTime = timestamp;

    // Continuous Autoplay Progression right when website starts
    if (isPlaying) {
      const frameDelta = dt * BASE_FPS * playbackSpeed;
      currentFrame = (currentFrame + frameDelta) % TOTAL_FRAMES;
    }

    // Render frame
    if (Math.abs(currentFrame - lastDrawnPos) > 0.005) {
      renderFrame(currentFrame);
      lastDrawnPos = currentFrame;
    }

    requestAnimationFrame(animationLoop);
  }

  // --- Animation Play / Pause Controls ---
  function togglePlayPause() {
    isPlaying = !isPlaying;
    updatePlayPauseUI(isPlaying);
  }

  function updatePlayPauseUI(playing) {
    if (dockPlayBtn) {
      dockPlayBtn.classList.toggle('playing', playing);
      dockPlayBtn.setAttribute('aria-label', playing ? 'Pause Animation (Space)' : 'Play Animation (Space)');
    }
    if (dockPlayIcon) {
      dockPlayIcon.textContent = playing ? '❚❚' : '▶';
    }
    if (lullabyBtn) {
      lullabyBtn.classList.toggle('active', playing);
    }
    if (lullabyBtnText) {
      lullabyBtnText.textContent = playing ? 'Pause Animation' : 'Play Animation';
    }
    if (playBtnSvg) {
      if (playing) {
        playBtnSvg.innerHTML = '<rect x="1" y="1" width="3" height="10" fill="currentColor"/><rect x="6" y="1" width="3" height="10" fill="currentColor"/>';
      } else {
        playBtnSvg.innerHTML = '<path d="M1 1L9 6L1 11V1Z" fill="currentColor"/>';
      }
    }
  }

  if (dockPlayBtn) {
    dockPlayBtn.addEventListener('click', togglePlayPause);
  }
  if (lullabyBtn) {
    lullabyBtn.addEventListener('click', () => {
      togglePlayPause();
      // Also trigger gentle music box sound if starting play
      if (isPlaying && !isLullabyPlaying) {
        startLullabyAudio();
      }
    });
  }

  // --- Playback Speed Control ---
  const SPEEDS = [0.5, 1.0, 1.5, 2.0];
  function cyclePlaybackSpeed() {
    const currIndex = SPEEDS.indexOf(playbackSpeed);
    const nextIndex = (currIndex + 1) % SPEEDS.length;
    playbackSpeed = SPEEDS[nextIndex];
    if (dockSpeedText) {
      dockSpeedText.textContent = `${playbackSpeed.toFixed(1)}x`;
    }
  }

  if (dockSpeedBtn) {
    dockSpeedBtn.addEventListener('click', cyclePlaybackSpeed);
  }

  // --- Aspect Ratio Mode Toggle (16:9 Fit vs Cover) ---
  function toggleFitMode() {
    if (fitMode === 'cover') {
      fitMode = 'fit169';
      if (dockFitText) dockFitText.textContent = '16:9';
      if (dockFitBtn) {
        dockFitBtn.classList.remove('active');
        dockFitBtn.title = 'Aspect Ratio: True 16:9 Fit';
      }
    } else {
      fitMode = 'cover';
      if (dockFitText) dockFitText.textContent = 'Cover';
      if (dockFitBtn) {
        dockFitBtn.classList.add('active');
        dockFitBtn.title = 'Aspect Ratio: Full Screen Cover';
      }
    }
    renderFrame(currentFrame);
  }

  if (dockFitBtn) {
    dockFitBtn.addEventListener('click', toggleFitMode);
  }

  // --- Timeline Scrubber Interaction (Click & Drag) ---
  function scrubToEvent(e) {
    if (!dockScrubberTrack) return;
    const rect = dockScrubberTrack.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const progress = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    targetFrame = progress * (TOTAL_FRAMES - 1);
    currentFrame = targetFrame;
    renderFrame(currentFrame);
  }

  if (dockScrubberTrack) {
    const startScrub = (e) => {
      isUserScrubbing = true;
      scrubToEvent(e);
      window.addEventListener('mousemove', scrubToEvent, { passive: true });
      window.addEventListener('touchmove', scrubToEvent, { passive: true });
      window.addEventListener('mouseup', endScrub);
      window.addEventListener('touchend', endScrub);
    };

    const endScrub = () => {
      isUserScrubbing = false;
      window.removeEventListener('mousemove', scrubToEvent);
      window.removeEventListener('touchmove', scrubToEvent);
      window.removeEventListener('mouseup', endScrub);
      window.removeEventListener('touchend', endScrub);
    };

    dockScrubberTrack.addEventListener('mousedown', startScrub);
    dockScrubberTrack.addEventListener('touchstart', startScrub, { passive: true });

    // Keyboard scrubbing on scrubber track
    dockScrubberTrack.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault();
        targetFrame = Math.min(TOTAL_FRAMES - 1, targetFrame + 4);
        currentFrame = targetFrame;
        renderFrame(currentFrame);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault();
        targetFrame = Math.max(0, targetFrame - 4);
        currentFrame = targetFrame;
        renderFrame(currentFrame);
      }
    });
  }

  // --- Primary CTA & Navigation Interactions (No scroll) ---
  if (exploreBtn) {
    exploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!isPlaying) togglePlayPause();
      if (!isLullabyPlaying) toggleLullabyAudio();
    });
  }

  // Pill Navigation Active Links
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach((el) => el.classList.remove('active'));
      item.classList.add('active');
    });
  });

  // ==========================================================================
  // CELESTIAL MUSIC BOX SYNTHESIZER (WEB AUDIO API)
  // Harmonic plucked bell chimes replicating Pip's lullaby music box
  // ==========================================================================
  let audioCtx = null;
  let isLullabyPlaying = false;
  let lullabyTimeoutId = null;

  const NOTES = {
    C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880.00,
    B5: 987.77, C6: 1046.50, D6: 1174.66, E6: 1318.51
  };

  const LULLABY_SEQUENCE = [
    [NOTES.G5, 1], [NOTES.E5, 1], [NOTES.G5, 1], [NOTES.E5, 1],
    [NOTES.G5, 2], [NOTES.C6, 2],
    [NOTES.B5, 1], [NOTES.A5, 1], [NOTES.G5, 2],
    [NOTES.D5, 1], [NOTES.E5, 1], [NOTES.D5, 1], [NOTES.C5, 2]
  ];

  function playChimeNote(freq, volume = 0.22) {
    if (!audioCtx || freq === 0) return;
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    const gain2 = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3400, now);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.01, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(volume, now + 0.005);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(volume * 0.3, now + 0.004);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.6);
    osc2.stop(now + 0.9);
  }

  function startLullabyAudio() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    isLullabyPlaying = true;
    updateAudioUI(true);

    let step = 0;
    const tempo = 450;

    function playLoop() {
      if (!isLullabyPlaying) return;
      const [freq, beats] = LULLABY_SEQUENCE[step];
      playChimeNote(freq);
      step = (step + 1) % LULLABY_SEQUENCE.length;
      lullabyTimeoutId = setTimeout(playLoop, beats * tempo);
    }

    playLoop();
  }

  function stopLullabyAudio() {
    isLullabyPlaying = false;
    if (lullabyTimeoutId) {
      clearTimeout(lullabyTimeoutId);
      lullabyTimeoutId = null;
    }
    updateAudioUI(false);
  }

  function toggleLullabyAudio() {
    if (isLullabyPlaying) {
      stopLullabyAudio();
    } else {
      startLullabyAudio();
    }
  }

  function updateAudioUI(isPlaying) {
    if (dockSoundBtn) {
      dockSoundBtn.classList.toggle('active', isPlaying);
    }
    if (dreamModeBtn) {
      if (dreamModeText) {
        dreamModeText.textContent = isPlaying ? 'Dreaming...' : 'Dream Mode';
      }
    }
  }

  if (dockSoundBtn) {
    dockSoundBtn.addEventListener('click', toggleLullabyAudio);
  }
  if (dreamModeBtn) {
    dreamModeBtn.addEventListener('click', toggleLullabyAudio);
  }

  // --- Keyboard Shortcuts ---
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    switch (e.code) {
      case 'Space':
        e.preventDefault();
        togglePlayPause();
        break;
      case 'KeyM':
        toggleLullabyAudio();
        break;
      case 'KeyF':
        toggleFitMode();
        break;
      case 'ArrowDown':
      case 'ArrowRight':
      case 'PageDown':
        if (!isPlaying) {
          e.preventDefault();
          targetFrame = (targetFrame + 4) % TOTAL_FRAMES;
          currentFrame = targetFrame;
          renderFrame(currentFrame);
        }
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        if (!isPlaying) {
          e.preventDefault();
          targetFrame = (targetFrame - 4 + TOTAL_FRAMES) % TOTAL_FRAMES;
          currentFrame = targetFrame;
          renderFrame(currentFrame);
        }
        break;
      case 'Home':
        e.preventDefault();
        targetFrame = 0;
        currentFrame = 0;
        renderFrame(0);
        break;
      case 'End':
        e.preventDefault();
        targetFrame = TOTAL_FRAMES - 1;
        currentFrame = targetFrame;
        renderFrame(currentFrame);
        break;
    }
  });

  // --- Ambient Stardust Cursor Trail ---
  class StarParticle {
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 14;
      this.y = y + (Math.random() - 0.5) * 14;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7 - 0.3;
      this.size = Math.random() * 2.5 + 1.2;
      this.alpha = 1.0;
      this.life = 1.0;
      this.decay = Math.random() * 0.02 + 0.015;
      this.color = Math.random() > 0.5 ? '#e5a93c' : '#a34063';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= this.decay;
      this.alpha = Math.max(0, this.life);
      return this.life > 0;
    }

    draw(c) {
      c.save();
      c.globalAlpha = this.alpha;
      c.fillStyle = this.color;
      c.shadowBlur = 8;
      c.shadowColor = this.color;
      c.beginPath();
      c.arc(this.x, this.y, this.size * this.alpha, 0, Math.PI * 2);
      c.fill();
      c.restore();
    }
  }

  window.addEventListener('mousemove', (e) => {
    if (stardustParticles.length < 35 && Math.random() > 0.45) {
      stardustParticles.push(new StarParticle(e.clientX, e.clientY));
    }
  }, { passive: true });

  function renderStardust() {
    cursorCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let i = stardustParticles.length - 1; i >= 0; i--) {
      const p = stardustParticles[i];
      if (p.update()) {
        p.draw(cursorCtx);
      } else {
        stardustParticles.splice(i, 1);
      }
    }
    requestAnimationFrame(renderStardust);
  }

  // --- Init ---
  function init() {
    resizeCanvas();
    preloadImages();
    updatePlayPauseUI(true);
    requestAnimationFrame(animationLoop);
    requestAnimationFrame(renderStardust);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
