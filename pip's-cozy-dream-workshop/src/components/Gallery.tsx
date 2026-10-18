import React, { useState } from 'react';

interface GalleryItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  alt: string;
}

export function Gallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'item-1',
      title: 'Pip Rested on the High Cloud',
      desc: 'Pip taking a quiet five-minute snooze wrapped in a cozy star blanket before midnight rounds.',
      image: 'artwork/gallery_01_sleepy_pip_v2.png',
      alt: 'Pip sleeping peacefully with a bunny plushie in cozy bedding',
    },
    {
      id: 'item-2',
      title: 'Midnight Nursery Rooftops',
      desc: 'The enchanted aerial route connecting the Nursery observatory to cottages throughout Sleepy Hollow.',
      image: 'artwork/gallery_02_village_panorama_v2.png',
      alt: 'Midnight village rooftops under a starry twilight sky',
    },
    {
      id: 'item-3',
      title: 'Observatory Snow Globe',
      desc: 'A miniature snow globe capturing the quiet snowfall over Midnight Nursery cottages.',
      image: 'artwork/gallery_03_snow_globe_v2.png',
      alt: 'Snowy village captured inside a glass globe',
    },
    {
      id: 'item-4',
      title: 'Dream Orb on Star Cushion',
      desc: 'Warm starlight condensed into a glowing crystal sphere on a velvet cushion.',
      image: 'artwork/gallery_04_crystal_orb_v2.png',
      alt: 'Glowing orb resting on a star-shaped cushion',
    },
    {
      id: 'item-5',
      title: 'The Cloud Cart Shift',
      desc: 'Pip riding through pink twilight clouds delivering soothing dreams to sleeping friends.',
      image: 'artwork/gallery_05_cloud_cart_v2.png',
      alt: 'Pip flying in a magical cloud cart over sleeping houses',
    },
    {
      id: 'item-6',
      title: 'Workshop Herb & Star Shelves',
      desc: 'Shelves lined with lavender lullaby essences, dried star-leaves, and glass potion vials.',
      image: 'artwork/gallery_06_workshop_shelves_v2.png',
      alt: 'Cozy workshop shelves with warm wooden cabinetry and glowing jars',
    },
    {
      id: 'item-7',
      title: 'Nursery Star Cushion Room',
      desc: 'Soft fluffy cloud cushions and pastel stars prepared for tired little dreamers.',
      image: 'artwork/gallery_07_cloud_nursery_v2.png',
      alt: 'Cozy nursery room filled with fluffy star cushions',
    },
  ];

  return (
    <section id="gallery" className="py-20 md:py-28 relative bg-[#fff8f1] border-b border-[#ebd7c8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header (Matches whole.png Section 5) */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-[#e5a93c] text-xl">⭐</span>
            <h2
              className="font-editorial text-4xl sm:text-5xl font-black text-[#38201a] tracking-tight"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              Little Windows Into Dreamland
            </h2>
            <span className="text-[#e5a93c] text-xl">⭐</span>
          </div>
          <p
            className="text-base sm:text-lg text-[#5a382e] font-semibold leading-relaxed"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            A few favorite snapshots from Pip's world.
          </p>
        </div>

        {/* Bento Collage Layout (Exact matching arrangement from whole.png) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          {/* Column 1 (Left): Feature 1 (Tall) + Feature 2 (Panorama) */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Gallery 1 (Big Left) */}
            <div
              onClick={() => setSelectedItem(galleryItems[0])}
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group flex-1 bg-white relative h-64 sm:h-72"
            >
              <img
                src={galleryItems[0].image}
                alt={galleryItems[0].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                <span className="text-white text-sm font-bold">{galleryItems[0].title}</span>
              </div>
            </div>

            {/* Gallery 2 (Bottom Left) */}
            <div
              onClick={() => setSelectedItem(galleryItems[1])}
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative h-36 sm:h-40"
            >
              <img
                src={galleryItems[1].image}
                alt={galleryItems[1].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-bold">{galleryItems[1].title}</span>
              </div>
            </div>
          </div>

          {/* Column 2 (Center): 2 Top Squares + Bottom Wide */}
          <div className="md:col-span-4 flex flex-col gap-5">
            {/* Top Row: Gallery 3 & Gallery 4 */}
            <div className="grid grid-cols-2 gap-5 h-44 sm:h-52">
              <div
                onClick={() => setSelectedItem(galleryItems[2])}
                className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative"
              >
                <img
                  src={galleryItems[2].image}
                  alt={galleryItems[2].alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-white text-xs font-bold">{galleryItems[2].title}</span>
                </div>
              </div>

              <div
                onClick={() => setSelectedItem(galleryItems[3])}
                className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative"
              >
                <img
                  src={galleryItems[3].image}
                  alt={galleryItems[3].alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="eager" decoding="async"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-white text-xs font-bold">{galleryItems[3].title}</span>
                </div>
              </div>
            </div>

            {/* Bottom: Gallery 5 (Cloud Cart) */}
            <div
              onClick={() => setSelectedItem(galleryItems[4])}
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative flex-1 min-h-[140px]"
            >
              <img
                src={galleryItems[4].image}
                alt={galleryItems[4].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-bold">{galleryItems[4].title}</span>
              </div>
            </div>
          </div>

          {/* Column 3 (Right): Gallery 6 (Top) + Gallery 7 (Bottom) */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <div
              onClick={() => setSelectedItem(galleryItems[5])}
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative flex-1 min-h-[160px]"
            >
              <img
                src={galleryItems[5].image}
                alt={galleryItems[5].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-bold">{galleryItems[5].title}</span>
              </div>
            </div>

            <div
              onClick={() => setSelectedItem(galleryItems[6])}
              className="rounded-3xl border-2 border-[#ecd3c1] overflow-hidden shadow-xs hover:border-[#a34063] hover:shadow-xl transition-all cursor-pointer group bg-white relative flex-1 min-h-[160px]"
            >
              <img
                src={galleryItems[6].image}
                alt={galleryItems[6].alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager" decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <span className="text-white text-xs font-bold">{galleryItems[6].title}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-2xl w-full rounded-3xl bg-[#fff8f1] border-2 border-[#ecd3c1] p-6 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-[#fce7ed] text-[#a34063] font-bold flex items-center justify-center cursor-pointer shadow-sm"
            >
              ✕
            </button>
            <div className="rounded-2xl overflow-hidden max-h-[380px] bg-black/10 mb-5">
              <img
                src={selectedItem.image}
                alt={selectedItem.alt}
                className="w-full h-full object-contain max-h-[380px] mx-auto"
              />
            </div>
            <h3
              className="font-editorial text-2xl font-black text-[#38201a] mb-2"
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            >
              {selectedItem.title}
            </h3>
            <p
              className="text-sm text-[#5a382e] font-semibold leading-relaxed"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              {selectedItem.desc}
            </p>
          </div>
        </div>
      )}

    </section>
  );
}
