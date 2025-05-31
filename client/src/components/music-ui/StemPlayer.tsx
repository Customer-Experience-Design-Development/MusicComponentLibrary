import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VolumeControl, StemVolumeControl } from './VolumeControl';
import { Waveform } from './Waveform';
import { Play, Pause, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface Stem {
  name: string;
  source: AudioSource;
  volume: number;
  muted: boolean;
}

interface StemPlayerProps {
  track: Track;
  stems: Stem[];
  onTogglePlay?: (isPlaying: boolean) => void;
  autoPlay?: boolean;
  showWaveform?: boolean;
  className?: string;
}

export function StemPlayer({
  track,
  stems,
  onTogglePlay,
  autoPlay = false,
  showWaveform = true,
  className = ''
}: StemPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration || 0);
  const [masterVolume, setMasterVolume] = useState(70);
  const [stemStates, setStemStates] = useState<Stem[]>(stems);
  
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const animationRef = useRef<number>();

  // Initialize audio sources
  useEffect(() => {
    stemStates.forEach(stem => {
      if (!audioRefs.current[stem.name]) {
        const audio = new Audio(stem.source.url);
        audioRefs.current[stem.name] = audio;
      }
    });
  }, [stemStates]);

  // Reset player when track or stems change
  useEffect(() => {
    setCurrentTime(0);
    setDuration(track.duration || 0);
    
    Object.values(audioRefs.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    if (autoPlay) {
      playAllStems();
    } else {
      setIsPlaying(false);
    }
  }, [track, stems]);

  const playAllStems = () => {
    const playPromises = Object.values(audioRefs.current).map(audio => 
      audio.play().catch(err => console.error("Error playing audio:", err))
    );
    
    Promise.all(playPromises)
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Error playing stems:", err));
  };

  const pauseAllStems = () => {
    Object.values(audioRefs.current).forEach(audio => audio.pause());
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAllStems();
    } else {
      playAllStems();
    }
    
    onTogglePlay && onTogglePlay(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const mainStem = Object.values(audioRefs.current)[0];
    if (mainStem) {
      setCurrentTime(mainStem.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const mainStem = Object.values(audioRefs.current)[0];
    if (mainStem) {
      setDuration(mainStem.duration);
    }
  };

  const handleWaveformClick = (position: number) => {
    const newTime = position * duration;
    Object.values(audioRefs.current).forEach(audio => {
      audio.currentTime = newTime;
    });
    setCurrentTime(newTime);
  };

  const handleMasterVolumeChange = (newVolume: number) => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = (newVolume / 100) * (audio.dataset.stemVolume ? parseFloat(audio.dataset.stemVolume) : 1);
    });
    setMasterVolume(newVolume);
  };

  const handleStemVolumeChange = (stemName: string, newVolume: number) => {
    const audio = audioRefs.current[stemName];
    if (audio) {
      audio.volume = (masterVolume / 100) * (newVolume / 100);
      audio.dataset.stemVolume = (newVolume / 100).toString();
    }
    
    setStemStates(prev => prev.map(stem => 
      stem.name === stemName ? { ...stem, volume: newVolume } : stem
    ));
  };

  const toggleStemMute = (stemName: string) => {
    const audio = audioRefs.current[stemName];
    if (audio) {
      const isMuted = audio.muted;
      audio.muted = !isMuted;
    }
    
    setStemStates(prev => prev.map(stem => 
      stem.name === stemName ? { ...stem, muted: !stem.muted } : stem
    ));
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-shrink-0 relative">
          <img 
            src={track.albumArt || `https://via.placeholder.com/64x64?text=${track.title[0]}`} 
            alt={`${track.title} album artwork`} 
            className="w-16 h-16 rounded-md object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground truncate">{track.title}</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{track.artist}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="default" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
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
      
      <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400 mb-4">
        <span>{formatTime(currentTime)}</span>
        <div className="w-32">
          <VolumeControl 
            initialVolume={masterVolume} 
            onChange={handleMasterVolumeChange}
          />
        </div>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Individual Stems</h4>
        {stemStates.map((stem) => (
          <StemVolumeControl
            key={stem.name}
            name={stem.name}
            volume={stem.volume}
            muted={stem.muted}
            onVolumeChange={(volume) => handleStemVolumeChange(stem.name, volume)}
            onMuteToggle={() => toggleStemMute(stem.name)}
          />
        ))}
      </div>
    </div>
  );
} 