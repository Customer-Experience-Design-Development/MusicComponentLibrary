// Core Audio Components
export { AudioPlayer } from './AudioPlayer';
export { Equalizer } from './Equalizer';
export { MediaCard } from './MediaCard';
export { Playlist } from './Playlist';
export { Visualizer } from './Visualizer';
export { VolumeControl } from './VolumeControl';
export { Waveform } from './Waveform';
export { TimelineComments } from './TimelineComments';
export { SongLyrics } from './SongLyrics';
export { StemPlayer } from './StemPlayer';
export { MashupCreator } from './MashupCreator';
export { MobileMashupCreator } from './MobileMashupCreator';

// New Components
export { MiniPlayer } from './MiniPlayer';
export { AlbumGrid } from './AlbumGrid';
export { PerformanceChart } from './PerformanceChart';

// Analytics Components
export { OverviewCard, OverviewGroup, CompactOverviewCard } from './AnalyticsOverview';
export type { AnalyticsData, OverviewCardProps, OverviewGroupProps } from './AnalyticsOverview';

// Education Components
export { TheoryVisualizer } from './education/TheoryVisualizer';

// Industry Components
export { RightsManager } from './industry/RightsManager';

// Component exports
export { ArtistDetails } from './ArtistDetails';
export { AlbumDetails } from './AlbumDetails';
export { SongDetails } from './SongDetails';
export { SongSearch } from './SongSearch';
export { SongLyricsSearch } from './SongLyricsSearch';
export { ReleaseCalendar } from './ReleaseCalendar';
export { WhisperTranscriber } from './WhisperTranscriber';
export { SongCardPlayer } from './SongCardPlayer';
export { Post } from './Post';
export { PostFeed } from './PostFeed';
export { Feed } from './Feed';
export type { PostProps, PostType, PostPlatform, PostAuthor, PostMedia, PostMetrics, PostAction } from './Post';
export type { PostFeedProps } from './PostFeed';
export type { FeedProps, FeedLayout, FeedSource, PaginationType } from './Feed';

// Type Re-exports
export type { Track, Playlist as PlaylistType, Album } from '@/types/music';
export type { TimelineComment, TimelineReaction } from './types';
export type { EnhancedAlbum, AlbumFile } from './AlbumDetails';