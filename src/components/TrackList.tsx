import React from 'react';
import { Music, Play } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  src: string;
}

interface TrackListProps {
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  currentTrackIndex,
  onSelectTrack
}) => {
  // Format time in MM:SS
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-h-64 overflow-y-auto bg-retro-beige retro-border p-1 font-retro">
      {tracks.map((track, index) => (
        <div
          key={track.id}
          className={`flex items-center p-2 border-b border-retro-tan-2 last:border-b-0 hover:bg-retro-tan-1 cursor-pointer transition-colors ${currentTrackIndex === index ? 'bg-retro-tan-2' : ''}`}
          onClick={() => onSelectTrack(index)}
        >
          <div className="mr-2 w-6 flex-shrink-0">
            {currentTrackIndex === index ? (
              <Play size={16} className="text-retro-brown-3" />
            ) : (
              <Music size={16} className="text-retro-brown-2" />
            )}
          </div>
          <div className="flex-grow mr-2 overflow-hidden">
            <div className="truncate font-bold text-retro-brown-3">{track.title}</div>
            <div className="truncate text-sm text-retro-brown-2">{track.artist}</div>
          </div>
          <div className="text-sm text-retro-brown-2 flex-shrink-0">
            {formatTime(track.duration)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrackList;
