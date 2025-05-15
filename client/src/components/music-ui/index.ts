// Core Audio Components
export { AudioPlayer } from './AudioPlayer';
export { Equalizer } from './Equalizer';
export { MediaCard } from './MediaCard';
export { Playlist } from './Playlist';
export { Visualizer } from './Visualizer';
export { VolumeControl } from './VolumeControl';
export { Waveform } from './Waveform';

// New Components
export { MiniPlayer } from './MiniPlayer';
export { AlbumGrid } from './AlbumGrid';
export { PerformanceChart } from './PerformanceChart';

// Education Components
export { TheoryVisualizer } from './education/TheoryVisualizer';

// Industry Components
export { RightsManager } from './industry/RightsManager';

// Type Re-exports
export type { Track, Playlist as PlaylistType } from '@/types/music';