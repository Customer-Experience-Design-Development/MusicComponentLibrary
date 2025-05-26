import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Info, Download, Plus, X, Edit, Save } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { cn } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  ArcElement, 
  ChartTooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

// Enhanced thematic categories with more nuanced detection
const THEMATIC_CATEGORIES: Record<string, {
  keywords: string[],
  color: string,
  description: string
}> = {
  love: {
    keywords: [
      'love', 'heart', 'affection', 'romance', 'passion', 'desire', 'adore',
      'relationship', 'companion', 'partner', 'lover', 'kiss', 'embrace', 'caress',
      'together', 'forever', 'romantic', 'enchanted', 'infatuated', 'smitten',
      'cherish', 'darling', 'beloved', 'devotion', 'intimate', 'attachment',
      'crush', 'attraction', 'chemistry', 'feelings', 'fond', 'care'
    ],
    color: '#e91e63',
    description: 'Expressions of romantic love, affection, and attraction'
  },
  loss: {
    keywords: [
      'loss', 'lost', 'gone', 'missing', 'empty', 'alone', 'lonely', 'abandon',
      'goodbye', 'farewell', 'away', 'departed', 'vanished', 'disappear',
      'without', 'absence', 'void', 'hole', 'memory', 'remember', 'forget',
      'past', 'never', 'anymore', 'broke', 'broken', 'shattered', 'grief',
      'mourn', 'miss', 'end', 'ended', 'over', 'distance', 'apart'
    ],
    color: '#673ab7',
    description: 'Themes of absence, separation, and grief'
  },
  growth: {
    keywords: [
      'grow', 'growing', 'growth', 'change', 'evolve', 'develop', 'learn',
      'journey', 'path', 'road', 'way', 'forward', 'future', 'better',
      'stronger', 'wiser', 'lesson', 'experience', 'understand', 'realize',
      'discover', 'find', 'seek', 'search', 'quest', 'adventure', 'transform',
      'become', 'potential', 'emerge', 'bloom', 'blossom', 'rise', 'overcome'
    ],
    color: '#4caf50',
    description: 'Personal development, transformation, and positive change'
  },
  struggle: {
    keywords: [
      'struggle', 'fight', 'battle', 'war', 'conflict', 'challenge', 'obstacle',
      'difficult', 'hard', 'tough', 'pain', 'suffer', 'hurt', 'wound', 'scar',
      'trauma', 'burden', 'weight', 'heavy', 'carry', 'bear', 'endure', 'survive',
      'resist', 'against', 'opposition', 'enemy', 'foe', 'adversary', 'opponent'
    ],
    color: '#f44336',
    description: 'Facing difficulties, resistance, and personal battles'
  },
  identity: {
    keywords: [
      'self', 'identity', 'who', 'person', 'individual', 'unique', 'special',
      'different', 'authentic', 'genuine', 'real', 'true', 'truth', 'honest',
      'soul', 'spirit', 'character', 'nature', 'essence', 'core', 'inside',
      'within', 'deep', 'hidden', 'reveal', 'discover', 'find', 'search',
      'question', 'answer', 'mirror', 'reflection', 'image', 'face'
    ],
    color: '#ff9800',
    description: 'Self-discovery, authenticity, and personal truth'
  },
  time: {
    keywords: [
      'time', 'day', 'night', 'hour', 'minute', 'second', 'moment', 'instant',
      'now', 'present', 'past', 'future', 'before', 'after', 'then', 'when',
      'always', 'never', 'forever', 'eternal', 'temporary', 'fleeting', 'brief',
      'short', 'long', 'wait', 'patience', 'delay', 'rush', 'speed', 'slow', 'fast'
    ],
    color: '#00bcd4',
    description: 'Experiences of temporality, memory, and anticipation'
  },
  nature: {
    keywords: [
      'nature', 'earth', 'world', 'land', 'ground', 'soil', 'dirt', 'dust',
      'mountain', 'hill', 'valley', 'forest', 'tree', 'wood', 'leaf', 'flower',
      'plant', 'seed', 'root', 'grow', 'river', 'lake', 'ocean', 'sea', 'water',
      'rain', 'storm', 'wind', 'breeze', 'air', 'sky', 'cloud', 'sun', 'moon',
      'star', 'light', 'dark', 'animal', 'bird', 'fish', 'season', 'spring',
      'summer', 'autumn', 'fall', 'winter', 'weather', 'climate'
    ],
    color: '#8bc34a',
    description: 'Connection to the natural world and environment'
  },
  freedom: {
    keywords: [
      'free', 'freedom', 'liberty', 'escape', 'release', 'liberate', 'break',
      'chain', 'bound', 'trap', 'cage', 'prison', 'confine', 'restrict', 'limit',
      'barrier', 'wall', 'fence', 'border', 'boundary', 'open', 'space', 'wide',
      'vast', 'unlimited', 'infinite', 'endless', 'choice', 'option', 'decision',
      'choose', 'path', 'road', 'journey', 'adventure', 'explore', 'discover'
    ],
    color: '#03a9f4',
    description: 'Liberation, independence, and escape from constraints'
  },
  hope: {
    keywords: [
      'hope', 'wish', 'dream', 'aspire', 'desire', 'want', 'need', 'long',
      'yearn', 'optimism', 'positive', 'bright', 'light', 'shine', 'glow',
      'believe', 'faith', 'trust', 'confident', 'assured', 'certain', 'promise',
      'future', 'tomorrow', 'ahead', 'forward', 'upward', 'rise', 'climb',
      'better', 'improve', 'change', 'new', 'fresh', 'start', 'begin', 'dawn'
    ],
    color: '#ffeb3b',
    description: 'Optimism, aspiration, and faith in possibilities'
  },
  despair: {
    keywords: [
      'despair', 'hopeless', 'lost', 'doom', 'dark', 'darkness', 'shadow', 'black',
      'night', 'fear', 'afraid', 'terror', 'dread', 'horror', 'panic', 'anxiety',
      'worry', 'stress', 'pressure', 'pain', 'hurt', 'suffer', 'agony', 'torment',
      'torture', 'hell', 'abyss', 'void', 'empty', 'hollow', 'numb', 'cold', 'freeze',
      'winter', 'death', 'die', 'dead', 'grave', 'tomb', 'end', 'final', 'terminal'
    ],
    color: '#607d8b',
    description: 'Darkness, fear, and the absence of hope'
  }
};

// Define the DEFAULT_THEMES constant based on THEMATIC_CATEGORIES
const DEFAULT_THEMES = Object.entries(THEMATIC_CATEGORIES).map(([id, category]) => ({
  id,
  name: id.charAt(0).toUpperCase() + id.slice(1), // Capitalize the first letter
  color: category.color,
  keywords: category.keywords
}));

interface Theme {
  id: string;
  name: string;
  color: string;
  keywords?: string[];
}

interface ThemeOccurrence {
  themeId: string;
  lineNumber: number;
  text: string;
}

interface ThematicAnalysisProps {
  lyrics: string;
  className?: string;
  isEditable?: boolean;
  onSave?: (themes: Theme[], occurrences: ThemeOccurrence[]) => void;
}

export function ThematicAnalysis({
  lyrics,
  className = '',
  isEditable = false,
  onSave
}: ThematicAnalysisProps) {
  const [themes, setThemes] = useState<Theme[]>(() => {
    // Use DEFAULT_THEMES as the initial state
    return DEFAULT_THEMES;
  });
  const [occurrences, setOccurrences] = useState<ThemeOccurrence[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [newTheme, setNewTheme] = useState<Partial<Theme>>({ name: '', color: '#94A3B8' });
  const [currentTab, setCurrentTab] = useState<string>('overview');
  
  const lines = lyrics.split('\n').filter(line => line.trim());
  
  useEffect(() => {
    // Auto-detect themes when component mounts
    if (occurrences.length === 0) {
      autoDetectThemes();
    }
  }, []);
  
  const autoDetectThemes = () => {
    const newOccurrences: ThemeOccurrence[] = [];
    
    lines.forEach((line, lineIndex) => {
      // Skip section titles
      if (line.trim().match(/^\[.*\]$/)) {
        return;
      }
      
      const lowerLine = line.toLowerCase();
      
      themes.forEach(theme => {
        // Use keywords from theme object or from THEMATIC_CATEGORIES if available
        const keywords = theme.keywords || THEMATIC_CATEGORIES[theme.id]?.keywords || [];
        const found = keywords.some(keyword => lowerLine.includes(keyword));
        
        if (found) {
          newOccurrences.push({
            themeId: theme.id,
            lineNumber: lineIndex,
            text: line
          });
        }
      });
    });
    
    setOccurrences(newOccurrences);
  };
  
  const getThemeById = (id: string) => {
    return themes.find(t => t.id === id);
  };
  
  const getThemeOccurrences = (themeId: string) => {
    return occurrences.filter(o => o.themeId === themeId);
  };
  
  const getDistinctThemesInUse = () => {
    // Get distinct theme IDs without using Set
    const distinctThemeIds: string[] = [];
    occurrences.forEach(o => {
      if (!distinctThemeIds.includes(o.themeId)) {
        distinctThemeIds.push(o.themeId);
      }
    });
    
    return distinctThemeIds.map(id => getThemeById(id)).filter(Boolean) as Theme[];
  };
  
  const addTheme = () => {
    if (newTheme.name && newTheme.color) {
      const id = newTheme.name.toLowerCase().replace(/\s+/g, '-');
      setThemes([...themes, { id, name: newTheme.name, color: newTheme.color } as Theme]);
      setNewTheme({ name: '', color: '#94A3B8' });
    }
  };
  
  const removeTheme = (themeId: string) => {
    setThemes(themes.filter(t => t.id !== themeId));
    setOccurrences(occurrences.filter(o => o.themeId !== themeId));
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave(themes, occurrences);
    }
    setIsEditing(false);
  };
  
  const toggleThemeOnLine = (lineIndex: number, themeId: string) => {
    const existingIndex = occurrences.findIndex(
      o => o.lineNumber === lineIndex && o.themeId === themeId
    );
    
    if (existingIndex >= 0) {
      // Remove this theme from the line
      const newOccurrences = [...occurrences];
      newOccurrences.splice(existingIndex, 1);
      setOccurrences(newOccurrences);
    } else {
      // Add this theme to the line
      setOccurrences([
        ...occurrences,
        {
          themeId,
          lineNumber: lineIndex,
          text: lines[lineIndex]
        }
      ]);
    }
  };
  
  const renderThemeStats = () => {
    const themeCounts = getDistinctThemesInUse().map(theme => ({
      theme,
      count: getThemeOccurrences(theme.id).length
    }));
    
    // Sort by count, descending
    themeCounts.sort((a, b) => b.count - a.count);
    
    // Chart data
    const chartData = {
      labels: themeCounts.map(tc => tc.theme.name),
      datasets: [
        {
          data: themeCounts.map(tc => tc.count),
          backgroundColor: themeCounts.map(tc => tc.theme.color),
          borderColor: themeCounts.map(tc => tc.theme.color),
          borderWidth: 1,
        },
      ],
    };
    
    // Chart options
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
        <div className="flex justify-center h-64">
          {themeCounts.length > 0 ? (
            <Doughnut data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              No themes detected. Add themes in the edit mode.
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {themeCounts.map(({ theme, count }) => (
            <div key={theme.id} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.color }}
              />
              <span className="font-medium">{theme.name}</span>
              <span className="text-gray-500">({count} occurrences)</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderThemeFlow = () => {
    // Create a structure to track theme occurrences by line group (e.g., every 4 lines)
    const groupSize = 4; // Group lines by 4
    const groupCount = Math.ceil(lines.length / groupSize);
    const themesByGroup: Record<string, number[]> = {};
    
    // Initialize
    getDistinctThemesInUse().forEach(theme => {
      themesByGroup[theme.id] = Array(groupCount).fill(0);
    });
    
    // Fill in occurrences
    occurrences.forEach(o => {
      const groupIndex = Math.floor(o.lineNumber / groupSize);
      if (themesByGroup[o.themeId]) {
        themesByGroup[o.themeId][groupIndex]++;
      }
    });
    
    // X-axis labels (line groups)
    const labels = Array(groupCount).fill(0).map((_, i) => 
      `Lines ${i * groupSize + 1}-${Math.min((i + 1) * groupSize, lines.length)}`
    );
    
    // Prepare chart data
    const chartData = {
      labels,
      datasets: getDistinctThemesInUse().map(theme => ({
        label: theme.name,
        data: themesByGroup[theme.id],
        borderColor: theme.color,
        backgroundColor: `${theme.color}33`, // Add transparency
        tension: 0.2,
        fill: false,
      })),
    };
    
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: 'Theme Flow Throughout the Lyrics'
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Occurrences'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Lyric Sections'
          }
        }
      }
    };
    
    return (
      <div className="w-full h-64">
        {Object.keys(themesByGroup).length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No themes detected. Add themes in the edit mode.
          </div>
        )}
      </div>
    );
  };
  
  const renderLinesWithThemes = () => {
    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-1 p-1">
          {lines.map((line, index) => {
            // Check if this is a section title
            const isSectionTitle = line.trim().match(/^\[.*\]$/);
            
            if (isSectionTitle) {
              // Render section title differently
              return (
                <div 
                  key={index}
                  className="p-2 rounded-md bg-gray-100 dark:bg-gray-800 text-center font-medium my-2"
                >
                  {line}
                </div>
              );
            }
            
            const lineThemes = occurrences
              .filter(o => o.lineNumber === index)
              .map(o => getThemeById(o.themeId)!);
            
            return (
              <div 
                key={index}
                className={cn(
                  "p-2 rounded-md group hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent",
                  lineThemes.length > 0 && "bg-gray-50 dark:bg-gray-800/50"
                )}
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 mt-1 w-8">{index + 1}</span>
                    <span className="flex-1">{line}</span>
                  </div>
                  
                  {isEditable && isEditing && (
                    <div className="relative">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      
                      <div className="absolute right-0 top-8 z-10 p-2 bg-white dark:bg-gray-900 border rounded-md shadow-lg hidden group-hover:block min-w-[150px]">
                        <div className="space-y-1">
                          {themes.map(theme => (
                            <div 
                              key={theme.id}
                              className={cn(
                                "flex items-center gap-2 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer",
                                lineThemes.some(t => t.id === theme.id) && "bg-gray-100 dark:bg-gray-800"
                              )}
                              onClick={() => toggleThemeOnLine(index, theme.id)}
                            >
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: theme.color }} 
                              />
                              <span className="text-sm">{theme.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {lineThemes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 ml-10">
                    {lineThemes.map(theme => (
                      <Badge 
                        key={theme.id}
                        variant="outline"
                        className="flex items-center gap-1.5 text-xs px-2 py-0.5"
                        style={{ 
                          borderColor: theme.color,
                          color: theme.color 
                        }}
                      >
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: theme.color }} 
                        />
                        {theme.name}
                        {isEditable && isEditing && (
                          <X 
                            className="h-3 w-3 cursor-pointer ml-1 hover:text-gray-500" 
                            onClick={() => toggleThemeOnLine(index, theme.id)}
                          />
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
  };
  
  const renderThemeManagement = () => {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Available Themes</h3>
            
            <div className="border rounded-md h-64 overflow-y-auto p-2">
              {themes.map(theme => (
                <div 
                  key={theme.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: theme.color }} 
                    />
                    <span>{theme.name}</span>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => removeTheme(theme.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Add New Theme</h3>
            
            <div className="space-y-3 border rounded-md p-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Theme Name</label>
                <Input 
                  value={newTheme.name} 
                  onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                  placeholder="Enter theme name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newTheme.color}
                    onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
                    className="w-12 h-9 rounded border p-1 bg-white"
                  />
                  <Input 
                    value={newTheme.color} 
                    onChange={(e) => setNewTheme({ ...newTheme, color: e.target.value })}
                    placeholder="#RRGGBB"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <Button 
                variant="default" 
                size="sm" 
                className="w-full"
                disabled={!newTheme.name}
                onClick={addTheme}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Theme
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Thematic Analysis</CardTitle>
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Analysis of thematic elements and motifs in the lyrics</p>
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
          value={currentTab}
          onValueChange={setCurrentTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flow">Theme Flow</TabsTrigger>
            <TabsTrigger value="lyrics">Annotated Lyrics</TabsTrigger>
            {isEditable && isEditing && (
              <TabsTrigger value="manage">Manage Themes</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview">
            {renderThemeStats()}
          </TabsContent>
          
          <TabsContent value="flow">
            {renderThemeFlow()}
          </TabsContent>
          
          <TabsContent value="lyrics">
            {renderLinesWithThemes()}
          </TabsContent>
          
          {isEditable && (
            <TabsContent value="manage">
              {renderThemeManagement()}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
} 