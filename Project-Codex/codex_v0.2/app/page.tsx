'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { NavigationDock } from '@/components/NavigationDock';
import { HeroSection } from '@/components/HeroSection';
import { ProjectGrid } from '@/components/ProjectGrid';

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-zinc-950">
      <LoadingScreen>
        <div className="flex flex-col items-center justify-center min-h-screen p-8 relative">
          <HeroSection />
          <ProjectGrid />
          <NavigationDock />
        </div>
      </LoadingScreen>
    </main>
  );
}