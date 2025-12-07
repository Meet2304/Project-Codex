import React from 'react';

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-12">
      <h1 className="text-6xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-6">
        CODEX v0.2
      </h1>
      <p className="text-xl text-zinc-400 max-w-2xl">
        You have crossed the event horizon. Welcome to the Living Manuscript.
      </p>
    </div>
  );
}
