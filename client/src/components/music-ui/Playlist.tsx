import { useState } from 'react';
import { Track } from '@/types/music';
import { Shuffle, Repeat, MoreHorizontal, PlusCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatTime } from '@/lib/utils';
import { Equalizer } from './Equalizer';

interface PlaylistProps {
  tracks: Track[];
  selectedTrackId?: number;
  onSelect?: (track: Track) => void;
  onShuffle?: () => void;
  onRepeat?: () => void;
  onAddTrack?: () => void;
  onDownload?: () => void;
  className?: string;
}

export function Playlist({
  tracks,
  selectedTrackId,
  onSelect,
  onShuffle,
  onRepeat,
  onAddTrack,
  onDownload,
  className = ''
}: PlaylistProps) {
  return (
    <div className={className}>
      <div className="overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-700 divide-y divide-neutral-200 dark:divide-neutral-700">
        {tracks.map((track, index) => (
          <PlaylistItem
            key={track.id}
            track={track}
            index={index + 1}
            isSelected={track.id === selectedTrackId}
            onClick={() => onSelect && onSelect(track)}
          />
        ))}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <Button 
          variant="link" 
          className="text-primary p-0 h-auto" 
          onClick={onAddTrack}
        >
          <PlusCircle className="h-4 w-4 mr-1" />
          Add track
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={onShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={onRepeat}
          >
            <Repeat className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 text-muted-foreground hover:text-primary transition-colors"
            onClick={onDownload}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface PlaylistItemProps {
  track: Track;
  index: number;
  isSelected?: boolean;
  onClick?: () => void;
}

function PlaylistItem({ track, index, isSelected, onClick }: PlaylistItemProps) {
  return (
    <div 
      className={`flex items-center p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer ${
        isSelected ? 'bg-primary/5' : ''
      }`}
      onClick={onClick}
    >
      <div className={`flex-shrink-0 w-8 text-center font-medium ${
        isSelected ? 'text-primary' : 'text-neutral-500 dark:text-neutral-400'
      }`}>
        {index}
      </div>
      <div className="flex-shrink-0 ml-2">
        <img 
          src={track.albumArt || `https://via.placeholder.com/40x40?text=${track.title[0]}`} 
          alt={`${track.title} album art`} 
          className="w-10 h-10 rounded object-cover" 
        />
      </div>
      <div className="ml-3 flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{track.title}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{track.artist}</p>
      </div>
      <div className="ml-2 flex-shrink-0 flex items-center text-neutral-500 dark:text-neutral-400">
        <span className="text-xs mr-3">{formatTime(track.duration)}</span>
        {isSelected && (
          <Equalizer className="mr-2" />
        )}
        <Button variant="ghost" size="icon" className="p-1 hover:text-primary transition-colors">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
