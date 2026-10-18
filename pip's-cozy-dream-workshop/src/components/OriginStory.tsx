import React from 'react';

export function OriginStory() {
  const steps = [
    {
      step: 1,
      title: 'The Fallen Star',
      image: 'artwork/story_01_fallen_star_v2.png',
      alt: 'A gentle glowing star falling near the Midnight Nursery',
      text: 'One quiet night, a little star falls near the Midnight Nursery. Pip discovers it and notices that its glow changes whenever a sleepy dream passes nearby.',
    },
    {
      step: 2,
      title: 'The First Lullaby',
      image: 'artwork/story_02_first_lullaby_v2.png',
      alt: 'Pip building the first carved music box to help the star glow',
      text: 'Pip builds a tiny music box to help the tired star glow again. A gentle melody emerges, and Pip discovers a new purpose: creating small comforts for sleepy dreamers.',
    },
    {
      step: 3,
      title: 'The Dream Deliverer',
      image: 'artwork/story_03_dream_deliverer_v2.png',
      alt: 'Pip with starlight lantern and velvet kit delivering dreams to rooftops',
      text: 'With a dream lantern and a heart full of hope, Pip begins preparing little dreams and delivering them through the night as a Junior Dream Engineer.',
    },
  ];

  return (
    <section id="origin-story" className="py-20 md:py-28 relative bg-[#fffaf5] border-b border-[#ebd7c8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (Matches whole.png Section 4) */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[#e5a93c] text-xl">⭐</span>
            <h2
              className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              How a Little Star Found Its Way Home
            </h2>
            <span className="text-[#e5a93c] text-xl">⭐</span>
          </div>
          <p
            className="text-base sm:text-lg text-[#5a382e] font-semibold leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            Follow Pip's journey from a fallen star to the Midnight Nursery.
          </p>
        </div>

        {/* 3 Step Cards with connecting arrows (Desktop 3-column row) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Step 1 Card */}
          <div className="md:col-span-3 lg:col-span-3">
            <div
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all bg-white"
            >
              <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                <img
                  src={steps[0].image}
                  alt={steps[0].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#fce7ed] text-[#a34063] font-black text-xs flex items-center justify-center">
                    {steps[0].step}
                  </span>
                  <h3
                    className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {steps[0].title} <span className="text-[#e5a93c] text-sm">✦</span>
                  </h3>
                </div>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {steps[0].text}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center">
            <div className="w-9 h-9 rounded-full bg-[#fce7ed] border border-[#ecd3c1] flex items-center justify-center text-[#a34063] text-lg font-bold shadow-xs">
              ➔
            </div>
          </div>

          {/* Step 2 Card */}
          <div className="md:col-span-3 lg:col-span-4">
            <div
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all bg-white"
            >
              <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                <img
                  src={steps[1].image}
                  alt={steps[1].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#fce7ed] text-[#a34063] font-black text-xs flex items-center justify-center">
                    {steps[1].step}
                  </span>
                  <h3
                    className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {steps[1].title} <span className="text-[#e5a93c] text-sm">✦</span>
                  </h3>
                </div>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {steps[1].text}
                </p>
              </div>
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex md:col-span-1 justify-center items-center">
            <div className="w-9 h-9 rounded-full bg-[#fce7ed] border border-[#ecd3c1] flex items-center justify-center text-[#a34063] text-lg font-bold shadow-xs">
              ➔
            </div>
          </div>

          {/* Step 3 Card */}
          <div className="md:col-span-4 lg:col-span-3">
            <div
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:shadow-lg hover:border-[#a34063] transition-all bg-white"
            >
              <div className="h-44 sm:h-48 overflow-hidden bg-[#fff0e5]">
                <img
                  src={steps[2].image}
                  alt={steps[2].alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#fce7ed] text-[#a34063] font-black text-xs flex items-center justify-center">
                    {steps[2].step}
                  </span>
                  <h3
                    className="font-editorial text-lg sm:text-xl font-black text-[#38201a]"
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  >
                    {steps[2].title} <span className="text-[#e5a93c] text-sm">✦</span>
                  </h3>
                </div>
                <p
                  className="text-xs sm:text-sm text-[#5a382e] font-semibold leading-relaxed"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {steps[2].text}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
