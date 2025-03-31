import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Volume2, VolumeX, ArrowRight } from "lucide-react";

const Landing = () => {
  const { user } = useAuth();
  const [bgMusicPlaying, setBgMusicPlaying] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background music
  useEffect(() => {
    if (audioRef.current) {
      if (bgMusicPlaying) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().catch((err) => {
          console.error("Could not autoplay background music:", err);
          setBgMusicPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [bgMusicPlaying]);

  // Scroll effect for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen py-8 px-4 relative crt-overlay">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={() => setBgMusicPlaying(!bgMusicPlaying)}
          className="retro-btn px-2 py-1 flex items-center gap-1"
          aria-label={bgMusicPlaying ? "Mute music" : "Play music"}
        >
          {bgMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span className="text-sm">{bgMusicPlaying ? "MUTE" : "PLAY"}</span>
        </button>

        {user ? (
          <Link to="/explore">
            <Button className="retro-btn">EXPLORE</Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button className="retro-btn">LOGIN</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div
          className="text-center mb-12"
          style={{
            transform: `translateY(${scrollPosition * 0.2}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <h1 className="text-5xl md:text-7xl font-pixel text-retro-brown-3 mb-6 animate-pulse">
            LOOPORIA
          </h1>
          <p className="font-retro text-2xl md:text-3xl text-retro-brown-2 max-w-2xl mx-auto mb-8">
            Experience music like it's 1999
            <span className="animate-blink inline-block ml-1">|</span>
          </p>
          <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <Link to={user ? "/explore" : "/auth"}>
              <Button className="retro-btn text-xl px-8 py-3 w-full md:w-auto group">
                {user ? "EXPLORE MUSIC" : "GET STARTED"}
                <ArrowRight
                  className="ml-2 transition-transform group-hover:translate-x-1"
                  size={18}
                />
              </Button>
            </Link>
            <Link to="/about">
              <Button className="retro-btn text-xl px-8 py-3 w-full md:w-auto">
                ABOUT
              </Button>
            </Link>
          </div>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto"
          style={{
            transform: `translateY(${scrollPosition * 0.1}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <div className="bg-retro-beige retro-border p-4 text-center hover:bg-retro-tan-1 transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">
              CREATE PLAYLISTS
            </h3>
            <p className="font-retro text-retro-brown-2">
              Build your perfect mixtape with custom playlists
            </p>
          </div>
          <div className="bg-retro-beige retro-border p-4 text-center hover:bg-retro-tan-1 transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">
              RETRO INTERFACE
            </h3>
            <p className="font-retro text-retro-brown-2">
              Experience the nostalgic vibes of early internet era music players
            </p>
          </div>
          <div className="bg-retro-beige retro-border p-4 text-center hover:bg-retro-tan-1 transition-colors cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">
              PERSONALIZED
            </h3>
            <p className="font-retro text-retro-brown-2">
              Get music recommendations based on your unique taste
            </p>
          </div>
        </div>
      </div>

      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-retro-brown-1 opacity-20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `translateY(${
                scrollPosition * (0.1 + Math.random() * 0.5)
              }px)`,
              transition: "transform 0.2s ease-out",
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
              animation: "float infinite alternate",
            }}
          />
        ))}
      </div>

      <audio
        ref={audioRef}
        src="https://cdn.freesound.org/previews/633/633621_14015157-lq.mp3"
        loop
        preload="auto"
      />

      <footer className="text-center mt-12 pb-8 font-retro text-retro-brown-2">
        <p>© {new Date().getFullYear()} LOOPORIA - All rights reserved</p>
        <p className="text-sm mt-1">Made with ♥ and nostalgia</p>
      </footer>
    </div>
  );
};

export default Landing;
