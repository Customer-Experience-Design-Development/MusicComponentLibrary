import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongLyrics } from '@/components/music-ui/SongLyrics';
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

// Demo data for the SongLyrics component
const demoSong = {
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
};

export default function SongLyricsPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-lyrics" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Lyrics" 
              description="A component for displaying and searching through song lyrics with advanced features."
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
                    <SongLyrics song={demoSong} />
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongLyrics component provides a rich interface for displaying and interacting with song lyrics, including:</p>
                      <ul>
                        <li>Real-time search functionality</li>
                        <li>Highlighted search matches</li>
                        <li>Copy to clipboard</li>
                        <li>Export and share options</li>
                        <li>Clean, readable layout</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface SongLyricsProps {
  song: {
    title: string;
    artist: string;
    lyrics: string;
  };
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { SongLyrics } from '@/components/music-ui/SongLyrics';

function MyComponent() {
  const song = {
    title: "Song Title",
    artist: "Artist Name",
    lyrics: "Song lyrics...",
  };

  return <SongLyrics song={song} />;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="code" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Source Code</h3>
                    <pre><code>{`// SongLyrics.tsx
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Download, Share2, Copy } from 'lucide-react';

interface SongLyricsProps {
  song: {
    title: string;
    artist: string;
    lyrics: string;
  };
  className?: string;
}

export function SongLyrics({ song, className = '' }: SongLyricsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const { filteredLyrics, matches } = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        filteredLyrics: song.lyrics,
        matches: []
      };
    }

    const lines = song.lyrics.split('\\n');
    const query = searchQuery.toLowerCase();
    const matches: number[] = [];
    
    const filteredLines = lines.map((line, index) => {
      if (line.toLowerCase().includes(query)) {
        matches.push(index);
        return line;
      }
      return line;
    });

    return {
      filteredLyrics: filteredLines.join('\\n'),
      matches
    };
  }, [song.lyrics, searchQuery]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(song.lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{song.title}</CardTitle>
            <p className="text-sm text-neutral-500">{song.artist}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleCopy}
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              type="text"
              placeholder="Search lyrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {searchQuery && (
            <p className="text-sm text-neutral-500">
              Found {matches.length} {matches.length === 1 ? 'match' : 'matches'}
            </p>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            {filteredLyrics.split('\\n').map((line, index) => (
              <p 
                key={index} 
                className={\`text-sm \${
                  matches.includes(index) 
                    ? 'bg-primary/10 text-primary px-2 py-1 rounded' 
                    : ''
                }\`}
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
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