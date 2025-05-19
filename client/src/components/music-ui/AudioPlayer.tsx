import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VolumeControl } from './VolumeControl';
import { Waveform } from './Waveform';
import { Equalizer } from './Equalizer';
import { Heart, Share2, SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  track: Track;
  onNext?: () => void;
  onPrevious?: () => void;
  onTogglePlay?: (isPlaying: boolean) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  showWaveform?: boolean;
  className?: string;
}

export function AudioPlayer({
  track,
  onNext,
  onPrevious,
  onTogglePlay,
  onEnded,
  autoPlay = false,
  showWaveform = true,
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration || 0);
  const [volume, setVolume] = useState(70);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [selectedSource, setSelectedSource] = useState<AudioSource | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Initialize audio source
  useEffect(() => {
    if (track.audioSources && track.audioSources.length > 0) {
      // Select the highest quality source by default
      const sortedSources = [...track.audioSources].sort((a, b) => {
        const qualityOrder = { lossless: 4, high: 3, medium: 2, low: 1 };
        return (qualityOrder[b.quality || 'medium'] || 0) - (qualityOrder[a.quality || 'medium'] || 0);
      });
      setSelectedSource(sortedSources[0]);
    } else if (track.audioSrc) {
      // Legacy support
      setSelectedSource({
        url: track.audioSrc,
        format: 'mp3',
        quality: 'medium'
      });
    }
  }, [track]);

  // Reset player when track or source changes
  useEffect(() => {
    if (!selectedSource) return;

    setCurrentTime(0);
    setDuration(track.duration || 0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = selectedSource.url;
      
      if (autoPlay) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing audio:", err));
      } else {
        setIsPlaying(false);
      }
    }
  }, [track, selectedSource, autoPlay]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => console.error("Error playing audio:", err));
    }
    
    setIsPlaying(!isPlaying);
    onTogglePlay && onTogglePlay(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleWaveformClick = (position: number) => {
    if (!audioRef.current) return;
    const newTime = position * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  };

  const handleEnded = () => {
    if (isRepeating && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .catch(err => console.error("Error playing audio:", err));
    } else {
      setIsPlaying(false);
      onEnded && onEnded();
    }
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  // Create a vinyl-like rotating album cover
  const vinylStyle = isPlaying ? 'vinyl' : '';

  return (
    <div className={`${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-shrink-0 relative">
          <img 
            src={track.albumArt || `https://via.placeholder.com/64x64?text=${track.title[0]}`} 
            alt={`${track.title} album artwork`} 
            className={`w-16 h-16 rounded-md object-cover ${vinylStyle}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 rounded-md border-4 border-white dark:border-neutral-800 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-black/80 w-6 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground truncate">{track.title}</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{track.artist}</p>
          {selectedSource && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {selectedSource.format.toUpperCase()} • {selectedSource.quality}
              {selectedSource.bitrate && ` • ${selectedSource.bitrate}kbps`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {track.audioSources && track.audioSources.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {track.audioSources.map((source, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setSelectedSource(source)}
                    className={selectedSource?.url === source.url ? 'bg-primary/10' : ''}
                  >
                    {source.format.toUpperCase()} • {source.quality}
                    {source.bitrate && ` • ${source.bitrate}kbps`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {showWaveform && (
        <div className="mb-3">
          <Waveform
            data={track.waveformData ? JSON.parse(track.waveformData) : undefined}
            currentTime={currentTime}
            duration={duration}
            onClick={handleWaveformClick}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
        <span>{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className={`p-1 rounded ${isRepeating ? 'text-primary' : 'hover:text-primary'} transition-colors`}
            onClick={toggleRepeat}
          >
            <Repeat className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`p-1 rounded ${isShuffle ? 'text-primary' : 'hover:text-primary'} transition-colors`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <VolumeControl 
            initialVolume={volume} 
            onChange={handleVolumeChange}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex justify-between">
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors p-0 h-auto"
          >
            <Heart className="h-4 w-4 mr-1" />
            <span className="text-sm">Like</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-neutral-500 dark:text-neutral-400 hover:text-primary dark:hover:text-primary transition-colors p-0 h-auto"
          >
            <Share2 className="h-4 w-4 mr-1" />
            <span className="text-sm">Share</span>
          </Button>
        </div>
        <div className="flex items-center text-sm">
          <span className="text-neutral-500 dark:text-neutral-400 mr-2">1.2M plays</span>
          <Equalizer isActive={isPlaying} />
        </div>
      </div>
    </div>
  );
}
