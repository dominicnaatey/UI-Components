"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ROBOT_SLIDES } from './constants';

const NeoCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(2);
  const [isAnimating, setIsAnimating] = useState(false);
  const [cursorType, setCursorType] = useState<'left' | 'right' | null>(null);
  // Default to 1200 to avoid hydration mismatch, update on mount
  const [windowWidth, setWindowWidth] = useState(1200);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    // Set initial width
    const handleResize = () => setWindowWidth(window.innerWidth);
    
    // Initial call
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSlideChange = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const getWrappedIndex = (index: number) => {
    const len = ROBOT_SLIDES.length;
    return ((index % len) + len) % len;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    
    // Check if we are hovering the active slide (approx center)
    const isCenter = Math.abs(e.clientX - centerX) < (isMobile ? 120 : 200);
    
    if (isCenter) {
      setCursorType(null);
    } else if (e.clientX < centerX) {
      setCursorType('left');
    } else {
      setCursorType('right');
    }
  };

  const handleMouseLeave = () => {
    setCursorType(null);
  };

  const handleContainerClick = () => {
    if (isAnimating) return;
    if (cursorType === 'left') {
      handleSlideChange(activeIndex - 1);
    } else if (cursorType === 'right') {
      handleSlideChange(activeIndex + 1);
    }
  };

  const isMobile = windowWidth < 768;
  const slideWidth = isMobile ? windowWidth * 0.85 : 720;
  // Calculate spacing to create a 5px gap between the edge of the active slide and the neighbor.
  // Formula: slideWidth * 0.83 + 5
  // This ensures that (CenterNeighbor - CenterActive) - (HalfWidthActive + HalfWidthNeighbor) = 5px
  const slideSpacing = isMobile ? slideWidth * 0.83 + 10 : 628;

  const getSlideStyles = (index: number) => {
    const offset = index - activeIndex;
    const absOffset = Math.abs(offset);
    
    let translateX = 0;
    if (isMobile) {
      translateX = offset * slideSpacing;
    } else {
      // Non-linear spacing for desktop:
      // First neighbor is at regular spacing (628px)
      // Subsequent neighbors are packed closer (500px step) to be visible on edges
      if (absOffset <= 1) {
        translateX = offset * slideSpacing;
      } else {
        const direction = Math.sign(offset);
        const extraOffset = absOffset - 1;
        // 628 (base) + extra steps * 500 (tighter packing)
        translateX = direction * (slideSpacing + extraOffset * 500);
      }
    }

    const scale = offset === 0 ? 1 : 0.66;
    const opacity = 1; // Always keep slides visible so they show up on edges
    const zIndex = 10 - absOffset;

    return {
      transform: `translate3d(${translateX}px, 0px, 0px) scale3d(${scale}, ${scale}, 1)`,
      opacity,
      zIndex,
      width: `${slideWidth}px`,
      height: isMobile ? '60vh' : '720px',
      maxHeight: isMobile ? '470px' : '720px',
      transition: 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease',
    };
  };

  // Touch Support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleSlideChange(activeIndex + 1);
      else handleSlideChange(activeIndex - 1);
    }
    touchStart.current = null;
  };

  const getCursorClass = () => {
    if (isMobile) return '';
    if (cursorType === 'left') return 'cursor-w-resize';
    if (cursorType === 'right') return 'cursor-e-resize';
    return 'cursor-default';
  };

  return (
    <div className="pt-8 md:pt-20 w-full overflow-hidden flex flex-col items-center">
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleContainerClick}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={`relative w-full flex items-center justify-center carousel-container h-[450px] md:h-[720px] transition-all duration-300 ${getCursorClass()}`}
      >
        {/* Render a window of slides around the active index to create infinite effect */}
        {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
          const index = activeIndex + offset;
          const wrappedIndex = getWrappedIndex(index);
          const slide = ROBOT_SLIDES[wrappedIndex];
          const isCenter = index === activeIndex;
          
          return (
            <div
              key={index}
              className="absolute origin-center"
              style={getSlideStyles(index)}
              onClick={(e) => {
                if (!isCenter) {
                  e.stopPropagation();
                  handleSlideChange(index);
                }
              }}
            >
              <div className={`relative w-full h-full overflow-hidden rounded-[40px] md:rounded-[80px] shadow-2xl bg-white group transition-shadow duration-300 ${isCenter ? 'shadow-black/10' : 'shadow-none'}`}>
                {/* Image Label - Dark pill style matching the mobile reference */}
                {isCenter && (
                  <div className="absolute bottom-[32px] left-1/2 -translate-x-1/2 z-20 pointer-events-none">
                    <div className="text-white whitespace-nowrap text-[13px] font-medium rounded-full bg-black/80 backdrop-blur-md px-6 py-3 animate-in fade-in zoom-in-95 duration-500">
                      {slide.title}
                    </div>
                  </div>
                )}
  
                {/* Slide Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className={`object-cover transition-all duration-1000 object-top pointer-events-none ${isCenter ? 'scale-100 brightness-100' : 'scale-110 brightness-90'}`}
                    priority={Math.abs(offset) <= 1}
                    sizes="(max-width: 768px) 100vw, 720px"
                  />
                </div>
                
                {/* Desktop Detail Overlay */}
                {!isMobile && isCenter && (
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-12 text-white pointer-events-none">
                    <p className="text-xl font-light max-w-md drop-shadow-md">{slide.description}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots - Centered below carousel as in the reference */}
      <div className="flex justify-center items-center w-full px-[20px] mt-10 z-30">
        <div className="flex gap-[10px] items-center">
          {ROBOT_SLIDES.map((_, i) => {
             const isActive = getWrappedIndex(activeIndex) === i;
             return (
              <button
                key={i}
                className={`w-[8px] h-[8px] transition-all rounded-full cursor-pointer ${
                  isActive ? 'bg-gray-800 scale-110' : 'bg-gray-300'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  // Calculate shortest distance to the target index
                  const currentWrapped = getWrappedIndex(activeIndex);
                  let diff = i - currentWrapped;
                  // Optimize direction (e.g. from 0 to 4 should go -1, not +4)
                  if (diff > ROBOT_SLIDES.length / 2) diff -= ROBOT_SLIDES.length;
                  if (diff < -ROBOT_SLIDES.length / 2) diff += ROBOT_SLIDES.length;
                  
                  handleSlideChange(activeIndex + diff);
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NeoCarousel;
