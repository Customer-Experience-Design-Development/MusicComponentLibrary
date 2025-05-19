import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Wand2, Save, Trash2 } from 'lucide-react';

export interface EqualizerProps {
  bands: number;
  min: number;
  max: number;
  step: number;
  values?: number[];
  onChange?: (values: number[]) => void;
  className?: string;
  audioElement?: HTMLAudioElement | null;
}

// Common equalizer presets
const EQUALIZER_PRESETS = {
  flat: Array(10).fill(0),
  bass: [6, 5, 4, 2, 0, 0, 0, -2, -3, -4],
  treble: [-4, -3, -2, 0, 0, 0, 2, 4, 5, 6],
  vocal: [-2, -1, 0, 2, 3, 3, 2, 0, -1, -2],
  rock: [4, 3, 2, 1, 0, 0, 1, 2, 3, 4],
  jazz: [2, 1, 0, -1, -2, -2, -1, 0, 1, 2],
  classical: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  pop: [3, 2, 1, 0, -1, -1, 0, 1, 2, 3],
};

export function Equalizer({
  bands,
  min,
  max,
  step,
  values: initialValues,
  onChange,
  className,
  audioElement
}: EqualizerProps) {
  const [values, setValues] = useState<number[]>(
    initialValues || Array(bands).fill(0)
  );
  const [savedPresets, setSavedPresets] = useState<Record<string, number[]>>({});
  const [isAutoEqualizing, setIsAutoEqualizing] = useState(false);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValues(initialValues);
    }
  }, [initialValues]);

  useEffect(() => {
    if (!audioElement || !isAutoEqualizing) return;

    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    const autoEqualize = () => {
      if (!analyserRef.current || !isAutoEqualizing) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average frequency levels for each band
      const newValues = Array(bands).fill(0);
      const samplesPerBand = Math.floor(bufferLength / bands);

      for (let i = 0; i < bands; i++) {
        let sum = 0;
        for (let j = 0; j < samplesPerBand; j++) {
          const index = i * samplesPerBand + j;
          sum += dataArray[index];
        }
        const average = sum / samplesPerBand;
        // Convert to dB scale and normalize
        newValues[i] = Math.round((average / 255) * (max - min) + min);
      }

      setValues(newValues);
      onChange?.(newValues);
    };

    try {
      initAudioContext();
      const interval = setInterval(autoEqualize, 1000); // Update every second
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Error initializing auto-equalizer:", error);
      setIsAutoEqualizing(false);
    }
  }, [audioElement, isAutoEqualizing, bands, max, min, onChange]);

  const handleValueChange = (index: number, value: number) => {
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    onChange?.(newValues);
  };

  const applyPreset = (preset: keyof typeof EQUALIZER_PRESETS) => {
    const presetValues = EQUALIZER_PRESETS[preset];
    setValues(presetValues);
    onChange?.(presetValues);
  };

  const saveCurrentPreset = (name: string) => {
    setSavedPresets(prev => ({
      ...prev,
      [name]: [...values]
    }));
  };

  const deletePreset = (name: string) => {
    setSavedPresets(prev => {
      const newPresets = { ...prev };
      delete newPresets[name];
      return newPresets;
    });
  };

  const toggleAutoEqualize = () => {
    setIsAutoEqualizing(!isAutoEqualizing);
  };

  const frequencyLabels = [
    '32Hz', '64Hz', '125Hz', '250Hz', '500Hz',
    '1kHz', '2kHz', '4kHz', '8kHz', '16kHz'
  ];

  return (
    <div className={cn('p-4 rounded-lg', className)}>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleAutoEqualize}
            className={isAutoEqualizing ? 'text-primary' : ''}
          >
            <Wand2 size={18} className="mr-2" />
            Auto-Equalize
          </Button>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings size={18} className="mr-2" />
              Presets
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm font-semibold">Built-in Presets</div>
            {Object.entries(EQUALIZER_PRESETS).map(([name, _]) => (
              <DropdownMenuItem key={name} onClick={() => applyPreset(name as keyof typeof EQUALIZER_PRESETS)}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </DropdownMenuItem>
            ))}
            {Object.keys(savedPresets).length > 0 && (
              <>
                <div className="px-2 py-1.5 text-sm font-semibold mt-2">Saved Presets</div>
                {Object.entries(savedPresets).map(([name, _]) => (
                  <DropdownMenuItem key={name} className="flex justify-between">
                    <span onClick={() => setValues(savedPresets[name])}>{name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePreset(name);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-10 gap-2">
        {Array.from({ length: bands }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <div className="h-32 w-full flex items-end">
              <Slider
                orientation="vertical"
                min={min}
                max={max}
                step={step}
                value={[values[index]]}
                onValueChange={([value]) => handleValueChange(index, value)}
                className="h-full"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {frequencyLabels[index] || `${index + 1}`}
            </span>
            <span className="text-xs font-medium">
              {values[index]}dB
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const name = prompt('Enter a name for this preset:');
            if (name) saveCurrentPreset(name);
          }}
        >
          <Save size={16} className="mr-2" />
          Save Preset
        </Button>
      </div>
    </div>
  );
}

// Advanced Equalizer with canvas visualization
interface CanvasEqualizerProps {
  audioElement?: HTMLAudioElement | null;
  barCount?: number;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
  isActive?: boolean;
  className?: string;
}

export function CanvasEqualizer({
  audioElement,
  barCount = 32,
  height = 100,
  width = 200,
  barWidth = 4,
  barGap = 2,
  barColor = '#6200EA', // Explicit hex color instead of CSS variable
  isActive = true,
  className = ''
}: CanvasEqualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioElement || !canvasRef.current || !isActive) return;

    // Initialize audio context
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        
        sourceRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
      }
    };

    // Draw visualization
    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw bars
      const totalWidth = barCount * (barWidth + barGap) - barGap;
      const startX = (canvas.width - totalWidth) / 2;
      
      for (let i = 0; i < barCount; i++) {
        const index = Math.floor(i * bufferLength / barCount);
        const barHeight = (dataArray[index] / 255) * canvas.height;
        
        ctx.fillStyle = barColor;
        ctx.fillRect(
          startX + i * (barWidth + barGap),
          canvas.height - barHeight,
          barWidth,
          barHeight
        );
      }
      
      animationRef.current = requestAnimationFrame(draw);
    };

    try {
      initAudioContext();
      draw();
    } catch (error) {
      console.error("Error initializing audio visualizer:", error);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioElement, isActive, barCount, barWidth, barGap, barColor, height, width]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`${className} ${!isActive ? 'opacity-50' : ''}`}
    />
  );
}
