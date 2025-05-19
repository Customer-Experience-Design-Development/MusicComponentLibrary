import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Playlist } from '@/components/music-ui/Playlist';
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

// Demo data for the Playlist component
const tracks: Track[] = [
  {
    id: 1,
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    duration: 180,
    albumArt: 'https://example.com/track1.jpg'
  },
  {
    id: 2,
    title: 'Midnight Dreams',
    artist: 'Luna Star',
    duration: 240,
    albumArt: 'https://example.com/track2.jpg'
  },
  {
    id: 3,
    title: 'Urban Rhythms',
    artist: 'Beat Master',
    duration: 200,
    albumArt: 'https://example.com/track3.jpg'
  },
  {
    id: 4,
    title: 'Acoustic Sessions',
    artist: 'Guitar Hero',
    duration: 220,
    albumArt: 'https://example.com/track4.jpg'
  }
];

export default function PlaylistPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/playlist" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader
              title="Playlist"
              description="A component for displaying and managing music playlists with track information and controls."
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
                    <Playlist
                      tracks={tracks}
                      selectedTrackId={1}
                      onSelect={(track: Track) => console.log('Track selected:', track)}
                      onShuffle={() => console.log('Shuffle clicked')}
                      onRepeat={() => console.log('Repeat clicked')}
                      onAddTrack={() => console.log('Add track clicked')}
                      onDownload={() => console.log('Download clicked')}
                      className="w-full"
                    />
                  </Card>
                </TabsContent>
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Overview</h3>
                    <p className="text-muted-foreground mb-4">
                      The Playlist component provides a list view of music tracks with playback controls, reordering capabilities, and track information. It's designed for music streaming platforms and media players.
                    </p>
                    <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                    <div className="space-y-2">
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">tracks: Track[]</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Array of track objects containing title, artist, duration, and album art.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">selectedTrackId?: number</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional ID of the currently selected track.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onSelect?: (track: Track) =&gt; void</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional callback function when a track is selected.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onShuffle?: () =&gt; void</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional callback function when shuffle is clicked.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onRepeat?: () =&gt; void</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional callback function when repeat is clicked.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onAddTrack?: () =&gt; void</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional callback function when add track is clicked.
                        </p>
                      </div>
                      <div>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onDownload?: () =&gt; void</code>
                        <p className="text-sm text-muted-foreground mt-1">
                          Optional callback function when download is clicked.
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
                      <li>Track list display</li>
                      <li>Playback controls</li>
                      <li>Drag-and-drop reordering</li>
                      <li>Track information display</li>
                      <li>Customizable styling</li>
                    </ul>
                    <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2">
                      <li>Use for displaying and managing music playlists.</li>
                      <li>Implement track click handlers for playback control.</li>
                      <li>Handle track reordering to update playlist order.</li>
                    </ul>
                  </Card>
                </TabsContent>
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                    <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code>
{`import { Playlist } from '@/components/music-ui/Playlist';
import { Track } from '@/types/music';

export default function Example() {
  const tracks: Track[] = [
    {
      id: 1,
      title: 'Summer Vibes',
      artist: 'DJ Cool',
      duration: 180,
      albumArt: 'https://example.com/track1.jpg'
    },
    {
      id: 2,
      title: 'Midnight Dreams',
      artist: 'Luna Star',
      duration: 240,
      albumArt: 'https://example.com/track2.jpg'
    }
  ];

  return (
    <Playlist
      tracks={tracks}
      selectedTrackId={1}
      onSelect={(track: Track) => console.log('Track selected:', track)}
      onShuffle={() => console.log('Shuffle clicked')}
      onRepeat={() => console.log('Repeat clicked')}
      onAddTrack={() => console.log('Add track clicked')}
      onDownload={() => console.log('Download clicked')}
      className="w-full"
    />
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
      
      <Footer 
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
}