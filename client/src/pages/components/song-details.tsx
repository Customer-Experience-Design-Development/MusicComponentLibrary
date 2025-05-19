import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongDetails } from '@/components/music-ui/SongDetails';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

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

export default function SongDetailsPage() {
  const handleSave = (updatedSong: any) => {
    console.log('Updated song:', updatedSong);
    // In a real application, you would save this to your backend
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
              description="A comprehensive component for displaying detailed information about a song, including metadata, credits, lyrics, streaming links, and audio analysis from various services."
            />
            
            <div className="mt-8 space-y-8">
              <Tabs defaultValue="variations" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="variations">Variations</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
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
                  </Card>

                  {/* With DSP Links */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Streaming Links</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes links to various streaming platforms.
                    </p>
                    <SongDetails song={songWithDSPLinks} />
                  </Card>

                  {/* With Spotify Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Spotify Analysis</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes Spotify audio features and analysis.
                    </p>
                    <SongDetails song={songWithSpotifyAnalysis} />
                  </Card>

                  {/* With Essentia Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Essentia Analysis</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes Essentia audio descriptors and mood analysis.
                    </p>
                    <SongDetails song={songWithEssentiaAnalysis} />
                  </Card>

                  {/* With OpenAI Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With OpenAI Analysis</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes AI-generated song description and genre analysis.
                    </p>
                    <SongDetails song={songWithOpenAIAnalysis} />
                  </Card>

                  {/* With Whisper Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">With Whisper Transcription</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Includes speech-to-text transcription with timestamps.
                    </p>
                    <SongDetails song={songWithWhisperAnalysis} />
                  </Card>

                  {/* Complete Version */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Complete Version</h3>
                    <p className="text-sm text-neutral-500 mb-4">
                      Full version with all features including multiple analysis sources.
                    </p>
                    <SongDetails song={completeSong} />
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
                      onSave={handleSave}
                    />
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
                        <li>Edit mode for updating information</li>
                      </ul>
                      
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
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (song: SongDetailsProps['song']) => void;
}`}</code></pre>
                      
                      <h4>Audio Analysis Support</h4>
                      <p>The component supports analysis data from various sources:</p>
                      <ul>
                        <li><strong>Spotify</strong> - Audio features and track analysis</li>
                        <li><strong>Essentia</strong> - Audio descriptors including rhythm, tonal, and mood analysis</li>
                        <li><strong>OpenAI</strong> - AI-generated descriptions and genre analysis</li>
                        <li><strong>Whisper</strong> - Audio transcription with timestamps and confidence scores</li>
                      </ul>
                      
                      <h4>Usage Examples</h4>
                      <pre><code>{`// Basic usage
<SongDetails song={song} />

// With lyrics
<SongDetails song={songWithLyrics} />

// With streaming links
<SongDetails song={songWithDSPLinks} />

// With audio analysis
<SongDetails song={songWithAnalysis} />

// Editable version
<SongDetails 
  song={song}
  isEditable={true}
  onSave={(updatedSong) => {
    // Handle saving the updated song data
    console.log('Updated song:', updatedSong);
  }}
/>`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongDetails.tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Play, Pause, Share2, Download, Edit2, Save, X, ExternalLink, BarChart2 } from 'lucide-react';

// ... rest of the component code ...`}</code></pre>
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