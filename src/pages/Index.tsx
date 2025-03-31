import React from "react";
import RetroMusicPlayer from "@/components/RetroMusicPlayer";

const Index = () => {
  return (
    <div className="min-h-screen py-8 px-4 relative crt-overlay">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-pixel text-retro-brown-3 mb-4">
          LOOPORIA
        </h1>
        <p className="font-retro text-xl md:text-2xl text-retro-brown-2 max-w-2xl mx-auto">
          Experience the nostalgic vibes of early internet era music players
          <span className="animate-blink inline-block ml-1">|</span>
        </p>
      </header>

      <main>
        <RetroMusicPlayer />
      </main>

      <footer className="text-center mt-12 pb-8 font-retro text-retro-brown-2">
        <p>© {new Date().getFullYear()} LOOPORIA - All rights reserved</p>
        <p className="text-sm mt-1">Made with ♥ and nostalgia</p>
      </footer>
    </div>
  );
};

export default Index;
