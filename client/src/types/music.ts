export interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
  albumArt?: string;
  audioSrc?: string;
  waveformData?: string;
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
