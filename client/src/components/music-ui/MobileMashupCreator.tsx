import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Play, Pause, SkipBack, SkipForward, 
  ChevronUp, ChevronDown, Save, Mic, Music, 
  Sliders, Waves, Clock, Share2
} from 'lucide-react';
import { Waveform } from './Waveform';
import { cn } from '@/lib/utils';

interface Stem {
  name: string;
  source: AudioSource;
  volume: number;
  muted: boolean;
  type: 'vocal' | 'instrumental';
  trackId: number;
  color?: string;
}

interface StemPadConfig {
  id: string;
  name: string;
  stems: string[]; // Names of stems to activate/deactivate
  icon?: React.ReactNode;
  color?: string;
}

interface MobileMashupCreatorProps {
  vocalTrack: Track;
  instrumentalTrack: Track;
  vocalStems: Stem[];
  instrumentalStems: Stem[];
  onSave?: (mashupData: any) => void;
  onShare?: (mashupData: any) => void;
  className?: string;
}

export function MobileMashupCreator({
  vocalTrack,
  instrumentalTrack,
  vocalStems,
  instrumentalStems,
  onSave,
  onShare,
  className = ''
}: MobileMashupCreatorProps) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mashupDuration, setMashupDuration] = useState(
    Math.max(vocalTrack.duration || 0, instrumentalTrack.duration || 0)
  );
  const [masterVolume, setMasterVolume] = useState(80);
  
  // Combined stems from both tracks
  const [allStems, setAllStems] = useState<Stem[]>([
    ...vocalStems.map(stem => ({
      ...stem,
      type: 'vocal' as const,
      color: '#7C3AED' // Purple for vocals
    })),
    ...instrumentalStems.map(stem => ({
      ...stem,
      type: 'instrumental' as const,
      color: '#3B82F6' // Blue for instrumentals
    }))
  ]);
  
  // Tempo and alignment
  const [vocalTempo, setVocalTempo] = useState(vocalTrack.metadata?.bpm || 120);
  const [instrumentalTempo, setInstrumentalTempo] = useState(instrumentalTrack.metadata?.bpm || 120);
  const [vocalOffset, setVocalOffset] = useState(0);
  const [instrumentalOffset, setInstrumentalOffset] = useState(0);
  const [autoSync, setAutoSync] = useState(true);
  
  // UI state
  const [expandedSection, setExpandedSection] = useState<'stems' | 'waveform' | 'tempo' | null>(null);
  const [activeStemPad, setActiveStemPad] = useState<string | null>(null);
  
  // Audio processing
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const animationRef = useRef<number>();
  
  // Stem pad configurations
  const stemPads: StemPadConfig[] = [
    {
      id: 'vocal-only',
      name: 'Vocals Only',
      stems: vocalStems.map(s => s.name),
      icon: <Mic size={18} />,
      color: '#7C3AED'
    },
    {
      id: 'instrumental-only',
      name: 'Instrumentals Only',
      stems: instrumentalStems.map(s => s.name),
      icon: <Music size={18} />,
      color: '#3B82F6'
    },
    {
      id: 'mashup',
      name: 'Mashup',
      stems: [...vocalStems.map(s => s.name), ...instrumentalStems.map(s => s.name)],
      icon: <Share2 size={18} />,
      color: '#10B981'
    },
    {
      id: 'no-vocals',
      name: 'No Vocals',
      stems: instrumentalStems.map(s => s.name),
      icon: <Mic size={18} className="line-through" />,
      color: '#F97316'
    },
    {
      id: 'no-drums',
      name: 'No Drums',
      stems: [...vocalStems.map(s => s.name), ...instrumentalStems.filter(s => s.name !== 'Drums').map(s => s.name)],
      icon: <Waves size={18} className="line-through" />,
      color: '#EF4444'
    },
    {
      id: 'percussion-only',
      name: 'Percussion Only',
      stems: instrumentalStems.filter(s => ['Drums', 'Percussion'].includes(s.name)).map(s => s.name),
      icon: <Waves size={18} />,
      color: '#EC4899'
    }
  ];
  
  // Initialize audio elements
  useEffect(() => {
    allStems.forEach(stem => {
      if (!audioRefs.current[stem.name]) {
        const audio = new Audio(stem.source.url);
        audio.preload = 'auto';
        audioRefs.current[stem.name] = audio;
      }
    });
    
    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [allStems]);
  
  // Apply auto-sync if enabled
  useEffect(() => {
    if (autoSync) {
      // For demo purposes, we're just setting the target tempo to the instrumental track
      // Real implementation would use time-stretching and more complex audio processing
      console.log('Auto-syncing tracks', {
        vocalTempo,
        instrumentalTempo,
        targetTempo: instrumentalTempo
      });
    }
  }, [autoSync, vocalTempo, instrumentalTempo]);
  
  // Animation frame for playback progress
  useEffect(() => {
    if (isPlaying) {
      const updatePlayhead = () => {
        // Use instrumental track as the time reference
        const mainStem = Object.values(audioRefs.current).find(
          audio => audio && audio.src.includes(instrumentalStems[0]?.source.url)
        );
        
        if (mainStem) {
          setCurrentTime(mainStem.currentTime - instrumentalOffset);
        }
        
        animationRef.current = requestAnimationFrame(updatePlayhead);
      };
      
      animationRef.current = requestAnimationFrame(updatePlayhead);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [isPlaying, instrumentalOffset, instrumentalStems]);
  
  const playAllStems = () => {
    // Only play active stems (not muted ones)
    const activeStems = allStems.filter(stem => !stem.muted);
    
    // Start vocal stems with their offset
    const vocalPlayPromises = activeStems
      .filter(stem => stem.type === 'vocal')
      .map(stem => {
        const audio = audioRefs.current[stem.name];
        if (audio) {
          audio.currentTime = Math.max(0, currentTime + vocalOffset);
          audio.volume = (masterVolume / 100) * (stem.volume / 100);
          return audio.play().catch(err => console.error("Error playing audio:", err));
        }
        return Promise.resolve();
      });
    
    // Start instrumental stems with their offset
    const instrumentalPlayPromises = activeStems
      .filter(stem => stem.type === 'instrumental')
      .map(stem => {
        const audio = audioRefs.current[stem.name];
        if (audio) {
          audio.currentTime = Math.max(0, currentTime + instrumentalOffset);
          audio.volume = (masterVolume / 100) * (stem.volume / 100);
          return audio.play().catch(err => console.error("Error playing audio:", err));
        }
        return Promise.resolve();
      });
    
    Promise.all([...vocalPlayPromises, ...instrumentalPlayPromises])
      .then(() => setIsPlaying(true))
      .catch(err => console.error("Error playing stems:", err));
  };
  
  const pauseAllStems = () => {
    Object.values(audioRefs.current).forEach(audio => audio.pause());
    setIsPlaying(false);
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAllStems();
    } else {
      playAllStems();
    }
  };
  
  const handleSeek = (position: number) => {
    const newTime = position * mashupDuration;
    setCurrentTime(newTime);
    
    // Update all audio elements
    allStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio) {
        const offset = stem.type === 'vocal' ? vocalOffset : instrumentalOffset;
        audio.currentTime = Math.max(0, newTime + offset);
      }
    });
  };
  
  const handleWaveformClick = (position: number) => {
    handleSeek(position);
  };
  
  const handleStemVolumeChange = (stemName: string, newVolume: number) => {
    setAllStems(stems => 
      stems.map(stem => 
        stem.name === stemName ? { ...stem, volume: newVolume } : stem
      )
    );
    
    const audio = audioRefs.current[stemName];
    if (audio) {
      audio.volume = (masterVolume / 100) * (newVolume / 100);
    }
  };
  
  const toggleStemMute = (stemName: string) => {
    setAllStems(stems => 
      stems.map(stem => 
        stem.name === stemName ? { ...stem, muted: !stem.muted } : stem
      )
    );
    
    const audio = audioRefs.current[stemName];
    if (audio) {
      audio.muted = !audio.muted;
    }
  };
  
  const activateStemPad = (padId: string) => {
    const pad = stemPads.find(p => p.id === padId);
    if (!pad) return;
    
    setActiveStemPad(activeStemPad === padId ? null : padId);
    
    // Mute all stems
    const updatedStems = allStems.map(stem => ({
      ...stem,
      muted: !pad.stems.includes(stem.name)
    }));
    
    // Update stem states
    setAllStems(updatedStems);
    
    // Update audio elements
    updatedStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio) {
        audio.muted = stem.muted;
      }
    });
  };
  
  const handleMasterVolumeChange = (newVolume: number) => {
    setMasterVolume(newVolume);
    
    allStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio && !stem.muted) {
        audio.volume = (newVolume / 100) * (stem.volume / 100);
      }
    });
  };
  
  const saveMashup = () => {
    if (onSave) {
      onSave({
        vocalTrack,
        instrumentalTrack,
        stems: allStems,
        vocalOffset,
        instrumentalOffset,
        duration: mashupDuration
      });
    }
  };
  
  const shareMashup = () => {
    if (onShare) {
      onShare({
        vocalTrack,
        instrumentalTrack,
        stems: allStems,
        vocalOffset,
        instrumentalOffset,
        duration: mashupDuration
      });
    }
  };
  
  const toggleSection = (section: 'stems' | 'waveform' | 'tempo') => {
    setExpandedSection(expandedSection === section ? null : section);
  };
  
  return (
    <div className={cn("mobile-mashup-creator flex flex-col h-full bg-background rounded-lg overflow-hidden", className)}>
      {/* Track Info and Main Controls */}
      <div className="relative p-3 flex justify-between items-center border-b">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            <img 
              src={vocalTrack.albumArt || `https://via.placeholder.com/64x64?text=${vocalTrack.title[0]}`} 
              alt={`${vocalTrack.title} album artwork`} 
              className="w-12 h-12 rounded-md object-cover"
            />
            <img 
              src={instrumentalTrack.albumArt || `https://via.placeholder.com/64x64?text=${instrumentalTrack.title[0]}`} 
              alt={`${instrumentalTrack.title} album artwork`} 
              className="w-8 h-8 rounded-md object-cover absolute -right-2 -bottom-2 border-2 border-background"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold truncate text-sm">
              {vocalTrack.artist} × {instrumentalTrack.artist}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {vocalTrack.title} + {instrumentalTrack.title}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={saveMashup}
          >
            <Save size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={shareMashup}
          >
            <Share2 size={18} />
          </Button>
        </div>
      </div>
      
      {/* Waveform Section (Collapsible) */}
      <div className="border-b">
        <div 
          className="p-3 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('waveform')}
        >
          <span className="text-sm font-medium flex items-center">
            <Waves size={16} className="mr-2" />
            Waveform View
          </span>
          {expandedSection === 'waveform' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSection === 'waveform' && (
          <div className="px-3 pb-3">
            <div className="mb-2">
              <div className="text-xs text-muted-foreground mb-1 flex items-center">
                <Mic size={12} className="mr-1" />
                Vocals
              </div>
              <Waveform
                data={vocalTrack.waveformData ? JSON.parse(vocalTrack.waveformData) : undefined}
                currentTime={currentTime}
                duration={mashupDuration}
                color="#7C3AED"
                progressColor="#7C3AED"
                height={32}
                onClick={handleWaveformClick}
              />
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1 flex items-center">
                <Music size={12} className="mr-1" />
                Instrumental
              </div>
              <Waveform
                data={instrumentalTrack.waveformData ? JSON.parse(instrumentalTrack.waveformData) : undefined}
                currentTime={currentTime}
                duration={mashupDuration}
                color="#3B82F6"
                progressColor="#3B82F6"
                height={32}
                onClick={handleWaveformClick}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Stem Mixer Section (Collapsible) */}
      <div className="border-b">
        <div 
          className="p-3 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('stems')}
        >
          <span className="text-sm font-medium flex items-center">
            <Sliders size={16} className="mr-2" />
            Stem Controls
          </span>
          {expandedSection === 'stems' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSection === 'stems' && (
          <div className="px-3 pb-3 space-y-2">
            {/* Vocal Stems */}
            <div className="text-xs font-medium text-muted-foreground mb-1">Vocal Stems</div>
            {allStems.filter(stem => stem.type === 'vocal').map((stem) => (
              <div key={stem.name} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStemMute(stem.name)}
                  className={cn(
                    "w-4 h-4 rounded-full flex-shrink-0",
                    stem.muted ? "bg-muted" : stem.color
                  )}
                />
                <div className="w-16 truncate text-xs">{stem.name}</div>
                <div className="flex-1">
                  <Slider
                    value={[stem.volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleStemVolumeChange(stem.name, value[0])}
                    disabled={stem.muted}
                  />
                </div>
              </div>
            ))}
            
            {/* Instrumental Stems */}
            <div className="text-xs font-medium text-muted-foreground mb-1 mt-3">Instrumental Stems</div>
            {allStems.filter(stem => stem.type === 'instrumental').map((stem) => (
              <div key={stem.name} className="flex items-center space-x-2">
                <button
                  onClick={() => toggleStemMute(stem.name)}
                  className={cn(
                    "w-4 h-4 rounded-full flex-shrink-0",
                    stem.muted ? "bg-muted" : stem.color
                  )}
                />
                <div className="w-16 truncate text-xs">{stem.name}</div>
                <div className="flex-1">
                  <Slider
                    value={[stem.volume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => handleStemVolumeChange(stem.name, value[0])}
                    disabled={stem.muted}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Tempo & Alignment Section (Collapsible) */}
      <div className="border-b">
        <div 
          className="p-3 flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('tempo')}
        >
          <span className="text-sm font-medium flex items-center">
            <Clock size={16} className="mr-2" />
            Tempo & Alignment
          </span>
          {expandedSection === 'tempo' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
        
        {expandedSection === 'tempo' && (
          <div className="px-3 pb-3 space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={autoSync}
                onCheckedChange={setAutoSync}
                className="data-[state=checked]:bg-green-500"
              />
              <Label className="text-sm">Auto Sync</Label>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Vocal Timing Offset</div>
              <div className="flex items-center space-x-2">
                <div className="w-10 text-center text-xs">
                  {vocalOffset > 0 ? '+' : ''}{vocalOffset.toFixed(2)}s
                </div>
                <Slider
                  value={[vocalOffset]}
                  min={-2}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setVocalOffset(value[0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground">Instrumental Timing Offset</div>
              <div className="flex items-center space-x-2">
                <div className="w-10 text-center text-xs">
                  {instrumentalOffset > 0 ? '+' : ''}{instrumentalOffset.toFixed(2)}s
                </div>
                <Slider
                  value={[instrumentalOffset]}
                  min={-2}
                  max={2}
                  step={0.01}
                  onValueChange={(value) => setInstrumentalOffset(value[0])}
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground pt-1">
              Current BPM: {instrumentalTempo} (Vocal: {vocalTempo})
            </div>
          </div>
        )}
      </div>
      
      {/* Stem Pads Section */}
      <div className="p-3 border-b">
        <div className="grid grid-cols-3 gap-2">
          {stemPads.map(pad => (
            <button
              key={pad.id}
              className={cn(
                "flex flex-col items-center justify-center rounded-md p-2 transition-colors text-xs",
                activeStemPad === pad.id 
                  ? `bg-${pad.color} text-white` 
                  : "bg-muted/50 hover:bg-muted"
              )}
              style={{
                backgroundColor: activeStemPad === pad.id ? pad.color : undefined
              }}
              onClick={() => activateStemPad(pad.id)}
            >
              <div className="mb-1">{pad.icon}</div>
              <span className="truncate max-w-full">{pad.name}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Playback Controls */}
      <div className="p-3 flex flex-col">
        <div className="flex justify-between items-center mb-2 text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(mashupDuration)}</span>
        </div>
        
        {/* Seek bar */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            min={0}
            max={mashupDuration}
            step={0.1}
            onValueChange={(value) => handleSeek(value[0] / mashupDuration)}
          />
        </div>
        
        {/* Player controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => handleSeek(0)}
            >
              <SkipBack size={18} />
            </Button>
          </div>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </Button>
          
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => handleSeek(1)}
            >
              <SkipForward size={18} />
            </Button>
          </div>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center space-x-3 mt-3">
          <Label className="text-xs">Volume</Label>
          <Slider
            value={[masterVolume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => handleMasterVolumeChange(value[0])}
          />
        </div>
      </div>
    </div>
  );
} 