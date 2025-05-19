import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { MiniPlayer } from '@/components/music-ui/MiniPlayer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Track } from '@/types/music';
import React from 'react';

const footerCategories = [
  {
    title: 'Documentation',
    links: [
      { title: 'Getting Started', path: '/docs/introduction' },
      { title: 'Components', path: '/components' },
      { title: 'API Reference', path: '/docs/api' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
      { title: 'Discord', path: 'https://discord.gg/your-server' },
      { title: 'Twitter', path: 'https://twitter.com/your-handle' },
    ],
  },
];

const socialLinks = [
  { title: 'GitHub', path: 'https://github.com/yourusername/music-component-library' },
  { title: 'Discord', path: 'https://discord.gg/your-server' },
  { title: 'Twitter', path: 'https://twitter.com/your-handle' },
];

// Demo data for the MiniPlayer component
const demoTrack: Track = {
  id: 1,
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  duration: 331, // 5:31
  albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
};

export default function MiniPlayerPage() {
  const [currentTrack, setCurrentTrack] = React.useState<Track>(demoTrack);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleTogglePlay = (playing: boolean) => {
    setIsPlaying(playing);
  };

  const handleNext = () => {
    // In a real app, this would load the next track
    console.log('Next track requested');
  };

  const handlePrevious = () => {
    // In a real app, this would load the previous track
    console.log('Previous track requested');
  };

  const handleEnded = () => {
    // In a real app, this would handle track ending
    console.log('Track ended');
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/mini-player" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Mini Player"
            description="A compact audio player component with playback controls and progress tracking."
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
                  <div className="max-w-2xl mx-auto">
                    <MiniPlayer
                      track={currentTrack}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      onTogglePlay={handleTogglePlay}
                      onEnded={handleEnded}
                      autoPlay={false}
                    />
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Mini Player component provides a compact interface for audio playback with essential controls and progress tracking. It's perfect for persistent playback controls in music applications.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">track: Track</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The current track being played. Must include id, title, artist, duration, and albumArt.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onNext?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when next track is requested.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onPrevious?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when previous track is requested.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onTogglePlay?: (isPlaying: boolean) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when play state changes.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onEnded?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when track playback ends.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">autoPlay?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Whether to automatically start playback when track loads.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">className?: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional CSS class name for custom styling.
                      </p>
                    </div>
                  </div>
                  <h4 className="text-md font-semibold mt-6 mb-2">Features</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Compact design with album art</li>
                    <li>Play/pause controls</li>
                    <li>Previous/next track navigation</li>
                    <li>Progress bar with seeking</li>
                    <li>Volume control with mute toggle</li>
                    <li>Time display</li>
                    <li>Auto-play support</li>
                    <li>Track change handling</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for persistent playback controls in music applications.</li>
                    <li>Implement track navigation callbacks for playlist support.</li>
                    <li>Handle play state changes to sync with application state.</li>
                    <li>Consider auto-play behavior based on user preferences.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { MiniPlayer } from '@/components/music-ui/MiniPlayer';
import { Track } from '@/types/music';
import { useState } from 'react';

export default function Example() {
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331,
    albumArt: "https://example.com/album-art.jpg"
  });

  const handleNext = () => {
    // Load next track
    console.log('Next track requested');
  };

  const handlePrevious = () => {
    // Load previous track
    console.log('Previous track requested');
  };

  const handleTogglePlay = (isPlaying: boolean) => {
    // Update play state
    console.log('Play state:', isPlaying);
  };

  const handleEnded = () => {
    // Handle track ending
    console.log('Track ended');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <MiniPlayer
        track={currentTrack}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onTogglePlay={handleTogglePlay}
        onEnded={handleEnded}
        autoPlay={false}
      />
    </div>
  );
}`}
                    </code>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        </div>
      </div>
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 