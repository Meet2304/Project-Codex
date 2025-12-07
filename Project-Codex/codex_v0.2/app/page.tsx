'use client';

import LoadingScreen from '@/components/LoadingScreen';
import { NavigationDock } from '@/components/NavigationDock';
import { HeroSection } from '@/components/HeroSection';
import { ProjectGrid } from '@/components/ProjectGrid';

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-zinc-950">
      <LoadingScreen>
        <div className="flex flex-col items-center justify-center min-h-screen p-8 relative pb-20">
          <HeroSection />
          {/* <ProjectGrid />
          <div className="w-full max-w-2xl my-20 space-y-4">
            <div className="text-center mb-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <h2 className="text-xl font-bold text-blue-200">🧪 Scroll Test Zone</h2>
              <p className="text-blue-300 text-sm">Scroll up and down to see the blur effect at the edges of the screen.</p>
            </div>
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <h3 className="font-mono text-zinc-500 text-xs mb-2">TEST ITEM {i + 1}</h3>
                <p className="text-zinc-300">
                  As this text moves to the top or bottom edge of the screen, it should gently fade away into the background color due to the Progressive Blur component.
                </p>
              </div>
            ))}
          </div> */}
          <NavigationDock />
        </div>
      </LoadingScreen>
    </main>
  );
}