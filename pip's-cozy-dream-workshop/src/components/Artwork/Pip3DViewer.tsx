import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Pip3DViewerProps {
  fallbackImage?: string;
  onToggleViewMode?: () => void;
  is3DMode?: boolean;
}

export function Pip3DViewer({
  fallbackImage = 'artwork/pip_avatar_full_v2.png',
  onToggleViewMode,
  is3DMode = true,
}: Pip3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const initialCameraPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 3.2));

  useEffect(() => {
    if (!is3DMode) return;
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let animationFrameId: number;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const width = container.clientWidth || 340;
    const height = container.clientHeight || 440;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 3.2);
    cameraRef.current = camera;
    initialCameraPos.current.copy(camera.position);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.4;
    controls.enableZoom = true;
    controls.minDistance = 1.8;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI * 0.75;
    controls.minPolarAngle = Math.PI * 0.2;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Pause auto-rotate when user starts interacting
    const onStartInteract = () => {
      // Keep state in sync if needed
    };
    controls.addEventListener('start', onStartInteract);

    // 5. Studio Lighting for Whimsical Dreamy Figurine Aesthetic
    // Soft warm ambient base
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.4);
    scene.add(ambientLight);

    // Warm golden key light (sun/lamp)
    const keyLight = new THREE.DirectionalLight(0xffdfba, 2.6);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    // Soft pastel pink/rose rim light (nursery twilight)
    const rimLight = new THREE.DirectionalLight(0xf472b6, 2.0);
    rimLight.position.set(-3.5, 2.5, -2.5);
    scene.add(rimLight);

    // Soft lilac bottom fill light
    const fillLight = new THREE.DirectionalLight(0xc4b5fd, 1.0);
    fillLight.position.set(0, -3, 2);
    scene.add(fillLight);

    // Subtle front warm starlight point light
    const pointLight = new THREE.PointLight(0xffedd5, 1.2, 8);
    pointLight.position.set(0, 0.5, 2);
    scene.add(pointLight);

    // 6. Model Root Group
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // 7. Load 3D.glb model
    const loader = new GLTFLoader();
    // Try primary path then fallback
    const modelUrl = 'models/3D.glb';

    loader.load(
      modelUrl,
      (gltf) => {
        if (!isMounted) return;

        const model = gltf.scene;

        // Custom Disney/Pixar collectible figurine material
        // Smooth porcelain cream with soft satin sheen & pastel subsurface tint
        const figurineMaterial = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color('#fff5ec'),
          roughness: 0.38,
          metalness: 0.04,
          clearcoat: 0.28,
          clearcoatRoughness: 0.2,
          sheen: 0.6,
          sheenColor: new THREE.Color('#fed7aa'),
          flatShading: false,
        });

        // Compute smooth normals and assign material
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            if (mesh.geometry) {
              mesh.geometry.computeVertexNormals();
            }
            mesh.material = figurineMaterial;
          }
        });

        // Compute exact bounding box and center at (0, 0, 0)
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        // Center model geometry at origin
        model.position.x = -center.x;
        model.position.y = -center.y;
        model.position.z = -center.z;

        // Scale model appropriately to fit nicely in the frame
        const maxDim = Math.max(size.x, size.y, size.z);
        const targetScale = 2.0 / maxDim;
        modelGroup.scale.setScalar(targetScale);

        modelGroup.add(model);
        setLoading(false);
      },
      (progress) => {
        if (progress.total > 0) {
          const pct = Math.round((progress.loaded / progress.total) * 100);
          setLoadingProgress(pct);
        }
      },
      (error) => {
        console.error('Error loading 3D.glb:', error);
        if (isMounted) {
          setHasError(true);
          setLoading(false);
        }
      }
    );

    // 8. Animation & Render Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Gentle floating breathing motion
      modelGroup.position.y = Math.sin(elapsedTime * 1.6) * 0.05;

      // Update orbit controls
      controls.autoRotate = isAutoRotating;
      controls.update();

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    });
    resizeObserver.observe(container);

    // 10. Clean up
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onStartInteract);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [is3DMode, isAutoRotating]);

  const handleResetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0.2, 3.2);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleToggleAutoRotate = () => {
    setIsAutoRotating((prev) => !prev);
  };

  if (!is3DMode || hasError) {
    return (
      <div className="relative z-10 max-w-[320px] sm:max-w-[360px] animate-float-gentle group">
        <img
          src={fallbackImage}
          alt="Pip the sleepy skull baby holding a warm glowing star bottle"
          className="w-full h-auto drop-shadow-2xl rounded-3xl object-contain border-2 border-[#ecd3c1]"
          loading="lazy"
        />
        {onToggleViewMode && (
          <button
            type="button"
            onClick={onToggleViewMode}
            className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold bg-white/90 text-[#a34063] shadow-md border border-[#ecd3c1] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span>🔄</span>
            <span>Switch to 3D</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] h-[430px] sm:h-[460px] rounded-3xl border-2 border-[#ecd3c1] bg-[#fffaf5]/90 backdrop-blur-sm shadow-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar inside 3D Card */}
      <div className="p-3.5 flex items-center justify-between z-20 pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fce7ed] text-[#a34063] text-xs font-bold border border-[#f5c6d3]">
          <span className="animate-spin text-[10px]">✦</span>
          <span>Interactive 3D Pip</span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Auto-rotate button */}
          <button
            type="button"
            onClick={handleToggleAutoRotate}
            title={isAutoRotating ? 'Pause auto-rotation' : 'Resume auto-rotation'}
            className="w-7 h-7 rounded-full bg-white/90 text-[#a34063] border border-[#ecd3c1] shadow-xs flex items-center justify-center text-xs hover:bg-[#fce7ed] transition-all cursor-pointer"
          >
            {isAutoRotating ? '⏸' : '▶'}
          </button>

          {/* Reset Camera button */}
          <button
            type="button"
            onClick={handleResetCamera}
            title="Reset 3D camera"
            className="w-7 h-7 rounded-full bg-white/90 text-[#a34063] border border-[#ecd3c1] shadow-xs flex items-center justify-center text-xs hover:bg-[#fce7ed] transition-all cursor-pointer"
          >
            ↺
          </button>

          {/* Toggle to 2D illustration */}
          {onToggleViewMode && (
            <button
              type="button"
              onClick={onToggleViewMode}
              title="View 2D storybook portrait"
              className="px-2.5 py-1 rounded-full bg-white/90 text-[#5a382e] border border-[#ecd3c1] shadow-xs text-xs font-bold hover:bg-[#fff0e5] transition-all cursor-pointer flex items-center gap-1"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              <span>🖼️</span>
              <span>2D</span>
            </button>
          )}
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#fff8f1]/90 backdrop-blur-xs p-6 text-center">
          <div className="w-12 h-12 rounded-full border-3 border-[#a34063]/30 border-t-[#a34063] animate-spin mb-3" />
          <h4
            className="font-editorial text-lg font-bold text-[#38201a] mb-1"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Summoning 3D Pip...
          </h4>
          <p className="text-xs text-[#5a382e] font-semibold">
            {loadingProgress > 0 ? `${loadingProgress}% loaded` : 'Preparing magical dream mesh ✨'}
          </p>
        </div>
      )}

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="w-full flex-1 cursor-grab active:cursor-grabbing touch-none relative"
        title="Click & drag to rotate 3D Pip · Scroll to zoom"
      />

      {/* Bottom Hint Pill */}
      <div className="p-3 text-center z-20 pointer-events-none">
        <span
          className="inline-block px-3.5 py-1 rounded-full bg-white/80 border border-[#ecd3c1] text-[11px] font-bold text-[#6e463a] shadow-xs"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          👆 Drag to Orbit · Scroll to Zoom
        </span>
      </div>
    </div>
  );
}
