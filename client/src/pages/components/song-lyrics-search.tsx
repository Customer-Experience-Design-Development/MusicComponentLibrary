import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongLyricsSearch } from '@/components/music-ui/SongLyricsSearch';
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

// Demo data for the SongLyricsSearch component
const demoSongs = [
  {
    id: "1",
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    lyrics: `In the vast expanse of space
Where stars dance in endless grace
We find our cosmic harmony
A symphony of eternity

Through the void of time and space
We journey at our own pace
Finding rhythm in the stars
As they guide us from afar

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony

Through nebulas and galaxies
We search for melodies
That echo through the cosmic sea
In perfect harmony

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony

[Bridge]
Every note a star
Every chord a galaxy
Every beat a pulse
Of cosmic energy

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony`
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Marine Melodies",
    lyrics: `Beneath the surface of the sea
Where currents flow so gracefully
We dance with waves in harmony
A melody of the deep blue sea

Through coral reefs and sandy shores
Where ocean life forever pours
We find our rhythm in the tide
As waves crash with the rising tide

[Chorus]
Ocean waves, eternal flow
Dancing with the undertow
In perfect harmony we go
With the rhythm of the sea below

Through depths unknown and mysteries
Where ancient creatures swim with ease
We search for songs in the deep
Where secrets of the ocean sleep

[Chorus]
Ocean waves, eternal flow
Dancing with the undertow
In perfect harmony we go
With the rhythm of the sea below

[Bridge]
Every wave a note
Every current a chord
Every tide a beat
Of the ocean's accord

[Chorus]
Ocean waves, eternal flow
Dancing with the undertow
In perfect harmony we go
With the rhythm of the sea below`
  },
  {
    id: "3",
    title: "Mountain Echo",
    artist: "Peak Performers",
    lyrics: `High above the valley floor
Where eagles soar forever more
We sing our songs to the sky
As echoes through the mountains fly

Through rocky peaks and snow-capped heights
Where morning sun brings golden light
We find our voice in the wind
As nature's chorus begins

[Chorus]
Mountain echo, carry on
Through the valleys, through the dawn
In perfect harmony we sing
With the mountains' echoing

Through misty clouds and alpine air
Where mountain goats with grace repair
We search for songs in the peaks
Where nature's beauty speaks

[Chorus]
Mountain echo, carry on
Through the valleys, through the dawn
In perfect harmony we sing
With the mountains' echoing

[Bridge]
Every peak a note
Every valley a chord
Every wind a beat
Of the mountain's accord

[Chorus]
Mountain echo, carry on
Through the valleys, through the dawn
In perfect harmony we sing
With the mountains' echoing`
  }
];

export default function SongLyricsSearchPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-lyrics-search" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Lyrics Search" 
              description="A powerful search component for finding and analyzing song lyrics with advanced features."
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
                    <SongLyricsSearch songs={demoSongs} />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongLyricsSearch component provides a comprehensive search interface for song lyrics, including:</p>
                      <ul>
                        <li>Real-time search across multiple songs</li>
                        <li>Advanced filtering options</li>
                        <li>Highlighted search matches</li>
                        <li>Context-aware results</li>
                        <li>Export and share functionality</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongLyricsSearchProps {
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    lyrics: string;
  }>;
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { SongLyricsSearch } from '@/components/music-ui/SongLyricsSearch';

function MyComponent() {
  const songs = [
    {
      id: "1",
      title: "Song Title",
      artist: "Artist Name",
      lyrics: "Song lyrics...",
    }
  ];

  return <SongLyricsSearch songs={songs} />;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongLyricsSearch.tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Download, Share2, Copy } from 'lucide-react';

interface SongLyricsSearchProps {
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    lyrics: string;
  }>;
  className?: string;
}

interface SearchResult {
  songId: string;
  songTitle: string;
  artist: string;
  matches: Array<{
    line: string;
    lineNumber: number;
    context: string[];
  }>;
}

export function SongLyricsSearch({ songs, className = '' }: SongLyricsSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }

    const results: SearchResult[] = [];
    const query = searchQuery.toLowerCase();

    songs.forEach(song => {
      if (selectedSong && song.id !== selectedSong) {
        return;
      }

      const lines = song.lyrics.split('\\n');
      const matches: SearchResult['matches'] = [];

      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(query)) {
          const context = [
            lines[index - 2],
            lines[index - 1],
            line,
            lines[index + 1],
            lines[index + 2]
          ].filter(Boolean);

          matches.push({
            line,
            lineNumber: index + 1,
            context
          });
        }
      });

      if (matches.length > 0) {
        results.push({
          songId: song.id,
          songTitle: song.title,
          artist: song.artist,
          matches
        });
      }
    });

    return results;
  }, [songs, searchQuery, selectedSong]);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            type="text"
            placeholder="Search lyrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Select value={selectedSong} onValueChange={setSelectedSong}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by song" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Songs</SelectItem>
            {songs.map(song => (
              <SelectItem key={song.id} value={song.id}>
                {song.title} - {song.artist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {searchQuery && (
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">
            Found {searchResults.reduce((acc, result) => acc + result.matches.length, 0)} matches
          </p>
          
          {searchResults.map(result => (
            <Card key={result.songId} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{result.songTitle}</CardTitle>
                    <p className="text-sm text-neutral-500">{result.artist}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleCopy(result.matches.map(m => m.line).join('\\n'))}
                    >
                      <Copy className={\`h-4 w-4 \${copied ? 'text-primary' : ''}\`} />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.matches.map((match, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm text-neutral-500">
                        Line {match.lineNumber}
                      </p>
                      <div className="prose dark:prose-invert max-w-none">
                        {match.context.map((line, i) => (
                          <p 
                            key={i}
                            className={\`text-sm \${
                              i === 2 
                                ? 'bg-primary/10 text-primary px-2 py-1 rounded' 
                                : 'text-neutral-500'
                            }\`}
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
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