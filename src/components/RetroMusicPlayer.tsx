import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music,
  ArrowLeft,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import TrackList from "./TrackList";
import { useNavigate } from "react-router-dom";

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
    title: "Alag Aasmaan",
    artist: "Anuv Jain",
    duration: 0,
    src: "https://hvsxibnxezarozhldbxr.supabase.co/storage/v1/object/public/audio-files//Anuv%20Jain%20-%20Alag%20Aasmaan.mp3",
  },
  {
    id: 2,
    title: "FictionJunction, LiSA - from the edge",
    artist: "LiSA",tree -I "node_modules" -L 3
    duration: 0,
    src: "https://hvsxibnxezarozhldbxr.supabase.co/storage/v1/object/public/audio-files//FictionJunction,%20LiSA%20-%20from%20the%20edge.mp3",
  },
  {
    id: 3,
    title: "Plastic Love",
    artist: "Mariya Takeuchi",
    duration: 0,
    src: "https://hvsxibnxezarozhldbxr.supabase.co/storage/v1/object/public/audio-files//Mariya%20Takeuchi%20-%20Plastic%20Love.mp3",
  },
];

const RetroMusicPlayer: React.FC<{ autoPlay?: boolean }> = ({}) => {
  const [tracks, setTracks] = useState<Track[]>(sampleTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolume, setShowVolume] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volumeRef = useRef(null);
  const currentTrack = tracks[currentTrackIndex];


  // Preload all audio durations
  useEffect(() => {
    const loadAllDurations = async () => {
      const updatedTracks = [...tracks];

      for (let i = 0; i < tracks.length; i++) {
        // Skip if we already have the duration
        if (updatedTracks[i].duration > 0) continue;

        // Create temporary audio element to load metadata
        const tempAudio = new Audio(tracks[i].src);

        // Wait for metadata to load
        await new Promise<void>((resolve) => {
          tempAudio.addEventListener("loadedmetadata", () => {
            updatedTracks[i] = {
              ...updatedTracks[i],
              duration: tempAudio.duration,
            };
            resolve();
          });

          // Handle errors
          tempAudio.addEventListener("error", () => {
            console.error(`Error loading metadata for track ${i}`);
            resolve();
          });
        });
      }

      setTracks(updatedTracks);
    };

    loadAllDurations();
  }, []);

  // Effect to handle audio playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
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

      audioRef.current.addEventListener("loadedmetadata", loadMetadata);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadedmetadata", loadMetadata);
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

      audioRef.current.addEventListener("timeupdate", updateTime);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("timeupdate", updateTime);
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

      audioRef.current.addEventListener("ended", handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", handleEnded);
        }
      };
    }
  }, [currentTrackIndex, tracks.length]);

  // Toggle play/pause
  const togglePlay = () => {
    if (!isPlaying) {
      // If we're trying to play
      if (audioRef.current) {
        audioRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.error("Error playing audio:", error);
            // Keep isPlaying as false if play fails
          });
      }
    } else {
      // If we're pausing
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Add this useEffect to handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the pressed key is spacebar
      if (event.code === "Space" || event.key === " ") {
        // Prevent default spacebar behavior (scrolling)
        event.preventDefault();

        // Toggle play/pause
        togglePlay();
      }
    };

    // Add the event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [togglePlay]);


  // Skip to previous track
  const prevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    } else {
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
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (volumeRef.current && !volumeRef.current.contains(event.target)) {
        setShowVolume(false);
      }
    }

    // Add event listener when volume is showing
    if (showVolume) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showVolume]);

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Select a specific track
  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const navigate = useNavigate();
  const handleNavigateBack = () => {
    navigate("/explore");
  };

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="bg-retro-beige retro-border p-4 relative overflow-hidden pixel-corners">
        <div className="flex justify-between items-center mb-2">
          <button
            onClick={handleNavigateBack}
            className="retro-btn px-2 py-1 flex items-center"
            aria-label="Back to Explore"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span className="font-pixel text-xs">BACK</span>
          </button>
        </div>
        <div className="bg-retro-brown-2 text-retro-beige p-2 mb-4 font-pixel text-center text-lg shadow-inner">
          <span className="inline-block animate-pulse">
            RETRO RHYTHM PLAYER
          </span>
        </div>

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
                    <>
                      NOW PLAYING<span className="animate-blink">_</span>
                    </>
                  ) : (
                    <>
                      PAUSED<span className="animate-blink">_</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

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
                ref={volumeRef}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 w-24 bg-retro-beige retro-border"
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

        <div className="retro-border bg-retro-tan-1 p-2">
          <h3 className="font-retro text-xl text-retro-brown-3 mb-2 text-center">
            PLAYLIST
          </h3>
          <TrackList
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onSelectTrack={selectTrack}
          />
        </div>

        <audio ref={audioRef} src={currentTrack.src} preload="metadata" />
      </div>
    </div>
  );
};

export default RetroMusicPlayer;
