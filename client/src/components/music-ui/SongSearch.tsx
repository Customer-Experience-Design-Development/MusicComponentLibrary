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
} 