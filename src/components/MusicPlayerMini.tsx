
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from "@/components/ui/slider";
import { useNavigate } from 'react-router-dom';

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
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const navigate = useNavigate();
  
  // Effect to handle audio playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  // Load audio metadata when component mounts
  useEffect(() => {
    if (audioRef.current) {
      const loadMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };
      
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };
      
      audioRef.current.addEventListener('loadedmetadata', loadMetadata);
      audioRef.current.addEventListener('timeupdate', updateTime);
      
      // Try to autoplay if needed
      if (autoPlay) {
        audioRef.current.play().catch(err => {
          console.error('Autoplay failed:', err);
          setIsPlaying(false);
        });
      }
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', loadMetadata);
          audioRef.current.removeEventListener('timeupdate', updateTime);
        }
      };
    }
  }, [autoPlay]);
  
  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
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
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-retro-beige retro-border p-2 z-50">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={togglePlay}
            className="retro-btn h-8 w-8 p-0 flex items-center justify-center"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>
          
          <div 
            className="text-retro-brown-3 font-retro text-sm cursor-pointer hover:underline"
            onClick={goToFullPlayer}
          >
            Now Playing • Click for full player
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
            onClick={toggleMute}
            className="retro-btn h-8 w-8 p-0 flex items-center justify-center"
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
      
      <audio 
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        loop={false}
      />
    </div>
  );
};

export default MusicPlayerMini;
