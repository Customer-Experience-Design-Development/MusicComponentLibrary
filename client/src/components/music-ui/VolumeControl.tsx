import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VolumeControlProps {
  initialVolume?: number;
  onChange?: (volume: number) => void;
  className?: string;
}

export function VolumeControl({ 
  initialVolume = 70, 
  onChange,
  className = ''
}: VolumeControlProps) {
  const [volume, setVolume] = useState(initialVolume);
  const [prevVolume, setPrevVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);

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
    </div>
  );
}
