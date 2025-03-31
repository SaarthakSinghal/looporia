
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Disc3, Sparkles, Library, Music, Headphones, Vinyl } from 'lucide-react';
import MusicPlayerMini from '@/components/MusicPlayerMini';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define interface for user preferences
interface UserPreferences {
  firstLogin: boolean;
  favoriteGenres: string[];
}

// Mock data for music genres
const musicGenres = [
  { id: 1, name: "Synthwave", image: "url('https://picsum.photos/seed/synthwave/300/200')" },
  { id: 2, name: "Chiptune", image: "url('https://picsum.photos/seed/chiptune/300/200')" },
  { id: 3, name: "Vaporwave", image: "url('https://picsum.photos/seed/vaporwave/300/200')" },
  { id: 4, name: "Lo-Fi", image: "url('https://picsum.photos/seed/lofi/300/200')" },
  { id: 5, name: "Retro Rock", image: "url('https://picsum.photos/seed/retrorock/300/200')" },
  { id: 6, name: "Disco", image: "url('https://picsum.photos/seed/disco/300/200')" },
];

// Mock recommended playlists
const recommendedPlaylists = [
  { id: 1, name: "80s Classics", tracks: 12, image: "url('https://picsum.photos/seed/80s/300/200')" },
  { id: 2, name: "Arcade Hits", tracks: 8, image: "url('https://picsum.photos/seed/arcade/300/200')" },
  { id: 3, name: "Retro Chill", tracks: 15, image: "url('https://picsum.photos/seed/retrochill/300/200')" },
];

const MusicExploration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    firstLogin: true,
    favoriteGenres: [],
  });
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  useEffect(() => {
    // Check if this is user's first login and load preferences
    const fetchUserPreferences = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('preferences')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.preferences) {
          // Type assertion to safely convert JSON to our interface
          const prefs = data.preferences as UserPreferences;
          setUserPreferences(prefs);
          
          // If it's first login, show the preferences modal
          if (prefs.firstLogin) {
            setShowPreferencesModal(true);
          }
        }
      } catch (error: any) {
        console.error('Error fetching preferences:', error.message);
      }
    };
    
    fetchUserPreferences();
  }, [user]);
  
  const savePreferences = async () => {
    if (!user) return;
    
    try {
      const newPreferences = {
        firstLogin: false,
        favoriteGenres: selectedGenres,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({ preferences: newPreferences })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setUserPreferences(newPreferences);
      setShowPreferencesModal(false);
      
      toast({
        title: "Preferences saved!",
        description: "We'll use your music taste to recommend songs you'll love.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving preferences",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const toggleGenreSelection = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen pb-20 py-8 px-4 relative crt-overlay">
      <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-noise animate-static opacity-5 pointer-events-none"></div>
      
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-pixel text-retro-brown-3 mb-2 text-glitch">
            MUSIC EXPLORATION
          </h1>
          <p className="font-retro text-xl text-retro-brown-2">
            Discover your next favorite retro tunes
            <span className="animate-blink inline-block ml-1">|</span>
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Link to="/player">
            <Button className="retro-btn-cassette flex items-center gap-2">
              <Music size={16} />
              <span className="hidden md:inline">PLAYER</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="retro-btn-vinyl flex items-center gap-2">
              <Vinyl size={16} />
              <span className="hidden md:inline">LIBRARY</span>
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-8">
        {/* Recommended Section */}
        <section className="retro-window">
          <div className="retro-window-header">
            <Sparkles className="mr-2 text-retro-neon-pink" size={24} />
            <h2 className="text-2xl font-pixel text-retro-neon-blue">
              RECOMMENDED FOR YOU
            </h2>
          </div>
          
          <div className="retro-window-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPlaylists.map(playlist => (
              <div 
                key={playlist.id}
                className="bg-retro-beige retro-border-glow p-4 cursor-pointer hover:bg-retro-tan-1 transition-colors transform hover:scale-105 duration-200"
              >
                <div 
                  className="h-40 mb-4 retro-border bg-retro-brown-1 overflow-hidden"
                  style={{ backgroundImage: playlist.image, backgroundSize: 'cover' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-retro-neon-pink/20 to-retro-neon-blue/20"></div>
                </div>
                <h3 className="font-pixel text-xl text-retro-brown-3">{playlist.name}</h3>
                <p className="font-retro text-retro-brown-2 flex items-center">
                  <Headphones size={14} className="mr-1" />
                  {playlist.tracks} tracks
                </p>
              </div>
            ))}
          </div>
        </section>
        
        {/* Browse by Genre */}
        <section className="retro-window">
          <div className="retro-window-header">
            <Disc3 className="mr-2 text-retro-neon-green" size={24} />
            <h2 className="text-2xl font-pixel text-retro-neon-green">
              BROWSE BY GENRE
            </h2>
          </div>
          
          <div className="retro-window-content grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {musicGenres.map(genre => (
              <div 
                key={genre.id}
                className="bg-retro-beige retro-border p-4 text-center cursor-pointer hover:bg-retro-tan-1 transition-colors hover:retro-border-glow"
              >
                <div 
                  className="h-24 mb-3 retro-border bg-retro-brown-1 overflow-hidden"
                  style={{ backgroundImage: genre.image, backgroundSize: 'cover' }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-retro-neon-pink/20 to-retro-neon-blue/20"></div>
                </div>
                <h3 className="font-pixel text-lg text-retro-brown-3">{genre.name}</h3>
              </div>
            ))}
          </div>
        </section>
      </div>
      
      {/* First Login Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-retro-beige retro-border-glow p-6 max-w-md w-full pixel-corners">
            <div className="bg-retro-neon-blue text-retro-beige p-2 mb-4 font-pixel text-center text-lg">
              <span className="inline-block animate-pulse">
                WELCOME TO RETRO RHYTHM!
              </span>
            </div>
            
            <p className="font-retro text-lg text-retro-brown-2 mb-6 text-center">
              Let us know your music taste to personalize your experience.
              <span className="animate-blink inline-block ml-1">|</span>
            </p>
            
            <h3 className="font-pixel text-xl text-retro-brown-3 mb-2">
              SELECT YOUR FAVORITE GENRES:
            </h3>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              {musicGenres.map(genre => (
                <button 
                  key={genre.id}
                  className={`p-2 font-retro text-lg retro-border ${
                    selectedGenres.includes(genre.name) 
                      ? 'bg-retro-neon-blue/30 text-retro-brown-3 retro-border-glow' 
                      : 'bg-retro-beige text-retro-brown-2'
                  }`}
                  onClick={() => toggleGenreSelection(genre.name)}
                >
                  {genre.name}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="retro-btn-cassette text-xl px-8 py-3 cassette-click"
                onClick={savePreferences}
                disabled={selectedGenres.length === 0}
              >
                LET'S GO!
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add the mini player at the bottom */}
      <MusicPlayerMini autoPlay={true} />
    </div>
  );
};

export default MusicExploration;
