'use client';

import { useState, useEffect, ReactNode } from 'react';
import BlackHoleLoader from '@/components/canvas/BlackHoleLoader';

// Define the props this component accepts
interface LoadingScreenProps {
  children: ReactNode;      // The content to show after loading
  duration?: number;        // Ignored now, driven by animation callback
}

export default function LoadingScreen({ children }: LoadingScreenProps) {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [entering, setEntering] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  
  // Word animation state
  const [visibleWords, setVisibleWords] = useState(0);
  const introWords = ["AND", "SO,", "IT", "BEGINS..."];

  useEffect(() => {
    // Start showing words one by one
    const wordInterval = setInterval(() => {
      setVisibleWords(prev => (prev < introWords.length ? prev + 1 : prev));
    }, 600); // Slow, elegant pace

    // Fade out intro text just before the singularity/explosion
    const fadeTimer = setTimeout(() => {
      setShowIntro(false);
    }, 4000); // Keep text visible long enough to read

    return () => {
      clearInterval(wordInterval);
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      // Only trigger if animation is done, we haven't started entering, and user scrolls down
      if (animationComplete && !entering && e.deltaY > 0) {
        setEntering(true);
      }
    };
    
    window.addEventListener('wheel', handleScroll);
    return () => window.removeEventListener('wheel', handleScroll);
  }, [animationComplete, entering]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Intro Text Overlay */}
      <div 
        className={`
          absolute inset-0 z-20 flex items-center justify-center pointer-events-none
          transition-opacity duration-1000 ease-in-out
          ${showIntro ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <h2 className="text-white/90 text-2xl md:text-4xl font-light tracking-[0.2em] font-sans flex flex-wrap justify-center gap-3 md:gap-5">
          {introWords.map((word, i) => (
            <span 
              key={i}
              className={`
                transition-all duration-1000 ease-out transform
                ${i < visibleWords 
                  ? 'opacity-100 translate-y-0 blur-none' 
                  : 'opacity-0 translate-y-4 blur-sm'}
              `}
            >
              {word}
            </span>
          ))}
        </h2>
      </div>

      {/* Black Hole Background */}
      <div className={`transition-opacity duration-1000 ${showContent ? 'opacity-0' : 'opacity-100'}`}>
        <BlackHoleLoader 
          onAnimationComplete={() => setAnimationComplete(true)} 
          enterBlackHole={entering}
          onEnterComplete={() => setShowContent(true)}
        />
      </div>
      
      {/* 
        Main content container
        - Fades in when "warp" is complete (showContent is true)
        - z-10 to sit on top of the canvas
      */}
      <div 
        className={`
          relative z-10 min-h-screen w-full
          transition-opacity duration-1000 ease-out
          ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        {children}
      </div>
      
      {/* Scroll Hint (Only show when animation is done but haven't entered yet) */}
      <div 
        className={`
          absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-sm tracking-widest uppercase
          transition-opacity duration-500
          ${animationComplete && !entering ? 'opacity-100' : 'opacity-0'}
        `}
      >
        Scroll to Enter
      </div>
    </div>
  );
}