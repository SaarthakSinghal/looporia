
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-8 px-4 relative crt-overlay">
      <div className="absolute top-4 right-4">
        {user ? (
          <Link to="/dashboard">
            <Button className="retro-btn">MY LIBRARY</Button>
          </Link>
        ) : (
          <Link to="/auth">
            <Button className="retro-btn">LOGIN</Button>
          </Link>
        )}
      </div>

      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-pixel text-retro-brown-3 mb-6 animate-pulse">
            RETRO RHYTHM REVAMP
          </h1>
          <p className="font-retro text-2xl md:text-3xl text-retro-brown-2 max-w-2xl mx-auto mb-8">
            Experience music like it's 1999
            <span className="animate-blink inline-block ml-1">|</span>
          </p>
          <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button className="retro-btn text-xl px-8 py-3 w-full md:w-auto">
                {user ? "MY LIBRARY" : "GET STARTED"}
              </Button>
            </Link>
            <Link to="/about">
              <Button className="retro-btn text-xl px-8 py-3 w-full md:w-auto">
                ABOUT
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mx-auto">
          <div className="bg-retro-beige retro-border p-4 text-center">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">CREATE PLAYLISTS</h3>
            <p className="font-retro text-retro-brown-2">
              Build your perfect mixtape with custom playlists
            </p>
          </div>
          <div className="bg-retro-beige retro-border p-4 text-center">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">RETRO INTERFACE</h3>
            <p className="font-retro text-retro-brown-2">
              Experience the nostalgic vibes of early internet era music players
            </p>
          </div>
          <div className="bg-retro-beige retro-border p-4 text-center">
            <h3 className="font-pixel text-lg text-retro-brown-3 mb-2">USER PROFILES</h3>
            <p className="font-retro text-retro-brown-2">
              Customize your profile and share your music taste
            </p>
          </div>
        </div>
      </div>

      <footer className="text-center mt-12 pb-8 font-retro text-retro-brown-2">
        <p>© {new Date().getFullYear()} Retro Rhythm Revamp - All rights reserved</p>
        <p className="text-sm mt-1">Made with ♥ and nostalgia</p>
      </footer>
    </div>
  );
};

export default Landing;
