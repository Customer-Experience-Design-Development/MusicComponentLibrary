import { useState, useRef, useEffect } from 'react';
import { Track } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, MoreHorizontal, Heart, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MiniPlayerProps {
  track: Track;
  onNext?: () => void;
  onPrevious?: () => void;
  onTogglePlay?: (isPlaying: boolean) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  className?: string;
}

export function MiniPlayer({
  track,
  onNext,
  onPrevious,
  onTogglePlay,
  onEnded,
  autoPlay = false,
  className = '',
}: MiniPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeVisible, setIsVolumeVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressIntervalRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
    if (onTogglePlay) {
      onTogglePlay(!isPlaying);
    }
  };

  const handleSeek = (values: number[]) => {
    const newTime = values[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleVolumeControl = () => {
    setIsVolumeVisible(!isVolumeVisible);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) {
        onEnded();
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Set initial volume
    audio.volume = volume;

    // Auto-play if requested
    if (autoPlay) {
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [track, autoPlay, volume, onEnded]);

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4 shadow-lg border dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Mini Player
          </h3>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>
              <Heart className="h-3 w-3 mr-2" />
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-3 w-3 mr-2" />
              Share track
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4">
        {/* Album Art */}
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-md flex items-center justify-center flex-shrink-0">
          {track.albumArt ? (
            <img 
              src={track.albumArt} 
              alt={track.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Music className="h-8 w-8 text-white/80" />
          )}
        </div>

        {/* Track Info & Controls */}
        <div className="flex-1 min-w-0">
          <div className="mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
              {track.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {track.artist}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onPrevious}
                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!onPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                onClick={togglePlay}
                size="icon"
                className="h-9 w-9 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onNext}
                className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={!onNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Volume & Time */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleVolumeControl}
                  className="h-6 w-6"
                >
                  {isMuted ? (
                    <VolumeX className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </Button>
                
                {isVolumeVisible && (
                  <div className="absolute bottom-full right-0 p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg w-28 z-50">
                    <Slider
                      value={[isMuted ? 0 : volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      className="my-1"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-3 space-y-1">
        <Slider
          value={[currentTime]}
          min={0}
          max={duration || track.duration || 0}
          step={0.1}
          onValueChange={handleSeek}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 tabular-nums">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration || track.duration || 0)}</span>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={track.audioSrc}
        preload="metadata"
        className="hidden"
      />
    </div>
  );
}