import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';

export interface MediaCardProps {
  title: string;
  artist: string;
  album: string;
  duration: number;
  albumArt: string;
  isPlaying?: boolean;
  variant?: 'default' | 'compact';
  showMetadata?: boolean;
  metadata?: Record<string, any>;
  onPlay?: () => void;
  onPause?: () => void;
  onSelect?: () => void;
  className?: string;
}

export function MediaCard({
  title,
  artist,
  album,
  duration,
  albumArt,
  isPlaying = false,
  variant = 'default',
  showMetadata = false,
  metadata,
  onPlay,
  onPause,
  onSelect,
  className
}: MediaCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent',
        variant === 'compact' && 'p-2',
        className
      )}
      onClick={onSelect}
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <img
          src={albumArt}
          alt={`${title} album art`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            type="button"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              isPlaying ? onPause?.() : onPlay?.();
            }}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium leading-none">{title}</h3>
            <p className="text-sm text-muted-foreground">{artist}</p>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDuration(duration)}
          </span>
        </div>

        {variant === 'default' && (
          <p className="text-sm text-muted-foreground">{album}</p>
        )}

        {showMetadata && metadata && (
          <div className="mt-1 flex gap-2 text-xs text-muted-foreground">
            {Object.entries(metadata).map(([key, value]) => (
              <span key={key}>
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
