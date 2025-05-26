import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info, Edit, Save, Download, Plus, X, BookOpen } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type FigurativeType = 'metaphor' | 'simile' | 'personification' | 'hyperbole' | 'symbolism' | 'idiom' | 'other';

interface FigurativeLanguage {
  id: string;
  type: FigurativeType;
  text: string;
  explanation: string;
  lineIndex: number;
  startIndex: number;
  endIndex: number;
}

interface MetaphorAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (figures: FigurativeLanguage[]) => void;
}

const TYPE_COLORS: Record<FigurativeType, string> = {
  metaphor: '#3b82f6', // blue
  simile: '#10b981', // green
  personification: '#8b5cf6', // purple
  hyperbole: '#f59e0b', // amber
  symbolism: '#ec4899', // pink
  idiom: '#64748b', // slate
  other: '#6b7280', // gray
};

export function MetaphorAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave
}: MetaphorAnalysisProps) {
  const [figures, setFigures] = useState<FigurativeLanguage[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [newFigure, setNewFigure] = useState<Partial<FigurativeLanguage>>({
    type: 'metaphor',
    text: '',
    explanation: ''
  });
  
  const lines = lyrics.split('\n');
  
  useEffect(() => {
    // Auto-detect obvious similes when component mounts
    if (figures.length === 0) {
      detectFigurativeLanguage();
    }
  }, []);
  
  const generateId = () => {
    return Math.random().toString(36).substring(2, 9);
  };
  
  const detectFigurativeLanguage = () => {
    const detectedFigures: FigurativeLanguage[] = [];
    
    lines.forEach((line, lineIndex) => {
      // Skip section titles
      if (line.trim().match(/^\[.*\]$/)) {
        return;
      }
      
      // Detect similes with "like" or "as"
      const likeMatches = line.match(/\b\w+\s+like\s+\w+/gi);
      const asMatches = line.match(/\b\w+\s+as\s+\w+\s+as\s+\w+/gi);
      
      if (likeMatches) {
        likeMatches.forEach(match => {
          const startIndex = line.indexOf(match);
          
          detectedFigures.push({
            id: generateId(),
            type: 'simile',
            text: match,
            explanation: 'Comparison using "like"',
            lineIndex,
            startIndex,
            endIndex: startIndex + match.length
          });
        });
      }
      
      if (asMatches) {
        asMatches.forEach(match => {
          const startIndex = line.indexOf(match);
          
          detectedFigures.push({
            id: generateId(),
            type: 'simile',
            text: match,
            explanation: 'Comparison using "as...as"',
            lineIndex,
            startIndex,
            endIndex: startIndex + match.length
          });
        });
      }
      
      // Add more detection logic for other types as needed
    });
    
    setFigures(detectedFigures);
  };
  
  const addFigure = () => {
    if (!newFigure.text || !newFigure.type || selectedLine === null) return;
    
    const line = lines[selectedLine];
    const startIndex = line.indexOf(newFigure.text);
    
    if (startIndex >= 0) {
      const figure: FigurativeLanguage = {
        id: generateId(),
        type: newFigure.type as FigurativeType,
        text: newFigure.text,
        explanation: newFigure.explanation || '',
        lineIndex: selectedLine,
        startIndex,
        endIndex: startIndex + newFigure.text.length
      };
      
      setFigures([...figures, figure]);
      setNewFigure({
        type: 'metaphor',
        text: '',
        explanation: ''
      });
      setSelectedLine(null);
    }
  };
  
  const removeFigure = (id: string) => {
    setFigures(figures.filter(f => f.id !== id));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(figures);
    }
    setIsEditing(false);
  };
  
  const getFiguresForLine = (lineIndex: number) => {
    return figures.filter(f => f.lineIndex === lineIndex);
  };
  
  const getFiguresGroupedByType = () => {
    const grouped: Record<FigurativeType, FigurativeLanguage[]> = {
      metaphor: [],
      simile: [],
      personification: [],
      hyperbole: [],
      symbolism: [],
      idiom: [],
      other: []
    };
    
    figures.forEach(figure => {
      grouped[figure.type].push(figure);
    });
    
    return grouped;
  };
  
  const getCounts = () => {
    const counts: Record<FigurativeType, number> = {
      metaphor: 0,
      simile: 0,
      personification: 0,
      hyperbole: 0,
      symbolism: 0,
      idiom: 0,
      other: 0
    };
    
    figures.forEach(figure => {
      counts[figure.type]++;
    });
    
    return counts;
  };
  
  const getExplanationForType = (type: FigurativeType): string => {
    switch (type) {
      case 'metaphor':
        return 'Direct comparison without using "like" or "as"';
      case 'simile':
        return 'Comparison using "like" or "as"';
      case 'personification':
        return 'Giving human attributes to non-human things';
      case 'hyperbole':
        return 'Extreme exaggeration for emphasis';
      case 'symbolism':
        return 'Using one thing to represent another';
      case 'idiom':
        return 'Phrase with a non-literal meaning';
      default:
        return 'Other figurative language';
    }
  };
  
  const renderLyricAnalysis = () => {
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
            
            const lineFigures = getFiguresForLine(lineIndex);
            const isSelected = selectedLine === lineIndex;
            
            return (
              <div 
                key={lineIndex}
                className={cn(
                  "p-2 border rounded-md transition-colors",
                  isSelected && "border-primary",
                  lineFigures.length > 0 && !isSelected && "border-gray-200 dark:border-gray-700",
                  !lineFigures.length && !isSelected && "border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                )}
              >
                <div className="flex items-start justify-between gap-2 group">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-xs text-gray-500 mt-1 w-8">{lineIndex + 1}</span>
                    <div className="flex-1">
                      <div>{line}</div>
                      
                      {lineFigures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lineFigures.map(figure => (
                            <Badge 
                              key={figure.id}
                              variant="outline" 
                              className="text-xs flex items-center gap-1"
                              style={{ 
                                borderColor: TYPE_COLORS[figure.type],
                                color: TYPE_COLORS[figure.type]
                              }}
                            >
                              <span className="capitalize">{figure.type}</span>
                              {isEditing && (
                                <button 
                                  className="ml-1 text-gray-400 hover:text-gray-600"
                                  onClick={() => removeFigure(figure.id)}
                                >
                                  ×
                                </button>
                              )}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {lineFigures.length > 0 && (
                        <div className="space-y-1 mt-2">
                          {lineFigures.map(figure => (
                            <div key={figure.id} className="ml-4 pl-2 border-l text-sm text-gray-600 dark:text-gray-400">
                              <span className="inline-block mr-1">•</span>
                              <span className="font-medium">{figure.text}:</span> {figure.explanation}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditable && isEditing && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setSelectedLine(isSelected ? null : lineIndex)}
                    >
                      {isSelected ? 'Cancel' : 'Add'}
                    </Button>
                  )}
                </div>
                
                {isSelected && (
                  <div className="mt-3 p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                    <h4 className="text-sm font-medium mb-2">Add Figurative Language</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium block mb-1">Text</label>
                        <Input
                          value={newFigure.text}
                          onChange={(e) => setNewFigure({ ...newFigure, text: e.target.value })}
                          placeholder="Enter the text containing figurative language"
                          className="text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium block mb-1">Type</label>
                        <Select
                          value={newFigure.type}
                          onValueChange={(value) => setNewFigure({ ...newFigure, type: value as FigurativeType })}
                        >
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="metaphor">Metaphor</SelectItem>
                            <SelectItem value="simile">Simile</SelectItem>
                            <SelectItem value="personification">Personification</SelectItem>
                            <SelectItem value="hyperbole">Hyperbole</SelectItem>
                            <SelectItem value="symbolism">Symbolism</SelectItem>
                            <SelectItem value="idiom">Idiom</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium block mb-1">Explanation</label>
                        <Input
                          value={newFigure.explanation}
                          onChange={(e) => setNewFigure({ ...newFigure, explanation: e.target.value })}
                          placeholder="Explain the figurative language"
                          className="text-sm"
                        />
                      </div>
                      
                      <Button 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={addFigure}
                        disabled={!newFigure.text}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };
  
  const renderTypeAnalysis = () => {
    const counts = getCounts();
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(counts).map(([type, count]) => (
            <div 
              key={type}
              className={cn(
                "border rounded-md p-3 transition-colors",
                count > 0 ? "border-gray-200 dark:border-gray-700" : "border-gray-100 dark:border-gray-800 opacity-60"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="font-medium capitalize">{type}</div>
                <Badge variant="secondary">{count}</Badge>
              </div>
              <div 
                className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-800 mt-2 overflow-hidden"
              >
                <div 
                  className="h-full rounded-full" 
                  style={{ 
                    backgroundColor: TYPE_COLORS[type as FigurativeType],
                    width: total ? `${(count / total) * 100}%` : '0%'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-2">Figurative Language Analysis</h4>
          <p className="text-sm text-gray-500">
            {total > 0 ? (
              <>
                These lyrics contain {total} instances of figurative language, 
                predominantly {
                  Object.entries(counts)
                    .sort(([_, a], [__, b]) => b - a)
                    .slice(0, 2)
                    .map(([type, _]) => type)
                    .join(' and ')
                }.
                {total < 5 && " Consider adding more figurative language to enhance imagery and emotion."}
              </>
            ) : (
              "No figurative language detected. Consider adding metaphors, similes, and other figurative devices to create more vivid imagery."
            )}
          </p>
        </div>
      </div>
    );
  };
  
  const renderGuide = () => {
    return (
      <div className="space-y-6">
        <div className="prose dark:prose-invert max-w-none text-sm">
          <p>
            <strong>Figurative language</strong> uses words in non-literal ways to create vivid imagery and emotional impact.
            Effective lyrics often employ these devices to convey complex ideas and emotions through comparison,
            exaggeration, and symbolism.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.keys(TYPE_COLORS).map(type => (
            <div 
              key={type}
              className="border rounded-md p-3"
              style={{ borderColor: `${TYPE_COLORS[type as FigurativeType]}50` }}
            >
              <h4 
                className="text-sm font-medium mb-1 capitalize"
                style={{ color: TYPE_COLORS[type as FigurativeType] }}
              >
                {type}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {getExplanationForType(type as FigurativeType)}
              </p>
              <div className="text-xs text-gray-500">
                {type === 'metaphor' && "Example: \"Her heart is ice\" (direct comparison)"}
                {type === 'simile' && "Example: \"Fly like an eagle\" (comparison using 'like')"}
                {type === 'personification' && "Example: \"The wind whispered secrets\" (giving wind human ability)"}
                {type === 'hyperbole' && "Example: \"I've told you a million times\" (extreme exaggeration)"}
                {type === 'symbolism' && "Example: \"The rose in her hand\" (rose symbolizing love)"}
                {type === 'idiom' && "Example: \"Break a leg\" (non-literal expression)"}
                {type === 'other' && "Any other non-literal language devices"}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4">
          <h4 className="text-sm font-medium mb-2 flex items-center">
            <BookOpen className="h-4 w-4 mr-1" /> Pat Pattison's Tips
          </h4>
          <div className="space-y-3 text-sm">
            <p>
              According to Pat Pattison's writing methods, figurative language is essential for creating
              memorable lyrics that resonate emotionally with listeners.
            </p>
            <ul className="space-y-1 list-disc pl-5">
              <li>Use metaphors that appeal to the senses (sensory metaphors)</li>
              <li>Develop extended metaphors throughout your lyrics</li>
              <li>Balance concrete and abstract language</li>
              <li>Mix different types of figurative language for variety</li>
              <li>Avoid clichés by creating fresh, unexpected comparisons</li>
              <li>Use figurative language that supports your song's core message</li>
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
          <CardTitle>Figurative Language Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analyze metaphors, similes, and other figurative language in your lyrics</p>
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
        <Tabs defaultValue="lyric-analysis" className="space-y-4">
          <TabsList>
            <TabsTrigger value="lyric-analysis">Lyric Analysis</TabsTrigger>
            <TabsTrigger value="type-analysis">By Type</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lyric-analysis">
            {renderLyricAnalysis()}
          </TabsContent>
          
          <TabsContent value="type-analysis">
            {renderTypeAnalysis()}
          </TabsContent>
          
          <TabsContent value="guide">
            {renderGuide()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 