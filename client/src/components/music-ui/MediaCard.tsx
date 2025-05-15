import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Track } from '@/types/music';
import { PlayCircle, Pause, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';

interface MediaCardProps {
  track: Track;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  className?: string;
}

export function MediaCard({
  track,
  isPlaying = false,
  onPlay,
  onPause,
  onLike,
  onShare,
  className = ''
}: MediaCardProps) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause && onPause();
    } else {
      onPlay && onPlay();
    }
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0 relative">
        <div className="aspect-square w-full relative overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <img 
            src={track.albumArt || `https://via.placeholder.com/400x400?text=${track.title[0]}`}
            alt={track.title}
            className="w-full h-full object-cover"
          />
          <Button 
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full h-12 w-12 bg-white/90 dark:bg-neutral-900/90 hover:bg-white dark:hover:bg-neutral-900 shadow-md"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause size={24} />
            ) : (
              <PlayCircle size={24} />
            )}
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{track.title}</h3>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm truncate">{track.artist}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {formatTime(track.duration)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between py-3 border-t">
        <Button variant="ghost" size="sm" onClick={onLike}>
          <Heart className="h-4 w-4 mr-1" />
          <span className="text-sm">Like</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={onShare}>
          <Share2 className="h-4 w-4 mr-1" />
          <span className="text-sm">Share</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
