import { useState, useRef } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongDetails } from '@/components/music-ui/SongDetails';
import { WhisperTranscriber } from '@/components/music-ui/WhisperTranscriber';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileAudio, ArrowRight, PlusCircle, FileText } from 'lucide-react';
import { Transcription } from '@/components/music-ui/types';
import { LyricalAnalysis } from '@/components/music-ui/analysis/LyricalAnalysis';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { FileType, SongFile, StemSubtype } from '@/components/music-ui/SongDetails';

const footerCategories = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "API Reference", href: "/api" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Examples", href: "/examples" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/musicui" },
      { label: "Discord", href: "https://discord.gg/musicui" },
      { label: "Twitter", href: "https://twitter.com/musicui" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "License", href: "/license" }
    ]
  }
];

const socialLinks = [
  { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
  { icon: "ri-github-fill", href: "https://github.com/musicui" },
  { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
];

// Demo data for different variations
const basicSong = {
  id: "1",
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  album: "Stellar Dreams",
  releaseDate: "2024-03-21",
  duration: 331,
  genre: "Electronic",
  bpm: 120,
  key: "C# minor",
  tags: ["atmospheric", "ethereal", "cosmic"],
  credits: {
    producer: "Alex Nova",
    songwriter: "Sarah Echo",
    mixer: "Mike Wave"
  }
};

const songWithLyrics = {
  ...basicSong,
  lyrics: "In the vast expanse of space\nWhere stars dance in endless grace\nWe find our cosmic harmony\nA symphony of eternity"
};

const songWithDSPLinks = {
  ...basicSong,
  dspLinks: [
    {
      platform: "Spotify",
      url: "https://open.spotify.com/track/example",
      icon: "/icons/spotify.svg"
    },
    {
      platform: "Apple Music",
      url: "https://music.apple.com/example",
      icon: "/icons/apple-music.svg"
    },
    {
      platform: "YouTube Music",
      url: "https://music.youtube.com/example",
      icon: "/icons/youtube-music.svg"
    },
    {
      platform: "SoundCloud",
      url: "https://soundcloud.com/example",
      icon: "/icons/soundcloud.svg"
    }
  ]
};

// New song with a single analysis source
const songWithSpotifyAnalysis = {
  ...songWithLyrics,
  analysis: [
    {
      source: "spotify",
      data: {
        audioFeatures: {
          danceability: 0.735,
          energy: 0.578,
          key: 2,
          loudness: -11.84,
          mode: 1,
          speechiness: 0.0461,
          acousticness: 0.514,
          instrumentalness: 0.0902,
          liveness: 0.159,
          valence: 0.624,
          tempo: 119.97
        },
        audioAnalysis: {
          sections: 5,
          segments: 743,
          tatums: 354,
          bars: 88
        }
      }
    }
  ]
};

// New song with Essentia analysis
const songWithEssentiaAnalysis = {
  ...songWithLyrics,
  analysis: [
    {
      source: "essentia",
      data: {
        rhythm: {
          bpm: 120.2,
          beatsConfidence: 0.87
        },
        tonal: {
          key: "C#",
          scale: "minor"
        },
        moods: ["atmospheric", "ethereal", "calm", "spacey", "melodic"]
      }
    }
  ]
};

// New song with OpenAI analysis
const songWithOpenAIAnalysis = {
  ...songWithLyrics,
  analysis: [
    {
      source: "openai",
      data: {
        description: "\"Cosmic Harmony\" is an atmospheric electronic track characterized by ethereal synthesizer pads and a spacious mix. The production creates a sense of floating through a vast cosmic landscape, with subtle melodic elements that emerge and recede throughout the track.",
        genreAnalysis: "The track primarily falls under ambient electronic music with elements of space music and downtempo. The atmospheric quality and minimal beat structure place it firmly in the ambient genre, while the cosmic sound palette connects it to the space music subgenre.",
        similarArtists: ["Brian Eno", "Stellardrone", "Carbon Based Lifeforms", "Solar Fields", "Boards of Canada"]
      }
    }
  ]
};

// New song with Whisper transcription analysis
const songWithWhisperAnalysis = {
  ...songWithLyrics,
  analysis: [
    {
      source: "whisper",
      data: {
        language: "English",
        confidence: 0.98,
        segments: [
          {
            start: 15.2,
            end: 21.5,
            text: "In the vast expanse of space",
            confidence: 0.95
          },
          {
            start: 22.1,
            end: 28.6,
            text: "Where stars dance in endless grace",
            confidence: 0.92
          },
          {
            start: 30.2,
            end: 35.8,
            text: "We find our cosmic harmony",
            confidence: 0.96
          },
          {
            start: 37.1,
            end: 43.4,
            text: "A symphony of eternity",
            confidence: 0.93
          }
        ]
      }
    }
  ]
};

// Song with multiple analysis sources
const completeSong = {
  ...songWithLyrics,
  ...songWithDSPLinks,
  analysis: [
    {
      source: "spotify",
      data: {
        audioFeatures: {
          danceability: 0.735,
          energy: 0.578,
          key: 2,
          loudness: -11.84,
          mode: 1,
          speechiness: 0.0461,
          acousticness: 0.514,
          instrumentalness: 0.0902,
          liveness: 0.159,
          valence: 0.624,
          tempo: 119.97
        },
        audioAnalysis: {
          sections: 5,
          segments: 743,
          tatums: 354,
          bars: 88
        }
      }
    },
    {
      source: "essentia",
      data: {
        rhythm: {
          bpm: 120.2,
          beatsConfidence: 0.87
        },
        tonal: {
          key: "C#",
          scale: "minor"
        },
        moods: ["atmospheric", "ethereal", "calm", "spacey", "melodic"]
      }
    },
    {
      source: "openai",
      data: {
        description: "\"Cosmic Harmony\" is an atmospheric electronic track characterized by ethereal synthesizer pads and a spacious mix. The production creates a sense of floating through a vast cosmic landscape, with subtle melodic elements that emerge and recede throughout the track.",
        genreAnalysis: "The track primarily falls under ambient electronic music with elements of space music and downtempo. The atmospheric quality and minimal beat structure place it firmly in the ambient genre, while the cosmic sound palette connects it to the space music subgenre.",
        similarArtists: ["Brian Eno", "Stellardrone", "Carbon Based Lifeforms", "Solar Fields", "Boards of Canada"]
      }
    },
    {
      source: "whisper",
      data: {
        language: "English",
        confidence: 0.98,
        segments: [
          {
            start: 15.2,
            end: 21.5,
            text: "In the vast expanse of space",
            confidence: 0.95
          },
          {
            start: 22.1,
            end: 28.6,
            text: "Where stars dance in endless grace",
            confidence: 0.92
          },
          {
            start: 30.2,
            end: 35.8,
            text: "We find our cosmic harmony",
            confidence: 0.96
          },
          {
            start: 37.1,
            end: 43.4,
            text: "A symphony of eternity",
            confidence: 0.93
          }
        ]
      }
    }
  ]
};

// New song with integrated Whisper transcription
const songWithIntegratedTranscription = {
  ...songWithLyrics,
  lyrics: "In the vast expanse of space\nWhere stars dance in endless grace\nWe find our cosmic harmony\nA symphony of eternity\nThrough the void of time and space\nWe journey at our own pace\nFinding rhythm in the stars\nAs they guide us from afar",
  analysis: [
    {
      source: "whisper",
      data: {
        language: "English",
        confidence: 0.94,
        segments: [
          {
            start: 0.0,
            end: 6.2,
            text: "In the vast expanse of space",
            confidence: 0.92
          },
          {
            start: 6.8,
            end: 12.5,
            text: "Where stars dance in endless grace",
            confidence: 0.95
          },
          {
            start: 13.6,
            end: 19.2,
            text: "We find our cosmic harmony",
            confidence: 0.91
          },
          {
            start: 20.1,
            end: 26.7,
            text: "A symphony of eternity",
            confidence: 0.89
          },
          {
            start: 28.3,
            end: 34.2,
            text: "Through the void of time and space",
            confidence: 0.96
          },
          {
            start: 35.0,
            end: 41.5,
            text: "We journey at our own pace",
            confidence: 0.93
          },
          {
            start: 42.8,
            end: 48.6,
            text: "Finding rhythm in the stars",
            confidence: 0.88
          },
          {
            start: 49.2,
            end: 56.1,
            text: "As they guide us from afar",
            confidence: 0.94
          }
        ]
      }
    }
  ]
};

// Create typed song files
const songFiles: SongFile[] = [
  {
    id: "file-1",
    name: "Cosmic Harmony - Master.wav",
    type: "master",
    url: "https://example.com/files/master.wav",
    size: 48 * 1024 * 1024, // 48MB
    date: "2024-03-20T14:30:00Z"
  },
  {
    id: "file-2",
    name: "Cosmic Harmony - Vocals.wav",
    type: "stem",
    subtype: "vocals",
    url: "https://example.com/files/vocals.wav",
    size: 12 * 1024 * 1024, // 12MB
    date: "2024-03-20T14:32:00Z"
  },
  {
    id: "file-3",
    name: "Cosmic Harmony - Drums.wav",
    type: "stem",
    subtype: "drums",
    url: "https://example.com/files/drums.wav",
    size: 10 * 1024 * 1024, // 10MB
    date: "2024-03-20T14:33:00Z"
  },
  {
    id: "file-4",
    name: "Cosmic Harmony - Artwork.jpg",
    type: "image",
    url: "https://picsum.photos/seed/track1/1000/1000",
    size: 2.5 * 1024 * 1024, // 2.5MB
    date: "2024-03-19T10:15:00Z"
  },
  {
    id: "file-5",
    name: "Cosmic Harmony - Credits.pdf",
    type: "document",
    url: "https://example.com/files/credits.pdf",
    size: 1.2 * 1024 * 1024, // 1.2MB
    date: "2024-03-21T09:00:00Z"
  }
];

// New song with files
const songWithFiles = {
  ...songWithLyrics,
  files: songFiles
};

export default function SongDetailsPage() {
  const [currentTranscription, setCurrentTranscription] = useState<any | null>(null);
  const [formattedLyrics, setFormattedLyrics] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('variations');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleSaveUpdatedSong = (updatedSong: any) => {
    // In a real app, this would save to a backend
    console.log('Updated song:', updatedSong);
    toast({
      title: 'Song updated successfully!',
      description: 'Your changes have been saved.'
    });
  };

  const handleTranscriptionComplete = (transcription: any, lyrics: string) => {
    setCurrentTranscription(transcription);
    setFormattedLyrics(lyrics);
  };

  const handleSeekAudio = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play();
    }
  };

  const navigateToLyricsAnalysis = () => {
    window.location.href = '/components/song-lyrics?tab=advanced-analysis';
  };
  
  const handleFileUpload = async (file: File, type: FileType, subtype?: StemSubtype): Promise<SongFile> => {
    // Simulate upload process
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Create a new file object
        const newFile: SongFile = {
          id: uuidv4(),
          name: file.name,
          type: type,
          subtype: subtype,
          url: URL.createObjectURL(file), // Create a temporary URL
          size: file.size,
          date: new Date().toISOString()
        };
        
        toast({
          title: 'File uploaded',
          description: `Successfully uploaded ${file.name}`
        });
        
        resolve(newFile);
      }, 1500); // Simulate 1.5s upload time
    });
  };
  
  const handleFileDelete = async (fileId: string): Promise<void> => {
    // Simulate delete process
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        toast({
          title: 'File deleted',
          description: `File has been removed`
        });
        
        resolve();
      }, 500);
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-details" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Details" 
              description="A comprehensive component for displaying detailed information about a song, including metadata, credits, lyrics, streaming links, audio analysis, and file management."
            />
            
            <div className="mt-8 space-y-8">
              <Tabs value={currentView} onValueChange={setCurrentView} className="space-y-4">
                <TabsList>
                  <TabsTrigger value="variations">Variations</TabsTrigger>
                  <TabsTrigger value="files">File Management</TabsTrigger>
                  <TabsTrigger value="transcription">Transcription Integration</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="variations" className="space-y-8">
                  {/* Basic Variation */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Basic Variation</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      A simple view of song details without lyrics or streaming links.
                    </p>
                    <SongDetails song={basicSong} />
                  </Card>

                  {/* With Lyrics */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Lyrics</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes a lyrics tab for displaying song lyrics.
                    </p>
                    <SongDetails song={songWithLyrics} />
                    
                    <div className="mt-6 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Advanced Lyrics Analysis</h4>
                          <p className="text-sm text-neutral-500">
                            The lyrics can be analyzed with our specialized analysis tools based on Pat Pattison's songwriting methods.
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          onClick={navigateToLyricsAnalysis}
                          className="flex items-center gap-1"
                        >
                          <FileText className="h-4 w-4" />
                          View Analysis
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                        <div className="border rounded-md p-3 bg-blue-50 dark:bg-blue-900/20 text-center">
                          <h5 className="text-xs font-medium mb-1">Structure</h5>
                          <p className="text-xs text-neutral-500">Song architecture</p>
                        </div>
                        <div className="border rounded-md p-3 bg-purple-50 dark:bg-purple-900/20 text-center">
                          <h5 className="text-xs font-medium mb-1">Themes</h5>
                          <p className="text-xs text-neutral-500">Message evolution</p>
                        </div>
                        <div className="border rounded-md p-3 bg-green-50 dark:bg-green-900/20 text-center">
                          <h5 className="text-xs font-medium mb-1">Prosody</h5>
                          <p className="text-xs text-neutral-500">Rhythm alignment</p>
                        </div>
                        <div className="border rounded-md p-3 bg-amber-50 dark:bg-amber-900/20 text-center">
                          <h5 className="text-xs font-medium mb-1">Sensory</h5>
                          <p className="text-xs text-neutral-500">Sensory language</p>
                        </div>
                        <div className="border rounded-md p-3 bg-pink-50 dark:bg-pink-900/20 text-center">
                          <h5 className="text-xs font-medium mb-1">Figurative</h5>
                          <p className="text-xs text-neutral-500">Metaphor & imagery</p>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* With DSP Links */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Streaming Links</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes links to various streaming platforms.
                    </p>
                    <SongDetails song={songWithDSPLinks} />
                  </Card>

                  {/* With Whisper Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Whisper Transcription</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes speech-to-text transcription with timestamps.
                    </p>
                    <audio 
                      ref={audioRef}
                      controls
                      className="w-full mb-4"
                      src="/audio/cosmic-harmony-demo.mp3"
                    />
                    <SongDetails 
                      song={songWithWhisperAnalysis} 
                      audioRef={audioRef}
                      onSeekAudio={handleSeekAudio}
                    />
                  </Card>

                  {/* Editable Complete Version */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Editable Complete Version</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Full version with all features and edit capability.
                    </p>
                    <SongDetails 
                      song={completeSong}
                      isEditable={true}
                      onSave={handleSaveUpdatedSong}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="files" className="space-y-8">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">File Management</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      The SongDetails component now supports file management for mastered audio, stems, images, and documents.
                    </p>
                    <SongDetails 
                      song={songWithFiles}
                      isEditable={true}
                      onSave={handleSaveUpdatedSong}
                      onFileUpload={handleFileUpload}
                      onFileDelete={handleFileDelete}
                    />
                  </Card>
                </TabsContent>
                
                <TabsContent value="transcription" className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Transcription Integration</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Demonstrates how the SongDetails component can work with Whisper transcription.
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <WhisperTranscriber 
                        onTranscriptionComplete={handleTranscriptionComplete}
                        externalAudioRef={audioRef}
                      />
                      
                      {currentTranscription && (
                        <div className="mt-8">
                          <SongDetails 
                            song={{
                              ...songWithIntegratedTranscription,
                              lyrics: formattedLyrics || songWithIntegratedTranscription.lyrics,
                              analysis: [
                                {
                                  source: 'whisper',
                                  data: {
                                    language: currentTranscription.language,
                                    confidence: currentTranscription.confidence,
                                    segments: currentTranscription.segments
                                  }
                                }
                              ]
                            }}
                            isEditable={true}
                            onSave={handleSaveUpdatedSong}
                            audioRef={audioRef}
                            onSeekAudio={handleSeekAudio}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongDetails component provides a comprehensive view of a song's information, including:</p>
                      <ul>
                        <li>Basic song information (title, artist, album)</li>
                        <li>Technical details (duration, BPM, key)</li>
                        <li>Genres and tags</li>
                        <li>Credits and contributors</li>
                        <li>Lyrics display (optional)</li>
                        <li>Streaming platform links (optional)</li>
                        <li>Audio analysis from various services (optional)</li>
                        <li>File management with support for stems, images, and documents</li>
                        <li>Built-in audio player</li>
                        <li>Edit mode for updating information</li>
                      </ul>
                      
                      <h4>File Management</h4>
                      <p>
                        The component now includes a robust file management system that allows users to:
                      </p>
                      <ul>
                        <li>Upload various file types (master audio, stems, images, documents)</li>
                        <li>Categorize files by type and subtype (for stems)</li>
                        <li>Play audio files directly</li>
                        <li>Preview and download non-audio files</li>
                        <li>Delete files when in edit mode</li>
                      </ul>
                      
                      <p>
                        To enable file management, you need to provide the following handlers:
                      </p>
                      <pre><code>{`onFileUpload: (file: File, type: string, subtype?: string) => Promise<{
  id: string;
  name: string;
  type: string;
  subtype?: string;
  url: string;
  size: number;
  date: string;
}>;

onFileDelete: (fileId: string) => Promise<boolean>;`}</code></pre>
                      
                      <h4>Integration with Whisper Transcription</h4>
                      <p>
                        The SongDetails component can be enhanced with Whisper transcription data 
                        to provide a more interactive lyrics experience. When transcription data is
                        available, the lyrics tab will show a toggle for the timestamped view, allowing
                        users to see exact timings and confidence scores for each line, and to
                        synchronize with audio playback.
                      </p>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongDetailsProps {
  song: {
    id: string;
    title: string;
    artist: string;
    album: string;
    releaseDate: string;
    duration: number;
    genre: string;
    bpm: number;
    key: string;
    tags: string[];
    credits: {
      producer: string;
      songwriter: string;
      mixer: string;
      [key: string]: string;
    };
    lyrics?: string;
    dspLinks?: {
      platform: string;
      url: string;
      icon?: string;
    }[];
    analysis?: {
      source: string;
      data: {
        [key: string]: any;
      };
    }[];
    audioSrc?: string;
    albumArt?: string;
    files?: {
      id: string;
      name: string;
      type: 'master' | 'stem' | 'image' | 'document' | 'other';
      subtype?: string;
      url: string;
      size: number;
      date: string;
    }[];
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (song: SongDetailsProps['song']) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onSeekAudio?: (timeInSeconds: number) => void;
  variant?: 'default' | 'player';
  track?: Track;
  autoPlay?: boolean;
  onTogglePlay?: (isPlaying: boolean) => void;
  onFileUpload?: (file: File, type: string, subtype?: string) => Promise<SongFile>;
  onFileDelete?: (fileId: string) => Promise<boolean>;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      
      <Footer 
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
} 