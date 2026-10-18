import React from 'react';

interface EasterEggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggModal({ isOpen, onClose }: EasterEggModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Secret Dream from Pip"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-sm w-full p-8 rounded-3xl bg-[#fff8f1] border-2 border-[#ecd3c1] shadow-2xl text-center transform transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pip Illustration with nightcap (cropped from whole.png) */}
        <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#ecd3c1] mb-5 shadow-sm bg-[#fff0e5]">
          <img
            src="artwork/easter_egg_pip_v2.png"
            alt="Pip peeking out with a cozy nightcap"
            className="w-full h-full object-cover scale-110"
          />
        </div>

        {/* Heading: Psst... */}
        <h3
          className="font-editorial text-3xl font-black text-[#38201a] mb-2"
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
        >
          Psst...
        </h3>

        {/* Secret Dream Text */}
        <p
          className="text-base text-[#5a382e] font-semibold leading-relaxed mb-6"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Pip saved one extra dream just for you. ✨
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-full font-bold text-sm text-white bg-[#a34063] hover:bg-[#8b3452] active:scale-98 transition-all cursor-pointer shadow-md"
          style={{ fontFamily: "'Outfit', sans-serif" }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
