export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
  albumArt?: string;
  audioSrc?: string; // Legacy support
  audioSources?: AudioSource[]; // New multi-format support
  waveformData?: string;
  metadata?: {
    album?: string;
    year?: number;
    genre?: string[];
    bpm?: number;
    key?: string;
    isrc?: string;
  };
}

export interface Playlist {
  id: number;
  name: string;
  tracks: Track[];
}

export type VisualizerType = 'bars' | 'circle' | 'wave';

export interface Platform {
  name: string;
  icon: string;
  supportLevel: number; // 0-100
}

export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export interface NavLink {
  title: string;
  path: string;
  active?: boolean;
}

export interface NavCategory {
  title: string;
  links: NavLink[];
}

export interface CodeExample {
  language: string;
  title: string;
  code: string;
  active?: boolean;
}

export interface AudioSource {
  url: string;
  format: 'mp3' | 'wav' | 'ogg' | 'm4a' | 'flac';
  quality?: 'low' | 'medium' | 'high' | 'lossless';
  bitrate?: number;
}

export interface Album {
  id: number;
  title: string;
  artist: string;
  releaseYear?: number;
  albumArt?: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  bio?: string;
  imageUrl?: string;
  headerImageUrl?: string;
  genres?: string[];
  formationYear?: number;
  origin?: string;
  website?: string;
  social?: {
    spotify?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    youtube?: string;
    soundcloud?: string;
    bandcamp?: string;
    [key: string]: string | undefined;
  };
  monthlyListeners?: number;
  topTracks?: Track[];
  albums?: Album[];
  relatedArtists?: {
    id: string;
    name: string;
    imageUrl?: string;
  }[];
  achievements?: {
    name: string;
    date: string;
    description?: string;
    icon?: string;
  }[];
  analytics?: {
    listeningTrends?: {
      period: string;
      value: number;
    }[];
    demographics?: {
      ageRange: string;
      percentage: number;
    }[];
    topRegions?: {
      name: string;
      value: number;
    }[];
    [key: string]: any;
  };
  tags?: string[];
  news?: NewsFeedItem[];
}

export interface NewsFeedItem {
  id: string;
  source: 'instagram' | 'twitter' | 'facebook' | 'spotify' | 'youtube' | 'soundcloud' | 'bandcamp' | 'article' | 'release' | 'tour' | 'other';
  title?: string;
  content: string;
  date: string;
  url?: string;
  imageUrl?: string;
  videoUrl?: string;
  likes?: number;
  shares?: number;
  comments?: number;
  isVerified?: boolean;
  isPinned?: boolean;
}
