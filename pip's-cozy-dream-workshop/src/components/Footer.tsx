import React from 'react';

export function Footer() {
  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#meet-pip' },
    { label: 'Creations', href: '#creations' },
    { label: 'Story', href: '#origin-story' },
    { label: 'Gallery', href: '#gallery' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-[#1a1728] text-white pt-16 pb-12 overflow-hidden border-t border-[#3a3055]">
      {/* Background Starlight & Village Panorama Backdrop */}
      <div className="absolute inset-0 opacity-45 pointer-events-none overflow-hidden">
        <img
          src="artwork/footer_backdrop_v2.png"
          alt="Midnight nursery rooftops and streetlamps under starry night"
          className="w-full h-full object-cover object-bottom"
          loading="eager" decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1728] via-[#1a1728]/70 to-[#1a1728]/30" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col items-center text-center">
        
        {/* Brand: ★ Pip's ★ Cozy Dream Workshop */}
        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[#e5a93c] text-base">★</span>
            <span
              className="font-editorial text-3xl sm:text-4xl font-extrabold tracking-tight text-[#fff8f1]"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Pip's
            </span>
            <span className="text-[#e5a93c] text-base">★</span>
          </div>
          <span
            className="text-base sm:text-lg font-bold text-[#e8c8b8] tracking-tight"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Cozy Dream Workshop
          </span>
          <p
            className="text-xs sm:text-sm text-[#b8a298] font-medium mt-1"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Small dreams. Brighter tomorrows.
          </p>
        </div>

        {/* Navigation Links: Home · About · Creations · Story · Gallery */}
        <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 mb-8" aria-label="Footer Links">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-bold text-[#f5eae1] hover:text-[#e8a5b2] transition-colors"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Social / Media Mini-Icons: 𝕏  📷  ▶ */}
        <div className="flex items-center gap-5 mb-10 text-lg text-[#ecd3c1]">
          <span className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
            𝕏
          </span>
          <span className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
            📷
          </span>
          <span className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all">
            ▶
          </span>
        </div>

        {/* Bottom Callout Pill (Exact match to whole.png Section 7) */}
        <div
          className="px-8 py-3.5 rounded-full border border-[#f0d5c0]/40 shadow-lg text-center"
          style={{
            backgroundColor: 'rgba(255, 248, 241, 0.95)',
          }}
        >
          <div className="flex items-center justify-center gap-1.5 text-sm sm:text-base font-bold text-[#38201a]" style={{ fontFamily: "'Fraunces', serif" }}>
            <span>Sweet dreams, little dreamer.</span>
            <span className="text-[#e5a93c]">⭐</span>
          </div>
          <div className="text-[11px] sm:text-xs text-[#6e463a] font-semibold mt-0.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
            A creative project for haX.baby — Baby's First Website
          </div>
        </div>

      </div>
    </footer>
  );
}
