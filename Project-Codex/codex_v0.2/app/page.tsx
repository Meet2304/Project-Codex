'use client';

import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  return (
    <main className="min-h-screen text-white bg-zinc-950">
      <LoadingScreen>
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6">
            CODEX v0.2
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mb-12">
            You have crossed the event horizon. Welcome to the Living Manuscript.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-colors">
                <div className="h-40 bg-zinc-800/50 rounded-lg mb-4 animate-pulse" />
                <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
                <p className="text-zinc-500">Encrypted data fragment retrieved.</p>
              </div>
            ))}
          </div>
        </div>
      </LoadingScreen>
    </main>
  );
}