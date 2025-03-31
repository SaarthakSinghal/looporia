
import React from 'react';
import RetroMusicPlayer from '@/components/RetroMusicPlayer';

const Index = () => {
  return (
    <div className="min-h-screen py-8 px-4 relative crt-overlay">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-pixel text-retro-brown-3 mb-4">
          RETRO RHYTHM REVAMP
        </h1>
        <p className="font-retro text-xl md:text-2xl text-retro-brown-2 max-w-2xl mx-auto">
          Experience the nostalgic vibes of early internet era music players
          <span className="animate-blink inline-block ml-1">|</span>
        </p>
      </header>

      <main>
        <RetroMusicPlayer />

        <div className="max-w-3xl mx-auto mt-12 bg-retro-beige retro-border p-6 font-retro text-lg">
          <h2 className="text-2xl font-pixel text-retro-brown-3 mb-4 text-center">ABOUT THE PLAYER</h2>
          <p className="mb-4">
            Welcome to Retro Rhythm Revamp, a nostalgic journey back to the days of 
            classic media players like Winamp, Windows Media Player, and RealPlayer.
          </p>
          <p className="mb-4">
            This retro-inspired music player combines vintage aesthetics with modern web 
            technologies, giving you that warm fuzzy feeling of the early internet era.
          </p>
          <div className="text-center mt-6">
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block mx-1">HTML5</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block mx-1">React</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block mx-1">Tailwind</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block mx-1">Nostalgia</span>
          </div>
        </div>
      </main>

      <footer className="text-center mt-12 pb-8 font-retro text-retro-brown-2">
        <p>© {new Date().getFullYear()} Retro Rhythm Revamp - All rights reserved</p>
        <p className="text-sm mt-1">Made with ♥ and nostalgia</p>
      </footer>
    </div>
  );
};

export default Index;
