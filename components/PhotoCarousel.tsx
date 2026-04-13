"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const carouselImages = Array.from({ length: 18 }, (_, i) => ({
  src: `/images/carousel/training-${String(i + 1).padStart(2, "0")}.jpg`,
  alt: `The Mindful Group training program photo ${i + 1}`,
}));

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
};

export default function PhotoCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const isPaused = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goToSlide = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrentIndex(index);
  }, []);

  const goNext = useCallback(() => {
    goToSlide((currentIndex + 1) % carouselImages.length, 1);
  }, [currentIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(
      (currentIndex - 1 + carouselImages.length) % carouselImages.length,
      -1
    );
  }, [currentIndex, goToSlide]);

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isPaused.current) {
        setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
        setDirection(1);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoPlay]);

  const handleManualNav = (action: () => void) => {
    action();
    startAutoPlay();
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Training program photos"
      className="relative rounded-lg overflow-hidden group"
      onMouseEnter={() => {
        isPaused.current = true;
      }}
      onMouseLeave={() => {
        isPaused.current = false;
      }}
    >
      {/* Slide container */}
      <div className="relative aspect-[16/9] md:aspect-[3/1]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, { offset }) => {
              if (offset.x < -50) handleManualNav(goNext);
              else if (offset.x > 50) handleManualNav(goPrev);
            }}
            className="absolute inset-0"
          >
            <Image
              src={carouselImages[currentIndex].src}
              alt={carouselImages[currentIndex].alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1280px"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Previous button */}
      <button
        onClick={() => handleManualNav(goPrev)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Previous photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={() => handleManualNav(goNext)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        aria-label="Next photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>

      {/* Dot indicators (desktop only) */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 hidden md:flex gap-2"
        aria-label="Slide navigation"
      >
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() =>
              handleManualNav(() =>
                goToSlide(i, i > currentIndex ? 1 : -1)
              )
            }
            className={`h-2 rounded-full transition-all cursor-pointer ${
              i === currentIndex
                ? "bg-white w-6"
                : "bg-white/50 hover:bg-white/70 w-2"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === currentIndex ? "true" : undefined}
          />
        ))}
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/40 text-white text-xs px-3 py-1 rounded-full">
        {currentIndex + 1} / {carouselImages.length}
      </div>
    </div>
  );
}
