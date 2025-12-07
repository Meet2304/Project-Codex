import React from 'react';

export function ProjectGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-24">
      {[1, 2, 3].map((i) => (
        <div key={i} className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-500/50 transition-colors">
          <div className="h-40 bg-zinc-800/50 rounded-lg mb-4 animate-pulse" />
          <h3 className="text-xl font-semibold mb-2">Project {i}</h3>
          <p className="text-zinc-500">Encrypted data fragment retrieved.</p>
        </div>
      ))}
    </div>
  );
}
