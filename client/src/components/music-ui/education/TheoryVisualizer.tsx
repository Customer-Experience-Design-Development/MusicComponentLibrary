import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Play, PauseCircle, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Music theory data
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALES = {
  'major': [0, 2, 4, 5, 7, 9, 11],
  'minor': [0, 2, 3, 5, 7, 8, 10],
  'pentatonic': [0, 2, 4, 7, 9],
  'blues': [0, 3, 5, 6, 7, 10],
  'dorian': [0, 2, 3, 5, 7, 9, 10],
  'mixolydian': [0, 2, 4, 5, 7, 9, 10],
};

const CHORDS = {
  'major': [0, 4, 7],
  'minor': [0, 3, 7],
  'diminished': [0, 3, 6],
  'augmented': [0, 4, 8],
  'sus2': [0, 2, 7],
  'sus4': [0, 5, 7],
  '7': [0, 4, 7, 10],
  'maj7': [0, 4, 7, 11],
  'min7': [0, 3, 7, 10],
  'dim7': [0, 3, 6, 9],
  '9': [0, 4, 7, 10, 14],
};

interface TheoryVisualizerProps {
  onPlayNote?: (noteFreq: number) => void;
  className?: string;
}

export function TheoryVisualizer({
  onPlayNote,
  className = ''
}: TheoryVisualizerProps) {
  const [rootNote, setRootNote] = useState('C');
  const [visualizerType, setVisualizerType] = useState('keyboard');
  const [scaleType, setScaleType] = useState('major');
  const [chordType, setChordType] = useState('major');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate the notes in the current scale or chord
  const calculateNotes = () => {
    const rootIndex = NOTES.indexOf(rootNote);
    let intervals: number[] = [];
    
    if (visualizerType === 'scale') {
      intervals = SCALES[scaleType as keyof typeof SCALES] || SCALES.major;
    } else if (visualizerType === 'chord') {
      intervals = CHORDS[chordType as keyof typeof CHORDS] || CHORDS.major;
    }
    
    return intervals.map(interval => {
      const noteIndex = (rootIndex + interval) % 12;
      return NOTES[noteIndex];
    });
  };
  
  const activeNotes = calculateNotes();
  
  // Play the sound of a note
  const playNote = (note: string) => {
    if (!onPlayNote) {
      // If no external handler, create our own audio
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Stop any currently playing note
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      
      // Calculate frequency (A4 = 440Hz)
      const a4Index = NOTES.indexOf('A');
      const noteIndex = NOTES.indexOf(note);
      const octave = 4; // Middle octave
      const semitonesFromA4 = (noteIndex - a4Index) + (octave - 4) * 12;
      const frequency = 440 * Math.pow(2, semitonesFromA4 / 12);
      
      // Create oscillator
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.2; // Lower volume
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      
      oscillator.start();
      oscillatorRef.current = oscillator;
      
      // Stop after 1 second
      setTimeout(() => {
        if (oscillatorRef.current === oscillator) {
          oscillator.stop();
          oscillator.disconnect();
          oscillatorRef.current = null;
        }
      }, 1000);
    } else {
      // If external handler provided, use it
      const a4Index = NOTES.indexOf('A');
      const noteIndex = NOTES.indexOf(note);
      const octave = 4; // Middle octave
      const semitonesFromA4 = (noteIndex - a4Index) + (octave - 4) * 12;
      const frequency = 440 * Math.pow(2, semitonesFromA4 / 12);
      
      onPlayNote(frequency);
    }
  };
  
  // Play all notes in the scale/chord in sequence
  const playSequence = () => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    const notes = calculateNotes();
    let index = 0;
    
    const playNextNote = () => {
      if (!isPlaying || index >= notes.length) {
        setIsPlaying(false);
        return;
      }
      
      playNote(notes[index]);
      index++;
      
      setTimeout(playNextNote, 500);
    };
    
    playNextNote();
  };
  
  // Draw keyboard visualization
  useEffect(() => {
    if (!canvasRef.current || visualizerType !== 'keyboard') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw piano keys
    const whiteKeyWidth = width / 7; // 7 white keys per octave
    const blackKeyWidth = whiteKeyWidth * 0.6;
    const blackKeyHeight = height * 0.6;
    
    // White keys positions (C, D, E, F, G, A, B)
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    
    // Black keys positions (C#, D#, F#, G#, A#)
    const blackKeys = [1, 3, 6, 8, 10];
    
    // Draw white keys
    for (let i = 0; i < 7; i++) {
      const x = i * whiteKeyWidth;
      const noteIndex = whiteKeys[i];
      const note = NOTES[noteIndex];
      const isActive = activeNotes.includes(note);
      
      ctx.fillStyle = isActive ? '#4f46e5' : '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      
      ctx.fillRect(x, 0, whiteKeyWidth, height);
      ctx.strokeRect(x, 0, whiteKeyWidth, height);
      
      // Draw note name
      ctx.fillStyle = isActive ? '#ffffff' : '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(note, x + whiteKeyWidth / 2, height - 20);
    }
    
    // Draw black keys
    for (let i = 0; i < 5; i++) {
      const noteIndex = blackKeys[i];
      const note = NOTES[noteIndex];
      const isActive = activeNotes.includes(note);
      
      // Position black keys between white keys
      let x;
      if (i < 2) {
        x = (i + 1) * whiteKeyWidth - blackKeyWidth / 2;
      } else {
        x = (i + 1.5) * whiteKeyWidth - blackKeyWidth / 2;
      }
      
      ctx.fillStyle = isActive ? '#4f46e5' : '#000000';
      ctx.fillRect(x, 0, blackKeyWidth, blackKeyHeight);
      
      // Draw note name
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(note, x + blackKeyWidth / 2, blackKeyHeight - 15);
    }
  }, [visualizerType, activeNotes]);
  
  // Draw circle of fifths visualization
  useEffect(() => {
    if (!canvasRef.current || visualizerType !== 'circle') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const radius = Math.min(width, height) / 2 - 30;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Notes in circle of fifths order
    const circleNotes = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'G#', 'D#', 'A#', 'F'];
    
    // Draw outer circle
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw note positions
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      const note = circleNotes[i];
      const isActive = activeNotes.includes(note);
      
      // Draw circle for note
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fillStyle = isActive ? '#4f46e5' : '#f3f4f6';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      
      // Draw note name
      ctx.fillStyle = isActive ? '#ffffff' : '#000000';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(note, x, y);
    }
    
    // Draw minor keys in inner circle
    const minorNotes = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'D#m', 'A#m', 'Fm', 'Cm', 'Gm', 'Dm'];
    
    for (let i = 0; i < 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = centerX + Math.cos(angle) * radius * 0.7;
      const y = centerY + Math.sin(angle) * radius * 0.7;
      
      // Draw circle for minor note
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#f3f4f6';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      
      // Draw note name
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(minorNotes[i], x, y);
    }
    
    // Draw title
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Circle of Fifths', centerX, 10);
    
  }, [visualizerType, activeNotes]);
  
  // Draw fretboard visualization
  useEffect(() => {
    if (!canvasRef.current || visualizerType !== 'fretboard') return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    ctx.scale(dpr, dpr);
    
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Fretboard settings
    const numStrings = 6;
    const numFrets = 12;
    const fretboardWidth = width - 40;
    const fretboardHeight = height - 40;
    const startX = 30;
    const startY = 20;
    const stringSpacing = fretboardHeight / (numStrings - 1);
    const fretSpacing = fretboardWidth / numFrets;
    
    // Guitar string tunings (standard) - E, A, D, G, B, E
    const stringTunings = [4, 9, 2, 7, 11, 4]; // Note indices
    
    // Draw fretboard
    ctx.fillStyle = '#d4a373'; // Wood color
    ctx.fillRect(startX, startY, fretboardWidth, fretboardHeight);
    
    // Draw frets
    ctx.strokeStyle = '#999999';
    ctx.lineWidth = 3;
    for (let i = 0; i <= numFrets; i++) {
      const x = startX + i * fretSpacing;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + fretboardHeight);
      ctx.stroke();
    }
    
    // Draw strings
    ctx.lineWidth = 1;
    for (let i = 0; i < numStrings; i++) {
      const y = startY + i * stringSpacing;
      ctx.strokeStyle = i < 3 ? '#999999' : '#dddddd'; // Thicker strings are darker
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + fretboardWidth, y);
      ctx.stroke();
    }
    
    // Draw fret markers
    const markerPositions = [3, 5, 7, 9, 12];
    ctx.fillStyle = '#ffffff';
    for (let fret of markerPositions) {
      if (fret === 12) {
        // Double marker at 12th fret
        ctx.beginPath();
        ctx.arc(startX + (fret - 0.5) * fretSpacing, startY + stringSpacing * 1.5, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(startX + (fret - 0.5) * fretSpacing, startY + stringSpacing * 3.5, 5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Single marker
        ctx.beginPath();
        ctx.arc(startX + (fret - 0.5) * fretSpacing, startY + fretboardHeight / 2, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // Draw notes
    for (let string = 0; string < numStrings; string++) {
      const rootNoteIndex = NOTES.indexOf(rootNote);
      const stringTuning = stringTunings[string];
      
      for (let fret = 0; fret <= numFrets; fret++) {
        const noteIndex = (stringTuning + fret) % 12;
        const note = NOTES[noteIndex];
        const isActive = activeNotes.includes(note);
        
        if (isActive) {
          const x = startX + (fret === 0 ? 15 : fret * fretSpacing - fretSpacing / 2);
          const y = startY + string * stringSpacing;
          
          // Draw note marker
          ctx.beginPath();
          ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = note === rootNote ? '#ef4444' : '#4f46e5';
          ctx.fill();
          
          // Draw note name
          ctx.fillStyle = '#ffffff';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note, x, y);
        }
      }
    }
    
    // Draw string names
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    const stringNames = ['E', 'A', 'D', 'G', 'B', 'e'];
    for (let i = 0; i < numStrings; i++) {
      const y = startY + i * stringSpacing;
      ctx.fillText(stringNames[i], startX - 10, y);
    }
    
    // Draw fret numbers
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    for (let i = 0; i <= numFrets; i++) {
      const x = startX + i * fretSpacing;
      if (i > 0) {
        ctx.fillText(i.toString(), x - fretSpacing / 2, startY - 5);
      }
    }
    
  }, [visualizerType, activeNotes, rootNote]);
  
  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Music Theory Visualizer</CardTitle>
            <CardDescription>Interactive music theory learning tool</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPlaying ? "destructive" : "default"}
              size="sm"
              onClick={playSequence}
            >
              {isPlaying ? <PauseCircle className="mr-1 h-4 w-4" /> : <Play className="mr-1 h-4 w-4" />}
              {isPlaying ? "Stop" : "Play"}
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click on elements to play their sounds.</p>
                  <p>Use the controls to change visualization type and music properties.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <Select value={rootNote} onValueChange={setRootNote}>
            <SelectTrigger className="w-full sm:w-24">
              <SelectValue placeholder="Root Note" />
            </SelectTrigger>
            <SelectContent>
              {NOTES.map(note => (
                <SelectItem key={note} value={note}>{note}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Tabs value={visualizerType} onValueChange={setVisualizerType} className="flex-1">
            <TabsList className="w-full">
              <TabsTrigger value="keyboard" className="flex-1">Keyboard</TabsTrigger>
              <TabsTrigger value="circle" className="flex-1">Circle of Fifths</TabsTrigger>
              <TabsTrigger value="fretboard" className="flex-1">Guitar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Select 
            value={visualizerType === 'scale' ? scaleType : chordType} 
            onValueChange={visualizerType === 'scale' ? setScaleType : setChordType}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={visualizerType === 'scale' ? "Scale Type" : "Chord Type"} />
            </SelectTrigger>
            <SelectContent>
              {visualizerType === 'scale' ? (
                Object.keys(SCALES).map(scale => (
                  <SelectItem key={scale} value={scale}>
                    {scale.charAt(0).toUpperCase() + scale.slice(1)}
                  </SelectItem>
                ))
              ) : (
                Object.keys(CHORDS).map(chord => (
                  <SelectItem key={chord} value={chord}>
                    {rootNote} {chord}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          <Tabs value={visualizerType === 'scale' ? 'scale' : 'chord'} onValueChange={setVisualizerType} className="flex-1">
            <TabsList className="w-full">
              <TabsTrigger value="scale" className="flex-1">Scale</TabsTrigger>
              <TabsTrigger value="chord" className="flex-1">Chord</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="relative aspect-video bg-white rounded-md overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full"
            onClick={e => {
              // Handle click events for interactive elements
              // This would require more complex hit detection based on visualization type
            }}
          />
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-1">
            {visualizerType === 'scale' 
              ? `${rootNote} ${scaleType.charAt(0).toUpperCase() + scaleType.slice(1)} Scale` 
              : `${rootNote} ${chordType} Chord`}
          </h4>
          <div className="flex flex-wrap gap-1">
            {activeNotes.map((note, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={note === rootNote ? "border-primary" : ""}
                onClick={() => playNote(note)}
              >
                {note}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}