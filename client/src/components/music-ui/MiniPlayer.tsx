import { useState, useRef, useEffect } from 'react';
import { Track } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

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

  const handlePrevious = () => {
    if (audioRef.current && currentTime > 3) {
      audioRef.current.currentTime = 0;
    } else if (onPrevious) {
      onPrevious();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    const newTime = value[0];
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    const newVolume = value[0];
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleVolumeControl = () => {
    setIsVolumeVisible(!isVolumeVisible);
  };

  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      if (autoPlay) {
        audio.play().catch(error => {
          console.error('Autoplay failed:', error);
        });
        setIsPlaying(true);
        if (onTogglePlay) onTogglePlay(true);
      }
    };
    
    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) {
        onEnded();
      } else if (onNext) {
        onNext();
      }
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleAudioEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleAudioEnded);
      
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, [autoPlay, onEnded, onNext, onTogglePlay]);

  useEffect(() => {
    // Reset player when track changes
    if (audioRef.current) {
      setCurrentTime(0);
      setDuration(track.duration || 0);
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
          if (onTogglePlay) onTogglePlay(false);
        });
      }
    }
  }, [track, isPlaying, onTogglePlay]);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-2">
        <div className="flex items-center space-x-2">
          {/* Album Art */}
          <div className="shrink-0 w-10 h-10 rounded overflow-hidden">
            {track.albumArt ? (
              <img 
                src={track.albumArt} 
                alt={`${track.title} album art`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">♪</span>
              </div>
            )}
          </div>
          
          {/* Track Info */}
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-sm font-semibold truncate">{track.title}</p>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>
          
          {/* Player Controls */}
          <div className="flex items-center space-x-1.5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handlePrevious}
              className="h-7 w-7"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon" 
              onClick={togglePlay}
              className="h-7 w-7 rounded-full"
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
              className="h-7 w-7"
              disabled={!onNext}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleVolumeControl}
                className="h-7 w-7"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              
              {isVolumeVisible && (
                <div className="absolute bottom-full right-0 p-2 bg-background border rounded shadow-md w-32 z-50">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.01}
                    onValueChange={handleVolumeChange}
                    className="my-1.5"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-1.5 flex items-center space-x-2 text-xs">
          <span className="text-muted-foreground w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || track.duration || 0}
            step={0.1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-muted-foreground w-8">
            {formatTime(duration || track.duration || 0)}
          </span>
        </div>
      </CardContent>
      
      <audio 
        ref={audioRef}
        src={track.audioSrc}
        preload="metadata"
        className="hidden"
      />
    </Card>
  );
}