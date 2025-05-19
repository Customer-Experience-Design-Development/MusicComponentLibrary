import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongSearch } from '@/components/music-ui/SongSearch';
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

// Demo data for the SongSearch component
const demoSongs = [
  {
    id: "1",
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    album: "Stellar Journey",
    releaseDate: "2024-03-15",
    duration: 245,
    genre: "Electronic",
    bpm: 128,
    key: "D minor",
    tags: ["space", "electronic", "ambient"],
    credits: {
      producer: "Nova Beats",
      songwriter: "Cosmic Writer",
      mixer: "Star Mixer"
    }
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Marine Melodies",
    album: "Deep Blue",
    releaseDate: "2024-02-28",
    duration: 198,
    genre: "Ambient",
    bpm: 90,
    key: "A major",
    tags: ["ocean", "ambient", "nature"],
    credits: {
      producer: "Wave Maker",
      songwriter: "Ocean Poet",
      mixer: "Deep Mixer"
    }
  },
  {
    id: "3",
    title: "Mountain Echo",
    artist: "Peak Performers",
    album: "High Altitude",
    releaseDate: "2024-01-15",
    duration: 215,
    genre: "Folk",
    bpm: 110,
    key: "G major",
    tags: ["mountain", "folk", "acoustic"],
    credits: {
      producer: "Summit Sounds",
      songwriter: "Mountain Muse",
      mixer: "Peak Mixer"
    }
  }
];

export default function SongSearchPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-search" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Search" 
              description="A powerful search component for finding and filtering songs with advanced features."
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
                    <SongSearch songs={demoSongs} />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongSearch component provides a comprehensive search interface for songs, including:</p>
                      <ul>
                        <li>Real-time search and filtering</li>
                        <li>Advanced filtering options</li>
                        <li>Sorting capabilities</li>
                        <li>Responsive grid layout</li>
                        <li>Customizable card display</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongSearchProps {
  songs: Array<{
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
  }>;
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { SongSearch } from '@/components/music-ui/SongSearch';

function MyComponent() {
  const songs = [
    {
      id: "1",
      title: "Song Title",
      artist: "Artist Name",
      // ... other song properties
    }
  ];

  return <SongSearch songs={songs} />;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongSearch.tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';

interface SongSearchProps {
  songs: Array<{
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
  }>;
  className?: string;
}

export function SongSearch({ songs, className = '' }: SongSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredSongs = useMemo(() => {
    return songs
      .filter(song => {
        const matchesSearch = 
          song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
          song.album.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesGenre = !genreFilter || song.genre === genreFilter;
        
        return matchesSearch && matchesGenre;
      })
      .sort((a, b) => {
        const aValue = a[sortBy as keyof typeof a];
        const bValue = b[sortBy as keyof typeof b];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }
        
        return 0;
      });
  }, [songs, searchQuery, genreFilter, sortBy, sortOrder]);

  const genres = useMemo(() => {
    return Array.from(new Set(songs.map(song => song.genre)));
  }, [songs]);

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search songs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="artist">Artist</SelectItem>
            <SelectItem value="album">Album</SelectItem>
            <SelectItem value="releaseDate">Release Date</SelectItem>
            <SelectItem value="duration">Duration</SelectItem>
            <SelectItem value="bpm">BPM</SelectItem>
          </SelectContent>
        </Select>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        >
          {sortOrder === 'asc' ? (
            <SortAsc className="h-4 w-4" />
          ) : (
            <SortDesc className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map(song => (
          <Card key={song.id} className="overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">{song.title}</CardTitle>
              <p className="text-sm text-neutral-500">{song.artist}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Album:</span> {song.album}</p>
                <p><span className="font-medium">Genre:</span> {song.genre}</p>
                <p><span className="font-medium">BPM:</span> {song.bpm}</p>
                <p><span className="font-medium">Key:</span> {song.key}</p>
                <div className="flex flex-wrap gap-1">
                  {song.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
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