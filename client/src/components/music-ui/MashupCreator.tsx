import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VolumeControl, StemVolumeControl } from './VolumeControl';
import { Waveform } from './Waveform';
import { Play, Pause, SkipBack, Clock, Sliders, Music, Mic, ZoomIn, ZoomOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Stem {
  name: string;
  source: AudioSource;
  volume: number;
  muted: boolean;
  type: 'vocal' | 'instrumental';
  trackId: number; // Reference to parent track
}

interface TrackSection {
  startTime: number;
  endTime: number;
  label: string;
}

interface MashupCreatorProps {
  vocalTrack: Track;
  instrumentalTrack: Track;
  vocalStems: Stem[];
  instrumentalStems: Stem[];
  onSave?: (mashupData: any) => void;
  className?: string;
}

export function MashupCreator({
  vocalTrack,
  instrumentalTrack,
  vocalStems,
  instrumentalStems,
  onSave,
  className = ''
}: MashupCreatorProps) {
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [mashupDuration, setMashupDuration] = useState(
    Math.max(vocalTrack.duration || 0, instrumentalTrack.duration || 0)
  );
  const [masterVolume, setMasterVolume] = useState(70);
  
  // Combined stems from both tracks
  const [allStems, setAllStems] = useState<Stem[]>([
    ...vocalStems.map(stem => ({ ...stem, type: 'vocal' as const })),
    ...instrumentalStems.map(stem => ({ ...stem, type: 'instrumental' as const }))
  ]);
  
  // Tempo adjustment
  const [vocalTempo, setVocalTempo] = useState(vocalTrack.metadata?.bpm || 120);
  const [instrumentalTempo, setInstrumentalTempo] = useState(instrumentalTrack.metadata?.bpm || 120);
  const [targetTempo, setTargetTempo] = useState(instrumentalTempo);
  const [tempoLocked, setTempoLocked] = useState(true);
  
  // Time alignment
  const [vocalOffset, setVocalOffset] = useState(0); // seconds
  const [instrumentalOffset, setInstrumentalOffset] = useState(0); // seconds
  const [beatSnapEnabled, setBeatSnapEnabled] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Sections/markers for easy navigation
  const [sections, setSections] = useState<TrackSection[]>([]);
  const [currentSection, setCurrentSection] = useState<TrackSection | null>(null);
  
  // Audio processing
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodesRef = useRef<{ [key: string]: MediaElementAudioSourceNode }>({});
  const tempoNodesRef = useRef<{ [key: string]: any }>({});
  const animationRef = useRef<number>();
  
  // Initialize Web Audio API context and nodes
  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const audioContext = audioContextRef.current;
    
    // Initialize audio elements and nodes for each stem
    allStems.forEach(stem => {
      if (!audioRefs.current[stem.name]) {
        // Create audio element
        const audio = new Audio(stem.source.url);
        audio.preload = 'auto';
        audioRefs.current[stem.name] = audio;
        
        // Connect to Web Audio API for processing
        const source = audioContext.createMediaElementSource(audio);
        sourceNodesRef.current[stem.name] = source;
        
        // For now, connect directly to destination (we'll add tempo processing later)
        source.connect(audioContext.destination);
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
  
  // Update tempo adjustment when target tempo changes
  useEffect(() => {
    if (tempoLocked) {
      // Apply tempo adjustments to audio nodes
      // This would require a tempo-shifting library or implementation
      // Placeholder for actual tempo-stretching implementation
      console.log('Applying tempo adjustment:', {
        vocalTempo,
        instrumentalTempo,
        targetTempo
      });
    }
  }, [vocalTempo, instrumentalTempo, targetTempo, tempoLocked]);
  
  // Handle time offset changes
  useEffect(() => {
    // Apply timing offsets to the stems
    allStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio) {
        const offset = stem.type === 'vocal' ? vocalOffset : instrumentalOffset;
        // This is a simplified approach - actual implementation would be more complex
        // as it needs to maintain sync during playback
        if (!isPlaying) {
          audio.currentTime = Math.max(0, currentTime + offset);
        }
      }
    });
  }, [vocalOffset, instrumentalOffset, currentTime, isPlaying]);
  
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
    // Resume audio context if it was suspended
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Start vocal stems with their offset
    const vocalPlayPromises = allStems
      .filter(stem => stem.type === 'vocal')
      .map(stem => {
        const audio = audioRefs.current[stem.name];
        if (audio) {
          audio.currentTime = Math.max(0, currentTime + vocalOffset);
          return audio.play().catch(err => console.error("Error playing audio:", err));
        }
        return Promise.resolve();
      });
    
    // Start instrumental stems with their offset
    const instrumentalPlayPromises = allStems
      .filter(stem => stem.type === 'instrumental')
      .map(stem => {
        const audio = audioRefs.current[stem.name];
        if (audio) {
          audio.currentTime = Math.max(0, currentTime + instrumentalOffset);
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
  
  const handleWaveformClick = (position: number) => {
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
  
  const handleMasterVolumeChange = (newVolume: number) => {
    setMasterVolume(newVolume);
    
    allStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio) {
        audio.volume = (newVolume / 100) * (stem.volume / 100);
      }
    });
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
  
  const handleTempoChange = (type: 'vocal' | 'instrumental' | 'target', value: number) => {
    switch (type) {
      case 'vocal':
        setVocalTempo(value);
        if (tempoLocked) setTargetTempo(value);
        break;
      case 'instrumental':
        setInstrumentalTempo(value);
        if (tempoLocked) setTargetTempo(value);
        break;
      case 'target':
        setTargetTempo(value);
        break;
    }
  };
  
  const addSection = () => {
    const newSection: TrackSection = {
      startTime: currentTime,
      endTime: currentTime + 30, // Default 30 second section
      label: `Section ${sections.length + 1}`
    };
    
    setSections([...sections, newSection]);
    setCurrentSection(newSection);
  };
  
  const jumpToSection = (section: TrackSection) => {
    setCurrentTime(section.startTime);
    setCurrentSection(section);
    
    // Update all audio elements
    allStems.forEach(stem => {
      const audio = audioRefs.current[stem.name];
      if (audio) {
        const offset = stem.type === 'vocal' ? vocalOffset : instrumentalOffset;
        audio.currentTime = Math.max(0, section.startTime + offset);
      }
    });
  };
  
  const saveMashup = () => {
    if (onSave) {
      onSave({
        vocalTrack,
        instrumentalTrack,
        stems: allStems,
        tempo: targetTempo,
        vocalOffset,
        instrumentalOffset,
        sections,
        duration: mashupDuration
      });
    }
  };
  
  return (
    <div className={`${className}`}>
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timing">Timing & Tempo</TabsTrigger>
          <TabsTrigger value="stems">Stems</TabsTrigger>
          <TabsTrigger value="sections">Sections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 relative">
                <img 
                  src={vocalTrack.albumArt || `https://via.placeholder.com/64x64?text=${vocalTrack.title[0]}`} 
                  alt={`${vocalTrack.title} album artwork`} 
                  className="w-16 h-16 rounded-md object-cover"
                />
                <img 
                  src={instrumentalTrack.albumArt || `https://via.placeholder.com/64x64?text=${instrumentalTrack.title[0]}`} 
                  alt={`${instrumentalTrack.title} album artwork`} 
                  className="w-16 h-16 rounded-md object-cover absolute -right-4 -bottom-4 border-2 border-background"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-foreground truncate">
                  {vocalTrack.artist} × {instrumentalTrack.artist}
                </h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                  {vocalTrack.title} vocals + {instrumentalTrack.title} instrumentals
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setCurrentTime(0)}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                variant="default" 
                size="icon" 
                className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90" 
                onClick={togglePlayPause}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
              </Button>
              <Button
                variant="outline"
                onClick={saveMashup}
              >
                Save Mashup
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-2 absolute right-0 -top-6">
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}>
                <ZoomOut className="h-3 w-3 mr-1" />
                <span className="text-xs">Zoom Out</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-6 px-2" onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}>
                <ZoomIn className="h-3 w-3 mr-1" />
                <span className="text-xs">Zoom In</span>
              </Button>
            </div>
            
            <div className="mb-3">
              <div className="flex space-x-1 mb-1">
                <div className="flex-grow">
                  <Label className="text-xs flex items-center">
                    <Mic className="h-3 w-3 mr-1" />
                    Vocals ({vocalTrack.artist})
                  </Label>
                  <Waveform
                    data={vocalTrack.waveformData ? JSON.parse(vocalTrack.waveformData) : undefined}
                    currentTime={currentTime}
                    duration={mashupDuration}
                    color="#7C3AED"
                    progressColor="#7C3AED"
                    height={40 * zoomLevel}
                    onClick={handleWaveformClick}
                  />
                </div>
              </div>
              
              <div className="flex space-x-1">
                <div className="flex-grow">
                  <Label className="text-xs flex items-center">
                    <Music className="h-3 w-3 mr-1" />
                    Instrumentals ({instrumentalTrack.artist})
                  </Label>
                  <Waveform
                    data={instrumentalTrack.waveformData ? JSON.parse(instrumentalTrack.waveformData) : undefined}
                    currentTime={currentTime}
                    duration={mashupDuration}
                    color="#2563EB"
                    progressColor="#2563EB"
                    height={40 * zoomLevel}
                    onClick={handleWaveformClick}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <div className="w-32">
              <VolumeControl 
                initialVolume={masterVolume} 
                onChange={handleMasterVolumeChange}
              />
            </div>
            <span>{formatTime(mashupDuration)}</span>
          </div>
        </TabsContent>
        
        <TabsContent value="timing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Tempo Matching
              </CardTitle>
              <CardDescription>
                Adjust tempos to match both tracks together
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="mb-2 block">Vocal Track BPM</Label>
                  <div className="flex space-x-2 items-center">
                    <Input 
                      type="number" 
                      value={vocalTempo.toString()} 
                      onChange={(e) => handleTempoChange('vocal', parseInt(e.target.value) || vocalTempo)}
                      className="w-20"
                    />
                    <div className="flex-1">
                      <Slider
                        value={[vocalTempo]}
                        min={60}
                        max={200}
                        step={1}
                        onValueChange={(value) => handleTempoChange('vocal', value[0])}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Instrumental Track BPM</Label>
                  <div className="flex space-x-2 items-center">
                    <Input 
                      type="number" 
                      value={instrumentalTempo.toString()} 
                      onChange={(e) => handleTempoChange('instrumental', parseInt(e.target.value) || instrumentalTempo)}
                      className="w-20"
                    />
                    <div className="flex-1">
                      <Slider
                        value={[instrumentalTempo]}
                        min={60}
                        max={200}
                        step={1}
                        onValueChange={(value) => handleTempoChange('instrumental', value[0])}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Target BPM</Label>
                  <div className="flex space-x-2 items-center">
                    <Input 
                      type="number" 
                      value={targetTempo.toString()} 
                      onChange={(e) => handleTempoChange('target', parseInt(e.target.value) || targetTempo)}
                      className="w-20"
                      disabled={tempoLocked}
                    />
                    <div className="flex-1">
                      <Slider
                        value={[targetTempo]}
                        min={60}
                        max={200}
                        step={1}
                        onValueChange={(value) => handleTempoChange('target', value[0])}
                        disabled={tempoLocked}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={tempoLocked}
                  onCheckedChange={setTempoLocked}
                />
                <Label>Lock target BPM to track BPM</Label>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Sliders className="h-4 w-4 mr-2" />
                Time Alignment
              </CardTitle>
              <CardDescription>
                Adjust timing offsets to align beats between tracks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2 block">Vocal Offset (seconds)</Label>
                  <div className="flex space-x-2 items-center">
                    <Input 
                      type="number" 
                      step="0.01"
                      value={vocalOffset.toFixed(2)} 
                      onChange={(e) => setVocalOffset(parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                    <div className="flex-1">
                      <Slider
                        value={[vocalOffset]}
                        min={-5}
                        max={5}
                        step={0.01}
                        onValueChange={(value) => setVocalOffset(value[0])}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="mb-2 block">Instrumental Offset (seconds)</Label>
                  <div className="flex space-x-2 items-center">
                    <Input 
                      type="number" 
                      step="0.01"
                      value={instrumentalOffset.toFixed(2)} 
                      onChange={(e) => setInstrumentalOffset(parseFloat(e.target.value) || 0)}
                      className="w-20"
                    />
                    <div className="flex-1">
                      <Slider
                        value={[instrumentalOffset]}
                        min={-5}
                        max={5}
                        step={0.01}
                        onValueChange={(value) => setInstrumentalOffset(value[0])}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={beatSnapEnabled}
                  onCheckedChange={setBeatSnapEnabled}
                />
                <Label>Enable beat snapping</Label>
                <div className="flex-1"></div>
                <Select value="1/4" onValueChange={() => {}}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Beat Division" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1/1">1/1</SelectItem>
                    <SelectItem value="1/2">1/2</SelectItem>
                    <SelectItem value="1/4">1/4</SelectItem>
                    <SelectItem value="1/8">1/8</SelectItem>
                    <SelectItem value="1/16">1/16</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stems" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Vocal Stems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allStems.filter(stem => stem.type === 'vocal').map((stem) => (
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Music className="h-4 w-4 mr-2" />
                  Instrumental Stems
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allStems.filter(stem => stem.type === 'instrumental').map((stem) => (
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mashup Sections</CardTitle>
              <CardDescription>
                Create sections to navigate through your mashup easily
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={addSection} className="mb-4">
                Add Section at Current Position
              </Button>
              
              <div className="space-y-2">
                {sections.map((section, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 border rounded hover:bg-accent">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => jumpToSection(section)}
                      className="flex-grow justify-start"
                    >
                      {section.label} ({formatTime(section.startTime)} - {formatTime(section.endTime)})
                    </Button>
                  </div>
                ))}
                
                {sections.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sections created yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 