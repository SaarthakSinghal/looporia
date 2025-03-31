import { useState, useEffect } from 'react';
import { uploadAudio, addTrackToDatabase, trackService } from '@/api/audioService.js';

function AudioUploadTest() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load existing tracks
  useEffect(() => {
    const loadTracks = async () => {
      const fetchedTracks = await trackService.getAllTracks();
      setTracks(fetchedTracks);
    };

    loadTracks();
  }, []);

  // Function to upload local files
  const uploadLocalFiles = async () => {
    setLoading(true);

    try {
      // Get list of files from public/audio folder
      const audioFiles = [
        '/audio/Adele - Skyfall.opus'
      ];

      for (const filePath of audioFiles) {
        // Fetch the file from public folder
        const response = await fetch(filePath);
        console.log(response);
        const blob = await response.blob();

        // Create a File object
        const fileName = filePath.split('/').pop().replace('.mp3', '');
        const file = new File([blob], fileName, { type: 'audio/mpeg' });
        console.log(file)

        // Upload to Supabase
        const path = await uploadAudio(file, fileName);
        console.log(path)

        if (path) {
          // Add to database with extracted metadata
          const title = fileName.replace(/_/g, ' ');

          await addTrackToDatabase(title, path);
          console.log("Track added to database:", title);
        }
      }

      // Refresh track list
      const updatedTracks = await trackService.getAllTracks();
      setTracks(updatedTracks);

      console.log("Tracks:", updatedTracks);
    } catch (error) {
      console.error('Error uploading local files:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <h1>Audio Upload Test</h1>
      <button onClick={uploadLocalFiles} disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Local Files'}
      </button>

      <h2>Tracks ({tracks.length})</h2>
      <ul>
        {tracks.map(track => (
          <li key={track.id}>
            <strong>{track.title}</strong> by {track.artist} ({track.duration}s)
            <audio controls src={track.src}></audio>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AudioUploadTest;
