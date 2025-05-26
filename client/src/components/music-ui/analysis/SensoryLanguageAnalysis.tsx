import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  Eye, 
  Ear, 
  Thermometer, 
  Wind, 
  Coffee,
  Activity,
  Edit,
  Save,
  Download
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Doughnut } from 'react-chartjs-2';
import { cn } from '@/lib/utils';

// Based on Pat Pattison's Object Writing technique which focuses on seven senses
type SensoryType = 'sight' | 'sound' | 'touch' | 'taste' | 'smell' | 'motion' | 'emotion';

interface SensoryWord {
  word: string;
  sensoryType: SensoryType;
  lineIndex: number;
  wordIndex: number;
  startPos: number;
  endPos: number;
}

interface WordAnalysis {
  word: string;
  type: string | null;
}

interface LineSensoryAnalysis {
  line: string;
  words: WordAnalysis[];
  sensoryTypes: Record<string, number>;
  isSectionTitle?: boolean;
}

interface SensoryStats {
  totalWords: number;
  sensoryWordCount: number;
  sensoryPercent: number;
  sensoryTypeCount: Record<string, number>;
  dominantTypes: string[];
  balanceScore: number;
}

interface SensoryAnalysis {
  lineAnalysis: LineSensoryAnalysis[];
  stats: SensoryStats;
  insights: string[];
}

interface SensoryLanguageAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (sensoryWords: SensoryWord[]) => void;
}

// Enhance the sensory words dictionary with more nuanced categories
const SENSORY_WORDS: Record<string, { words: string[], color: string, description: string }> = {
  visual: {
    words: [
      'see', 'saw', 'seen', 'look', 'gaze', 'watch', 'glimpse', 'observe', 'witness',
      'bright', 'dark', 'light', 'shadow', 'shine', 'glimmer', 'gleam', 'glisten', 'shimmer',
      'vibrant', 'colorful', 'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'white', 'black',
      'flash', 'sparkle', 'glint', 'dim', 'faint', 'vivid', 'blur', 'focus', 'clear',
      'hazy', 'foggy', 'misty', 'shining', 'dull', 'pale', 'brilliant', 'radiant'
    ],
    color: 'rgb(144, 202, 249)',
    description: 'Words that evoke sight and visual perception.'
  },
  auditory: {
    words: [
      'hear', 'heard', 'sound', 'noise', 'listen', 'whisper', 'shout', 'scream', 'cry',
      'whine', 'crackle', 'hum', 'buzz', 'ring', 'ping', 'chime', 'melody', 'rhythm',
      'beat', 'tune', 'echo', 'silence', 'quiet', 'loud', 'soft', 'harmony', 'discord',
      'cacophony', 'rustle', 'thud', 'crash', 'bang', 'clang', 'sizzle', 'pop', 'snap',
      'crackle', 'mumble', 'thunder', 'boom', 'roar', 'groan', 'murmur', 'voice'
    ],
    color: 'rgb(179, 157, 219)',
    description: 'Words that evoke sounds and auditory experiences.'
  },
  tactile: {
    words: [
      'touch', 'feel', 'felt', 'rough', 'smooth', 'soft', 'hard', 'warm', 'cold',
      'hot', 'chill', 'frozen', 'burning', 'sharp', 'dull', 'prickly', 'sticky',
      'wet', 'dry', 'heavy', 'light', 'pressure', 'caress', 'stroke', 'scratch',
      'itch', 'tickle', 'sting', 'pain', 'pleasure', 'numb', 'tingle', 'shiver',
      'tremble', 'vibrate', 'soothe', 'grasp', 'hold', 'squeeze', 'embrace'
    ],
    color: 'rgb(255, 167, 38)',
    description: 'Words that evoke touch and physical sensations.'
  },
  gustatory: {
    words: [
      'taste', 'flavor', 'sweet', 'sour', 'bitter', 'salty', 'savory', 'umami',
      'delicious', 'tasty', 'juicy', 'ripe', 'raw', 'cooked', 'baked', 'fried',
      'spicy', 'hot', 'mild', 'bland', 'rich', 'creamy', 'buttery', 'crisp',
      'crunchy', 'chewy', 'tender', 'tough', 'zesty', 'tangy', 'tart', 'mellow',
      'sugary', 'syrupy', 'honeyed', 'chocolatey', 'fruity', 'citrusy'
    ],
    color: 'rgb(255, 138, 101)',
    description: 'Words that evoke taste and flavors.'
  },
  olfactory: {
    words: [
      'smell', 'scent', 'aroma', 'odor', 'fragrance', 'perfume', 'stench', 'reek',
      'musty', 'moldy', 'fresh', 'stale', 'pungent', 'acrid', 'sweet', 'sour',
      'earthy', 'floral', 'fruity', 'spicy', 'smoky', 'burnt', 'foul', 'putrid',
      'rancid', 'musky', 'woody', 'herbal', 'citrusy', 'minty', 'vanilla', 'cinnamon',
      'ginger', 'lavender', 'rose', 'jasmine', 'petrichor', 'marine', 'salty'
    ],
    color: 'rgb(174, 213, 129)',
    description: 'Words that evoke smell and scents.'
  },
  kinesthetic: {
    words: [
      'move', 'motion', 'run', 'walk', 'dance', 'jump', 'leap', 'skip', 'hop',
      'slide', 'glide', 'sway', 'twist', 'turn', 'spin', 'whirl', 'roll', 'fall',
      'rise', 'float', 'fly', 'soar', 'dive', 'plunge', 'swim', 'climb', 'crawl',
      'stretch', 'bend', 'fold', 'lift', 'drop', 'throw', 'catch', 'balance',
      'stumble', 'trip', 'tumble', 'bounce', 'vibrate', 'shake', 'tremble', 'quiver'
    ],
    color: 'rgb(128, 222, 234)',
    description: 'Words that evoke movement and bodily sensations.'
  },
  emotional: {
    words: [
      'love', 'hate', 'fear', 'joy', 'sorrow', 'anger', 'happiness', 'sadness',
      'rage', 'calm', 'peace', 'anxiety', 'stress', 'relief', 'hope', 'despair',
      'yearning', 'longing', 'desire', 'disgust', 'shame', 'pride', 'guilt',
      'jealousy', 'envy', 'satisfaction', 'contentment', 'bliss', 'ecstasy',
      'agony', 'misery', 'grief', 'mourning', 'exhilaration', 'excitement',
      'boredom', 'interest', 'wonder', 'awe', 'surprise', 'shock', 'terror'
    ],
    color: 'rgb(236, 64, 122)',
    description: 'Words that evoke emotional states and experiences.'
  }
};

// Sensory colors for visualization
const SENSORY_COLORS: Record<SensoryType, string> = {
  sight: '#3b82f6', // blue
  sound: '#8b5cf6', // purple
  touch: '#10b981', // green
  taste: '#f59e0b', // amber
  smell: '#f43f5e', // rose
  motion: '#06b6d4', // cyan
  emotion: '#ec4899', // pink
};

// Sensory icons for visualization
const SENSORY_ICONS: Record<SensoryType, React.ReactNode> = {
  sight: <Eye className="h-4 w-4" />,
  sound: <Ear className="h-4 w-4" />,
  touch: <Thermometer className="h-4 w-4" />,
  taste: <Coffee className="h-4 w-4" />,
  smell: <Wind className="h-4 w-4" />,
  motion: <Activity className="h-4 w-4" />,
  emotion: <Activity className="h-4 w-4" />
};

// Update the analyzeSensoryLanguage function to skip section titles and be more nuanced
const analyzeSensoryLanguage = (lyrics: string): SensoryAnalysis => {
  const lines = lyrics.split('\n');
  const lineAnalysis: LineSensoryAnalysis[] = [];
  
  let totalWords = 0;
  let sensoryWordCount = 0;
  const sensoryTypeCount: Record<string, number> = {
    visual: 0, 
    auditory: 0, 
    tactile: 0, 
    gustatory: 0, 
    olfactory: 0, 
    kinesthetic: 0,
    emotional: 0
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) {
      lineAnalysis.push({
        line,
        words: [],
        sensoryTypes: {}
      });
      continue;
    }
    
    // Check if it's a section title and add it unchanged
    if (line.match(/^\[.*\]$/)) {
      lineAnalysis.push({
        line,
        words: [],
        sensoryTypes: {},
        isSectionTitle: true
      });
      continue;
    }
    
    // Regular content line - analyze words
    const words = line.split(/\s+/).filter(Boolean);
    const lineWords: WordAnalysis[] = [];
    const lineSensoryTypes: Record<string, number> = {};
    
    words.forEach(rawWord => {
      // Remove punctuation for matching but keep it for display
      const word = rawWord.toLowerCase().replace(/[^\w]/g, '');
      if (!word) return; // Skip empty words (e.g., just punctuation)
      
      totalWords++;
      let sensoryType = null;
      
      // Check if word is in any sensory category
      for (const type in SENSORY_WORDS) {
        // Look for exact matches
        if (SENSORY_WORDS[type].words.includes(word)) {
          sensoryType = type;
          sensoryWordCount++;
          sensoryTypeCount[type]++;
          
          // Track sensory types for this line
          lineSensoryTypes[type] = (lineSensoryTypes[type] || 0) + 1;
          break;
        }
        
        // Look for words that contain our sensory words
        // This catches plurals, tenses, etc.
        for (const sensoryWord of SENSORY_WORDS[type].words) {
          // Check for words that contain the sensory word but aren't simply longer words
          // (e.g., "bright" should match "brightly" but not "copyright")
          if (word.includes(sensoryWord) && 
              (word.startsWith(sensoryWord) || word.endsWith(sensoryWord) || 
               word.length - sensoryWord.length <= 3)) {
            sensoryType = type;
            sensoryWordCount++;
            sensoryTypeCount[type]++;
            
            // Track sensory types for this line
            lineSensoryTypes[type] = (lineSensoryTypes[type] || 0) + 1;
            break;
          }
        }
        
        if (sensoryType) break; // Stop once we've found a match
      }
      
      lineWords.push({
        word: rawWord,
        type: sensoryType
      });
    });
    
    lineAnalysis.push({
      line,
      words: lineWords,
      sensoryTypes: lineSensoryTypes
    });
  }
  
  // Calculate the percentage of sensory words
  const sensoryPercent = totalWords > 0 ? (sensoryWordCount / totalWords) * 100 : 0;
  
  // Calculate dominant sensory types
  let dominantTypes: string[] = [];
  let maxCount = 0;
  
  for (const type in sensoryTypeCount) {
    if (sensoryTypeCount[type] > maxCount) {
      dominantTypes = [type];
      maxCount = sensoryTypeCount[type];
    } else if (sensoryTypeCount[type] === maxCount && maxCount > 0) {
      dominantTypes.push(type);
    }
  }
  
  // Calculate sensory balance score (higher means more balanced use of sensory types)
  const sensoryCounts = Object.values(sensoryTypeCount);
  const totalSensoryWords = sensoryCounts.reduce((sum, count) => sum + count, 0);
  let balanceScore = 0;
  
  if (totalSensoryWords > 0) {
    // Calculate entropy-based balance score
    const typeProportions = sensoryCounts.map(count => count / totalSensoryWords);
    const entropy = -typeProportions
      .filter(p => p > 0) // Avoid log(0)
      .reduce((sum, p) => sum + p * Math.log2(p), 0);
    
    // Normalize to 0-100
    const maxEntropy = Math.log2(Object.keys(SENSORY_WORDS).length);
    balanceScore = (entropy / maxEntropy) * 100;
  }
  
  // Provide insights based on analysis
  const insights: string[] = [];
  
  if (sensoryPercent < 5) {
    insights.push("Consider adding more sensory language to make your lyrics more vivid and engaging.");
  } else if (sensoryPercent > 25) {
    insights.push("Your lyrics are rich in sensory details, creating an immersive experience for listeners.");
  }
  
  if (dominantTypes.length === 1) {
    insights.push(`Your lyrics primarily use ${dominantTypes[0]} imagery. Consider incorporating other sensory types for more dimension.`);
  } else if (balanceScore > 75) {
    insights.push("You've achieved a good balance of different sensory types, creating a multi-dimensional experience.");
  }
  
  // Suggest areas for improvement
  const weakSensoryTypes = Object.entries(sensoryTypeCount)
    .filter(([_, count]) => count === 0 || count < totalSensoryWords * 0.1)
    .map(([type, _]) => type);
    
  if (weakSensoryTypes.length > 0 && weakSensoryTypes.length < Object.keys(SENSORY_WORDS).length) {
    insights.push(`Consider adding more ${weakSensoryTypes.join(', ')} imagery to balance your sensory palette.`);
  }
  
  return {
    lineAnalysis,
    stats: {
      totalWords,
      sensoryWordCount,
      sensoryPercent,
      sensoryTypeCount,
      dominantTypes,
      balanceScore
    },
    insights
  };
};

// Update renderLyricDisplay to handle section titles appropriately
const renderLyricDisplay = (analysis: SensoryAnalysis | null) => {
  if (!analysis) return null;
  
  return (
    <div className="space-y-2">
      {analysis.lineAnalysis.map((line, index) => {
        // Handle section titles differently
        if (line.isSectionTitle) {
          return (
            <div 
              key={index} 
              className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-center rounded font-semibold"
            >
              {line.line}
            </div>
          );
        }
        
        if (!line.line) return <div key={index} className="h-4"></div>;
        
        // Add visual indicators for sensory density
        const hasSensoryWords = Object.keys(line.sensoryTypes).length > 0;
        const sensorySaturation = hasSensoryWords 
          ? Object.values(line.sensoryTypes).reduce((a, b) => a + b, 0) / line.words.length 
          : 0;
          
        const lineClass = hasSensoryWords
          ? sensorySaturation > 0.5
            ? "border-l-4 border-indigo-500 pl-2"
            : "border-l-2 border-indigo-300 pl-3"
          : "pl-4";
          
        return (
          <div key={index} className={`${lineClass} hover:bg-slate-100 dark:hover:bg-slate-800 rounded`}>
            {line.words.map((word, wordIndex) => {
              if (!word.type) {
                return <span key={wordIndex}>{word.word} </span>;
              }
              
              const { color } = SENSORY_WORDS[word.type];
              return (
                <span 
                  key={wordIndex} 
                  style={{ color }} 
                  className="font-medium underline decoration-dotted cursor-help"
                  title={`${word.type.charAt(0).toUpperCase() + word.type.slice(1)}: ${SENSORY_WORDS[word.type].description}`}
                >
                  {word.word}{' '}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export function SensoryLanguageAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave
}: SensoryLanguageAnalysisProps) {
  const [sensoryWords, setSensoryWords] = useState<SensoryWord[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  useEffect(() => {
    // Auto-detect sensory words when component mounts
    if (sensoryWords.length === 0) {
      analyzeSensoryLanguage();
    }
  }, []);
  
  const analyzeSensoryLanguage = () => {
    const lines = lyrics.split('\n');
    const detectedWords: SensoryWord[] = [];
    
    lines.forEach((line, lineIndex) => {
      // Skip section titles
      if (line.trim().match(/^\[.*\]$/)) {
        return;
      }
      
      const words = line.split(/\s+/);
      let currentPosition = 0;
      
      words.forEach((originalWord, wordIndex) => {
        // Clean the word for matching but keep original for display
        const word = originalWord.toLowerCase().replace(/[^\w]/g, '');
        
        // Check each sensory dictionary
        Object.entries(SENSORY_WORDS).forEach(([type, dictionary]) => {
          if (dictionary.words.includes(word) || dictionary.words.some(dictWord => word.includes(dictWord))) {
            const startPos = currentPosition;
            const endPos = startPos + originalWord.length;
            
            detectedWords.push({
              word: originalWord,
              sensoryType: type as SensoryType,
              lineIndex,
              wordIndex,
              startPos,
              endPos
            });
          }
        });
        
        currentPosition += originalWord.length + 1; // +1 for the space
      });
    });
    
    setSensoryWords(detectedWords);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(sensoryWords);
    }
    setIsEditing(false);
  };
  
  const toggleSensoryWord = (word: SensoryWord) => {
    if (!isEditable || !isEditing) return;
    
    // Remove the word from sensory words
    setSensoryWords(sensoryWords.filter(w => 
      !(w.lineIndex === word.lineIndex && w.wordIndex === word.wordIndex)
    ));
  };
  
  const addSensoryWord = (lineIndex: number, wordIndex: number, word: string, type: SensoryType) => {
    if (!isEditable || !isEditing) return;
    
    // Calculate position (approximate)
    const line = lyrics.split('\n')[lineIndex];
    const words = line.split(/\s+/);
    let pos = 0;
    
    for (let i = 0; i < wordIndex; i++) {
      pos += words[i].length + 1; // +1 for space
    }
    
    const newWord: SensoryWord = {
      word,
      sensoryType: type,
      lineIndex,
      wordIndex,
      startPos: pos,
      endPos: pos + word.length
    };
    
    setSensoryWords([...sensoryWords, newWord]);
  };
  
  const getSensoryTypeCounts = () => {
    const counts: Record<SensoryType, number> = {
      sight: 0,
      sound: 0,
      touch: 0,
      taste: 0,
      smell: 0,
      motion: 0,
      emotion: 0
    };
    
    sensoryWords.forEach(word => {
      counts[word.sensoryType]++;
    });
    
    return counts;
  };
  
  const getLineWithHighlightedWords = (line: string, lineIndex: number): React.ReactNode => {
    const lineWords = sensoryWords.filter(word => word.lineIndex === lineIndex);
    
    if (lineWords.length === 0) {
      return line;
    }
    
    // Sort by position to process them in order
    lineWords.sort((a, b) => a.startPos - b.startPos);
    
    // Build an array of segments (text and highlighted words)
    const segments: JSX.Element[] = [];
    let lastIndex = 0;
    
    lineWords.forEach((word, index) => {
      // Add text before this word
      if (word.startPos > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>{line.substring(lastIndex, word.startPos)}</span>
        );
      }
      
      // Add the highlighted word
      segments.push(
        <span 
          key={`word-${index}`}
          className="inline-flex items-center px-1 py-0.5 rounded" 
          style={{ backgroundColor: `${SENSORY_COLORS[word.sensoryType]}20` }}
        >
          {word.word}
          <span 
            className="ml-1 h-2 w-2 rounded-full inline-block" 
            style={{ backgroundColor: SENSORY_COLORS[word.sensoryType] }}
          />
        </span>
      );
      
      lastIndex = word.endPos;
    });
    
    // Add any remaining text after the last highlighted word
    if (lastIndex < line.length) {
      segments.push(
        <span key="text-end">{line.substring(lastIndex)}</span>
      );
    }
    
    // Return all segments as a fragment
    return <>{segments}</>;
  };
  
  const renderSensoryOverview = () => {
    const counts = getSensoryTypeCounts();
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    // Prepare chart data
    const data = {
      labels: Object.keys(counts).map(key => key.charAt(0).toUpperCase() + key.slice(1)),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: Object.keys(counts).map(key => SENSORY_COLORS[key as SensoryType]),
          borderColor: Object.keys(counts).map(key => SENSORY_COLORS[key as SensoryType]),
          borderWidth: 1,
        },
      ],
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right' as const,
          labels: {
            boxWidth: 12,
            padding: 15
          }
        }
      }
    };
    
    return (
      <div className="space-y-6">
        {total > 0 ? (
          <>
            <div className="flex justify-center items-center h-64">
              <Doughnut data={data} options={chartOptions} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(counts).map(([type, count]) => {
                if (count === 0) return null;
                
                return (
                  <div 
                    key={type}
                    className="flex items-center p-3 rounded-md border"
                    style={{ borderColor: `${SENSORY_COLORS[type as SensoryType]}50` }}
                  >
                    <div 
                      className="p-2 rounded-md mr-3"
                      style={{ backgroundColor: `${SENSORY_COLORS[type as SensoryType]}20` }}
                    >
                      {SENSORY_ICONS[type as SensoryType]}
                    </div>
                    <div>
                      <div className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                      <div className="text-sm text-gray-500">{count} words ({Math.round(count / total * 100)}%)</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
              <h4 className="text-sm font-medium mb-2">Sensory Balance Analysis</h4>
              <p className="text-sm text-gray-500">
                {total === 0 ? (
                  "No sensory language detected in these lyrics."
                ) : (
                  <>
                    These lyrics use primarily <strong>{
                      Object.entries(counts)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 2)
                        .map(([type]) => type)
                        .join(' and ')
                    }</strong> sensory language.
                    {Object.values(counts).some(c => c === 0) && (
                      <> Consider adding more sensory details for <strong>{
                        Object.entries(counts)
                          .filter(([_, count]) => count === 0)
                          .map(([type]) => type)
                          .join(', ')
                      }</strong> to create a more immersive experience.</>
                    )}
                  </>
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No sensory language detected. Consider adding sensory details to create more vivid lyrics.
          </div>
        )}
      </div>
    );
  };
  
  const renderHighlightedLyrics = () => {
    const lines = lyrics.split('\n');
    
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-1 p-1">
          {lines.map((line, lineIndex) => {
            // Check if this is a section title
            const isSectionTitle = line.trim().match(/^\[.*\]$/);
            
            if (isSectionTitle) {
              // Render section title differently
              return (
                <div 
                  key={lineIndex}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-center font-medium my-2"
                >
                  {line}
                </div>
              );
            }
            
            // Find all sensory words in this line
            const lineWords = sensoryWords.filter(word => word.lineIndex === lineIndex);
            
            // If no sensory words and not editing, render plain line
            if (lineWords.length === 0 && (!isEditable || !isEditing)) {
              return (
                <div 
                  key={lineIndex}
                  className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 w-8">{lineIndex + 1}</span>
                    <span>{line}</span>
                  </div>
                </div>
              );
            }
            
            // If editing or has sensory words, render with enhanced UI
            return (
              <div 
                key={lineIndex}
                className="p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 group"
              >
                <div className="flex items-start gap-2">
                  <span className="text-xs text-gray-500 w-8">{lineIndex + 1}</span>
                  <div className="flex-1">
                    {getLineWithHighlightedWords(line, lineIndex)}
                    
                    {lineWords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lineWords.map((word, idx) => (
                          <Badge 
                            key={idx}
                            variant="outline" 
                            className="text-xs flex items-center gap-1"
                            style={{ 
                              borderColor: SENSORY_COLORS[word.sensoryType],
                              color: SENSORY_COLORS[word.sensoryType]
                            }}
                          >
                            <span 
                              className="h-2 w-2 rounded-full" 
                              style={{ backgroundColor: SENSORY_COLORS[word.sensoryType] }}
                            />
                            {word.sensoryType}
                            {isEditable && isEditing && (
                              <button 
                                className="ml-1 text-gray-400 hover:text-gray-600"
                                onClick={() => toggleSensoryWord(word)}
                              >
                                ×
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {isEditable && isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          // In a real app, this would open a dialog to select the sensory type
                          const type = prompt('Enter sensory type (sight, sound, touch, taste, smell, motion, emotion)') as SensoryType;
                          const word = prompt('Enter the word to highlight');
                          if (type && SENSORY_COLORS[type] && word) {
                            addSensoryWord(lineIndex, 0, word, type);
                          }
                        }}
                      >
                        + Add
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };
  
  const renderSensoryTypeTab = (type: SensoryType) => {
    const wordsOfType = sensoryWords.filter(word => word.sensoryType === type);
    
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <h3 className="text-lg font-medium" style={{ color: SENSORY_COLORS[type] }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Language
          </h3>
          <p className="text-sm text-gray-500">
            {wordsOfType.length > 0 ? (
              `Found ${wordsOfType.length} instances of ${type} sensory language.`
            ) : (
              `No ${type} sensory language detected in these lyrics.`
            )}
          </p>
        </div>
        
        {wordsOfType.length > 0 ? (
          <div className="space-y-2">
            {wordsOfType.map((word, index) => {
              const line = lyrics.split('\n')[word.lineIndex];
              return (
                <div key={index} className="border rounded-md p-3">
                  <div className="mb-1">
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        borderColor: SENSORY_COLORS[type],
                        color: SENSORY_COLORS[type]
                      }}
                    >
                      {word.word}
                    </Badge>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Line {word.lineIndex + 1}: </span>
                    {line}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border rounded-md p-4 text-center text-gray-500">
            <p>No {type} sensory language found</p>
            <p className="text-sm mt-2">Try incorporating some {type} descriptions to enhance your lyrics.</p>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mt-6">
          <h4 className="text-sm font-medium mb-2">Tips for Adding {type.charAt(0).toUpperCase() + type.slice(1)} Language</h4>
          <ul className="space-y-1 text-sm">
            {type === 'sight' && (
              <>
                <li>Describe colors, shapes, and visual textures</li>
                <li>Use visual metaphors to create imagery</li>
                <li>Incorporate light, shadow, and visual contrasts</li>
                <li>Describe what characters see and observe</li>
              </>
            )}
            {type === 'sound' && (
              <>
                <li>Include descriptions of noises, voices, and music</li>
                <li>Use onomatopoeia to mimic sounds</li>
                <li>Describe the quality and volume of sounds</li>
                <li>Mention sounds from the environment</li>
              </>
            )}
            {type === 'touch' && (
              <>
                <li>Describe textures, temperatures, and physical sensations</li>
                <li>Include feelings of comfort or discomfort</li>
                <li>Mention the physical interaction between people</li>
                <li>Describe how objects feel against the skin</li>
              </>
            )}
            {type === 'taste' && (
              <>
                <li>Incorporate flavors and tastes in descriptions</li>
                <li>Use taste as metaphors for experiences</li>
                <li>Describe foods, drinks, and their flavors</li>
                <li>Include surprising or unexpected taste comparisons</li>
              </>
            )}
            {type === 'smell' && (
              <>
                <li>Describe scents, fragrances, and odors</li>
                <li>Use smell to evoke memory and emotion</li>
                <li>Include environmental smells to set the scene</li>
                <li>Connect smells to people, places, or emotions</li>
              </>
            )}
            {type === 'motion' && (
              <>
                <li>Describe how things move, flow, or change</li>
                <li>Use dynamic verbs to create movement</li>
                <li>Include rhythm and pace in descriptions</li>
                <li>Describe body language and physical actions</li>
              </>
            )}
            {type === 'emotion' && (
              <>
                <li>Directly name feelings and emotional states</li>
                <li>Describe physical manifestations of emotions</li>
                <li>Use metaphors to convey complex emotions</li>
                <li>Connect emotional responses to events in the lyrics</li>
              </>
            )}
          </ul>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sensory Language Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analyze the use of sensory language (sight, sound, touch, taste, smell, motion, emotion)</p>
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
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="w-full overflow-x-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="highlighted">Highlighted Lyrics</TabsTrigger>
            <TabsTrigger value="sight">Sight</TabsTrigger>
            <TabsTrigger value="sound">Sound</TabsTrigger>
            <TabsTrigger value="touch">Touch</TabsTrigger>
            <TabsTrigger value="taste">Taste</TabsTrigger>
            <TabsTrigger value="smell">Smell</TabsTrigger>
            <TabsTrigger value="motion">Motion</TabsTrigger>
            <TabsTrigger value="emotion">Emotion</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            {renderSensoryOverview()}
          </TabsContent>
          
          <TabsContent value="highlighted">
            {renderHighlightedLyrics()}
          </TabsContent>
          
          <TabsContent value="sight">
            {renderSensoryTypeTab('sight')}
          </TabsContent>
          
          <TabsContent value="sound">
            {renderSensoryTypeTab('sound')}
          </TabsContent>
          
          <TabsContent value="touch">
            {renderSensoryTypeTab('touch')}
          </TabsContent>
          
          <TabsContent value="taste">
            {renderSensoryTypeTab('taste')}
          </TabsContent>
          
          <TabsContent value="smell">
            {renderSensoryTypeTab('smell')}
          </TabsContent>
          
          <TabsContent value="motion">
            {renderSensoryTypeTab('motion')}
          </TabsContent>
          
          <TabsContent value="emotion">
            {renderSensoryTypeTab('emotion')}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 