import { useState, useRef } from 'react';
import { Track } from '@/types/music';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Heart, Share2, MoreHorizontal } from 'lucide-react';
import { formatTime } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Album {
  id: number;
  title: string;
  artist: string;
  releaseYear?: number;
  albumArt?: string;
  tracks: Track[];
}

interface AlbumGridProps {
  albums: Album[];
  onPlay?: (album: Album) => void;
  onSelect?: (album: Album) => void;
  onLike?: (album: Album) => void;
  className?: string;
}

export function AlbumGrid({
  albums,
  onPlay,
  onSelect,
  onLike,
  className = '',
}: AlbumGridProps) {
  const [hoveredAlbum, setHoveredAlbum] = useState<number | null>(null);
  const [playingAlbum, setPlayingAlbum] = useState<number | null>(null);
  
  const handlePlayClick = (album: Album, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (playingAlbum === album.id) {
      // Toggle pause
      setPlayingAlbum(null);
    } else {
      // Start playing
      setPlayingAlbum(album.id);
      if (onPlay) {
        onPlay(album);
      }
    }
  };
  
  const handleLikeClick = (album: Album, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onLike) {
      onLike(album);
    }
  };

  const handleAlbumClick = (album: Album) => {
    if (onSelect) {
      onSelect(album);
    }
  };

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${className}`}>
      {albums.map((album) => (
        <Card 
          key={album.id}
          className="overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer"
          onClick={() => handleAlbumClick(album)}
          onMouseEnter={() => setHoveredAlbum(album.id)}
          onMouseLeave={() => setHoveredAlbum(null)}
        >
          <div className="relative aspect-square">
            {album.albumArt ? (
              <img 
                src={album.albumArt} 
                alt={`${album.title} album cover`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-2xl">♪</span>
              </div>
            )}
            
            {(hoveredAlbum === album.id || playingAlbum === album.id) && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                <Button 
                  variant="default" 
                  size="icon" 
                  className="rounded-full h-12 w-12 bg-primary/90 hover:bg-primary"
                  onClick={(e) => handlePlayClick(album, e)}
                >
                  {playingAlbum === album.id ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6 ml-1" />
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-background/30"
                  onClick={(e) => handleLikeClick(album, e)}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-9 w-9 bg-background/30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Album Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>Add to Playlist</DropdownMenuItem>
                    <DropdownMenuItem>View Artist</DropdownMenuItem>
                    <DropdownMenuItem>Download</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
          
          <CardContent className="p-3">
            <h3 className="font-semibold truncate">{album.title}</h3>
            <p className="text-sm text-muted-foreground">{album.artist}</p>
            {album.releaseYear && (
              <p className="text-xs text-muted-foreground mt-1">{album.releaseYear}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {album.tracks.length} {album.tracks.length === 1 ? 'track' : 'tracks'} • {
                formatTime(
                  album.tracks.reduce((total, track) => total + (track.duration || 0), 0)
                )
              }
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}