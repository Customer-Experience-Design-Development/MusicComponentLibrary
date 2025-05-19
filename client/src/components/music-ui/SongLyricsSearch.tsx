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

      const lines = song.lyrics.split('\n');
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
                      onClick={() => handleCopy(result.matches.map(m => m.line).join('\n'))}
                    >
                      <Copy className={`h-4 w-4 ${copied ? 'text-primary' : ''}`} />
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
                            className={`text-sm ${
                              i === 2 
                                ? 'bg-primary/10 text-primary px-2 py-1 rounded' 
                                : 'text-neutral-500'
                            }`}
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
} 