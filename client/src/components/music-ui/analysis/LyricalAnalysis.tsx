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

interface LyricalAnalysisProps {
  lyrics: string;
  className?: string;
}

interface LyricalMetrics {
  wordCount: number;
  uniqueWords: number;
  averageWordLength: number;
  averageLineLength: number;
  rhymeDensity: number;
  sentimentScore: number;
  themeDistribution: {
    [theme: string]: number;
  };
  wordFrequency: {
    [word: string]: number;
  };
  rhymePatterns: {
    pattern: string;
    frequency: number;
  }[];
}

// Common themes in music
const THEMES = [
  'love', 'heartbreak', 'empowerment', 'social', 'political',
  'personal', 'spiritual', 'nature', 'party', 'nostalgia',
  'struggle', 'success', 'family', 'friendship', 'identity'
];

// Common rhyme patterns
const RHYME_PATTERNS = [
  'AABB', 'ABAB', 'ABBA', 'ABCB', 'AAAA',
  'AABA', 'ABAC', 'ABCD', 'ABAA', 'ABBB'
];

export function LyricalAnalysis({
  lyrics,
  className = ''
}: LyricalAnalysisProps) {
  const [metrics, setMetrics] = useState<LyricalMetrics>(() => analyzeLyrics(lyrics));

  function analyzeLyrics(lyrics: string): LyricalMetrics {
    // Split lyrics into lines and words
    const lines = lyrics.split('\n').filter(line => line.trim());
    const words = lyrics.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Basic metrics
    const wordCount = words.length;
    const uniqueWords = new Set(words).size;
    const averageWordLength = words.reduce((sum, word) => sum + word.length, 0) / wordCount;
    const averageLineLength = lines.reduce((sum, line) => sum + line.split(/\s+/).length, 0) / lines.length;
    
    // Calculate rhyme density
    const endWords = lines.map(line => {
      const words = line.trim().split(/\s+/);
      return words[words.length - 1].toLowerCase();
    });
    
    let rhymeCount = 0;
    for (let i = 0; i < endWords.length - 1; i++) {
      if (endWords[i] === endWords[i + 1]) {
        rhymeCount++;
      }
    }
    const rhymeDensity = rhymeCount / (lines.length - 1);
    
    // Calculate sentiment score (simplified)
    const positiveWords = new Set(['love', 'happy', 'joy', 'beautiful', 'wonderful', 'amazing', 'great']);
    const negativeWords = new Set(['hate', 'sad', 'pain', 'hurt', 'bad', 'terrible', 'awful']);
    
    let sentimentScore = 0;
    words.forEach(word => {
      if (positiveWords.has(word)) sentimentScore++;
      if (negativeWords.has(word)) sentimentScore--;
    });
    sentimentScore = (sentimentScore / wordCount) * 100;
    
    // Calculate theme distribution
    const themeDistribution: { [theme: string]: number } = {};
    THEMES.forEach(theme => {
      const regex = new RegExp(`\\b${theme}\\b`, 'gi');
      const matches = lyrics.match(regex);
      themeDistribution[theme] = matches ? matches.length : 0;
    });
    
    // Calculate word frequency
    const wordFrequency: { [word: string]: number } = {};
    words.forEach(word => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });
    
    // Identify rhyme patterns
    const rhymePatterns = RHYME_PATTERNS.map(pattern => {
      let frequency = 0;
      for (let i = 0; i < lines.length - 3; i++) {
        const matches = pattern.split('').every((letter, j) => {
          const currentLine = lines[i + j].trim().split(/\s+/).pop()?.toLowerCase();
          const nextLine = lines[i + j + 1].trim().split(/\s+/).pop()?.toLowerCase();
          return letter === 'A' ? currentLine === nextLine : true;
        });
        if (matches) frequency++;
      }
      return { pattern, frequency };
    }).filter(rp => rp.frequency > 0);
    
    return {
      wordCount,
      uniqueWords,
      averageWordLength,
      averageLineLength,
      rhymeDensity,
      sentimentScore,
      themeDistribution,
      wordFrequency,
      rhymePatterns
    };
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lyrical Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Detailed analysis of lyrics including themes, patterns, and metrics.</p>
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
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="themes">Themes</TabsTrigger>
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Word Count</h4>
                  <Progress value={metrics.wordCount / 500 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.wordCount} words</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Unique Words</h4>
                  <Progress value={metrics.uniqueWords / metrics.wordCount * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.uniqueWords} unique words</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Average Word Length</h4>
                  <Progress value={metrics.averageWordLength / 10 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.averageWordLength.toFixed(1)} characters</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Average Line Length</h4>
                  <Progress value={metrics.averageLineLength / 20 * 100} />
                  <p className="text-sm text-neutral-500 mt-1">{metrics.averageLineLength.toFixed(1)} words</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Sentiment Analysis</h4>
                <Progress value={metrics.sentimentScore + 50} />
                <p className="text-sm text-neutral-500 mt-1">
                  {metrics.sentimentScore > 0 ? 'Positive' : metrics.sentimentScore < 0 ? 'Negative' : 'Neutral'} tone
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="themes">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(metrics.themeDistribution)
                  .filter(([_, count]) => count > 0)
                  .sort(([_, a], [__, b]) => b - a)
                  .map(([theme, count]) => (
                    <div key={theme}>
                      <h4 className="text-sm font-medium mb-2 capitalize">{theme}</h4>
                      <Progress value={count / 10 * 100} />
                      <p className="text-sm text-neutral-500 mt-1">{count} occurrences</p>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="patterns">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Rhyme Density</h4>
                <Progress value={metrics.rhymeDensity * 100} />
                <p className="text-sm text-neutral-500 mt-1">
                  {(metrics.rhymeDensity * 100).toFixed(1)}% of lines rhyme
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Common Rhyme Patterns</h4>
                <div className="space-y-2">
                  {metrics.rhymePatterns
                    .sort((a, b) => b.frequency - a.frequency)
                    .map(({ pattern, frequency }) => (
                      <div key={pattern}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{pattern}</span>
                          <span>{frequency} occurrences</span>
                        </div>
                        <Progress value={frequency / Math.max(...metrics.rhymePatterns.map(rp => rp.frequency)) * 100} />
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Most Used Words</h4>
                <div className="space-y-2">
                  {Object.entries(metrics.wordFrequency)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 5)
                    .map(([word, count]) => (
                      <div key={word}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{word}</span>
                          <span>{count} times</span>
                        </div>
                        <Progress value={count / Math.max(...Object.values(metrics.wordFrequency)) * 100} />
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