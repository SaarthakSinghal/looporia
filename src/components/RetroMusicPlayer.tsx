import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import TrackList from './TrackList';

// Define our track interface
interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  src: string;
}

// Sample tracks data
const sampleTracks: Track[] = [
  {
    id: 1,
    title: "Retro Beats",
    artist: "SynthWave",
    duration: 180,
    src: "https://lookandfeellikean9.neocities.org/music/musicforairports.mp3"
  },
  {
    id: 2,
    title: "Digital Dreams",
    artist: "8-Bit Wonder",
    duration: 210,
    src: "https://cdn.freesound.org/previews/706/706747_1648170-lq.mp3"
  },
  {
    id: 3,
    title: "Neon Nights",
    artist: "Pixel Punk",
    duration: 195,
    src: "https://cdn.freesound.org/previews/631/631551_7797137-lq.mp3"
  },
  {
    id: 4,
    title: "Cyber Funk",
    artist: "Retro Revivalists",
    duration: 225,
    src: "https://cdn.freesound.org/previews/612/612334_5674468-lq.mp3"
  },
  {
    id: 5,
    title: "DOS Groove",
    artist: "COM.PORT",
    duration: 187,
    src: "https://cdn.freesound.org/previews/566/566265_5674468-lq.mp3"
  }
];

const RetroMusicPlayer: React.FC = () => {
  const [tracks] = useState<Track[]>(sampleTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentTrackIndex];

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
  }, [isPlaying, currentTrackIndex]);

  // Load audio metadata when track changes
  useEffect(() => {
    if (audioRef.current) {
      const loadMetadata = () => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration);
        }
      };
      
      audioRef.current.addEventListener('loadedmetadata', loadMetadata);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('loadedmetadata', loadMetadata);
        }
      };
    }
  }, [currentTrackIndex]);

  // Update time as audio plays
  useEffect(() => {
    if (audioRef.current) {
      const updateTime = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
        }
      };
      
      audioRef.current.addEventListener('timeupdate', updateTime);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateTime);
        }
      };
    }
  }, []);

  // Apply volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle track ended
  useEffect(() => {
    if (audioRef.current) {
      const handleEnded = () => {
        // Go to next track or stop at end of playlist
        if (currentTrackIndex < tracks.length - 1) {
          setCurrentTrackIndex(currentTrackIndex + 1);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        }
      };
      
      audioRef.current.addEventListener('ended', handleEnded);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [currentTrackIndex, tracks.length]);

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Skip to previous track
  const prevTrack = () => {
    if (currentTime > 3) {
      // If more than 3 seconds into track, restart current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    } else {
      // Otherwise go to previous track
      setCurrentTrackIndex((prevIndex) => 
        prevIndex === 0 ? tracks.length - 1 : prevIndex - 1
      );
    }
  };

  // Skip to next track
  const nextTrack = () => {
    setCurrentTrackIndex((prevIndex) => 
      prevIndex === tracks.length - 1 ? 0 : prevIndex + 1
    );
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

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Select a specific track
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-3xl mx-auto my-8">
      {/* Audio player visible UI */}
      <div className="bg-retro-beige retro-border p-4 relative overflow-hidden pixel-corners">
        {/* Player header with "vintage" look */}
        <div className="bg-retro-brown-2 text-retro-beige p-2 mb-4 font-pixel text-center text-lg shadow-inner">
          <span className="inline-block animate-pulse">
            RETRO RHYTHM REVAMP
          </span>
        </div>
        
        {/* Album art and visualizer area */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/3 retro-border bg-retro-brown-1 aspect-square flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-crt-lines"></div>
            <Music size={64} className="text-retro-beige opacity-80" />
          </div>
          
          <div className="w-full md:w-2/3">
            <div className="h-full retro-border bg-black relative overflow-hidden">
              <div className="h-full bg-noise animate-static opacity-25 absolute inset-0"></div>
              <div className="h-1/3 bg-scanline animate-scan absolute w-full opacity-30"></div>
              <div className="p-4 h-full flex flex-col justify-between relative z-[1]">
                <div>
                  <h2 className="text-retro-tan-1 font-retro text-2xl truncate">
                    {currentTrack.title}
                  </h2>
                  <p className="text-retro-tan-2 font-retro text-xl truncate">
                    {currentTrack.artist}
                  </p>
                </div>
                <div className="text-retro-tan-3 font-retro text-lg">
                  {isPlaying ? (
                    <>NOW PLAYING<span className="animate-blink">_</span></>
                  ) : (
                    <>PAUSED<span className="animate-blink">_</span></>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Time progress and slider */}
        <div className="mb-4">
          <div className="flex justify-between text-retro-brown-3 font-retro text-md mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider 
            value={[currentTime]} 
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>
        
        {/* Playback controls */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={prevTrack}
            className="retro-btn px-2 py-1"
            aria-label="Previous Track"
          >
            <SkipBack size={20} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="retro-btn px-6 py-3"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="retro-btn px-2 py-1"
            aria-label="Next Track"
          >
            <SkipForward size={20} />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setShowVolume(!showVolume)}
              className="retro-btn px-2 py-1"
              aria-label={isMuted ? "Unmute" : "Mute"}
              onMouseEnter={() => setShowVolume(true)}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            
            {showVolume && (
              <div 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 w-24 bg-retro-beige retro-border"
                onMouseLeave={() => setShowVolume(false)}
              >
                <Slider 
                  value={[isMuted ? 0 : volume]} 
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                  orientation="vertical"
                  className="h-24"
                />
              </div>
            )}
          </div>
        </div>
        
        {/* Track list section */}
        <div className="retro-border bg-retro-tan-1 p-2">
          <h3 className="font-retro text-xl text-retro-brown-3 mb-2 text-center">PLAYLIST</h3>
          <TrackList 
            tracks={tracks} 
            currentTrackIndex={currentTrackIndex}
            onSelectTrack={selectTrack}
          />
        </div>
        
        {/* Audio element (hidden) */}
        <audio 
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
        />
      </div>
    </div>
  );
};

export default RetroMusicPlayer;
