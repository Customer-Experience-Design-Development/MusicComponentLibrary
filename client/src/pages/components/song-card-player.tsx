import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongCardPlayer } from '@/components/music-ui/SongCardPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Track } from '@/types/music';

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

// Demo data for the SongCardPlayer component
const demoTracks: Track[] = [
  {
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331,
    albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3"
  },
  {
    id: 2,
    title: "Neon Dreams",
    artist: "Digital Wave",
    duration: 245,
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3"
  },
  {
    id: 3,
    title: "Midnight Pulse",
    artist: "Synth Master",
    duration: 298,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3"
  }
];

export default function SongCardPlayerPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-card-player" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Card Player" 
              description="A compact audio player component for displaying songs in a grid or list view."
            />
            
            <div className="mt-8">
              <Tabs defaultValue="preview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="code">Code</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Interactive Demo</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {demoTracks.map(track => (
                        <SongCardPlayer
                          key={track.id}
                          track={track}
                          onSelect={(track) => console.log('Selected track:', track)}
                        />
                      ))}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongCardPlayer component provides a compact audio player interface for grid or list views, including:</p>
                      <ul>
                        <li>Square album art with hover overlay</li>
                        <li>Basic track information</li>
                        <li>Essential playback controls</li>
                        <li>Compact progress bar</li>
                        <li>Simple volume control</li>
                        <li>Favorite button</li>
                        <li>Click handling for navigation</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongCardPlayerProps {
  track: Track;
  className?: string;
  onSelect?: (track: Track) => void;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { SongCardPlayer } from '@/components/music-ui/SongCardPlayer';

function MyComponent() {
  const tracks = [
    {
      id: 1,
      title: "Song Title",
      artist: "Artist Name",
      duration: 180,
      albumArt: "path/to/album-art.jpg",
      audioSrc: "path/to/audio.mp3"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tracks.map(track => (
        <SongCardPlayer
          key={track.id}
          track={track}
          onSelect={(track) => navigate(\`/songs/\${track.id}\`)}
        />
      ))}
    </div>
  );
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongCardPlayer.tsx
import { useState, useRef } from 'react';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Heart, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface SongCardPlayerProps {
  track: Track;
  className?: string;
  onSelect?: (track: Track) => void;
}

export function SongCardPlayer({ track, className = '', onSelect }: SongCardPlayerProps) {
  // ... component implementation
}`}</code></pre>
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