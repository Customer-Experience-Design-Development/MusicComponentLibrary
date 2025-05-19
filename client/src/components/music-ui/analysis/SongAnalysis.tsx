import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Info, Download, Share2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SongAnalysisProps {
  song: {
    title: string;
    artist: string;
    duration: number;
    bpm: number;
    key: string;
    sections: {
      name: string;
      startTime: number;
      endTime: number;
    }[];
    chords: {
      time: number;
      chord: string;
    }[];
    melody: {
      time: number;
      note: string;
      duration: number;
    }[];
  };
  className?: string;
}

interface SongMetrics {
  structure: {
    sectionCount: number;
    averageSectionLength: number;
    sectionDistribution: {
      [section: string]: number;
    };
  };
  harmony: {
    chordComplexity: number;
    keyConsistency: number;
    chordProgression: {
      [progression: string]: number;
    };
  };
  melody: {
    range: number;
    complexity: number;
    noteDistribution: {
      [note: string]: number;
    };
  };
  rhythm: {
    syncopation: number;
    groove: number;
    accentPattern: {
      [pattern: string]: number;
    };
  };
}

// Common song sections
const SECTIONS = [
  'intro', 'verse', 'chorus', 'bridge', 'outro',
  'pre-chorus', 'post-chorus', 'interlude', 'solo'
];

// Common chord progressions
const CHORD_PROGRESSIONS = [
  'I-IV-V', 'I-V-vi-IV', 'vi-IV-I-V',
  'I-vi-IV-V', 'ii-V-I', 'I-V-vi-iii'
];

export function SongAnalysis({
  song,
  className = ''
}: SongAnalysisProps) {
  const [metrics, setMetrics] = useState<SongMetrics>(() => analyzeSong(song));

  function analyzeSong(song: SongAnalysisProps['song']): SongMetrics {
    // Analyze structure
    const sectionCount = song.sections.length;
    const sectionLengths = song.sections.map(section => section.endTime - section.startTime);
    const averageSectionLength = sectionLengths.reduce((sum, length) => sum + length, 0) / sectionCount;
    
    const sectionDistribution: { [section: string]: number } = {};
    song.sections.forEach(section => {
      sectionDistribution[section.name] = (sectionDistribution[section.name] || 0) + 1;
    });
    
    // Analyze harmony
    const chordComplexity = calculateChordComplexity(song.chords);
    const keyConsistency = calculateKeyConsistency(song.chords, song.key);
    
    const chordProgression: { [progression: string]: number } = {};
    for (let i = 0; i < song.chords.length - 2; i++) {
      const progression = `${song.chords[i].chord}-${song.chords[i + 1].chord}-${song.chords[i + 2].chord}`;
      chordProgression[progression] = (chordProgression[progression] || 0) + 1;
    }
    
    // Analyze melody
    const melodyNotes = song.melody.map(m => m.note);
    const noteRange = calculateNoteRange(melodyNotes);
    const melodyComplexity = calculateMelodyComplexity(song.melody);
    
    const noteDistribution: { [note: string]: number } = {};
    melodyNotes.forEach(note => {
      noteDistribution[note] = (noteDistribution[note] || 0) + 1;
    });
    
    // Analyze rhythm
    const syncopation = calculateSyncopation(song.melody);
    const groove = calculateGroove(song.melody);
    
    const accentPattern: { [pattern: string]: number } = {};
    for (let i = 0; i < song.melody.length - 3; i++) {
      const pattern = song.melody.slice(i, i + 4).map(m => m.duration).join('-');
      accentPattern[pattern] = (accentPattern[pattern] || 0) + 1;
    }
    
    return {
      structure: {
        sectionCount,
        averageSectionLength,
        sectionDistribution
      },
      harmony: {
        chordComplexity,
        keyConsistency,
        chordProgression
      },
      melody: {
        range: noteRange,
        complexity: melodyComplexity,
        noteDistribution
      },
      rhythm: {
        syncopation,
        groove,
        accentPattern
      }
    };
  }

  function calculateChordComplexity(chords: { chord: string }[]): number {
    // Simplified complexity calculation based on chord types
    const complexityMap: { [chord: string]: number } = {
      'maj': 1, 'min': 1, '7': 2, 'maj7': 2,
      'min7': 2, 'dim': 2, 'aug': 2, 'sus4': 2,
      '9': 3, 'maj9': 3, 'min9': 3, '13': 4
    };
    
    return chords.reduce((sum, { chord }) => {
      const type = chord.replace(/[A-G]#?b?/, '');
      return sum + (complexityMap[type] || 1);
    }, 0) / chords.length;
  }

  function calculateKeyConsistency(chords: { chord: string }[], key: string): number {
    // Simplified key consistency calculation
    const keyChords = new Set(['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°']);
    const inKeyCount = chords.filter(({ chord }) => keyChords.has(chord)).length;
    return (inKeyCount / chords.length) * 100;
  }

  function calculateNoteRange(notes: string[]): number {
    const noteValues = notes.map(note => {
      const noteMap: { [note: string]: number } = {
        'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4,
        'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9,
        'A#': 10, 'B': 11
      };
      return noteMap[note.replace(/[0-9]/g, '')] || 0;
    });
    
    return Math.max(...noteValues) - Math.min(...noteValues);
  }

  function calculateMelodyComplexity(melody: { note: string; duration: number }[]): number {
    // Simplified complexity calculation based on note changes and durations
    let complexity = 0;
    for (let i = 1; i < melody.length; i++) {
      if (melody[i].note !== melody[i - 1].note) complexity++;
      if (melody[i].duration !== melody[i - 1].duration) complexity++;
    }
    return (complexity / melody.length) * 100;
  }

  function calculateSyncopation(melody: { duration: number }[]): number {
    // Simplified syncopation calculation
    let syncopation = 0;
    for (let i = 1; i < melody.length; i++) {
      if (melody[i].duration !== melody[i - 1].duration) {
        syncopation++;
      }
    }
    return (syncopation / melody.length) * 100;
  }

  function calculateGroove(melody: { duration: number }[]): number {
    // Simplified groove calculation based on rhythmic patterns
    const commonDurations = new Set([0.25, 0.5, 1, 2]); // Quarter, half, whole notes
    const grooveScore = melody.reduce((sum, { duration }) => {
      return sum + (commonDurations.has(duration) ? 1 : 0.5);
    }, 0);
    return (grooveScore / melody.length) * 100;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Song Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comprehensive analysis of song structure, harmony, melody, and rhythm.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="structure">
          <TabsList className="mb-4">
            <TabsTrigger value="structure">Structure</TabsTrigger>
            <TabsTrigger value="harmony">Harmony</TabsTrigger>
            <TabsTrigger value="melody">Melody</TabsTrigger>
            <TabsTrigger value="rhythm">Rhythm</TabsTrigger>
          </TabsList>
          
          <TabsContent value="structure">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Section Count</h4>
                  <Progress value={metrics.structure.sectionCount / 10 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.structure.sectionCount} sections</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Average Section Length</h4>
                  <Progress value={metrics.structure.averageSectionLength / 60 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.structure.averageSectionLength.toFixed(1)} seconds</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Section Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.structure.sectionDistribution)
                    .sort(([_, a], [__, b]) => b - a)
                    .map(([section, count]) => (
                      <div key={section}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{section}</span>
                          <span>{count} occurrences</span>
                        </div>
                        <Progress value={count / Math.max(...Object.values(metrics.structure.sectionDistribution)) * 100} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="harmony">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Chord Complexity</h4>
                  <Progress value={metrics.harmony.chordComplexity * 25} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.harmony.chordComplexity.toFixed(1)} / 4</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Consistency</h4>
                  <Progress value={metrics.harmony.keyConsistency} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.harmony.keyConsistency.toFixed(1)}%</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Common Chord Progressions</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.harmony.chordProgression)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 5)
                    .map(([progression, count]) => (
                      <div key={progression}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{progression}</span>
                          <span>{count} occurrences</span>
                        </div>
                        <Progress value={count / Math.max(...Object.values(metrics.harmony.chordProgression)) * 100} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="melody">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Note Range</h4>
                  <Progress value={metrics.melody.range * 8.33} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.melody.range} semitones</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Melodic Complexity</h4>
                  <Progress value={metrics.melody.complexity} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.melody.complexity.toFixed(1)}%</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Note Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.melody.noteDistribution)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 5)
                    .map(([note, count]) => (
                      <div key={note}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{note}</span>
                          <span>{count} occurrences</span>
                        </div>
                        <Progress value={count / Math.max(...Object.values(metrics.melody.noteDistribution)) * 100} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="rhythm">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Syncopation</h4>
                  <Progress value={metrics.rhythm.syncopation} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.rhythm.syncopation.toFixed(1)}%</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Groove</h4>
                  <Progress value={metrics.rhythm.groove} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.rhythm.groove.toFixed(1)}%</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Common Accent Patterns</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.rhythm.accentPattern)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 5)
                    .map(([pattern, count]) => (
                      <div key={pattern}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{pattern}</span>
                          <span>{count} occurrences</span>
                        </div>
                        <Progress value={count / Math.max(...Object.values(metrics.rhythm.accentPattern)) * 100} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 