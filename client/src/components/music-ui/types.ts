/**
 * Represents a segment of a Whisper transcription
 */
export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence: number;
}

/**
 * Represents a complete Whisper transcription
 */
export interface Transcription {
  language: string;
  confidence: number;
  segments: TranscriptionSegment[];
}

/**
 * Represents an annotation on lyrics
 */
export interface Annotation {
  id: string;
  lineNumber: number;
  content: string;
  author: string;
  timestamp: string;
  type: 'comment' | 'suggestion' | 'correction' | 'artist';
  artist?: {
    name: string;
    role?: string;
    color?: string;
  };
  selection?: {
    start: number;
    end: number;
    text: string;
  };
}

/**
 * Represents a comment on a specific timestamp in a track
 */
export interface TimelineComment {
  id: string;
  timestamp: number;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string;
  reactions?: TimelineReaction[];
  isPrivate?: boolean;
  replyTo?: string;
  replies?: TimelineComment[];
}

/**
 * Represents a reaction to a comment or timestamp
 */
export interface TimelineReaction {
  id: string;
  emoji: string;
  count: number;
  users: string[];
}

/**
 * Represents a version of lyrics
 */
export interface LyricsVersion {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  changes: string[];
}

/**
 * Represents a song
 */
export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  duration?: number;
  genre?: string;
  bpm?: number;
  key?: string;
  tags?: string[];
  credits?: Record<string, string>;
  lyrics: string;
  transcription?: Transcription;
  dspLinks?: {
    platform: string;
    url: string;
    icon?: string;
  }[];
  analysis?: {
    source: string;
    data: Record<string, any>;
  }[];
  timelineComments?: TimelineComment[];
}

/**
 * Represents lyrical metrics for analysis
 */
export interface LyricalMetrics {
  wordCount: number;
  uniqueWords: number;
  averageWordLength: number;
  averageLineLength: number;
  rhymeDensity: number;
  sentimentScore: number;
  themeDistribution: {
    [theme: string]: number;
  };
  wordFrequency: {
    [word: string]: number;
  };
  rhymePatterns: {
    pattern: string;
    frequency: number;
  }[];
} 