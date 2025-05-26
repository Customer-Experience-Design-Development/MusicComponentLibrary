import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info, Edit, Save, Download, Plus, X, BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface RhymeGroup {
  id: string;
  color: string;
  words: RhymeWord[];
  type: 'perfect' | 'family' | 'slant' | 'assonance' | 'consonance';
  strength: number; // 0-1 value indicating rhyme strength
}

interface RhymeWord {
  word: string;
  line: number;
  position: number;
  start: number;
  end: number;
  isEndRhyme: boolean;
  phoneticRepresentation?: string;
  syllables?: number;
}

interface RhymeSchemeAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (rhymeGroups: RhymeGroup[]) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  tempo?: number;
}

// Enhanced color palette with primary and secondary colors for better visualization
const RHYME_COLORS = [
  { perfect: '#3b82f6', family: '#93c5fd' }, // blue
  { perfect: '#10b981', family: '#6ee7b7' }, // green
  { perfect: '#8b5cf6', family: '#c4b5fd' }, // purple
  { perfect: '#f59e0b', family: '#fcd34d' }, // amber
  { perfect: '#ec4899', family: '#f9a8d4' }, // pink
  { perfect: '#06b6d4', family: '#67e8f9' }, // cyan
  { perfect: '#f97316', family: '#fdba74' }, // orange
  { perfect: '#64748b', family: '#94a3b8' }, // slate
  { perfect: '#6366f1', family: '#a5b4fc' }, // indigo
  { perfect: '#a855f7', family: '#d8b4fe' }, // violet
  { perfect: '#14b8a6', family: '#5eead4' }, // teal
  { perfect: '#ef4444', family: '#fca5a5' }, // red
];

// Expanded traditional rhyme scheme labels
const SCHEME_LABELS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Common rhyme schemes with their names for pattern detection
const COMMON_SCHEMES = [
  { name: 'Couplets', pattern: ['A', 'A', 'B', 'B'] },
  { name: 'Alternate/Cross Rhyme', pattern: ['A', 'B', 'A', 'B'] },
  { name: 'Enclosed/Envelope Rhyme', pattern: ['A', 'B', 'B', 'A'] },
  { name: 'Triplet', pattern: ['A', 'A', 'A'] },
  { name: 'Quatrain (common)', pattern: ['A', 'B', 'C', 'B'] },
  { name: 'Limerick', pattern: ['A', 'A', 'B', 'B', 'A'] },
  { name: 'Terza Rima', pattern: ['A', 'B', 'A', 'B', 'C', 'B'] },
];

// Enhanced phonetic mapping for better rhyme detection
const VOWEL_SOUNDS = {
  'a': ['a', 'ai', 'ay', 'ei', 'ey', 'ea'],
  'e': ['e', 'ee', 'ea', 'ie', 'ei', 'ey', 'y'],
  'i': ['i', 'ie', 'y', 'igh', 'uy', 'ui', 'ai'],
  'o': ['o', 'oa', 'oe', 'ow', 'ou', 'ough'],
  'u': ['u', 'oo', 'ou', 'ue', 'ew'],
};

// Add more sophisticated phoneme mapping (IPA-inspired)
const PHONEME_MAP: Record<string, string> = {
  // Vowels and diphthongs
  'a': 'æ', 'ai': 'eɪ', 'ay': 'eɪ', 'al': 'ɔl', 'all': 'ɔl',
  'ar': 'ɑr', 'are': 'ɛər', 'au': 'ɔ', 'aw': 'ɔ',
  'e': 'ɛ', 'ee': 'i', 'ea': 'i', 'ear': 'ɪər', 'eo': 'i',
  'er': 'ər', 'ere': 'ɪər', 'ew': 'u', 'ey': 'i',
  'i': 'ɪ', 'ie': 'aɪ', 'igh': 'aɪ', 'ir': 'ər',
  'o': 'ɑ', 'oa': 'oʊ', 'oe': 'oʊ', 'oi': 'ɔɪ', 'oy': 'ɔɪ',
  'oo': 'u', 'or': 'ɔr', 'ore': 'ɔr', 'ou': 'aʊ', 'ow': 'aʊ',
  'u': 'ʌ', 'ue': 'u', 'ur': 'ər',
  
  // Consonants
  'b': 'b', 'c': 'k', 'ch': 'tʃ', 'd': 'd',
  'f': 'f', 'g': 'g', 'gh': 'g', 'h': 'h',
  'j': 'dʒ', 'k': 'k', 'l': 'l', 'm': 'm',
  'n': 'n', 'ng': 'ŋ', 'p': 'p', 'ph': 'f',
  'qu': 'kw', 'r': 'r', 's': 's', 'sh': 'ʃ',
  't': 't', 'th': 'θ', 'v': 'v', 'w': 'w',
  'wh': 'w', 'x': 'ks', 'y': 'j', 'z': 'z',
  'zh': 'ʒ', 'tion': 'ʃən'
};

// Common word endings for rhyme patterns
const COMMON_ENDINGS: Record<string, string> = {
  'ing': 'ɪŋ', 'in': 'ɪn', 'ine': 'aɪn', 'ight': 'aɪt',
  'ate': 'eɪt', 'ake': 'eɪk', 'ame': 'eɪm', 'ain': 'eɪn',
  'ay': 'eɪ', 'ays': 'eɪz', 'ace': 'eɪs', 'ase': 'eɪs',
  'ale': 'eɪl', 'ail': 'eɪl', 'aim': 'eɪm',
  'eet': 'it', 'eat': 'it', 'eam': 'im', 'eem': 'im',
  'eal': 'il', 'eep': 'ip', 'ead': 'ɛd',
  'ice': 'aɪs', 'ite': 'aɪt', 'ide': 'aɪd', 'ive': 'aɪv',
  'ime': 'aɪm', 'ine_end': 'aɪn', 'ire': 'aɪər',
  'oan': 'oʊn', 'one': 'oʊn', 'own': 'oʊn', 'owe': 'oʊ',
  'ode': 'oʊd', 'oke': 'oʊk', 'old': 'oʊld', 'oll': 'oʊl',
  'ool': 'ul', 'oom': 'um', 'oot': 'ut', 'ood': 'ʊd',
  'ore': 'ɔr', 'orn': 'ɔrn', 'orld': 'ɔrld'
};

// Common words with known syllable counts
const COMMON_SYLLABLE_COUNTS: Record<string, number> = {
  'the': 1, 'and': 1, 'that': 1, 'have': 1, 'for': 1, 'not': 1, 'with': 1,
  'you': 1, 'this': 1, 'but': 1, 'his': 1, 'from': 1, 'they': 1, 'say': 1,
  'her': 1, 'she': 1, 'will': 1, 'one': 1, 'all': 1, 'would': 1, 'there': 1,
  'their': 1, 'what': 1, 'out': 1, 'about': 2, 'who': 1, 'get': 1, 'which': 1,
  'when': 1, 'make': 1, 'can': 1, 'like': 1, 'time': 1, 'just': 1, 'him': 1,
  'know': 1, 'take': 1, 'people': 2, 'into': 2, 'year': 1, 'your': 1, 'good': 1,
  'some': 1, 'could': 1, 'them': 1, 'see': 1, 'other': 2, 'than': 1, 'then': 1,
  'now': 1, 'look': 1, 'only': 2, 'come': 1, 'its': 1, 'over': 2, 'think': 1,
  'also': 2, 'back': 1, 'after': 2, 'use': 1, 'two': 1, 'how': 1, 'our': 1,
  'work': 1, 'first': 1, 'well': 1, 'way': 1, 'even': 2, 'new': 1, 'want': 1,
  
  // Common words in lyrics
  'love': 1, 'heart': 1, 'soul': 1, 'mind': 1, 'eyes': 1, 'light': 1, 
  'dream': 1, 'night': 1, 'day': 1, 'way_word': 1, 'world': 1, 'rain': 1, 'pain': 1,
  'fire': 1, 'desire': 2, 'heaven': 2, 'forever': 3, 'together': 3, 'never': 2,
  'always': 2, 'baby': 2, 'crazy': 2, 'maybe': 2, 'beautiful': 3, 'wonderful': 3,
  'magical': 3, 'melody': 3, 'harmony': 3, 'symphony': 3, 'fantasy': 3, 'reality': 4,
  'music': 2, 'rhythm': 2
};

// Add function to convert words to phonetic representation
const wordToPhonetic = (word: string): string => {
  // Convert to lowercase and remove non-alphabetic characters
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  if (word.length <= 1) {
    return word; // Single letter, return as is
  }
  
  // Check for common word endings first (usually most important for rhymes)
  for (const [ending, phonetic] of Object.entries(COMMON_ENDINGS)) {
    if (word.endsWith(ending)) {
      const stem = word.slice(0, word.length - ending.length);
      // If stem is very short, include it in phonetic representation
      if (stem.length <= 2) {
        return stem + phonetic;
      }
      // Otherwise just return the ending phonetic (focus on rhyme)
      return phonetic;
    }
  }
  
  // Process the word using phoneme mapping
  let phonetic = '';
  let i = 0;
  
  while (i < word.length) {
    // Try to match longer phonemes first
    let matched = false;
    
    // Try 4-character phonemes
    if (i <= word.length - 4) {
      const four = word.substring(i, i + 4);
      if (PHONEME_MAP[four]) {
        phonetic += PHONEME_MAP[four];
        i += 4;
        matched = true;
        continue;
      }
    }
    
    // Try 3-character phonemes
    if (i <= word.length - 3) {
      const three = word.substring(i, i + 3);
      if (PHONEME_MAP[three]) {
        phonetic += PHONEME_MAP[three];
        i += 3;
        matched = true;
        continue;
      }
    }
    
    // Try 2-character phonemes
    if (i <= word.length - 2) {
      const two = word.substring(i, i + 2);
      if (PHONEME_MAP[two]) {
        phonetic += PHONEME_MAP[two];
        i += 2;
        matched = true;
        continue;
      }
    }
    
    // Fall back to single character
    const one = word[i];
    if (PHONEME_MAP[one]) {
      phonetic += PHONEME_MAP[one];
    } else {
      phonetic += one; // Keep the character if no mapping
    }
    i++;
  }
  
  return phonetic;
};

// Helper function to count syllables
const countSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  
  // Special cases
  if (COMMON_SYLLABLE_COUNTS[word]) {
    return COMMON_SYLLABLE_COUNTS[word];
  }
  
  // Count vowel groups as syllables (refined algorithm)
  const vowels = 'aeiouy';
  let count = 0;
  let prevIsVowel = false;
  
  for (let i = 0; i < word.length; i++) {
    const isVowel = vowels.includes(word[i]);
    
    // Count vowel groups (transitions from consonant to vowel)
    if (isVowel && !prevIsVowel) {
      count++;
    }
    
    prevIsVowel = isVowel;
  }
  
  // Handle common silent e at end
  if (word.length > 2 && word.endsWith('e') && !vowels.includes(word[word.length - 2])) {
    count--;
  }
  
  // Handle 'le' syllable ending preceded by a consonant (e.g., 'simple', 'gentle')
  if (word.length > 2 && word.endsWith('le') && !vowels.includes(word[word.length - 3])) {
    count++;
  }
  
  // Handle 'ed' ending - only counts as syllable if preceded by 'd' or 't'
  if (word.length > 2 && word.endsWith('ed')) {
    const precedingChar = word[word.length - 3];
    if (precedingChar === 'd' || precedingChar === 't') {
      count++;
    }
  }
  
  return Math.max(1, count); // Ensure at least one syllable
};

// Enhanced phonetic analysis for more accurate rhyme detection
const getPhoneticKey = (word: string, detailed = false): { key: string, type: RhymeGroup['type'], strength: number } => {
  const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
  
  if (cleanWord.length <= 1) {
    return { key: cleanWord, type: 'slant', strength: 0.1 };
  }
  
  // Get full phonetic representation
  const fullPhonetic = wordToPhonetic(cleanWord);
  
  // For detailed analysis, use syllable-aware rhyme detection
  const syllableCount = countSyllables(cleanWord);
  
  // Different rhyme types based on what phonetic elements match
  let perfectKey = fullPhonetic;
  let familyKey = '';
  let slantKey = '';
  let assonanceKey = '';
  let consonanceKey = '';
  
  // Extract rhyme components
  const lastVowelIndex = Math.max(
    ...Array.from('aeiouæɑɛəɪɔʊʌ').map(vowel => fullPhonetic.lastIndexOf(vowel))
  );
  
  if (lastVowelIndex >= 0) {
    // Perfect rhyme: everything from last vowel to end
    perfectKey = fullPhonetic.substring(lastVowelIndex);
    
    // Family rhyme: last vowel sound + similar consonants
    const vowelSound = fullPhonetic.charAt(lastVowelIndex);
    const endConsonants = fullPhonetic.substring(lastVowelIndex + 1);
    familyKey = vowelSound + endConsonants;
    
    // Slant rhyme: only consonant pattern matches
    const consonantPattern = fullPhonetic.replace(/[aeiouæɑɛəɪɔʊʌ]/g, '');
    slantKey = consonantPattern.slice(-Math.min(3, consonantPattern.length));
    
    // Assonance: vowel sounds only
    const vowelPattern = fullPhonetic.match(/[aeiouæɑɛəɪɔʊʌ]/g)?.join('') || '';
    assonanceKey = vowelPattern.slice(-Math.min(2, vowelPattern.length));
    
    // Consonance: consonant sounds only from end
    consonanceKey = endConsonants;
  }
  
  // Determine type and strength based on syllable count and phonetic qualities
  let type: RhymeGroup['type'] = 'perfect';
  let strength = 0.5; // Default strength
  
  // Perfect rhymes are stronger with more matching phonemes
  if (perfectKey.length >= 3) {
    type = 'perfect';
    strength = 0.9 + (Math.min(perfectKey.length, 6) - 3) * 0.02; // Up to 0.96 for long matches
  } 
  // Family rhymes match vowel sound + most consonants
  else if (familyKey.length >= 2) {
    type = 'family';
    strength = 0.7 + (Math.min(familyKey.length, 5) - 2) * 0.04; // Up to 0.82
  }
  // Slant rhymes have some phonetic similarity
  else if (slantKey.length >= 2) {
    type = 'slant';
    strength = 0.5 + (Math.min(slantKey.length, 4) - 2) * 0.05; // Up to 0.6
  } 
  // Assonance matches vowel sounds only
  else if (assonanceKey.length >= 1) {
    type = 'assonance';
    strength = 0.3 + (Math.min(assonanceKey.length, 3) - 1) * 0.05; // Up to 0.4
  } 
  // Consonance matches consonant sounds only
  else if (consonanceKey.length >= 1) {
    type = 'consonance';
    strength = 0.2 + (Math.min(consonanceKey.length, 3) - 1) * 0.05; // Up to 0.3
  }
  
  // Multi-syllable words with matching endings get a bonus
  if (syllableCount > 1 && perfectKey.length >= 2) {
    strength = Math.min(strength + (syllableCount - 1) * 0.05, 1.0);
  }
  
  // Prioritize different keys based on the type
  let key = '';
  switch (type) {
    case 'perfect': key = perfectKey; break;
    case 'family': key = familyKey; break;
    case 'slant': key = slantKey; break;
    case 'assonance': key = assonanceKey; break;
    case 'consonance': key = consonanceKey; break;
  }
  
  return { 
    key, 
    type, 
    strength: Math.min(Math.max(0.1, strength), 1.0) // Ensure between 0.1 and 1.0
  };
};

export function RhymeSchemeAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave,
  audioRef,
  tempo
}: RhymeSchemeAnalysisProps) {
  const [rhymeGroups, setRhymeGroups] = useState<RhymeGroup[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState('visualizer');
  const [showInternalRhymes, setShowInternalRhymes] = useState(true);
  const [showEndRhymes, setShowEndRhymes] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<'traditional' | 'network' | 'heatmap'>('traditional');
  const [rhymeTypes, setRhymeTypes] = useState({
    perfect: true,
    family: true,
    slant: true,
    assonance: false,
    consonance: false
  });

  const lines = lyrics.split('\n').filter(line => line.trim());
  
  useEffect(() => {
    // Auto-analyze rhymes when component mounts
    if (rhymeGroups.length === 0) {
      analyzeRhymes();
    }
  }, []);
  
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  // Enhanced rhyme analysis with improved categorization
  const analyzeRhymes = () => {
    const words: RhymeWord[] = [];
    const phoneticMap: Record<string, { words: RhymeWord[], type: RhymeGroup['type'], strength: number }> = {};
    
    // Extract words from each line
    lines.forEach((line, lineIndex) => {
      // Skip section headings
      if (line.trim().match(/^\[.*\]$/)) {
        return;
      }
      
      // Process for end rhymes
      const lineWords = line.trim().split(/\s+/);
      if (lineWords.length > 0) {
        const lastWord = lineWords[lineWords.length - 1].replace(/[^\w']/g, '');
        const lastWordStart = line.lastIndexOf(lastWord);
        const lastWordEnd = lastWordStart + lastWord.length;
        
        if (lastWord && lastWord.length > 1) {
          const endRhyme: RhymeWord = {
            word: lastWord,
            line: lineIndex,
            position: lineWords.length - 1,
            start: lastWordStart,
            end: lastWordEnd,
            isEndRhyme: true,
            syllables: countSyllables(lastWord),
            phoneticRepresentation: wordToPhonetic(lastWord)
          };
          
          words.push(endRhyme);
          
          // Group by enhanced phonetic analysis
          const { key, type, strength } = getPhoneticKey(lastWord, true);
          
          // Skip words with very low strength (likely not good rhymes)
          if (strength >= 0.2) {
            if (!phoneticMap[key]) {
              phoneticMap[key] = { words: [], type, strength };
            }
            phoneticMap[key].words.push(endRhyme);
          }
        }
      }
      
      // Process for internal rhymes with enhanced detection
      lineWords.slice(0, -1).forEach((wordWithPunctuation, wordIndex) => {
        const word = wordWithPunctuation.replace(/[^\w']/g, '');
        // Only consider words with enough phonetic substance (typically 3+ letters)
        if (word.length < 3) return;
        
        const wordStart = line.indexOf(word, wordIndex > 0 ? 
          line.indexOf(lineWords[wordIndex - 1]) + lineWords[wordIndex - 1].length : 0);
        const wordEnd = wordStart + word.length;
        
        if (word) {
          const internalRhyme: RhymeWord = {
            word,
            line: lineIndex,
            position: wordIndex,
            start: wordStart,
            end: wordEnd,
            isEndRhyme: false,
            syllables: countSyllables(word),
            phoneticRepresentation: wordToPhonetic(word)
          };
          
          words.push(internalRhyme);
          
          // Group by enhanced phonetic analysis
          const { key, type, strength } = getPhoneticKey(word, true);
          
          // Higher bar for internal rhymes to avoid too many weak matches
          if (strength >= 0.3) {
            if (!phoneticMap[key]) {
              phoneticMap[key] = { words: [], type, strength };
            }
            phoneticMap[key].words.push(internalRhyme);
          }
        }
      });
    });
    
    // Create enhanced rhyme groups from the phonetic mapping
    const groups: RhymeGroup[] = [];
    
    Object.entries(phoneticMap).forEach(([key, { words: rhymeWords, type, strength }], index) => {
      // Only create groups with at least 2 rhyming words
      if (rhymeWords.length >= 2) {
        const colorIndex = index % RHYME_COLORS.length;
        const color = type === 'perfect' || type === 'family' 
          ? RHYME_COLORS[colorIndex].perfect 
          : RHYME_COLORS[colorIndex].family;
          
        groups.push({
          id: generateId(),
          color,
          words: rhymeWords,
          type,
          strength
        });
      }
    });
    
    // Sort groups by type and strength for better visualization
    groups.sort((a, b) => {
      // First by type
      const typeOrder = { perfect: 0, family: 1, slant: 2, assonance: 3, consonance: 4 };
      const typeDiff = typeOrder[a.type] - typeOrder[b.type];
      if (typeDiff !== 0) return typeDiff;
      
      // Then by strength
      return b.strength - a.strength;
    });
    
    // Merge similar rhyme groups to avoid duplication
    const mergedGroups = mergeSimilarRhymeGroups(groups);
    
    setRhymeGroups(mergedGroups);
  };
  
  // New function to merge similar rhyme groups
  const mergeSimilarRhymeGroups = (groups: RhymeGroup[]): RhymeGroup[] => {
    if (groups.length <= 1) return groups;
    
    const result: RhymeGroup[] = [];
    const processed = new Set<string>();
    
    // Process groups in order (from best to worst rhymes)
    for (let i = 0; i < groups.length; i++) {
      const groupId = groups[i].id;
      if (processed.has(groupId)) continue;
      processed.add(groupId);
      
      const currentGroup = groups[i];
      const wordSet = new Set(currentGroup.words.map(w => `${w.line}-${w.position}`));
      const mergedWords = [...currentGroup.words];
      
      // Look for groups with overlapping words
      for (let j = i + 1; j < groups.length; j++) {
        const otherGroup = groups[j];
        if (processed.has(otherGroup.id)) continue;
        
        // Check for word overlap between groups
        const hasOverlap = otherGroup.words.some(word => 
          wordSet.has(`${word.line}-${word.position}`)
        );
        
        // If there's significant overlap and types are compatible, merge the groups
        if (hasOverlap && areCompatibleRhymeTypes(currentGroup.type, otherGroup.type)) {
          // Add words from other group that aren't already in the merged group
          otherGroup.words.forEach(word => {
            const wordKey = `${word.line}-${word.position}`;
            if (!wordSet.has(wordKey)) {
              wordSet.add(wordKey);
              mergedWords.push(word);
            }
          });
          
          processed.add(otherGroup.id);
        }
      }
      
      // Create a new merged group
      result.push({
        ...currentGroup,
        words: mergedWords
      });
    }
    
    return result;
  };
  
  // Helper function to check if rhyme types are compatible for merging
  const areCompatibleRhymeTypes = (type1: RhymeGroup['type'], type2: RhymeGroup['type']): boolean => {
    // Perfect and family rhymes can be merged
    if ((type1 === 'perfect' && type2 === 'family') || (type1 === 'family' && type2 === 'perfect')) {
      return true;
    }
    
    // Slant and assonance/consonance can be merged
    if (type1 === 'slant' && (type2 === 'assonance' || type2 === 'consonance')) {
      return true;
    }
    if (type2 === 'slant' && (type1 === 'assonance' || type1 === 'consonance')) {
      return true;
    }
    
    // Same type can always be merged
    return type1 === type2;
  };
  
  // Detect common rhyme scheme patterns
  const detectRhymeSchemePattern = (scheme: string[]): string | null => {
    // Minimum pattern length
    if (scheme.length < 4) return null;
    
    // Check against common patterns
    for (const knownScheme of COMMON_SCHEMES) {
      // Check if the pattern repeats throughout the scheme
      const patternLength = knownScheme.pattern.length;
      let matches = true;
      
      for (let i = 0; i < Math.floor(scheme.length / patternLength); i++) {
        const section = scheme.slice(i * patternLength, (i + 1) * patternLength);
        
        // Check if this section follows the pattern
        const normalizedSection = section.map((label, idx) => {
          // Map the actual label to the pattern label
          const patternChar = knownScheme.pattern[idx];
          if (patternChar === section[0]) return 'A';
          if (patternChar === section[1]) return 'B';
          if (patternChar === section[2] && section.length > 2) return 'C';
          if (patternChar === section[3] && section.length > 3) return 'D';
          return patternChar;
        });
        
        if (!normalizedSection.every((label, idx) => label === knownScheme.pattern[idx])) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        return knownScheme.name;
      }
    }
    
    return null;
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(rhymeGroups);
    }
    setIsEditing(false);
  };
  
  const addWordsToGroup = (groupId: string, wordIndices: number[]) => {
    // Implementation for editing in a real app
  };
  
  const removeWordFromGroup = (groupId: string, word: RhymeWord) => {
    if (!isEditable || !isEditing) return;
    
    const updatedGroups = [...rhymeGroups];
    const groupIndex = updatedGroups.findIndex(g => g.id === groupId);
    
    if (groupIndex >= 0) {
      const group = updatedGroups[groupIndex];
      group.words = group.words.filter(w => 
        !(w.line === word.line && w.position === word.position)
      );
      
      // Remove the group if it has less than 2 words
      if (group.words.length < 2) {
        updatedGroups.splice(groupIndex, 1);
      }
      
      setRhymeGroups(updatedGroups);
    }
  };
  
  const getWordsByLine = (lineIndex: number) => {
    const lineWords: { word: RhymeWord, group: RhymeGroup }[] = [];
    
    rhymeGroups.forEach(group => {
      group.words
        .filter(word => word.line === lineIndex)
        .forEach(word => {
          lineWords.push({ word, group });
        });
    });
    
    // Sort by position in line
    lineWords.sort((a, b) => a.word.position - b.word.position);
    
    return lineWords;
  };
  
  const getEndRhymeScheme = () => {
    // Find all end rhymes
    const endRhymeGroups = rhymeGroups
      .map(group => ({
        ...group,
        words: group.words.filter(word => word.isEndRhyme)
      }))
      .filter(group => group.words.length >= 2);
    
    // Create a rhyme scheme representation (A, B, A, B, etc.)
    const scheme: string[] = Array(lines.length).fill('');
    
    // Mark section titles with a special character
    lines.forEach((line, index) => {
      if (line.trim().match(/^\[.*\]$/)) {
        scheme[index] = '';  // Empty string for section titles
      }
    });
    
    // Add rhyme labels
    endRhymeGroups.forEach((group, groupIndex) => {
      const label = SCHEME_LABELS[groupIndex % SCHEME_LABELS.length];
      
      group.words.forEach(word => {
        scheme[word.line] = label;
      });
    });
    
    // Filter out empty entries for the display representation
    return scheme.filter(s => s !== '');
  };
  
  const getRhymeAnalysisStats = () => {
    const endRhymes = rhymeGroups.flatMap(g => g.words.filter(w => w.isEndRhyme));
    const internalRhymes = rhymeGroups.flatMap(g => g.words.filter(w => !w.isEndRhyme));
    
    const endRhymeGroups = rhymeGroups.filter(g => 
      g.words.some(w => w.isEndRhyme) && g.words.filter(w => w.isEndRhyme).length >= 2
    );
    
    const internalRhymeGroups = rhymeGroups.filter(g => 
      g.words.some(w => !w.isEndRhyme) && g.words.filter(w => !w.isEndRhyme).length >= 2
    );
    
    // Count content lines (excluding section titles)
    const contentLines = lines.filter(line => !line.trim().match(/^\[.*\]$/)).length;
    
    // Calculate percentage of lines with end rhymes
    const linesWithEndRhymes = new Set(endRhymes.map(w => w.line)).size;
    const endRhymePercent = Math.round((linesWithEndRhymes / contentLines) * 100);
    
    return {
      totalGroups: rhymeGroups.length,
      endRhymeGroups: endRhymeGroups.length,
      internalRhymeGroups: internalRhymeGroups.length,
      totalEndRhymes: endRhymes.length,
      totalInternalRhymes: internalRhymes.length,
      endRhymePercent
    };
  };
  
  const renderVisualizer = () => {
    const stats = getRhymeAnalysisStats();
    const endRhymeScheme = getEndRhymeScheme();
    const detectedPattern = detectRhymeSchemePattern(endRhymeScheme);
    
    // Create a map of line numbers to their rhyme scheme labels
    const lineToSchemeMap = new Map<number, string>();
    let schemeIndex = 0;
    
    lines.forEach((line, lineIndex) => {
      // Skip section titles when mapping rhyme labels
      if (!line.trim().match(/^\[.*\]$/)) {
        if (schemeIndex < endRhymeScheme.length) {
          lineToSchemeMap.set(lineIndex, endRhymeScheme[schemeIndex]);
          schemeIndex++;
        }
      }
    });
    
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-end-rhymes" 
              checked={showEndRhymes}
              onCheckedChange={setShowEndRhymes}
            />
            <Label htmlFor="show-end-rhymes">End Rhymes</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="show-internal-rhymes" 
              checked={showInternalRhymes}
              onCheckedChange={setShowInternalRhymes}
            />
            <Label htmlFor="show-internal-rhymes">Internal Rhymes</Label>
          </div>
          
          <Select value={visualizationType} onValueChange={(value) => setVisualizationType(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Visualization Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="traditional">Traditional</SelectItem>
              <SelectItem value="network">Network</SelectItem>
              <SelectItem value="heatmap">Heat Map</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 flex flex-wrap gap-6">
          <div>
            <div className="text-xs text-gray-500">End Rhyme Scheme</div>
            <div className="font-mono font-medium text-lg">
              {endRhymeScheme.join(' ')}
            </div>
            {detectedPattern && (
              <Badge className="mt-1" variant="secondary">
                {detectedPattern}
              </Badge>
            )}
          </div>
          
          <div>
            <div className="text-xs text-gray-500">End Rhyme Groups</div>
            <div className="font-medium text-lg">{stats.endRhymeGroups}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500">Internal Rhyme Groups</div>
            <div className="font-medium text-lg">{stats.internalRhymeGroups}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-500">Rhyme Density</div>
            <div className="font-medium text-lg">
              {(stats.totalEndRhymes + stats.totalInternalRhymes) / lines.length}
              <span className="text-xs ml-1">per line</span>
            </div>
          </div>
        </div>
        
        {visualizationType === 'traditional' && (
          <ScrollArea className="h-[400px]">
            <div className="space-y-1">
              {lines.map((line, lineIndex) => {
                // Check if this is a section title
                const isSectionTitle = line.trim().match(/^\[.*\]$/);
                
                if (isSectionTitle) {
                  // Render section title differently
                  return (
                    <div 
                      key={lineIndex}
                      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-center font-medium"
                    >
                      {line}
                    </div>
                  );
                }
                
                const lineWords = getWordsByLine(lineIndex);
                const hasEndRhyme = lineWords.some(({ word }) => word.isEndRhyme);
                const hasInternalRhyme = lineWords.some(({ word }) => !word.isEndRhyme);
                const endRhymeLetter = lineToSchemeMap.get(lineIndex);
                
                // Extract text segments with rhymes highlighted
                const segments: JSX.Element[] = [];
                let lastIndex = 0;
                
                // Sort words by their position in the line
                const sortedWords = lineWords
                  .filter(({ word }) => 
                    (word.isEndRhyme && showEndRhymes) || (!word.isEndRhyme && showInternalRhymes)
                  )
                  .map(({ word, group }) => ({ word, group }))
                  .sort((a, b) => a.word.start - b.word.start);
                
                sortedWords.forEach(({ word, group }, index) => {
                  if (word.start > lastIndex) {
                    segments.push(
                      <span key={`text-${index}`}>{line.substring(lastIndex, word.start)}</span>
                    );
                  }
                  
                  segments.push(
                    <span 
                      key={`word-${index}`}
                      className="px-1 py-0.5 rounded font-medium"
                      style={{ 
                        backgroundColor: `${group.color}20`,
                        color: group.color 
                      }}
                    >
                      {line.substring(word.start, word.end)}
                    </span>
                  );
                  
                  lastIndex = word.end;
                });
                
                if (lastIndex < line.length) {
                  segments.push(
                    <span key="text-end">{line.substring(lastIndex)}</span>
                  );
                }
                
                // If there are no highlighted words, just show the plain line
                if (segments.length === 0) {
                  segments.push(<span key="full-line">{line}</span>);
                }
                
                return (
                  <div 
                    key={lineIndex}
                    className={cn(
                      "p-2 rounded-md border",
                      (hasEndRhyme && showEndRhymes) || (hasInternalRhyme && showInternalRhymes)
                        ? "border-gray-200 dark:border-gray-700" 
                        : "border-transparent"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex flex-col items-center w-8">
                        <span className="text-xs text-gray-500">{lineIndex + 1}</span>
                        {endRhymeLetter && showEndRhymes && (
                          <Badge 
                            variant="outline" 
                            className="mt-1 h-5 w-5 p-0 flex items-center justify-center text-xs font-medium"
                          >
                            {endRhymeLetter}
                          </Badge>
                        )}
                      </div>
                      <div className="flex-1">
                        {segments}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
        
        {visualizationType === 'network' && (
          <div className="h-[400px] border rounded-md p-4 flex justify-center items-center">
            <div className="text-center text-gray-500">
              Rhyme network visualization would go here, showing connections between rhyming words across the lyrics
              {/* In a real implementation, this would be a force-directed graph using D3.js or similar */}
            </div>
          </div>
        )}
        
        {visualizationType === 'heatmap' && (
          <div className="h-[400px] rounded-md">
            <div className="w-full h-full p-4 overflow-auto">
              {/* Color gradient representing rhyme density */}
              <div className="flex flex-col gap-1">
                {lines.map((line, lineIndex) => {
                  // Skip section titles
                  if (line.trim().match(/^\[.*\]$/)) {
                    return (
                      <div key={lineIndex} className="text-center py-1 text-sm font-medium">
                        {line}
                      </div>
                    );
                  }
                  
                  // Calculate rhyme density for this line
                  const lineRhymes = rhymeGroups.flatMap(g => 
                    g.words.filter(w => w.line === lineIndex)
                  );
                  
                  const density = lineRhymes.length / (line.split(/\s+/).length || 1);
                  const intensity = Math.min(density * 100, 100); // 0-100 scale
                  
                  return (
                    <div 
                      key={lineIndex}
                      className="flex items-center gap-2"
                    >
                      <div className="text-xs w-6 text-right text-gray-500">{lineIndex + 1}</div>
                      <div 
                        className="flex-1 py-1 px-2 text-sm rounded-sm"
                        style={{
                          background: `linear-gradient(90deg, rgba(59, 130, 246, ${intensity/100}) ${intensity}%, transparent ${intensity}%)`,
                          opacity: 0.8 + (intensity / 500) // subtle variation in opacity too
                        }}
                      >
                        {line}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const renderRhymeGroups = () => {
    return (
      <div className="space-y-4">
        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rhymeGroups.map(group => {
              const endRhymes = group.words.filter(w => w.isEndRhyme);
              const internalRhymes = group.words.filter(w => !w.isEndRhyme);
              
              // Skip groups based on visibility settings
              if (
                (!showEndRhymes && endRhymes.length > 0 && internalRhymes.length === 0) ||
                (!showInternalRhymes && internalRhymes.length > 0 && endRhymes.length === 0)
              ) {
                return null;
              }
              
              return (
                <div 
                  key={group.id}
                  className={cn(
                    "border rounded-md overflow-hidden",
                    selectedGroup === group.id && "ring-2 ring-primary"
                  )}
                >
                  <div 
                    className="p-2 font-medium flex justify-between items-center"
                    style={{ backgroundColor: `${group.color}20` }}
                  >
                    <span style={{ color: group.color }}>
                      Rhyme Group: {group.words[0].word}
                    </span>
                    <div className="flex gap-1">
                      {endRhymes.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {endRhymes.length} End
                        </Badge>
                      )}
                      {internalRhymes.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {internalRhymes.length} Internal
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-2 text-sm">
                    <div className="space-y-1">
                      {group.words.map((word, wordIndex) => {
                        const lineText = lines[word.line];
                        
                        // Skip based on rhyme type filter
                        if ((word.isEndRhyme && !showEndRhymes) || 
                            (!word.isEndRhyme && !showInternalRhymes)) {
                          return null;
                        }
                        
                        return (
                          <div 
                            key={`${word.line}-${word.position}`}
                            className="flex justify-between items-start px-2 py-1 rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                          >
                            <div>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <span>Line {word.line + 1}</span>
                                {word.isEndRhyme && (
                                  <Badge variant="outline" className="text-[10px] py-0 h-4">
                                    End
                                  </Badge>
                                )}
                              </div>
                              <div className="line-clamp-1 mt-1">
                                {/* Show context with the rhyming word highlighted */}
                                {lineText.substring(0, word.start)}
                                <span 
                                  className="px-1 py-0.5 rounded font-medium"
                                  style={{ 
                                    backgroundColor: `${group.color}20`,
                                    color: group.color 
                                  }}
                                >
                                  {word.word}
                                </span>
                                {lineText.substring(word.end)}
                              </div>
                            </div>
                            
                            {isEditable && isEditing && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                                onClick={() => removeWordFromGroup(group.id, word)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };
  
  const renderGuide = () => {
    return (
      <div className="space-y-6">
        <div className="prose dark:prose-invert max-w-none text-sm">
          <p>
            <strong>Rhyme scheme</strong> refers to the pattern of rhymes at the end of each line,
            while <strong>internal rhymes</strong> occur within lines. Both are powerful tools
            for creating rhythm, musicality, and structure in your lyrics.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Common End Rhyme Schemes</h4>
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-mono font-medium">A A B B (Couplets)</div>
                <div className="text-xs text-gray-500 mt-1">
                  Pairs of rhyming lines, often used in pop and rap music
                </div>
              </div>
              
              <div>
                <div className="font-mono font-medium">A B A B (Alternating)</div>
                <div className="text-xs text-gray-500 mt-1">
                  Alternating rhymes, common in ballads and many verse structures
                </div>
              </div>
              
              <div>
                <div className="font-mono font-medium">A B B A (Enclosed)</div>
                <div className="text-xs text-gray-500 mt-1">
                  First and last lines rhyme, enclosing a rhyming couplet
                </div>
              </div>
              
              <div>
                <div className="font-mono font-medium">A A A (Monorhyme)</div>
                <div className="text-xs text-gray-500 mt-1">
                  All lines rhyme, creating a strong sonic pattern
                </div>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4">
            <h4 className="text-sm font-medium mb-2">Internal Rhyme Techniques</h4>
            <div className="space-y-2 text-sm">
              <div>
                <div className="font-medium">Line-Internal Rhymes</div>
                <div className="text-xs text-gray-500 mt-1">
                  Rhymes within a single line: "I <span className="text-blue-500">know</span> the <span className="text-blue-500">flow</span> will never die"
                </div>
              </div>
              
              <div>
                <div className="font-medium">Cross-Line Internal Rhymes</div>
                <div className="text-xs text-gray-500 mt-1">
                  Internal words rhyming across multiple lines, creating cohesion
                </div>
              </div>
              
              <div>
                <div className="font-medium">Internal-End Rhymes</div>
                <div className="text-xs text-gray-500 mt-1">
                  Internal words rhyming with end words from other lines
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> Tips for Effective Rhyme Schemes
          </h4>
          <div className="space-y-3 text-sm">
            <ul className="space-y-1 list-disc pl-5">
              <li>Use consistent rhyme schemes for verses to create structure</li>
              <li>Consider changing rhyme patterns between verses and chorus for contrast</li>
              <li>Internal rhymes can add rhythm without changing the end rhyme scheme</li>
              <li>Multi-syllable rhymes (perfect rhymes) create stronger connections</li>
              <li>Balance predictable rhymes with occasional surprises to keep listeners engaged</li>
              <li>Combine end and internal rhymes for more complex sonic textures</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rhyme Scheme Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analyze rhyme schemes, including end rhymes and internal rhymes</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            
            {isEditable && (
              <>
                {isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" /> Save
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
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
            <TabsTrigger value="groups">Rhyme Groups</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="visualizer">
            {renderVisualizer()}
          </TabsContent>
          
          <TabsContent value="groups">
            {renderRhymeGroups()}
          </TabsContent>
          
          <TabsContent value="guide">
            {renderGuide()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 