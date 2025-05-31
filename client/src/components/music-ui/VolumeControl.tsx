import { useState, useRef, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX, Settings, Zap, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  const [isCompact, setIsCompact] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check container size and adjust layout
  useEffect(() => {
    const checkSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setIsCompact(width < 200); // Switch to compact mode if container is less than 200px
      }
    };

    checkSize();
    window.addEventListener('resize', checkSize);
    
    // Use ResizeObserver if available for more accurate container size detection
    let resizeObserver: ResizeObserver | null = null;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(checkSize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', checkSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

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
    if (muted || volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  };

  const setPreset = (preset: keyof typeof VOLUME_PRESETS) => {
    const presetVolume = VOLUME_PRESETS[preset];
    setVolume(presetVolume);
    setMuted(false);
    if (onChange) {
      onChange(presetVolume);
    }
  };

  const normalizeVolume = () => {
    setIsNormalized(!isNormalized);
  };

  const VolumeIcon = getVolumeIcon();

  // Compact layout for small containers
  if (isCompact) {
    return (
      <div ref={containerRef} className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-6 w-6 flex-shrink-0"
        >
          <VolumeIcon className="h-3 w-3" />
        </Button>
        
        <div className="flex-1 min-w-0">
          <Slider
            value={[muted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            disabled={muted}
            className="w-full"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 flex-shrink-0"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setPreset('quiet')}>
              <Minus className="h-4 w-4 mr-2" />
              Quiet (30%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreset('normal')}>
              <Volume2 className="h-4 w-4 mr-2" />
              Normal (70%)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPreset('loud')}>
              <Plus className="h-4 w-4 mr-2" />
              Loud (90%)
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={normalizeVolume}>
              <Zap className="h-4 w-4 mr-2" />
              {isNormalized ? 'Disable' : 'Enable'} Normalization
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Full layout for larger containers
  return (
    <div ref={containerRef} className={`bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 flex items-center justify-center shadow-sm">
              <VolumeIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                Volume Control
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {muted ? 'Muted' : `${Math.round(volume)}%`}
              </p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => setPreset('quiet')}>
                <Minus className="h-4 w-4 mr-2" />
                Quiet (30%)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreset('normal')}>
                <Volume2 className="h-4 w-4 mr-2" />
                Normal (70%)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setPreset('loud')}>
                <Plus className="h-4 w-4 mr-2" />
                Loud (90%)
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={normalizeVolume}>
                <Zap className="h-4 w-4 mr-2" />
                {isNormalized ? 'Disable' : 'Enable'} Normalization
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Volume Control */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex-shrink-0"
            >
              <VolumeIcon className="h-5 w-5" />
            </Button>
            
            <div className="flex-1 space-y-3">
              <Slider
                value={[muted ? 0 : volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="flex-1"
                disabled={muted}
              />
              
              {/* Visual level indicators */}
              <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <span>0</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-4 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                  <span>50</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-5 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
                  <span>100</span>
                </div>
              </div>
            </div>

            <div className="text-right flex-shrink-0 min-w-[3rem]">
              <div className="text-lg font-semibold text-gray-900 dark:text-white tabular-nums">
                {muted ? '0' : Math.round(volume)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {muted ? 'MUTED' : '%'}
              </div>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        {(isNormalized || muted) && (
          <div className="flex items-center justify-between">
            {isNormalized && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full">
                <Zap className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                  Normalized
                </span>
              </div>
            )}
            {muted && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full ml-auto">
                <VolumeX className="h-3 w-3 text-red-600 dark:text-red-400" />
                <span className="text-xs font-medium text-red-700 dark:text-red-300">
                  Muted
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// New component for individual stem controls
interface StemVolumeControlProps {
  name: string;
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

export function StemVolumeControl({
  name,
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
  className = ''
}: StemVolumeControlProps) {
  const getVolumeIcon = () => {
    if (muted || volume === 0) return VolumeX;
    if (volume < 30) return Volume;
    if (volume < 70) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className={`flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 hover:shadow-sm transition-shadow ${className}`}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <VolumeIcon className="h-3 w-3 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {name}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {muted ? 'Muted' : `${Math.round(volume)}%`}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-24">
          <Slider
            value={[muted ? 0 : volume]}
            onValueChange={(value) => onVolumeChange(value[0])}
            max={100}
            step={1}
            disabled={muted}
            className="w-full"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onMuteToggle}
          className="h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <VolumeIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
