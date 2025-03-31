
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface MusicPlayerMiniProps {
  audioSrc?: string;
  autoPlay?: boolean;
}

const MusicPlayerMini: React.FC<MusicPlayerMiniProps> = ({ 
  audioSrc = "https://lookandfeellikean9.neocities.org/music/musicforairports.mp3", 
  autoPlay = true 
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [audioLoaded, setAudioLoaded] = useState<boolean>(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Effect to initialize audio element
  useEffect(() => {
    // Create audio element if not exists
    if (!audioRef.current) {
      audioRef.current = new Audio(audioSrc);
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      
      // Add event listeners
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleEnded);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      
      // Load audio
      audioRef.current.load();
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleEnded);
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  }, [audioSrc]);
  
  // Event handlers
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
  };
  
  const handleCanPlayThrough = () => {
    setAudioLoaded(true);
    if (autoPlay && !isPlaying) {
      playAudio();
    }
  };
  
  // Effect to handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        playAudio();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Effect to handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Play audio with user interaction tracking
  const playAudio = () => {
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            console.log("Audio playing successfully");
          })
          .catch(err => {
            console.error("Playback prevented:", err);
            setIsPlaying(false);
            
            // Show a user-friendly message about browsers blocking autoplay
            toast({
              title: "Audio Playback Blocked",
              description: "Click the play button to start music. Your browser requires user interaction to play audio.",
              duration: 5000,
            });
          });
      }
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle time seek
  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Go to the full player page
  const goToFullPlayer = () => {
    navigate('/player');
  };

  // Simulate old analog tape movement
  const tapeEffectClass = isPlaying ? "animate-tape-spin" : "";
  
  // Play a click sound effect for button interaction
  const playClickSound = () => {
    const clickSound = new Audio("https://cdn.freesound.org/previews/573/573547_1015240-lq.mp3");
    clickSound.volume = 0.5;
    clickSound.play().catch(e => console.error("Couldn't play click sound", e));
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-retro-beige retro-border p-2 z-50">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={() => {
              togglePlay();
              playClickSound();
            }}
            className="retro-btn-cassette h-8 w-8 p-0 flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full border border-retro-brown-2 mr-2 relative overflow-hidden ${tapeEffectClass}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-retro-neon-pink to-retro-neon-blue opacity-80"></div>
            </div>
            <div 
              className="text-retro-brown-3 font-pixel text-xs sm:text-sm cursor-pointer hover:text-retro-neon-pink transition-colors"
              onClick={goToFullPlayer}
            >
              Now Playing • Click for full player
            </div>
          </div>
        </div>
        
        <div className="w-1/2 px-4">
          <Slider 
            value={[currentTime]} 
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs font-retro text-retro-brown-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="relative">
          <Button 
            onClick={() => {
              toggleMute();
              playClickSound();
            }}
            className="retro-btn-cassette h-8 w-8 p-0 flex items-center justify-center"
            aria-label={isMuted ? "Unmute" : "Mute"}
            onMouseEnter={() => setShowVolume(true)}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </Button>
          
          {showVolume && (
            <div 
              className="absolute bottom-full right-0 mb-2 p-2 w-8 h-24 bg-retro-beige retro-border"
              onMouseLeave={() => setShowVolume(false)}
            >
              <Slider 
                value={[isMuted ? 0 : volume]} 
                max={1}
                step={0.01}
                onValueChange={(value) => setVolume(value[0])}
                orientation="vertical"
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayerMini;
