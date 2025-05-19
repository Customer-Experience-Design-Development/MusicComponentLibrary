import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { AlbumGrid } from '@/components/music-ui/AlbumGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Album } from '@/types/music';

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

// Demo data for the AlbumGrid component
const albums = [
  {
    id: '1',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    coverUrl: 'https://example.com/album1.jpg',
    releaseDate: '2024-01-01',
    genre: 'Electronic',
    tracks: [
      {
        id: 1,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
        audioSources: [{
          url: 'https://example.com/sample1.mp3',
          format: 'mp3',
          quality: 'high'
        }]
      },
      {
        id: 2,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
      {
        id: 3,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
      {
        id: 4,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
    ]
  },
  {
    id: '2',
    title: 'Midnight Dreams',
    artist: 'Luna Star',
    coverUrl: 'https://example.com/album2.jpg',
    releaseDate: '2024-02-01',
    genre: 'Pop',
    tracks: [
      {
        id: 1,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
    ]
  },
  {
    id: '3',
    title: 'Urban Rhythms',
    artist: 'Beat Master',
    coverUrl: 'https://example.com/album3.jpg',
    releaseDate: '2024-03-01',
    genre: 'Hip Hop',
    tracks: [
      {
        id: 1,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
    ]
  },
  {
    id: '4',
    title: 'Acoustic Sessions',
    artist: 'Guitar Hero',
    coverUrl: 'https://example.com/album4.jpg',
    releaseDate: '2024-04-01',
    genre: 'Folk',
    tracks: [
      {
        id: 1,
        title: 'Summer Vibes',
        artist: 'DJ Cool',
        duration: 180,
      },
    ]
  }
];

export default function AlbumGridPage() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-12 gap-6 mt-4">
        <Sidebar activePath="/components/album-grid" />
        <main className="col-span-12 lg:col-span-9">
          <PageHeader
            title="Album Grid"
            description="A responsive grid component for displaying music albums with cover art and details."
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
                  <AlbumGrid
                    albums={albums}
                    onAlbumClick={(album) => console.log('Album clicked:', album)}
                  />
                </Card>
              </TabsContent>
              <TabsContent value="documentation" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Overview</h3>
                  <p className="text-muted-foreground mb-4">
                    The Album Grid component provides a responsive grid layout for displaying music albums with their cover art and details. It's designed for music streaming platforms, artist pages, and music libraries.
                  </p>
                  <h4 className="text-md font-semibold mt-6 mb-2">Props</h4>
                  <div className="space-y-2">
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">albums: Album[]</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Array of album objects containing title, artist, cover URL, and other details.
                      </p>
                    </div>
                    <div>
                      <code className="text-sm font-mono bg-muted px-2 py-1 rounded">onAlbumClick?: (album: Album) =&gt; void</code>
                      <p className="text-sm text-muted-foreground mt-1">
                        Optional callback function when an album is clicked.
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
                    <li>Responsive grid layout</li>
                    <li>Album cover art display</li>
                    <li>Album details (title, artist, genre)</li>
                    <li>Interactive hover effects</li>
                    <li>Customizable styling</li>
                  </ul>
                  <h4 className="text-md font-semibold mt-6 mb-2">Usage Guidelines</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>Use for displaying music albums in a grid format.</li>
                    <li>Ensure album cover images are properly sized and optimized.</li>
                    <li>Implement click handlers for album selection or navigation.</li>
                  </ul>
                </Card>
              </TabsContent>
              <TabsContent value="code" className="space-y-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Example Implementation</h3>
                  <div className="bg-muted p-4 rounded-lg overflow-x-auto">
                    <code>
{`import { AlbumGrid } from '@/components/music-ui/AlbumGrid';

export default function Example() {
  const albums = [
    {
      id: '1',
      title: 'Summer Vibes',
      artist: 'DJ Cool',
      coverUrl: 'https://example.com/album1.jpg',
      releaseDate: '2024-01-01',
      genre: 'Electronic',
      tracks: 12
    },
    {
      id: '2',
      title: 'Midnight Dreams',
      artist: 'Luna Star',
      coverUrl: 'https://example.com/album2.jpg',
      releaseDate: '2024-02-01',
      genre: 'Pop',
      tracks: 10
    }
  ];

  return (
    <AlbumGrid
      albums={albums}
      onAlbumClick={(album) => console.log('Album clicked:', album)}
      className="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
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
      <Footer categories={footerCategories} socialLinks={socialLinks} />
    </div>
  );
} 