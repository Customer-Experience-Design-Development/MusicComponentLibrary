import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  Crosshair, 
  Zap,
  Disc3,
  Music,
  Waves,
  Settings
} from 'lucide-react';

interface DJControllerProps {
  className?: string;
}

interface TouchPoint {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  isActive: boolean;
}

interface DeckState {
  isPlaying: boolean;
  position: number; // 0-100
  pitch: number; // -8 to +8
  volume: number; // 0-100
  eq: {
    high: number;
    mid: number;
    low: number;
  };
}

export function MobileDJController({ className = '' }: DJControllerProps) {
  // Deck states
  const [leftDeck, setLeftDeck] = useState<DeckState>({
    isPlaying: false,
    position: 25,
    pitch: 0,
    volume: 75,
    eq: { high: 50, mid: 50, low: 50 }
  });

  const [rightDeck, setRightDeck] = useState<DeckState>({
    isPlaying: true,
    position: 60,
    pitch: 2,
    volume: 80,
    eq: { high: 60, mid: 45, low: 55 }
  });

  // Crossfader and master controls
  const [crossfader, setCrossfader] = useState(50);
  const [masterVolume, setMasterVolume] = useState(85);
  const [cue, setCue] = useState({ left: false, right: false });

  // Touch tracking
  const [touchPoints, setTouchPoints] = useState<TouchPoint[]>([]);
  const [activeGesture, setActiveGesture] = useState<string | null>(null);

  // Refs for touch areas
  const leftJogRef = useRef<HTMLDivElement>(null);
  const rightJogRef = useRef<HTMLDivElement>(null);
  const crossfaderRef = useRef<HTMLDivElement>(null);

  // Touch handling
  const handleTouchStart = useCallback((e: React.TouchEvent, area: string) => {
    e.preventDefault();
    const touches = Array.from(e.touches);
    const newTouchPoints = touches.map((touch, index) => ({
      id: touch.identifier,
      x: touch.clientX,
      y: touch.clientY,
      startX: touch.clientX,
      startY: touch.clientY,
      isActive: true
    }));
    
    setTouchPoints(newTouchPoints);
    setActiveGesture(area);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent, area: string, deckSide?: 'left' | 'right') => {
    e.preventDefault();
    if (activeGesture !== area) return;

    const touches = Array.from(e.touches);
    if (touches.length === 0) return;

    const touch = touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    if (area === 'jog' && deckSide) {
      // Calculate rotation based on touch position
      const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX);
      const normalizedAngle = (angle + Math.PI) / (2 * Math.PI);
      
      // Update deck position or pitch based on gesture
      const updateDeck = deckSide === 'left' ? setLeftDeck : setRightDeck;
      updateDeck(prev => ({
        ...prev,
        position: Math.max(0, Math.min(100, normalizedAngle * 100))
      }));
    } else if (area === 'crossfader') {
      // Update crossfader position
      const relativeX = (touch.clientX - rect.left) / rect.width;
      setCrossfader(Math.max(0, Math.min(100, relativeX * 100)));
    }
  }, [activeGesture]);

  const handleTouchEnd = useCallback(() => {
    setTouchPoints([]);
    setActiveGesture(null);
  }, []);

  // Format time
  const formatTime = (position: number) => {
    const totalSeconds = (position / 100) * 300; // Assume 5 minute tracks
    const mins = Math.floor(totalSeconds / 60);
    const secs = Math.floor(totalSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Deck component
  const Deck = ({ 
    side, 
    state, 
    setState 
  }: { 
    side: 'left' | 'right'; 
    state: DeckState; 
    setState: React.Dispatch<React.SetStateAction<DeckState>> 
  }) => (
    <div className="flex-1 p-4 space-y-4">
      {/* Track info */}
      <div className="text-center text-white/90">
        <h4 className="font-semibold text-sm">
          {side === 'left' ? 'Digital Horizon' : 'Neon Dreams'}
        </h4>
        <p className="text-xs text-white/60">
          {side === 'left' ? 'Cyber Pulse' : 'Synthwave Collective'}
        </p>
      </div>

      {/* Jog wheel */}
      <div className="relative mx-auto w-32 h-32">
        <div
          ref={side === 'left' ? leftJogRef : rightJogRef}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-4 border-white/20 cursor-pointer select-none touch-none"
          onTouchStart={(e) => handleTouchStart(e, 'jog')}
          onTouchMove={(e) => handleTouchMove(e, 'jog', side)}
          onTouchEnd={handleTouchEnd}
        >
          {/* Jog wheel markings */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-4 bg-white/30 origin-bottom"
              style={{
                left: '50%',
                bottom: '50%',
                transform: `translateX(-50%) rotate(${i * 22.5}deg) translateY(-60px)`,
              }}
            />
          ))}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          
          {/* Position indicator */}
          <div
            className="absolute w-1 h-8 bg-red-500 origin-bottom"
            style={{
              left: '50%',
              bottom: '50%',
              transform: `translateX(-50%) rotate(${state.position * 3.6}deg) translateY(-50px)`,
            }}
          />
        </div>

        {/* BPM display */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-xs text-white/60">BPM</div>
          <div className="text-sm font-mono text-cyan-400">
            {(128 + state.pitch * 2).toFixed(1)}
          </div>
        </div>
      </div>

      {/* Transport controls */}
      <div className="flex justify-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-white/80 hover:text-white"
        >
          <RotateCcw size={16} />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className={cn(
            "w-10 h-10 rounded-full",
            state.isPlaying 
              ? "bg-red-500 hover:bg-red-600" 
              : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
        >
          {state.isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 text-white/80 hover:text-white"
        >
          <RotateCw size={16} />
        </Button>
      </div>

      {/* Pitch fader */}
      <div className="space-y-2">
        <div className="text-xs text-white/60 text-center">Pitch</div>
        <div className="h-24 flex justify-center">
          <Slider
            orientation="vertical"
            value={[state.pitch + 8]}
            min={0}
            max={16}
            step={0.1}
            onValueChange={([value]) => setState(prev => ({ ...prev, pitch: value - 8 }))}
            className="h-full"
          />
        </div>
        <div className="text-xs text-center font-mono text-cyan-400">
          {state.pitch > 0 ? '+' : ''}{state.pitch.toFixed(1)}%
        </div>
      </div>

      {/* EQ controls */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {(['high', 'mid', 'low'] as const).map((freq) => (
          <div key={freq} className="space-y-1">
            <div className="text-white/60 text-center capitalize">{freq}</div>
            <div className="h-16 flex justify-center">
              <Slider
                orientation="vertical"
                value={[state.eq[freq]]}
                min={0}
                max={100}
                onValueChange={([value]) => 
                  setState(prev => ({ 
                    ...prev, 
                    eq: { ...prev.eq, [freq]: value } 
                  }))
                }
                className="h-full"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Volume fader */}
      <div className="space-y-2">
        <div className="text-xs text-white/60 text-center">Volume</div>
        <Slider
          value={[state.volume]}
          min={0}
          max={100}
          onValueChange={([value]) => setState(prev => ({ ...prev, volume: value }))}
        />
      </div>

      {/* Cue button */}
      <div className="flex justify-center">
        <Button
          variant={cue[side] ? "default" : "outline"}
          size="sm"
          onClick={() => setCue(prev => ({ ...prev, [side]: !prev[side] }))}
          className={cn(
            "text-xs",
            cue[side] && "bg-orange-500 hover:bg-orange-600"
          )}
        >
          CUE
        </Button>
      </div>
    </div>
  );

  return (
    <div className={cn("relative h-full bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden", className)}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="dj-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dj-grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Mobile DJ Controller</h3>
          <Button variant="ghost" size="icon" className="text-white/80">
            <Settings size={20} />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Deck section */}
        <div className="flex-1 flex">
          <Deck side="left" state={leftDeck} setState={setLeftDeck} />
          <Deck side="right" state={rightDeck} setState={setRightDeck} />
        </div>

        {/* Crossfader section */}
        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="space-y-4">
            {/* Crossfader */}
            <div className="space-y-2">
              <div className="text-xs text-white/60 text-center">Crossfader</div>
              <div
                ref={crossfaderRef}
                className="relative h-8 bg-gray-700 rounded-full cursor-pointer touch-none"
                onTouchStart={(e) => handleTouchStart(e, 'crossfader')}
                onTouchMove={(e) => handleTouchMove(e, 'crossfader')}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="absolute top-1 w-6 h-6 bg-cyan-400 rounded-full shadow-lg transition-all duration-150"
                  style={{ left: `calc(${crossfader}% - 12px)` }}
                />
                
                {/* Channel indicators */}
                <div className="absolute -top-6 left-2 text-xs text-white/60">A</div>
                <div className="absolute -top-6 right-2 text-xs text-white/60">B</div>
              </div>
            </div>

            {/* Master volume */}
            <div className="flex items-center space-x-3">
              <Volume2 size={16} className="text-white/60" />
              <Slider
                value={[masterVolume]}
                min={0}
                max={100}
                onValueChange={([value]) => setMasterVolume(value)}
                className="flex-1"
              />
              <span className="text-xs text-white/60 w-8">{masterVolume}</span>
            </div>

            {/* Quick effects */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Echo
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Reverb
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom status */}
        <div className="p-2 bg-black/40 text-center">
          <div className="text-xs text-white/60">
            Master: {masterVolume}% • Crossfader: {Math.round(crossfader)}% • {activeGesture ? `Controlling: ${activeGesture}` : 'Ready'}
          </div>
        </div>
      </div>
    </div>
  );
} 