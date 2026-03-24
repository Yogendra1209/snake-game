/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-['VT323'] selection:bg-fuchsia-500 selection:text-black flex flex-col items-center justify-between p-4 md:p-8 overflow-hidden relative uppercase">
      <div className="static-bg"></div>
      <div className="scanlines"></div>

      {/* Background Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-30" 
           style={{ 
             backgroundImage: 'linear-gradient(to right, #06b6d4 2px, transparent 2px), linear-gradient(to bottom, #06b6d4 2px, transparent 2px)',
             backgroundSize: '60px 60px',
           }} 
      />

      {/* Header */}
      <header className="w-full max-w-4xl flex items-start justify-between z-10 mb-4 border-b-4 border-fuchsia-500 pb-4 tear-effect">
        <div className="flex flex-col gap-1">
          <div className="bg-fuchsia-500 text-black px-2 py-1 text-xl font-bold w-max animate-pulse">
            SYS.SNAKE_PROTOCOL_v1.0
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-cyan-400 glitch-neon-text mt-2">
            NEURAL_LINK
          </h1>
        </div>
        
        <div className="flex flex-col items-end border-2 border-cyan-400 p-2 bg-black/80">
          <span className="text-xl text-fuchsia-500">DATA_YIELD</span>
          <span className="text-6xl md:text-7xl text-cyan-400 glitch-neon-text leading-none">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 w-full flex items-center justify-center z-10 mb-4">
        <SnakeGame onScoreChange={setScore} />
      </main>

      {/* Footer / Music Player */}
      <footer className="w-full max-w-4xl z-10 tear-effect">
        <MusicPlayer />
      </footer>
    </div>
  );
}
