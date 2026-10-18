import React, { useState } from 'react';

// Character illustration: Pip the adorable gentle Skull Baby on a cozy cloud
export function PipAvatarCloudSvg({ className = "w-full h-auto", isHovered = false }: { className?: string; isHovered?: boolean }) {
  return (
    <svg
      viewBox="0 0 400 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-500 ${isHovered ? 'scale-[1.03] rotate-1' : ''}`}
      aria-label="Pip the sleepy skull baby sitting cozily on a crescent cloud"
    >
      <defs>
        {/* Gradients */}
        <radialGradient id="pipGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.4" />
          <stop offset="60%" stopColor="#F472B6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#B9A1E8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="amberEye" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </radialGradient>
        <linearGradient id="nightcapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#EDE9FE" />
        </linearGradient>
        <linearGradient id="pinkRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="100%" stopColor="#A34063" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Ambient background aura */}
      <circle cx="200" cy="200" r="170" fill="url(#pipGlow)" />

      {/* Cozy Puffy Cloud Base */}
      <g id="cloud-base" className="filter drop-shadow-md">
        {/* Soft lower shadows */}
        <ellipse cx="200" cy="355" rx="145" ry="32" fill="#E2D9F3" />
        {/* Cloud puffs */}
        <circle cx="110" cy="330" r="48" fill="url(#cloudGrad)" />
        <circle cx="170" cy="310" r="58" fill="url(#cloudGrad)" />
        <circle cx="240" cy="312" r="54" fill="url(#cloudGrad)" />
        <circle cx="295" cy="334" r="44" fill="url(#cloudGrad)" />
        <ellipse cx="200" cy="340" rx="130" ry="34" fill="url(#cloudGrad)" />

        {/* Little golden star tucked in cloud */}
        <polygon points="120,315 124,324 134,324 126,330 129,339 120,333 111,339 114,330 106,324 116,324" fill="#FBBF24" />
      </g>

      {/* Pip's Cozy Little Body & Pajama Sleeves */}
      <g id="pip-body">
        {/* Soft pastel lavender nightshirt */}
        <path
          d="M150 255 C140 255 125 290 135 320 C165 325 235 325 265 320 C275 290 260 255 250 255 Z"
          fill="#DDD6FE"
          stroke="#C4B5FD"
          strokeWidth="2.5"
        />
        {/* Tiny pajama buttons */}
        <circle cx="200" cy="275" r="3.5" fill="#A34063" />
        <circle cx="200" cy="292" r="3.5" fill="#A34063" />

        {/* Tiny mitten hands resting gently */}
        <circle cx="148" cy="295" r="14" fill="#FAF5ED" stroke="#E5DEC9" strokeWidth="2" />
        <circle cx="252" cy="295" r="14" fill="#FAF5ED" stroke="#E5DEC9" strokeWidth="2" />

        {/* Dream measuring caliper / tiny quill in hand */}
        <path d="M255 285 L280 260" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        <circle cx="282" cy="258" r="4" fill="#FBBF24" />
      </g>

      {/* Pip's Smooth Round Skull Head */}
      <g id="pip-head">
        {/* Skull base: warm ivory porcelain tone */}
        <ellipse cx="200" cy="180" rx="72" ry="68" fill="#FFFBF5" stroke="#EFE4D6" strokeWidth="3" />
        {/* Soft lower jaw curve */}
        <path
          d="M165 210 C165 240 235 240 235 210 Z"
          fill="#FFFBF5"
          stroke="#EFE4D6"
          strokeWidth="3"
        />

        {/* Rosy blush on cheeks */}
        <ellipse cx="145" cy="198" rx="14" ry="8" fill="#F472B6" opacity="0.35" />
        <ellipse cx="255" cy="198" rx="14" ry="8" fill="#F472B6" opacity="0.35" />

        {/* Soft large eye sockets */}
        <ellipse cx="168" cy="172" rx="20" ry="24" fill="#3B2820" />
        <ellipse cx="232" cy="172" rx="20" ry="24" fill="#3B2820" />

        {/* Warm amber glowing eyes */}
        <circle cx="170" cy="172" r="12" fill="url(#amberEye)" />
        <circle cx="230" cy="172" r="12" fill="url(#amberEye)" />

        {/* Friendly starlight reflections in eyes */}
        <circle cx="166" cy="167" r="4.5" fill="#FFFFFF" />
        <circle cx="174" cy="176" r="2" fill="#FFFFFF" opacity="0.8" />
        <circle cx="226" cy="167" r="4.5" fill="#FFFFFF" />
        <circle cx="234" cy="176" r="2" fill="#FFFFFF" opacity="0.8" />

        {/* Tiny sweet inverted heart skull nose */}
        <path
          d="M200 193 C198 189 193 189 194 194 C195 198 200 202 200 202 C200 202 205 198 206 194 C207 189 202 189 200 193 Z"
          fill="#4A3428"
        />

        {/* Tiny crooked smile */}
        <path
          d="M188 214 Q201 223 214 212"
          fill="none"
          stroke="#4A3428"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Tiny cute stitch lines on smile */}
        <line x1="194" y1="214" x2="194" y2="218" stroke="#4A3428" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="202" y1="216" x2="202" y2="220" stroke="#4A3428" strokeWidth="1.8" strokeLinecap="round" />
        <line x1="209" y1="214" x2="209" y2="218" stroke="#4A3428" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* Cozy Bedtime Nightcap with Stars and Pink Bow */}
      <g id="pip-nightcap">
        {/* Brim of cap fitting snugly on forehead */}
        <path
          d="M132 155 Q200 135 268 155 Q200 120 132 155 Z"
          fill="#FFFFFF"
          stroke="#E5E7EB"
          strokeWidth="2"
        />

        {/* Cone of the nightcap flopping gracefully to the side */}
        <path
          d="M136 150 C140 85 240 70 280 110 C310 140 315 195 295 205 C280 210 270 190 270 170 C270 130 220 115 180 130 Z"
          fill="url(#nightcapGrad)"
        />

        {/* Stars decorated on the cap */}
        <polygon points="175,105 178,111 185,111 180,115 182,121 175,117 168,121 170,115 165,111 172,111" fill="#FDE047" opacity="0.9" />
        <polygon points="215,92 217,97 223,97 218,100 220,105 215,102 210,105 212,100 207,97 213,97" fill="#FDE047" opacity="0.9" />
        <polygon points="255,115 257,119 262,119 258,122 259,126 255,124 251,126 252,122 248,119 253,119" fill="#FDE047" opacity="0.9" />
        <polygon points="280,165 282,168 286,168 283,171 284,174 280,172 277,174 278,171 275,168 279,168" fill="#FDE047" opacity="0.85" />

        {/* Fluffy Pom-pom on nightcap tip */}
        <circle cx="295" cy="205" r="16" fill="#FFFFFF" stroke="#EDE9FE" strokeWidth="2" />
        <circle cx="292" cy="202" r="3" fill="#DDD6FE" />

        {/* Pink Bow at the nightcap fold */}
        <g id="pink-bow" transform="translate(155, 142)">
          {/* Left loop */}
          <ellipse cx="-10" cy="0" rx="10" ry="7" fill="url(#pinkRibbon)" transform="rotate(-15)" />
          {/* Right loop */}
          <ellipse cx="10" cy="0" rx="10" ry="7" fill="url(#pinkRibbon)" transform="rotate(15)" />
          {/* Knot */}
          <circle cx="0" cy="0" r="5" fill="#A34063" />
          {/* Ribbon tails */}
          <path d="M-2 4 Q-6 16 -12 18" stroke="#A34063" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M2 4 Q6 16 12 18" stroke="#A34063" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </g>

      {/* Floating Starlight Sparkles around Pip */}
      <g id="celestial-sparkles">
        <polygon points="80,180 82,186 89,188 83,191 84,198 79,193 74,197 76,190 71,187 77,185" fill="#FBBF24" opacity="0.8" />
        <polygon points="325,100 327,105 333,107 328,110 329,116 324,112 319,115 321,109 316,106 322,105" fill="#FBBF24" opacity="0.7" />
        <circle cx="95" cy="140" r="2.5" fill="#FDE68A" />
        <circle cx="330" cy="250" r="3" fill="#FDE68A" />
      </g>
    </svg>
  );
}

// Lullaby Music Box Illustration
export function PipLullabyBoxSvg({ className = "w-full h-auto", isPlaying = false }: { className?: string; isPlaying?: boolean }) {
  return (
    <svg viewBox="0 0 320 280" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Pip's carved wooden lullaby music box">
      <defs>
        <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#85583E" />
          <stop offset="50%" stopColor="#6C4229" />
          <stop offset="100%" stopColor="#4F2E1B" />
        </linearGradient>
        <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="40%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>
        <linearGradient id="boxLidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9C6B4E" />
          <stop offset="100%" stopColor="#7B4C32" />
        </linearGradient>
      </defs>

      {/* Music Box Body */}
      <rect x="50" y="120" width="220" height="110" rx="14" fill="url(#woodGrad)" stroke="#382012" strokeWidth="3" />
      {/* Front carved panel inlay */}
      <rect x="65" y="135" width="190" height="80" rx="8" fill="#583520" stroke="#9C6B4E" strokeWidth="1.5" />

      {/* Crescent moon marquetry inlay on front */}
      <path
        d="M150 175 C150 160 162 148 177 148 C168 152 163 163 163 175 C163 187 168 198 177 202 C162 202 150 190 150 175 Z"
        fill="#FDE68A"
      />
      {/* Tiny stars marquetry */}
      <circle cx="130" cy="165" r="3" fill="#FDE68A" />
      <circle cx="190" cy="185" r="2.5" fill="#FDE68A" />
      <circle cx="120" cy="185" r="2" fill="#FDE68A" />

      {/* Decorative brass feet */}
      <ellipse cx="75" cy="232" rx="10" ry="5" fill="url(#brassGrad)" />
      <ellipse cx="245" cy="232" rx="10" ry="5" fill="url(#brassGrad)" />

      {/* Music Box Hinged Lid (Propped Open) */}
      <path
        d="M45 120 L160 45 L275 120 Z"
        fill="url(#boxLidGrad)"
        stroke="#382012"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Velvet interior lining glowing */}
      <polygon points="58,118 160,55 262,118" fill={isPlaying ? "#A34063" : "#742442"} />

      {/* Brass Music Comb & Cylinder Mechanism inside */}
      <g transform="translate(120, 85)">
        <rect x="0" y="5" width="80" height="20" rx="3" fill="url(#brassGrad)" />
        {/* Tines */}
        <line x1="10" y1="2" x2="10" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="20" y1="1" x2="20" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="30" y1="3" x2="30" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="40" y1="2" x2="40" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="50" y1="1" x2="50" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="60" y1="2" x2="60" y2="8" stroke="#FEF08A" strokeWidth="2" />
        <line x1="70" y1="3" x2="70" y2="8" stroke="#FEF08A" strokeWidth="2" />
      </g>

      {/* Brass Hand Crank on side */}
      <g transform="translate(268, 160)" className={isPlaying ? "animate-spin origin-[0_10px]" : ""}>
        <path d="M0 10 L25 10 L25 35" stroke="url(#brassGrad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="25" cy="35" r="6" fill="#F59E0B" />
      </g>

      {/* Floating musical notes */}
      {isPlaying && (
        <g id="floating-notes">
          <text x="90" y="70" fontSize="24" fill="#E5A83B" className="animate-note-1 font-serif select-none">♪</text>
          <text x="175" y="45" fontSize="28" fill="#F472B6" className="animate-note-2 font-serif select-none">♫</text>
          <text x="235" y="65" fontSize="22" fill="#B9A1E8" className="animate-note-3 font-serif select-none">♩</text>
        </g>
      )}
    </svg>
  );
}

// Dream Lantern Illustration
export function PipDreamLanternSvg({ className = "w-full h-auto", isLit = true }: { className?: string; isLit?: boolean }) {
  return (
    <svg viewBox="0 0 280 340" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Pip's glowing starlight dream lantern">
      <defs>
        <radialGradient id="lanternGlow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity={isLit ? "0.9" : "0.2"} />
          <stop offset="45%" stopColor="#F59E0B" stopOpacity={isLit ? "0.45" : "0.08"} />
          <stop offset="85%" stopColor="#A34063" stopOpacity={isLit ? "0.15" : "0"} />
          <stop offset="100%" stopColor="#A34063" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C4229" />
          <stop offset="50%" stopColor="#4A2818" />
          <stop offset="100%" stopColor="#30190D" />
        </linearGradient>
      </defs>

      {/* Ambient starlight aura */}
      <circle cx="140" cy="185" r="110" fill="url(#lanternGlow)" />

      {/* Hanging handle / ring */}
      <path d="M110 50 C110 20 170 20 170 50" stroke="url(#metalGrad)" strokeWidth="6" strokeLinecap="round" fill="none" />

      {/* Lantern Roof / Cap */}
      <path d="M90 75 L140 45 L190 75 Z" fill="url(#metalGrad)" stroke="#27140B" strokeWidth="2" />
      <rect x="75" y="75" width="130" height="15" rx="3" fill="url(#metalGrad)" stroke="#27140B" strokeWidth="2" />

      {/* Star cutouts in roof for ventilation */}
      <polygon points="140,55 142,60 147,60 143,63 145,68 140,65 135,68 137,63 133,60 138,60" fill={isLit ? "#FEF08A" : "#6C4229"} />

      {/* Glass Chamber */}
      <rect
        x="85"
        y="90"
        width="110"
        height="140"
        rx="6"
        fill={isLit ? "rgba(255, 250, 230, 0.25)" : "rgba(30, 20, 40, 0.4)"}
        stroke="url(#metalGrad)"
        strokeWidth="4"
      />

      {/* Protective cage wire bars */}
      <line x1="120" y1="90" x2="120" y2="230" stroke="url(#metalGrad)" strokeWidth="3" opacity="0.6" />
      <line x1="160" y1="90" x2="160" y2="230" stroke="url(#metalGrad)" strokeWidth="3" opacity="0.6" />

      {/* Inside: Captured Sleeping Baby Star */}
      <g id="star-inside" className={isLit ? "animate-pulse" : ""}>
        <polygon
          points="140,140 146,155 162,156 150,166 154,182 140,172 126,182 130,166 118,156 134,155"
          fill={isLit ? "#FBBF24" : "#92400E"}
          stroke={isLit ? "#FEF08A" : "#78350F"}
          strokeWidth="2"
        />
        {/* Star's sleepy closed eyes */}
        {isLit && (
          <>
            <path d="M135 159 Q138 162 141 159" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
            <path d="M141 159 Q144 162 147 159" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          </>
        )}
      </g>

      {/* Lantern Base */}
      <rect x="75" y="230" width="130" height="20" rx="4" fill="url(#metalGrad)" stroke="#27140B" strokeWidth="2" />
      <rect x="85" y="250" width="110" height="10" rx="3" fill="#27140B" />
    </svg>
  );
}

// Night Village Delivery Route Map Illustration
export function PipNightVillageSvg({ className = "w-full h-auto", activeStep = 0 }: { className?: string; activeStep?: number }) {
  return (
    <svg viewBox="0 0 500 320" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Illustrated dream delivery route through Midnight Village">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E1B38" />
          <stop offset="50%" stopColor="#28224E" />
          <stop offset="100%" stopColor="#372E63" />
        </linearGradient>
        <linearGradient id="hillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A2445" />
          <stop offset="100%" stopColor="#181429" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="500" height="320" rx="16" fill="url(#skyGrad)" />

      {/* Gentle hills */}
      <path d="M0 240 Q120 190 250 220 T500 230 L500 320 L0 320 Z" fill="url(#hillGrad)" />
      <path d="M0 265 Q180 230 360 260 T500 270 L500 320 L0 320 Z" fill="#131022" />

      {/* Sleeping houses with warm chimney puffs */}
      {/* House 1: Midnight Nursery (Left) */}
      <g transform="translate(40, 180)">
        <polygon points="35,0 0,25 70,25" fill="#A34063" />
        <rect x="10" y="25" width="50" height="45" rx="3" fill="#FFF8F1" />
        {/* Warm lit window */}
        <rect x="25" y="35" width="20" height="20" rx="3" fill="#FBBF24" />
        <line x1="35" y1="35" x2="35" y2="55" stroke="#78350F" strokeWidth="1.5" />
        <line x1="25" y1="45" x2="45" y2="45" stroke="#78350F" strokeWidth="1.5" />
        {/* Observatory tower with telescope */}
        <rect x="52" y="-12" width="18" height="25" rx="2" fill="#85583E" />
        <circle cx="61" cy="-12" r="9" fill="#B9A1E8" />
      </g>

      {/* House 2: Willow Cottage (Middle) */}
      <g transform="translate(210, 175)">
        <polygon points="30,0 5,22 55,22" fill="#5C4033" />
        <rect x="12" y="22" width="36" height="40" rx="2" fill="#E2D9F3" />
        <rect x="22" y="32" width="16" height="16" rx="2" fill="#FDE68A" />
      </g>

      {/* House 3: Sleepy Cove Cottage (Right) */}
      <g transform="translate(390, 190)">
        <polygon points="30,0 5,20 55,20" fill="#A34063" />
        <rect x="12" y="20" width="36" height="45" rx="2" fill="#FFF8F1" />
        <rect x="22" y="30" width="16" height="16" rx="2" fill="#FDE68A" />
      </g>

      {/* Crescent Moon in Sky */}
      <path
        d="M440 60 C440 38 456 22 475 22 C462 27 454 41 454 58 C454 75 463 88 475 94 C456 94 440 78 440 60 Z"
        fill="#FEF08A"
        opacity="0.9"
      />

      {/* Delivery Flight Path (Curved dashed celestial line) */}
      <path
        id="deliveryTrack"
        d="M80 180 C 130 90, 200 130, 240 180 C 290 230, 360 110, 420 195"
        fill="none"
        stroke="#E5A83B"
        strokeWidth="3"
        strokeDasharray="6 6"
        className="opacity-80"
      />

      {/* Waypoint Stations */}
      {/* Waypoint 1: Midnight Nursery */}
      <circle cx="80" cy="180" r={activeStep === 0 ? "8" : "6"} fill={activeStep === 0 ? "#F59E0B" : "#B9A1E8"} stroke="#FFFFFF" strokeWidth="2" />
      {/* Waypoint 2: Starlight Ridge */}
      <circle cx="160" cy="115" r={activeStep === 1 ? "8" : "6"} fill={activeStep === 1 ? "#F59E0B" : "#B9A1E8"} stroke="#FFFFFF" strokeWidth="2" />
      {/* Waypoint 3: Willow Lane */}
      <circle cx="240" cy="180" r={activeStep === 2 ? "8" : "6"} fill={activeStep === 2 ? "#F59E0B" : "#B9A1E8"} stroke="#FFFFFF" strokeWidth="2" />
      {/* Waypoint 4: Sleepy Cove */}
      <circle cx="420" cy="195" r={activeStep === 3 ? "8" : "6"} fill={activeStep === 3 ? "#F59E0B" : "#B9A1E8"} stroke="#FFFFFF" strokeWidth="2" />

      {/* The Animated Delivery Star traveling along the route */}
      <g>
        <animateMotion
          dur="8s"
          repeatCount="indefinite"
          path="M80 180 C 130 90, 200 130, 240 180 C 290 230, 360 110, 420 195"
        />
        {/* Star packet */}
        <circle cx="0" cy="0" r="12" fill="#FDE047" opacity="0.4" />
        <polygon points="0,-8 2,-2 8,-2 3,2 5,8 0,4 -5,8 -3,2 -8,-2 -2,-2" fill="#F59E0B" />
      </g>
    </svg>
  );
}

// Nursery Toys & Blocks Illustration
export function PipNurseryToysSvg({ className = "w-full h-auto", isRattleShaken = false }: { className?: string; isRattleShaken?: boolean }) {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Pip's nursery dream blocks and star rattle">
      {/* Stacking Wooden Dream Blocks */}
      {/* Block 1 (Base): Cream block with engraved Moon */}
      <g transform="translate(60, 160)">
        <rect x="0" y="0" width="70" height="70" rx="8" fill="#FFF8F1" stroke="#5C4033" strokeWidth="2.5" />
        <path d="M30 48 C30 38 38 30 48 30 C42 33 39 40 39 48 C39 56 42 62 48 65 C38 65 30 58 30 48 Z" fill="#A34063" />
      </g>

      {/* Block 2: Pink block with engraved Star */}
      <g transform="translate(85, 95)">
        <rect x="0" y="0" width="60" height="60" rx="7" fill="#FCE7F3" stroke="#A34063" strokeWidth="2.5" />
        <polygon points="30,15 34,25 45,25 36,32 39,43 30,36 21,43 24,32 15,25 26,25" fill="#A34063" />
      </g>

      {/* Block 3 (Top): Lavender block with engraved Cloud */}
      <g transform="translate(105, 42)">
        <rect x="0" y="0" width="50" height="50" rx="6" fill="#EDE9FE" stroke="#6366F1" strokeWidth="2" />
        <circle cx="20" cy="27" r="7" fill="#8B5CF6" />
        <circle cx="28" cy="23" r="8" fill="#8B5CF6" />
        <circle cx="34" cy="27" r="6" fill="#8B5CF6" />
        <rect x="18" y="27" width="18" height="7" fill="#8B5CF6" />
      </g>

      {/* Celestial Baby Rattle */}
      <g
        transform="translate(220, 140)"
        className={`cursor-pointer transition-transform duration-300 origin-bottom ${isRattleShaken ? 'rotate-12 scale-105' : 'hover:-rotate-6'}`}
      >
        {/* Rattle handle */}
        <path d="M0 60 L0 10" stroke="#85583E" strokeWidth="6" strokeLinecap="round" />
        {/* Wooden grip ring */}
        <circle cx="0" cy="65" r="9" stroke="#85583E" strokeWidth="4" fill="none" />

        {/* Head of rattle: glowing star ring with brass bells */}
        <circle cx="0" cy="0" r="28" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="3" />
        <polygon points="0,-16 4,-4 16,-4 7,3 10,15 0,8 -10,15 -7,3 -16,-4 -4,-4" fill="#FBBF24" />

        {/* Tiny bells around perimeter */}
        <circle cx="-24" cy="-12" r="5" fill="#D97706" />
        <circle cx="24" cy="-12" r="5" fill="#D97706" />
        <circle cx="0" cy="-28" r="5" fill="#D97706" />
      </g>
    </svg>
  );
}

// Universal Remote or Fallback Image Component
export function RemoteOrFallbackArtwork({
  url,
  fallback,
  alt,
  className = "",
  isHovered = false,
  isPlaying = false,
  isLit = true,
}: {
  url?: string;
  fallback: 'cloud' | 'box' | 'lantern' | 'village' | 'toys' | 'portrait';
  alt: string;
  className?: string;
  isHovered?: boolean;
  isPlaying?: boolean;
  isLit?: boolean;
}) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  // If there's an image URL and no error has occurred yet, attempt to load it
  if (url && !imgError) {
    return (
      <div className={`relative overflow-hidden flex items-center justify-center ${className}`}>
        {/* While loading or on error, keep fallback visible seamlessly */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            {renderFallback(fallback, isHovered, isPlaying, isLit)}
          </div>
        )}
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-full h-full object-contain transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    );
  }

  // Graceful fallback to handcrafted SVG
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {renderFallback(fallback, isHovered, isPlaying, isLit)}
    </div>
  );
}

function renderFallback(
  fallback: 'cloud' | 'box' | 'lantern' | 'village' | 'toys' | 'portrait',
  isHovered = false,
  isPlaying = false,
  isLit = true
) {
  switch (fallback) {
    case 'cloud':
    case 'portrait':
      return <PipAvatarCloudSvg isHovered={isHovered} className="w-full h-auto max-h-[380px]" />;
    case 'box':
      return <PipLullabyBoxSvg isPlaying={isPlaying} className="w-full h-auto max-h-[320px]" />;
    case 'lantern':
      return <PipDreamLanternSvg isLit={isLit} className="w-full h-auto max-h-[340px]" />;
    case 'village':
      return <PipNightVillageSvg className="w-full h-auto max-h-[320px]" />;
    case 'toys':
      return <PipNurseryToysSvg className="w-full h-auto max-h-[300px]" />;
    default:
      return <PipAvatarCloudSvg className="w-full h-auto max-h-[380px]" />;
  }
}
