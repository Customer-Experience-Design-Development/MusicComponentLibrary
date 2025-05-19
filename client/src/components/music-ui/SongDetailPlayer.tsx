import { useState, useRef, useEffect } from 'react';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface SongDetailPlayerProps {
  track: Track;
  className?: string;
}

export function SongDetailPlayer({ track, className = '' }: SongDetailPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <Card className={className}>
      <div className="p-6 space-y-6">
        {/* Album Art and Basic Info */}
        <div className="flex items-start gap-6">
          <img
            src={track.albumArt}
            alt={`${track.title} album art`}
            className="w-48 h-48 rounded-lg object-cover"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{track.title}</h2>
              <p className="text-lg text-muted-foreground">{track.artist}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsRepeat(!isRepeat)}>
                <Repeat className={`h-5 w-5 ${isRepeat ? 'text-primary' : ''}`} />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsShuffle(!isShuffle)}>
                <Shuffle className={`h-5 w-5 ${isShuffle ? 'text-primary' : ''}`} />
              </Button>
            </div>
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <SkipBack className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="icon"
              className="h-12 w-12"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground w-12">
              {formatTime(currentTime)}
            </span>
            <Slider
              value={[currentTime]}
              max={track.duration}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-12">
              {formatTime(track.duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {isMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-32"
            />
          </div>
        </div>

        {/* Additional Features */}
        <Tabs defaultValue="waveform" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="waveform" className="flex-1">Waveform</TabsTrigger>
            <TabsTrigger value="lyrics" className="flex-1">Lyrics</TabsTrigger>
            <TabsTrigger value="stems" className="flex-1">Stems</TabsTrigger>
          </TabsList>
          <TabsContent value="waveform" className="mt-4">
            <div className="h-32 bg-muted rounded-lg" />
          </TabsContent>
          <TabsContent value="lyrics" className="mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-center text-muted-foreground">Lyrics will be displayed here</p>
            </div>
          </TabsContent>
          <TabsContent value="stems" className="mt-4">
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">Stem controls will be displayed here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <audio
        ref={audioRef}
        src={track.audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
    </Card>
  );
} 