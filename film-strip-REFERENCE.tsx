"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";

interface ExampleItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
}

const examples: ExampleItem[] = [
  { id: 1, src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=500&fit=crop", alt: "Bridal makeup look", caption: "Bridal" },
  { id: 2, src: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=500&fit=crop", alt: "Editorial makeup look", caption: "Editorial" },
  { id: 3, src: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=500&fit=crop", alt: "Glam makeup look", caption: "Glam" },
  { id: 4, src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=500&fit=crop", alt: "Natural makeup look", caption: "Natural" },
  { id: 5, src: "https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=500&fit=crop", alt: "Special occasion look", caption: "Special Occasion" },
  { id: 6, src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop", alt: "Soft glam look", caption: "Soft Glam" },
  { id: 7, src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop", alt: "Photoshoot makeup", caption: "Photoshoot" },
  { id: 8, src: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=500&fit=crop", alt: "Fashion makeup look", caption: "Fashion" },
];

const FRAME_WIDTH = 240;
const SPROCKET_STRIP_HEIGHT = 24;
const PHOTO_HEIGHT = 300;
const SPROCKETS_PER_FRAME = 4;
const SPROCKET_WIDTH = 12;
const SPROCKET_HEIGHT = 8;

export function FilmStripExamples() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollStart, setScrollStart] = useState(0);
  const [selectedImage, setSelectedImage] = useState<ExampleItem | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const SCROLL_SPEED = 35;
  const TOTAL_WIDTH = FRAME_WIDTH * examples.length;

  const animate = useCallback((currentTime: number) => {
    if (!isPaused && !isDragging) {
      const deltaTime = lastTimeRef.current ? (currentTime - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = currentTime;
      
      setScrollPosition((prev) => {
        const newPos = prev + SCROLL_SPEED * deltaTime;
        return newPos >= TOTAL_WIDTH ? 0 : newPos;
      });
    } else {
      lastTimeRef.current = currentTime;
    }
    animationRef.current = requestAnimationFrame(animate);
  }, [isPaused, isDragging, TOTAL_WIDTH]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  // Handle escape key and body scroll lock for modal
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setSelectedImage(null);
      };
      window.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEscape);
      };
    }
  }, [selectedImage]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setScrollStart(scrollPosition);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = startX - e.clientX;
    setScrollPosition(scrollStart + deltaX);
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setScrollStart(scrollPosition);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = startX - e.touches[0].clientX;
    setScrollPosition(scrollStart + deltaX);
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleImageClick = (item: ExampleItem, e: React.MouseEvent) => {
    if (!isDragging) {
      e.stopPropagation();
      setSelectedImage(item);
    }
  };

  const closeModal = () => setSelectedImage(null);

  const duplicatedExamples = [...examples, ...examples, ...examples];
  const totalFrames = duplicatedExamples.length;
  const totalSprockets = totalFrames * SPROCKETS_PER_FRAME;

  return (
    <section className="py-24 md:py-32 overflow-hidden bg-cream">
      {/* Heading */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-16">
        <p className="font-serif text-xs tracking-[0.4em] uppercase text-gold mb-4">
          Portfolio
        </p>
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-wine mb-4">
          <span className="italic">A few</span> of my looks.
        </h2>
        <p className="font-serif text-lg text-wine/50 italic">
          From bridal elegance to editorial drama
        </p>
      </div>

      {/* Film Strip - Full Width */}
      <div 
        className="relative w-screen left-1/2 -translate-x-1/2"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => { setIsPaused(false); handleMouseLeave(); }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ cursor: isDragging ? "grabbing" : "grab" }}
      >
        {/* Film strip base - rich matte black */}
        <div 
          className="relative overflow-hidden"
          style={{ 
            background: "#181716",
            height: SPROCKET_STRIP_HEIGHT * 2 + PHOTO_HEIGHT + 32,
          }}
        >
          {/* Film grain texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.06]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Worn edge effect - top */}
          <div 
            className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(60,55,50,0.4) 10%, rgba(60,55,50,0.3) 50%, rgba(60,55,50,0.4) 90%, transparent 100%)" }}
          />
          
          {/* Worn edge effect - bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px] pointer-events-none"
            style={{ background: "linear-gradient(90deg, transparent 0%, rgba(60,55,50,0.4) 10%, rgba(60,55,50,0.3) 50%, rgba(60,55,50,0.4) 90%, transparent 100%)" }}
          />

          {/* Single unified scrolling strip */}
          <div 
            className="absolute inset-0"
            style={{ 
              transform: `translateX(${-scrollPosition}px)`,
              transition: isDragging ? "none" : "transform 0.02s linear",
              width: FRAME_WIDTH * totalFrames,
            }}
          >
            {/* Top sprocket strip - continuous */}
            <div 
              className="absolute left-0 right-0 flex"
              style={{ 
                top: 8,
                height: SPROCKET_STRIP_HEIGHT,
              }}
            >
              {Array.from({ length: totalSprockets }).map((_, i) => (
                <div
                  key={`top-sprocket-${i}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: FRAME_WIDTH / SPROCKETS_PER_FRAME }}
                >
                  <div
                    style={{
                      width: SPROCKET_WIDTH,
                      height: SPROCKET_HEIGHT,
                      background: "#F5F0E8",
                      borderRadius: 1,
                      boxShadow: "inset 0 1px 1px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Photo frames row */}
            <div 
              className="absolute left-0 flex"
              style={{ 
                top: SPROCKET_STRIP_HEIGHT + 16,
                height: PHOTO_HEIGHT,
              }}
            >
              {duplicatedExamples.map((item, index) => (
                <div
                  key={`frame-${item.id}-${index}`}
                  className="flex-shrink-0 px-2"
                  style={{ width: FRAME_WIDTH }}
                >
                  {/* Film frame window */}
                  <button 
                    onClick={(e) => handleImageClick(item, e)}
                    className="relative h-full w-full overflow-hidden text-left cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
                    style={{
                      background: "#f8f4ef",
                      borderRadius: 2,
                      padding: 6,
                    }}
                  >
                    {/* Inner photo */}
                    <div className="relative w-full h-full overflow-hidden bg-neutral-300" style={{ borderRadius: 1 }}>
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        className="object-cover"
                        sizes="240px"
                      />
                      
                      {/* Vintage photo overlay - slight fade */}
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)",
                        }}
                      />
                      
                      {/* Caption */}
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <span className="font-serif italic text-white text-sm drop-shadow-md">
                          {item.caption}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Bottom sprocket strip - continuous */}
            <div 
              className="absolute left-0 right-0 flex"
              style={{ 
                bottom: 8,
                height: SPROCKET_STRIP_HEIGHT,
              }}
            >
              {Array.from({ length: totalSprockets }).map((_, i) => (
                <div
                  key={`bottom-sprocket-${i}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: FRAME_WIDTH / SPROCKETS_PER_FRAME }}
                >
                  <div
                    style={{
                      width: SPROCKET_WIDTH,
                      height: SPROCKET_HEIGHT,
                      background: "#F5F0E8",
                      borderRadius: 1,
                      boxShadow: "inset 0 1px 1px rgba(0,0,0,0.2)",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side vignette fades */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-20 md:w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to right, #F5F0E8 0%, transparent 100%)" }}
        />
        <div 
          className="absolute top-0 bottom-0 right-0 w-20 md:w-32 pointer-events-none z-10"
          style={{ background: "linear-gradient(to left, #F5F0E8 0%, transparent 100%)" }}
        />
      </div>

      {/* Tagline */}
      <div className="max-w-4xl mx-auto px-6 mt-16 text-center">
        <p className="font-serif text-2xl md:text-3xl text-wine/70">
          <span className="italic">Made</span> with love <span className="text-gold">&</span> <span className="italic">detail</span>.
        </p>
      </div>

      {/* Lightbox Modal */}
      <div 
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-all duration-500 ease-out ${
          selectedImage ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeModal}
      >
        {/* Backdrop - warm cream tinted overlay */}
        <div 
          className={`absolute inset-0 transition-all duration-500 ease-out ${
            selectedImage ? "opacity-100" : "opacity-0"
          }`}
          style={{ 
            background: "linear-gradient(135deg, rgba(245, 240, 232, 0.97) 0%, rgba(235, 228, 218, 0.97) 100%)",
          }}
        />
        
        {/* Modal content */}
        <div 
          className={`relative max-w-2xl w-full transition-all duration-500 ease-out ${
            selectedImage 
              ? "opacity-100 scale-100 translate-y-0" 
              : "opacity-0 scale-95 translate-y-4"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Elegant film frame styling for modal */}
          <div 
            className="relative p-4 md:p-5"
            style={{ 
              background: "#1a1918",
              borderRadius: 3,
              boxShadow: "0 25px 80px -20px rgba(0, 0, 0, 0.35), 0 10px 30px -10px rgba(0, 0, 0, 0.2)",
            }}
          >
            {/* Film grain texture */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                borderRadius: 3,
              }}
            />
            
            {/* Top sprockets for modal */}
            <div className="flex justify-between mb-4 px-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`modal-top-${i}`}
                  style={{
                    width: 16,
                    height: 10,
                    background: "#F5F0E8",
                    borderRadius: 1,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
            
            {/* Photo frame with cream border */}
            <div 
              className="relative overflow-hidden"
              style={{
                background: "#f8f4ef",
                borderRadius: 2,
                padding: 10,
              }}
            >
              <div 
                className="relative aspect-[4/5] overflow-hidden" 
                style={{ borderRadius: 1 }}
              >
                {selectedImage && (
                  <Image
                    src={selectedImage.src.replace("w=400&h=500", "w=1200&h=1500")}
                    alt={selectedImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                    priority
                  />
                )}
              </div>
            </div>
            
            {/* Bottom sprockets for modal */}
            <div className="flex justify-between mt-4 px-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`modal-bottom-${i}`}
                  style={{
                    width: 16,
                    height: 10,
                    background: "#F5F0E8",
                    borderRadius: 1,
                    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.15)",
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Caption below the film frame */}
          <div className="mt-8 text-center">
            <p className="font-serif text-3xl md:text-4xl text-wine italic">
              {selectedImage?.caption}
            </p>
            <p className="font-serif text-sm text-wine/50 mt-2 tracking-[0.2em] uppercase">
              {selectedImage?.alt}
            </p>
          </div>
          
          {/* Close button - elegant wine colored */}
          <button
            onClick={closeModal}
            className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
            style={{ 
              background: "#722F37",
              boxShadow: "0 4px 12px rgba(114, 47, 55, 0.3)",
            }}
            aria-label="Close"
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#F5F0E8" 
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
