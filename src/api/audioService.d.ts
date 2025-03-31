// audioService.d.ts
export function uploadAudio(file: File, fileName: string): Promise<string>;
export function addTrackToDatabase(title: string, path: string): Promise<void>;
export const trackService: {
  getAllTracks(): Promise<any[]>;
};
