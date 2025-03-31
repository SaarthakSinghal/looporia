
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen py-8 px-4 relative crt-overlay">
      <Link to="/" className="inline-block mb-8">
        <Button className="retro-btn flex items-center">
          <ChevronLeft size={16} className="mr-1" />
          Back to Home
        </Button>
      </Link>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-pixel text-retro-brown-3 mb-4">
            ABOUT RETRO RHYTHM REVAMP
          </h1>
          <p className="font-retro text-xl md:text-2xl text-retro-brown-2">
            A journey back to the digital music era of yesteryear
            <span className="animate-blink inline-block ml-1">|</span>
          </p>
        </div>

        <div className="bg-retro-beige retro-border p-6 font-retro text-lg">
          <h2 className="text-2xl font-pixel text-retro-brown-3 mb-4 text-center">OUR STORY</h2>
          
          <p className="mb-4">
            Retro Rhythm Revamp was born from a deep nostalgia for the early days of digital music players. Remember the days of Winamp, Windows Media Player, and RealPlayer? Those chunky interfaces, visualizers, and the excitement of creating your first playlist?
          </p>
          
          <p className="mb-4">
            We've recreated that magical experience with modern technology. Our music player combines the aesthetic charm of the 90s and early 2000s with the power and convenience of today's web technologies.
          </p>
          
          <p className="mb-6">
            Whether you're an old-school music lover who remembers the dial-up internet days, or a newcomer curious about the retro digital experience, Retro Rhythm Revamp offers a unique way to enjoy and organize your music collection.
          </p>

          <h2 className="text-2xl font-pixel text-retro-brown-3 mb-4 text-center">FEATURES</h2>
          
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Authentic retro-style interface with CRT screen effects</li>
            <li>Create and manage custom playlists</li>
            <li>User accounts to save your music preferences</li>
            <li>Responsive design that works on all your devices</li>
            <li>Classic visualization effects while playing music</li>
          </ul>

          <h2 className="text-2xl font-pixel text-retro-brown-3 mb-4 text-center">TECHNICAL STACK</h2>
          
          <div className="text-center mb-6">
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block m-1">React</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block m-1">TypeScript</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block m-1">Tailwind CSS</span>
            <span className="px-3 py-1 bg-retro-brown-2 text-retro-beige inline-block m-1">Supabase</span>
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

export default About;
