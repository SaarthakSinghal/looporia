
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, Volume2, VolumeX, CassetteTape, Music } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bgMusicPlaying, setBgMusicPlaying] = useState(true);
  
  const { signIn, signUp, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  // If user is already logged in, redirect to explore page
  useEffect(() => {
    if (user) {
      navigate('/explore');
    }
  }, [user, navigate]);
  
  // Background music
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("https://cdn.freesound.org/previews/632/632317_13724595-lq.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
    }
    
    if (bgMusicPlaying) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.error("Could not autoplay background music:", err);
          setBgMusicPlaying(false);
          toast({
            title: "Background Music",
            description: "Click the sound button to enable background music.",
            duration: 3000,
          });
        });
      }
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [bgMusicPlaying]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
        // Redirect will happen automatically via the useEffect that watches user state
      } else {
        if (!username.trim()) {
          throw new Error('Username is required');
        }
        await signUp(email, password, username);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Play a click sound effect for button interaction
  const playClickSound = () => {
    const clickSound = new Audio("https://cdn.freesound.org/previews/573/573547_1015240-lq.mp3");
    clickSound.volume = 0.5;
    clickSound.play().catch(e => console.error("Couldn't play click sound", e));
  };

  // Visual embellishments
  const glowingEffects = {
    x: Math.sin(Date.now() / 1000) * 10,
    y: Math.cos(Date.now() / 1000) * 10,
  };

  return (
    <div className="min-h-screen py-8 px-4 crt-overlay flex flex-col">
      <div className="absolute inset-0 bg-scanline opacity-10 pointer-events-none"></div>
      <div className="absolute inset-0 bg-noise animate-static opacity-5 pointer-events-none"></div>
      
      {/* Retro decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-retro-neon-pink/30 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-24 h-24 bg-retro-neon-blue/30 rounded-full blur-xl animate-pulse" 
          style={{ 
            animationDelay: '1s',
            transform: `translate(${glowingEffects.x}px, ${glowingEffects.y}px)` 
          }}></div>
      
      <div className="text-center mb-8 relative">
        <h1 className="text-4xl md:text-5xl font-pixel text-retro-brown-3 mb-4 animate-glitch">
          RETRO RHYTHM REVAMP
        </h1>
        <div className="w-64 h-1 bg-gradient-to-r from-retro-neon-pink via-retro-neon-blue to-retro-neon-green mx-auto mb-4"></div>
        <p className="font-retro text-xl md:text-2xl text-retro-brown-2 max-w-2xl mx-auto">
          {isLogin ? 'Login to your account' : 'Create a new account'}
          <span className="animate-blink inline-block ml-1">|</span>
        </p>
      </div>

      <div className="max-w-md w-full mx-auto mt-8 bg-retro-beige retro-border p-6 font-retro relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-retro-brown-2 text-retro-beige px-4 py-1 font-pixel text-sm">
          DIGITAL ACCESS PORTAL
        </div>
        
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            onClick={() => {
              setBgMusicPlaying(!bgMusicPlaying);
              playClickSound();
            }}
            className="retro-btn-cassette h-8 w-8 p-0 flex items-center justify-center"
            aria-label={bgMusicPlaying ? "Mute music" : "Play music"}
          >
            {bgMusicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
        
        <div className="flex mb-6">
          <button 
            className={`flex-1 py-2 ${isLogin ? 'bg-retro-neon-blue/50 text-retro-brown-3 font-pixel' : 'bg-retro-beige text-retro-brown-2'}`}
            onClick={() => {
              setIsLogin(true);
              playClickSound();
            }}
          >
            LOGIN
          </button>
          <button 
            className={`flex-1 py-2 ${!isLogin ? 'bg-retro-neon-pink/50 text-retro-brown-3 font-pixel' : 'bg-retro-beige text-retro-brown-2'}`}
            onClick={() => {
              setIsLogin(false);
              playClickSound();
            }}
          >
            SIGN UP
          </button>
        </div>

        {error && (
          <Alert className="mb-4 bg-retro-burgundy text-retro-beige border-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg text-retro-brown-3 flex items-center">
              <span className="bg-retro-brown-3 text-retro-beige p-1 mr-2">@</span>
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="username" className="text-lg text-retro-brown-3 flex items-center">
                <Music size={16} className="mr-2" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg text-retro-brown-3 flex items-center">
              <span className="bg-retro-brown-3 text-retro-beige p-1 mr-2">*</span>
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-retro-paper border-retro-brown-2 text-retro-brown-3 font-retro"
              minLength={6}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className={isLogin ? "retro-btn-cassette w-full text-xl" : "retro-btn-vinyl w-full text-xl"}
              onClick={playClickSound}
            >
              {loading ? 'PROCESSING...' : isLogin ? 'LOGIN' : 'SIGN UP'}
            </Button>
          </div>
        </form>
        
        <div className="mt-6 text-center text-retro-brown-2 text-sm">
          <CassetteTape className="inline-block mr-2" size={16} />
          {bgMusicPlaying ? "Now playing retro synth waves..." : "Best experienced with sound on"}
        </div>
        <div className="mt-2 text-center text-retro-brown-2 text-xs">
          BEST VIEWED IN NETSCAPE NAVIGATOR 4.0 || UNDER CONSTRUCTION
        </div>
      </div>
    </div>
  );
};

export default Auth;
