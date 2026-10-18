export type DreamMode = 'day' | 'night';

export interface LullabyState {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTrackTitle: string;
  currentTrackId?: string;
  currentTrackIndex?: number;
}

export interface UserProfile {
  id: string;
  username: string;
  nickname: string;
  seal: string;
  favoriteLullaby?: string;
  createdAt?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
