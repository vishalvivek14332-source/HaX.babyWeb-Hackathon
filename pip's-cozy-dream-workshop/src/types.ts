export type DreamMode = 'day' | 'night';

export interface LullabyState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackTitle: string;
}

export interface GuestbookEntry {
  id: string;
  name: string;
  message: string;
  seal: string;
  date: string;
  isLocalOnly?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  description: string;
  altText: string;
  aspect: 'square' | 'wide' | 'tall';
  officialUrl?: string;
  fallbackKey: 'portrait' | 'lantern' | 'box' | 'cloud' | 'village' | 'toys';
}
