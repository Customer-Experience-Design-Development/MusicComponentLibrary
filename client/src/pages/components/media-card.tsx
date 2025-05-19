import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { MediaCard } from '@/components/music-ui/MediaCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
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

// Demo data for the MediaCard component
const mediaItems = [
  {
    id: 1,
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    album: 'Summer Collection',
    duration: 245,
    albumArt: 'https://example.com/album1.jpg',
    isPlaying: false
  },
  {
    id: 2,
    title: 'Midnight Dreams',
    artist: 'Luna Star',
    album: 'Night Sky',
    duration: 312,
    albumArt: 'https://example.com/album2.jpg',
    isPlaying: false
  },
  {
    id: 3,
    title: 'Urban Rhythms',
    artist: 'Beat Master',
    album: 'City Life',
    duration: 278,
    albumArt: 'https://example.com/album3.jpg',
    isPlaying: false
  },
  {
    id: 4,
    title: 'Acoustic Sessions',
    artist: 'Guitar Hero',
    album: 'Unplugged',
    duration: 198,
    albumArt: 'https://example.com/album4.jpg',
    isPlaying: false
  }
];

export default function MediaCardPage() {
  const [playingItems, setPlayingItems] = React.useState<Set<number>>(new Set());

  const handlePlay = (id: number) => {
    setPlayingItems(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handlePause = (id: number) => {
    setPlayingItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-6 mt-4">  
        <Sidebar activePath="/components/media-card" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Media Card"
            description="A versatile card component for displaying music tracks with album art and playback controls."
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mediaItems.map((item) => (
                      <MediaCard
                        key={item.id}
                        title={item.title}
                        artist={item.artist}
                        album={item.album}
                        duration={item.duration}
                        albumArt={item.albumArt}
                        isPlaying={playingItems.has(item.id)}
                        onPlay={() => handlePlay(item.id)}
                        onPause={() => handlePause(item.id)}
                        onSelect={() => console.log('Media item selected:', item)}
                      />
                    ))}
                  </div>
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Media Card component provides a visually appealing way to display music tracks with album art, playback controls, and track information. It supports both default and compact variants.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">title: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The title of the track.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">artist: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The artist of the track.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">album: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The album name.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">duration: number</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The duration of the track in seconds.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">albumArt: string</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        URL of the album art image.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">isPlaying?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Whether the track is currently playing.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">variant?: 'default' | 'compact'</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        The visual variant of the card.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">showMetadata?: boolean</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Whether to show additional metadata.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">metadata?: Record&lt;string, any&gt;</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Additional metadata to display.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onPlay?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when play button is clicked.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onPause?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when pause button is clicked.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onSelect?: () =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Callback when the card is clicked.
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
                    <li>Album art display</li>
                    <li>Track information (title, artist, album)</li>
                    <li>Duration display</li>
                    <li>Play/pause controls</li>
                    <li>Default and compact variants</li>
                    <li>Optional metadata display</li>
                    <li>Interactive hover effects</li>
                    <li>Customizable styling</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for displaying music tracks in a list or grid.</li>
                    <li>Ensure album art images are properly sized and optimized.</li>
                    <li>Implement play/pause handlers for audio playback.</li>
                    <li>Use the compact variant for dense layouts.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { MediaCard } from '@/components/music-ui/MediaCard';
import { useState } from 'react';

export default function Example() {
  const [playingItems, setPlayingItems] = useState(new Set());

  const handlePlay = (id: number) => {
    setPlayingItems(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handlePause = (id: number) => {
    setPlayingItems(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const mediaItems = [
    {
      id: 1,
      title: 'Summer Vibes',
      artist: 'DJ Cool',
      album: 'Summer Collection',
      duration: 245,
      albumArt: 'https://example.com/album1.jpg'
    },
    {
      id: 2,
      title: 'Midnight Dreams',
      artist: 'Luna Star',
      album: 'Night Sky',
      duration: 312,
      albumArt: 'https://example.com/album2.jpg'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mediaItems.map((item) => (
        <MediaCard
          key={item.id}
          title={item.title}
          artist={item.artist}
          album={item.album}
          duration={item.duration}
          albumArt={item.albumArt}
          isPlaying={playingItems.has(item.id)}
          onPlay={() => handlePlay(item.id)}
          onPause={() => handlePause(item.id)}
          onSelect={() => console.log('Media item selected:', item)}
        />
      ))}
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
