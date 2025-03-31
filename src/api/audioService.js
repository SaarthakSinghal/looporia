import { createClient } from '@supabase/supabase-js';

import { supabase } from "@/integrations/supabase/client";

export const uploadAudio = async (file, fileName) => {
  const { data, error } = await supabase.storage
    .from('audio-files')
    .upload(`${fileName}`, file);

  if (error) {
    console.error('Error uploading:', error);
    return null;
  }

  return data.path;
};

/*************  ✨ Codeium Command ⭐  *************/
/**
 * Add a new track to the database.
 * @param {string} title - The title of the track
 * @param {string} filePath - The path of the uploaded audio file
 * @returns {Promise<Object>} The newly added track object
 */
/******  5781da6e-4be5-4694-850a-ca6845cfb5e4  *******/export const addTrackToDatabase = async (title, filePath) => {
  const { data, error } = await supabase
    .from('tracks')
    .insert([
      {
        title,
        file_path: filePath,
        duration: 0
      }
    ])
    .select();

  if (error) {
    console.error('Error adding track:', error);
    return null;
  }

  return data[0];
};

export const trackService = {
  // Get all tracks
  async getAllTracks() {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tracks:', error);
      return [];
    }

    // Transform data to match your Track interface
    return data.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      src: this.getStreamUrl(track.file_path)
    }));
  },

  // Get a single track by ID
  async getTrackById(id) {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching track:', error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      artist: data.artist,
      duration: data.duration,
      src: this.getStreamUrl(data.file_path)
    };
  },

  // Generate a signed URL for streaming
  async getStreamUrl(filePath) {
    console.log("File path: ", filePath);
    const { data, error } = await supabase.storage
      .from('audio-files')
      .getPublicUrl(filePath);

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.publicUrl;
  },

  // Update track duration after metadata loads
  async updateTrackDuration(id, duration) {
    const { error } = await supabase
      .from('audio-tracks')
      .update({ duration })
      .eq('id', id);

    if (error) {
      console.error('Error updating duration:', error);
    }
  }
};
