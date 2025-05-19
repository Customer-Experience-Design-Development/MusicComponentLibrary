import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongDetailPlayer } from '@/components/music-ui/SongDetailPlayer';
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

// Demo data for the SongDetailPlayer component
const demoTrack: Track = {
  id: 1,
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  duration: 331, // 5:31
  albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3"
};

export default function SongDetailPlayerPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-detail-player" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Detail Player" 
              description="A comprehensive audio player component for song detail pages with advanced features."
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
                    <SongDetailPlayer track={demoTrack} />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongDetailPlayer component provides a comprehensive audio player interface for song detail pages, including:</p>
                      <ul>
                        <li>Large album art display</li>
                        <li>Full track information</li>
                        <li>Advanced playback controls</li>
                        <li>Progress bar with time display</li>
                        <li>Volume control with mute option</li>
                        <li>Favorite button</li>
                        <li>Tabbed interface for additional features</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongDetailPlayerProps {
  track: Track;
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { SongDetailPlayer } from '@/components/music-ui/SongDetailPlayer';

function MyComponent() {
  const track = {
    id: 1,
    title: "Song Title",
    artist: "Artist Name",
    duration: 180,
    albumArt: "path/to/album-art.jpg",
    audioSrc: "path/to/audio.mp3"
  };

  return <SongDetailPlayer track={track} />;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongDetailPlayer.tsx
import { useState, useRef, useEffect } from 'react';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface SongDetailPlayerProps {
  track: Track;
  className?: string;
}

export function SongDetailPlayer({ track, className = '' }: SongDetailPlayerProps) {
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