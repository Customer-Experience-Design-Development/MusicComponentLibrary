import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Info, Play, Pause, Edit, Save, Music, Wand2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SyllableData {
  text: string;
  stressed: boolean;
  duration?: number;
}

interface LineData {
  text: string;
  syllables: SyllableData[];
  stressPattern: string;
}

interface ProsodyAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (lineData: LineData[]) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  tempo?: number; // BPM
  rhymeGroups?: any[]; // Connect with RhymeSchemeAnalysis
}

// Common stress patterns in lyrics
const COMMON_PATTERNS = [
  { name: 'Iambic', pattern: 'uS', description: 'unstressed-STRESSED (hearts, toDAY)' },
  { name: 'Trochaic', pattern: 'Su', description: 'STRESSED-unstressed (BRILLiant, POWer)' },
  { name: 'Anapestic', pattern: 'uuS', description: 'unstressed-unstressed-STRESSED (understand, interrupt)' },
  { name: 'Dactylic', pattern: 'Suu', description: 'STRESSED-unstressed-unstressed (MEMory, POSSible)' },
  { name: 'Spondaic', pattern: 'SS', description: 'STRESSED-STRESSED (heart-break, STOP THAT)' },
];

export function ProsodyAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave,
  audioRef,
  tempo = 120,
  rhymeGroups = []
}: ProsodyAnalysisProps) {
  const [currentTempo, setCurrentTempo] = useState(tempo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentLine, setCurrentLine] = useState<number | null>(null);
  const [currentSyllable, setCurrentSyllable] = useState<number | null>(null);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [lineData, setLineData] = useState<LineData[]>([]);
  const [editingLine, setEditingLine] = useState<number | null>(null);
  const [timeSignature, setTimeSignature] = useState<'4/4' | '3/4' | '6/8'>('4/4');
  const [stressPatterns, setStressPatterns] = useState<{[key: number]: number[]}>({});
  const [highlightMode, setHighlightMode] = useState<'stress' | 'vowels' | 'consonants' | 'rhymes'>('stress');
  const [showRhymeAlignment, setShowRhymeAlignment] = useState(true);
  
  const metronomeRef = useRef<number | null>(null);
  const beatIntervalRef = useRef<number>(60000 / tempo); // ms per beat
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Initial breakdown of lyrics into syllables with estimated stress
    if (lineData.length === 0) {
      analyzeLines();
    }
    
    // Clean up metronome on unmount
    return () => {
      if (metronomeRef.current) {
        window.clearInterval(metronomeRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    // Update beat interval when tempo changes
    beatIntervalRef.current = 60000 / tempo;
    
    if (metronomeRef.current) {
      window.clearInterval(metronomeRef.current);
      if (isPlaying) {
        startMetronome();
      }
    }
  }, [tempo]);
  
  const analyzeLines = () => {
    const lines = lyrics.split('\n').filter(line => line.trim());
    const analyzedLines: LineData[] = lines.map(line => {
      // Skip section titles (return them unanalyzed)
      if (line.trim().match(/^\[.*\]$/)) {
        return {
          text: line,
          syllables: [],
          stressPattern: ''
        };
      }
      
      // Simple syllable counting (this is a basic approximation)
      const words = line.trim().split(/\s+/);
      const syllables: SyllableData[] = [];
      let stressPattern = '';
      
      words.forEach(word => {
        const wordSyllables = estimateSyllables(word);
        wordSyllables.forEach(syl => {
          syllables.push(syl);
          stressPattern += syl.stressed ? 'S' : 'u';
        });
      });
      
      return {
        text: line,
        syllables,
        stressPattern
      };
    });
    
    setLineData(analyzedLines);
  };
  
  const estimateSyllables = (word: string): SyllableData[] => {
    // Clean the word for processing but keep original for display
    const originalWord = word;
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    
    if (!cleanWord) {
      return [{
        text: originalWord,
        stressed: false
      }];
    }
    
    // Common words with known syllable counts and stress patterns
    const commonWords: Record<string, { count: number, stressPattern: boolean[] }> = {
      // Add more common words with known syllable counts
      'through': { count: 1, stressPattern: [true] },
      'the': { count: 1, stressPattern: [false] },
      'and': { count: 1, stressPattern: [false] },
      'in': { count: 1, stressPattern: [false] },
      'of': { count: 1, stressPattern: [false] },
      'to': { count: 1, stressPattern: [false] },
      'a': { count: 1, stressPattern: [false] },
      'that': { count: 1, stressPattern: [true] },
      'this': { count: 1, stressPattern: [true] },
      'with': { count: 1, stressPattern: [true] },
      'as': { count: 1, stressPattern: [false] },
      'at': { count: 1, stressPattern: [false] },
      'from': { count: 1, stressPattern: [true] },
      'by': { count: 1, stressPattern: [true] },
      'we': { count: 1, stressPattern: [true] },
      'us': { count: 1, stressPattern: [true] },
      'our': { count: 1, stressPattern: [true] },
      'love': { count: 1, stressPattern: [true] },
      'life': { count: 1, stressPattern: [true] },
      'time': { count: 1, stressPattern: [true] },
      'heart': { count: 1, stressPattern: [true] },
      'world': { count: 1, stressPattern: [true] },
      'never': { count: 2, stressPattern: [true, false] },
      'always': { count: 2, stressPattern: [true, false] },
      'forever': { count: 3, stressPattern: [false, true, false] },
      'together': { count: 3, stressPattern: [false, true, false] },
      'beautiful': { count: 3, stressPattern: [true, false, false] },
      'harmony': { count: 3, stressPattern: [true, false, false] },
      'journey': { count: 2, stressPattern: [true, false] },
      'rhythm': { count: 2, stressPattern: [true, false] },
      'melody': { count: 3, stressPattern: [true, false, false] },
      'symphony': { count: 3, stressPattern: [true, false, false] },
      'eternity': { count: 4, stressPattern: [false, true, false, false] },
      'infinite': { count: 3, stressPattern: [true, false, false] },
      'cosmic': { count: 2, stressPattern: [true, false] },
      'expanse': { count: 2, stressPattern: [false, true] },
      // More musical and lyrical terms
      'verse': { count: 1, stressPattern: [true] },
      'chorus': { count: 2, stressPattern: [true, false] },
      'bridge': { count: 1, stressPattern: [true] },
      'intro': { count: 2, stressPattern: [true, false] },
      'outro': { count: 2, stressPattern: [true, false] },
      'vocal': { count: 2, stressPattern: [true, false] },
      'voice': { count: 1, stressPattern: [true] },
      'sing': { count: 1, stressPattern: [true] },
      'song': { count: 1, stressPattern: [true] },
      'sound': { count: 1, stressPattern: [true] },
      'note': { count: 1, stressPattern: [true] },
      'beat': { count: 1, stressPattern: [true] },
      'tune': { count: 1, stressPattern: [true] },
      'music': { count: 2, stressPattern: [true, false] },
      'listen': { count: 2, stressPattern: [true, false] },
      'silence': { count: 2, stressPattern: [true, false] },
      'wonder': { count: 2, stressPattern: [true, false] },
      'passion': { count: 2, stressPattern: [true, false] },
      'power': { count: 2, stressPattern: [true, false] },
      'glory': { count: 2, stressPattern: [true, false] }
    };
    
    // Check if word is in our common words dictionary
    if (commonWords[cleanWord]) {
      const { count, stressPattern } = commonWords[cleanWord];
      const syllables: SyllableData[] = [];
      
      // For single syllable words, just return the whole word
      if (count === 1) {
        return [{
          text: originalWord,
          stressed: stressPattern[0]
        }];
      }
      
      // For multi-syllable words, we need a more sophisticated approach to divide the word
      return divideWordIntoSyllables(originalWord, cleanWord, count, stressPattern);
    }
    
    // If not in the common words dictionary, use linguistic rules for syllable division
    return applyLinguisticRules(originalWord, cleanWord);
  };
  
  // New helper function to divide words into syllables based on linguistic patterns
  const divideWordIntoSyllables = (
    originalWord: string, 
    cleanWord: string, 
    syllableCount: number, 
    stressPattern: boolean[]
  ): SyllableData[] => {
    const syllables: SyllableData[] = [];
    const vowels = 'aeiouy';
    
    // Find all vowel positions (potential syllable nuclei)
    const vowelPositions: number[] = [];
    for (let i = 0; i < cleanWord.length; i++) {
      if (vowels.includes(cleanWord[i])) {
        // Skip consecutive vowels (diphthongs)
        if (i > 0 && vowels.includes(cleanWord[i-1])) {
          continue;
        }
        vowelPositions.push(i);
      }
    }
    
    // If we found a different number of vowel groups than expected syllables,
    // use a proportional approach
    if (vowelPositions.length !== syllableCount) {
      return proportionalDivision(originalWord, syllableCount, stressPattern);
    }
    
    // Create syllable boundaries based on vowel positions and linguistic rules
    let lastBoundary = 0;
    
    for (let i = 0; i < vowelPositions.length; i++) {
      const vowelPos = vowelPositions[i];
      
      // Find the next boundary based on linguistic rules
      let nextBoundary = cleanWord.length;
      if (i < vowelPositions.length - 1) {
        const nextVowelPos = vowelPositions[i + 1];
        
        // Apply Maximum Onset Principle: consonants prefer to start a syllable
        // rather than end one when possible
        if (nextVowelPos - vowelPos > 1) {
          // There are consonants between vowels
          // For two consonants, typically split between them
          if (nextVowelPos - vowelPos == 3) {
            nextBoundary = vowelPos + 2;
          } 
          // For one consonant, it typically starts the next syllable
          else if (nextVowelPos - vowelPos == 2) {
            nextBoundary = vowelPos + 1;
          }
          // For 3+ consonants, follow specific rules for English consonant clusters
          else if (nextVowelPos - vowelPos > 3) {
            // Find a valid place to split based on English phonotactics
            nextBoundary = findConsonantClusterBoundary(cleanWord, vowelPos, nextVowelPos);
          }
        } else {
          // Adjacent vowels that weren't considered diphthongs
          nextBoundary = vowelPos + 1;
        }
      }
      
      // Handle the original word's characters (including punctuation)
      let origStart = 0;
      let origEnd = originalWord.length;
      
      // Map the clean boundaries back to the original word
      if (i > 0) {
        let cleanCharCount = 0;
        for (let j = 0; j < originalWord.length; j++) {
          if (originalWord[j].match(/[a-zA-Z]/)) {
            cleanCharCount++;
          }
          if (cleanCharCount > lastBoundary) {
            origStart = j;
            break;
          }
        }
      }
      
      if (i < vowelPositions.length - 1) {
        let cleanCharCount = 0;
        for (let j = 0; j < originalWord.length; j++) {
          if (originalWord[j].match(/[a-zA-Z]/)) {
            cleanCharCount++;
          }
          if (cleanCharCount > nextBoundary) {
            origEnd = j;
            break;
          }
        }
      }
      
      // Create the syllable
      syllables.push({
        text: originalWord.substring(origStart, origEnd),
        stressed: stressPattern[i] || false
      });
      
      lastBoundary = nextBoundary;
    }
    
    return syllables;
  };
  
  // Find the best place to split a consonant cluster based on English phonotactics
  const findConsonantClusterBoundary = (word: string, vowelPos: number, nextVowelPos: number): number => {
    // Get the consonant cluster between vowels
    const cluster = word.substring(vowelPos + 1, nextVowelPos);
    
    // Common English onset consonant clusters that can begin a syllable
    const validOnsets = [
      'pl', 'pr', 'bl', 'br', 'tr', 'dr', 'kl', 'kr', 'gl', 'gr',
      'fl', 'fr', 'sl', 'sm', 'sn', 'sp', 'st', 'sk', 'sw',
      'tw', 'dw', 'gw', 'kw',
      'spl', 'spr', 'str', 'skr', 'skw',
      'th', 'sh', 'wh', 'ph', 'ch'
    ];
    
    // Try to find the longest valid onset from the end of the cluster
    for (let i = 1; i < cluster.length; i++) {
      const potentialOnset = cluster.substring(i);
      if (validOnsets.some(onset => potentialOnset === onset)) {
        return vowelPos + 1 + i;
      }
    }
    
    // Default: split in the middle of the consonant cluster
    // This is a simplified approach - English phonotactics are complex
    return vowelPos + 1 + Math.floor(cluster.length / 2);
  };
  
  // Divide word proportionally when we can't accurately determine syllable boundaries
  const proportionalDivision = (
    originalWord: string, 
    syllableCount: number, 
    stressPattern: boolean[]
  ): SyllableData[] => {
    const syllables: SyllableData[] = [];
    const charPerSyllable = Math.ceil(originalWord.length / syllableCount);
    
    for (let i = 0; i < syllableCount; i++) {
      const start = i * charPerSyllable;
      const end = Math.min(start + charPerSyllable, originalWord.length);
      
      // Only add if we have characters left
      if (start < originalWord.length) {
        syllables.push({
          text: originalWord.substring(start, end),
          stressed: stressPattern[i] || false
        });
      }
    }
    
    return syllables;
  };
  
  // Apply linguistic rules for syllable division
  const applyLinguisticRules = (originalWord: string, cleanWord: string): SyllableData[] => {
    const vowels = 'aeiouy';
    const syllables: SyllableData[] = [];
    
    // Count vowel groups to estimate syllable count
    let vowelGroups = 0;
    let inVowelGroup = false;
    
    for (let i = 0; i < cleanWord.length; i++) {
      if (vowels.includes(cleanWord[i])) {
        if (!inVowelGroup) {
          vowelGroups++;
          inVowelGroup = true;
        }
      } else {
        inVowelGroup = false;
      }
    }
    
    // Special case for words ending in 'le' preceded by a consonant
    if (cleanWord.length > 2 && 
        cleanWord.endsWith('le') && 
        !vowels.includes(cleanWord[cleanWord.length - 3])) {
      vowelGroups += 1;
    }
    
    // Adjust for silent 'e' at the end
    if (cleanWord.length > 2 && 
        cleanWord.endsWith('e') && 
        !vowels.includes(cleanWord[cleanWord.length - 2])) {
      vowelGroups -= 1;
    }
    
    // Set minimum syllable count to 1
    vowelGroups = Math.max(1, vowelGroups);
    
    // Generate stress pattern based on syllable count
    const stressPattern = generateStressPattern(vowelGroups);
    
    // Now create syllables by dividing the word
    return divideWordIntoSyllables(originalWord, cleanWord, vowelGroups, stressPattern);
  };
  
  // Generate an appropriate stress pattern based on syllable count
  const generateStressPattern = (syllableCount: number): boolean[] => {
    const pattern: boolean[] = [];
    
    // Apply common English stress patterns based on syllable count
    switch (syllableCount) {
      case 1:
        // Single syllable words are typically stressed
        pattern.push(true);
        break;
      case 2:
        // Two-syllable words are often stressed on the first syllable
        // This is a simplification - noun/verb distinctions matter in English
        pattern.push(true, false);
        break;
      case 3:
        // Three-syllable words often follow an alternating pattern with
        // primary stress on the first syllable (again, a simplification)
        pattern.push(true, false, false);
        break;
      default:
        // For longer words, apply alternating stress with primary on the antepenultimate
        // (third from last) following common English patterns
        for (let i = 0; i < syllableCount; i++) {
          // Stress antepenultimate syllable (common in English longer words)
          pattern.push(i === syllableCount - 3 || i % 2 === 0);
        }
    }
    
    return pattern;
  };
  
  const startMetronome = () => {
    setIsPlaying(true);
    setCurrentBeat(0);
    
    metronomeRef.current = window.setInterval(() => {
      setCurrentBeat(prev => (prev + 1) % beatsPerMeasure);
    }, beatIntervalRef.current);
  };
  
  const stopMetronome = () => {
    setIsPlaying(false);
    if (metronomeRef.current) {
      window.clearInterval(metronomeRef.current);
      metronomeRef.current = null;
    }
  };
  
  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
  };
  
  const toggleSyllableStress = (lineIndex: number, syllableIndex: number) => {
    if (!isEditable || !isPlaying) return;
    
    const updatedLineData = [...lineData];
    const line = updatedLineData[lineIndex];
    const syllable = line.syllables[syllableIndex];
    
    syllable.stressed = !syllable.stressed;
    
    // Update stress pattern
    line.stressPattern = line.syllables.map(s => s.stressed ? 'S' : 'u').join('');
    
    setLineData(updatedLineData);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(lineData);
    }
    setIsPlaying(false);
  };
  
  const analyzeProsody = () => {
    // Improved analysis based on common prosody patterns in songwriting
    const updatedLineData = [...lineData];
    
    // First, try to identify song sections (verse, chorus, etc.) based on line patterns
    interface SongSection {
      type: string;
      startLine: number;
      endLine: number;
    }
    
    const sections: SongSection[] = [];
    let currentSection: { type: string, startLine: number } | null = null;
    
    updatedLineData.forEach((line, index) => {
      // Check if this is a section title
      if (line.text.trim().match(/^\[.*\]$/)) {
        // If we have an open section, close it
        if (currentSection) {
          sections.push({
            type: currentSection.type,
            startLine: currentSection.startLine,
            endLine: index - 1
          });
        }
        
        // Extract section type from the title
        const sectionMatch = line.text.trim().match(/^\[(.*?)\]$/);
        let sectionType = 'verse'; // Default
        
        if (sectionMatch && sectionMatch[1]) {
          const sectionText = sectionMatch[1].toLowerCase();
          if (sectionText.includes('chorus')) {
            sectionType = 'chorus';
          } else if (sectionText.includes('verse')) {
            sectionType = 'verse';
          } else if (sectionText.includes('bridge')) {
            sectionType = 'bridge';
          } else if (sectionText.includes('intro')) {
            sectionType = 'intro';
          } else if (sectionText.includes('outro')) {
            sectionType = 'outro';
          } else if (sectionText.includes('pre-chorus')) {
            sectionType = 'pre-chorus';
          }
        }
        
        // Start a new section
        currentSection = {
          type: sectionType,
          startLine: index + 1
        };
      }
    });
    
    // Close the final section if one is open
    if (currentSection) {
      sections.push({
        type: currentSection.type,
        startLine: currentSection.startLine,
        endLine: updatedLineData.length - 1
      });
    }
    
    // If no sections were found, treat the whole thing as one verse
    if (sections.length === 0 && updatedLineData.length > 0) {
      sections.push({
        type: 'verse',
        startLine: 0,
        endLine: updatedLineData.length - 1
      });
    }
    
    // Apply prosody patterns based on song section type
    sections.forEach(section => {
      // Apply different stress patterns based on section type
      const sectionLines = updatedLineData.slice(section.startLine, section.endLine + 1);
      
      switch (section.type) {
        case 'verse':
          // Verses often use more varied patterns, sometimes iambic (unstressed-stressed)
          sectionLines.forEach((line, lineIndex) => {
            if (!line.syllables.length) return; // Skip section titles
            
            // Apply variations to make the verse feel more natural
            if (lineIndex % 2 === 0) {
              // Apply iambic pattern (unstressed-stressed) for even lines
              applyStressPattern(line, 'iambic');
            } else {
              // Apply trochaic pattern (stressed-unstressed) for odd lines
              applyStressPattern(line, 'trochaic');
            }
          });
          break;
          
        case 'chorus':
          // Choruses often have stronger, more consistent patterns
          // Use trochaic (stressed-unstressed) for more emphasis/energy
          sectionLines.forEach(line => {
            if (!line.syllables.length) return; // Skip section titles
            applyStressPattern(line, 'trochaic');
          });
          break;
          
        case 'bridge':
          // Bridges often shift the pattern for contrast
          // Use dactylic (stressed-unstressed-unstressed) for distinction
          sectionLines.forEach(line => {
            if (!line.syllables.length) return; // Skip section titles
            applyStressPattern(line, 'dactylic');
          });
          break;
          
        case 'pre-chorus':
          // Pre-choruses build tension, often with anapestic patterns
          sectionLines.forEach(line => {
            if (!line.syllables.length) return; // Skip section titles
            applyStressPattern(line, 'anapestic');
          });
          break;
          
        default:
          // For other sections, use a balanced approach
          sectionLines.forEach(line => {
            if (!line.syllables.length) return; // Skip section titles
            
            // Apply alternating stress
            line.syllables.forEach((syllable, syllableIndex) => {
              syllable.stressed = syllableIndex % 2 === 0;
            });
            
            // Update the stress pattern
            line.stressPattern = line.syllables.map(s => s.stressed ? 'S' : 'u').join('');
          });
      }
    });
    
    setLineData(updatedLineData);
  };
  
  // Helper function to apply different stress patterns
  const applyStressPattern = (line: LineData, pattern: string) => {
    switch (pattern) {
      case 'iambic': // unstressed-stressed
        line.syllables.forEach((syllable, index) => {
          syllable.stressed = index % 2 === 1;
        });
        break;
        
      case 'trochaic': // stressed-unstressed
        line.syllables.forEach((syllable, index) => {
          syllable.stressed = index % 2 === 0;
        });
        break;
        
      case 'anapestic': // unstressed-unstressed-stressed
        line.syllables.forEach((syllable, index) => {
          syllable.stressed = index % 3 === 2;
        });
        break;
        
      case 'dactylic': // stressed-unstressed-unstressed
        line.syllables.forEach((syllable, index) => {
          syllable.stressed = index % 3 === 0;
        });
        break;
        
      case 'spondaic': // stressed-stressed
        line.syllables.forEach(syllable => {
          syllable.stressed = true;
        });
        break;
        
      default:
        // Alternating (default)
        line.syllables.forEach((syllable, index) => {
          syllable.stressed = index % 2 === 0;
        });
    }
    
    // Update the stress pattern
    line.stressPattern = line.syllables.map(s => s.stressed ? 'S' : 'u').join('');
  };
  
  const identifyPattern = (pattern: string): string => {
    for (const commonPattern of COMMON_PATTERNS) {
      // Look for repeating patterns
      const repeatPattern = commonPattern.pattern.repeat(5); // Repeat to match longer lines
      if (pattern.includes(commonPattern.pattern)) {
        return commonPattern.name;
      }
    }
    return 'Custom';
  };
  
  const calculateProsodyScore = (pattern: string): number => {
    // Calculate a "regularity" score based on pattern consistency
    // This is just a simple demo - real analysis would be more complex
    
    // Check for repeating patterns of length 2-4
    for (let len = 2; len <= 4; len++) {
      let repetitionCount = 0;
      for (let i = 0; i < pattern.length - len; i += len) {
        const segment = pattern.substring(i, i + len);
        const nextSegment = pattern.substring(i + len, i + (2 * len));
        if (segment === nextSegment) {
          repetitionCount++;
        }
      }
      if (repetitionCount > 0) {
        // More repetition = higher score
        return Math.min(100, repetitionCount * 20);
      }
    }
    
    // Look for alternating patterns
    let alternationCount = 0;
    for (let i = 0; i < pattern.length - 2; i++) {
      if (pattern[i] === pattern[i+2]) {
        alternationCount++;
      }
    }
    
    if (alternationCount > 0) {
      return Math.min(90, alternationCount * 15);
    }
    
    // Default lower score if no clear pattern
    return 30;
  };
  
  const renderProsodyVisualizer = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Tempo: {currentTempo} BPM</span>
              <Badge>{beatsPerMeasure}/4 Time</Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleMetronome}
              >
                {isPlaying ? (
                  <><Pause className="h-4 w-4 mr-1" /> Stop</>
                ) : (
                  <><Play className="h-4 w-4 mr-1" /> Play Beat</>
                )}
              </Button>
            </div>
          </div>
          
          {isEditable && (
            <Button 
              variant="secondary" 
              size="sm"
              onClick={analyzeProsody}
            >
              <Wand2 className="h-4 w-4 mr-1" /> Auto-Analyze
            </Button>
          )}
        </div>
        
        <div className="overflow-hidden rounded-md border">
          <div className="flex h-12 items-center bg-gray-100 dark:bg-gray-800">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
              <div 
                key={i}
                className={cn(
                  "flex-1 h-full flex items-center justify-center border-r last:border-r-0 transition-colors font-mono text-lg",
                  currentBeat === i && isPlaying ? "bg-primary/20" : ""
                )}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>
        
        <ScrollArea className="h-[400px]">
          <div className="space-y-2">
            {lineData.map((line, lineIndex) => {
              // Check if this is a section title
              const isSectionTitle = line.text.trim().match(/^\[.*\]$/);
              
              if (isSectionTitle) {
                // Render section title differently
                return (
                  <div 
                    key={lineIndex}
                    className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-center font-medium my-4"
                  >
                    {line.text}
                  </div>
                );
              }
              
              const patternName = identifyPattern(line.stressPattern);
              const prosodyScore = calculateProsodyScore(line.stressPattern);
              
              return (
                <div 
                  key={lineIndex}
                  className={cn(
                    "border rounded-md p-3 transition-colors",
                    lineIndex === currentLine ? "border-primary bg-primary/5" : "",
                    editingLine === lineIndex ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Line {lineIndex + 1}</span>
                      <Badge variant="outline" className="text-xs">
                        {patternName}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 dark:bg-green-600 rounded-full" 
                            style={{ width: `${prosodyScore}%` }}
                          />
                        </div>
                        <span className="text-xs">{prosodyScore}%</span>
                      </div>
                    </div>
                    
                    {isEditable && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingLine(editingLine === lineIndex ? null : lineIndex)}
                      >
                        {editingLine === lineIndex ? 'Done' : 'Edit'}
                      </Button>
                    )}
                  </div>
                  
                  {/* Syllable visualization */}
                  <div className="flex flex-wrap gap-1 mb-1">
                    {line.syllables.map((syllable, syllableIndex) => (
                      <div 
                        key={syllableIndex}
                        className={cn(
                          "border px-2 py-1 rounded cursor-pointer transition-all",
                          syllable.stressed ? 
                            "bg-primary/20 border-primary font-bold" : 
                            "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                          syllableIndex === currentSyllable && lineIndex === currentLine ? 
                            "ring-2 ring-primary ring-offset-1" : ""
                        )}
                        onClick={() => isEditable && toggleSyllableStress(lineIndex, syllableIndex)}
                      >
                        {syllable.text}
                      </div>
                    ))}
                  </div>
                  
                  {/* Stress pattern */}
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    Pattern: {line.stressPattern.replace(/S/g, '/')}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  const renderProsodyGuide = () => {
    return (
      <div className="space-y-4">
        <div className="prose dark:prose-invert max-w-none text-sm">
          <p>
            <strong>Prosody</strong> refers to the rhythm, stress, and intonation patterns in language, 
            especially as they relate to music. Good prosody ensures the natural speech rhythms of your lyrics 
            align with the musical rhythm, creating a cohesive and emotionally resonant song.
          </p>
          
          <h4>Key Aspects of Prosody</h4>
          <ul className="space-y-1">
            <li><strong>Word Setting</strong> - Fitting lyrics to melody in a natural, expressive way</li>
            <li><strong>Melodic Contour</strong> - Matching the emotional content with rising/falling melodies</li>
            <li><strong>Syllabic Placement</strong> - Placing syllables on appropriate musical notes</li>
            <li><strong>Stress Alignment</strong> - Ensuring stressed syllables land on strong beats</li>
            <li><strong>Emotional Pacing</strong> - Supporting the lyric's emotional journey with musical structure</li>
          </ul>
          
          <h4>Common Stress Patterns</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {COMMON_PATTERNS.map(pattern => (
            <div 
              key={pattern.name}
              className="border rounded-md p-3"
            >
              <h4 className="text-sm font-medium">{pattern.name}</h4>
              <div className="text-xs text-gray-500 mb-2">{pattern.description}</div>
              <div className="flex items-center gap-1">
                {pattern.pattern.split('').map((char, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      char === 'S' ? "bg-primary/20 border-primary border-2 font-bold" : "bg-gray-100 dark:bg-gray-800"
                    )}
                  >
                    {char === 'S' ? '/' : 'u'}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mt-4">
          <h4 className="text-sm font-medium mb-2">Tips for Better Prosody</h4>
          <ul className="space-y-2 text-sm">
            <li><strong>Important words on strong beats</strong> - Place significant words on beats 1 and 3 in 4/4 time</li>
            <li><strong>Match syllable stress to musical accents</strong> - Align stressed syllables with emphasized notes</li>
            <li><strong>Use naturalism in lyrics</strong> - Words should flow like authentic speech patterns</li>
            <li><strong>Consider sectional prosody</strong> - Each part of the song (verse, chorus, bridge) should have its own prosodic identity</li>
            <li><strong>Employ perfect rhymes</strong> - They contribute to a song's prosody by creating satisfaction</li>
            <li><strong>Respect prosodic tension</strong> - Sometimes intentional mismatches can create compelling tension</li>
            <li><strong>Read lyrics aloud while playing music</strong> - Check alignment between words and melody</li>
          </ul>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mt-2">
          <h4 className="text-sm font-medium mb-2 text-blue-800 dark:text-blue-300">Insights from Songwriting Experts</h4>
          <div className="space-y-2 text-sm">
            <p className="text-blue-700 dark:text-blue-300">
              <strong>Sheila Davis</strong> emphasizes metric rhythm where lyrics must fit within musical measures. 
              She examines iambic meter (unstressed-stressed) and trochaic meter (stressed-unstressed).
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              <strong>Jimmy Webb</strong> discusses how melodic contour should match emotional content. 
              Ascending melodies often convey optimism or intensity, while descending melodies may evoke sadness.
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              <strong>Stephen Sondheim</strong> stresses the importance of naturalism in lyrics and clear comprehension on first hearing. 
              He's meticulous about stressed syllables aligning with strong musical beats.
            </p>
            <p className="text-blue-700 dark:text-blue-300">
              <strong>Andrea Stolpe</strong> introduces structure rhythm, matching emotional pacing with musical arrangement. 
              Each section (verse, chorus, bridge) should have a distinct prosodic identity.
            </p>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-2 text-green-800 dark:text-green-300">Practical Exercise</h4>
          <ol className="space-y-1 list-decimal list-inside text-sm text-green-700 dark:text-green-300">
            <li>Mark the stressed syllables in your lyrics</li>
            <li>Play your melody and note where the musical accents fall</li>
            <li>Check whether stressed syllables align with musical accents</li>
            <li>Adjust lyrics or melody to improve alignment</li>
            <li>Ensure important words receive musical emphasis</li>
            <li>Read your lyrics aloud to verify natural speech flow</li>
            <li>Test different stress patterns if alignment feels unnatural</li>
          </ol>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Prosody Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analyze how well lyrics align with musical rhythm and stress patterns</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="icon">
              <Music className="h-4 w-4" />
            </Button>
            
            {isEditable && (
              <>
                {isPlaying ? (
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsPlaying(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="visualizer" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
            <TabsTrigger value="guide">Prosody Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizer">
            {renderProsodyVisualizer()}
          </TabsContent>
          
          <TabsContent value="guide">
            {renderProsodyGuide()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 