import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VolumeControlProps {
  initialVolume?: number;
  onChange?: (volume: number) => void;
  className?: string;
}

const VOLUME_PRESETS = {
  quiet: 30,
  normal: 70,
  loud: 90,
};

export function VolumeControl({ 
  initialVolume = 70, 
  onChange,
  className = ''
}: VolumeControlProps) {
  const [volume, setVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);
  const [isNormalized, setIsNormalized] = useState(false);

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    setMuted(vol === 0);
    
    if (onChange) {
      onChange(vol);
    }
  };

  const toggleMute = () => {
    if (muted) {
      setVolume(prevVolume || 70);
      setMuted(false);
      if (onChange) {
        onChange(prevVolume || 70);
      }
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setMuted(true);
      if (onChange) {
        onChange(0);
      }
    }
  };

  const toggleNormalization = () => {
    setIsNormalized(!isNormalized);
    if (!isNormalized) {
      // Apply normalization (simple version - just boost low volumes)
      const normalizedVolume = Math.min(volume * 1.5, 100);
      setVolume(normalizedVolume);
      if (onChange) {
        onChange(normalizedVolume);
      }
    } else {
      // Reset to original volume
      setVolume(prevVolume);
      if (onChange) {
        onChange(prevVolume);
      }
    }
  };

  const setPresetVolume = (preset: keyof typeof VOLUME_PRESETS) => {
    const presetVolume = VOLUME_PRESETS[preset];
    setPrevVolume(volume);
    setVolume(presetVolume);
    setMuted(false);
    if (onChange) {
      onChange(presetVolume);
    }
  };

  const getVolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX size={18} />;
    if (volume < 30) return <Volume size={18} />;
    if (volume < 70) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 rounded-full" 
        onClick={toggleMute}
      >
        {getVolumeIcon()}
      </Button>
      <Slider
        className="w-20 mx-2"
        defaultValue={[initialVolume]}
        max={100}
        step={1}
        value={[volume]}
        onValueChange={handleVolumeChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-1 rounded-full ${isNormalized ? 'text-primary' : ''}`}
          >
            <Settings size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={toggleNormalization}>
            {isNormalized ? 'Disable' : 'Enable'} Volume Normalization
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPresetVolume('quiet')}>
            Quiet ({VOLUME_PRESETS.quiet}%)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPresetVolume('normal')}>
            Normal ({VOLUME_PRESETS.normal}%)
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPresetVolume('loud')}>
            Loud ({VOLUME_PRESETS.loud}%)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
