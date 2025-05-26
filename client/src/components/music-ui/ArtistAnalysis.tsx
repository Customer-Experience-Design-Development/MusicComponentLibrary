import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Artist } from '@/types/music';
import { 
  TrendingUp, 
  Music, 
  BarChart2, 
  PieChart, 
  MessageCircle, 
  Calendar, 
  Clock, 
  Sparkles,
  Mic2
} from 'lucide-react';

interface LyricsAnalysis {
  topThemes: { theme: string; count: number }[];
  moodDistribution: { mood: string; percentage: number }[];
  vocabularyRichness: number;
  averageWordCount: number;
  topWords: { word: string; count: number }[];
  rhymePatterns: { pattern: string; percentage: number }[];
}

interface SoundAnalysis {
  genreDistribution: { genre: string; percentage: number }[];
  tempo: { average: number; range: [number, number] };
  keyDistribution: { key: string; percentage: number }[];
  productionElements: { element: string; percentage: number }[];
  instrumentation: { instrument: string; prominence: number }[];
}

interface CareerAnalysis {
  evolutionByYear: { year: number; metric: string; value: number }[];
  collaborationNetwork: { artist: string; count: number }[];
  fanDemographics: { demographic: string; percentage: number }[];
  commercialPerformance: { metric: string; value: number; change: number }[];
  styleEvolution: { period: string; dominantStyles: string[] }[];
}

interface ArtistInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

interface ArtistAnalysisProps {
  artist: Artist;
  className?: string;
}

export function ArtistAnalysis({ artist, className = '' }: ArtistAnalysisProps) {
  const [lyricsAnalysis, setLyricsAnalysis] = useState<LyricsAnalysis | null>(null);
  const [soundAnalysis, setSoundAnalysis] = useState<SoundAnalysis | null>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);
  const [insights, setInsights] = useState<ArtistInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('all');
  
  useEffect(() => {
    // Mock data - in a real application, this would be fetched from an API
    const mockLyricsAnalysis: LyricsAnalysis = {
      topThemes: [
        { theme: "Love/Romance", count: 42 },
        { theme: "Personal Growth", count: 28 },
        { theme: "Relationships", count: 23 },
        { theme: "Partying", count: 18 },
        { theme: "Social Commentary", count: 15 }
      ],
      moodDistribution: [
        { mood: "Empowering", percentage: 35 },
        { mood: "Melancholic", percentage: 25 },
        { mood: "Upbeat", percentage: 20 },
        { mood: "Reflective", percentage: 15 },
        { mood: "Angry", percentage: 5 }
      ],
      vocabularyRichness: 0.72,
      averageWordCount: 312,
      topWords: [
        { word: "love", count: 127 },
        { word: "heart", count: 98 },
        { word: "night", count: 87 },
        { word: "feel", count: 76 },
        { word: "time", count: 72 }
      ],
      rhymePatterns: [
        { pattern: "AABB", percentage: 45 },
        { pattern: "ABAB", percentage: 30 },
        { pattern: "AAAA", percentage: 15 },
        { pattern: "Free form", percentage: 10 }
      ]
    };
    
    const mockSoundAnalysis: SoundAnalysis = {
      genreDistribution: [
        { genre: "Pop", percentage: 45 },
        { genre: "Electronic", percentage: 25 },
        { genre: "R&B", percentage: 15 },
        { genre: "Hip-Hop", percentage: 10 },
        { genre: "Alternative", percentage: 5 }
      ],
      tempo: { 
        average: 112, 
        range: [85, 130] 
      },
      keyDistribution: [
        { key: "C Major", percentage: 25 },
        { key: "A Minor", percentage: 20 },
        { key: "G Major", percentage: 15 },
        { key: "D Minor", percentage: 15 },
        { key: "Other", percentage: 25 }
      ],
      productionElements: [
        { element: "Electronic beats", percentage: 75 },
        { element: "Synthesizers", percentage: 65 },
        { element: "Vocal effects", percentage: 60 },
        { element: "Acoustic elements", percentage: 40 },
        { element: "Orchestral elements", percentage: 25 }
      ],
      instrumentation: [
        { instrument: "Synthesizer", prominence: 85 },
        { instrument: "Drum machine", prominence: 80 },
        { instrument: "Bass", prominence: 70 },
        { instrument: "Piano", prominence: 60 },
        { instrument: "Guitar", prominence: 45 }
      ]
    };
    
    const mockCareerAnalysis: CareerAnalysis = {
      evolutionByYear: [
        { year: 2019, metric: "Monthly Listeners", value: 2500000, },
        { year: 2020, metric: "Monthly Listeners", value: 5800000, },
        { year: 2021, metric: "Monthly Listeners", value: 8200000, },
        { year: 2022, metric: "Monthly Listeners", value: 10500000, },
        { year: 2023, metric: "Monthly Listeners", value: 12500000, }
      ],
      collaborationNetwork: [
        { artist: "Major Producer", count: 8 },
        { artist: "Featured Artist 1", count: 5 },
        { artist: "Featured Artist 2", count: 3 },
        { artist: "Featured Artist 3", count: 2 },
        { artist: "Various Others", count: 12 }
      ],
      fanDemographics: [
        { demographic: "18-24", percentage: 35 },
        { demographic: "25-34", percentage: 28 },
        { demographic: "35-44", percentage: 18 },
        { demographic: "13-17", percentage: 12 },
        { demographic: "45+", percentage: 7 }
      ],
      commercialPerformance: [
        { metric: "Total Streams", value: 1250000000, change: 22 },
        { metric: "Playlist Adds", value: 87500, change: 15 },
        { metric: "Radio Spins", value: 325000, change: 8 },
        { metric: "Social Growth", value: 540000, change: 32 }
      ],
      styleEvolution: [
        { period: "2015-2017", dominantStyles: ["Pop", "Dance"] },
        { period: "2018-2020", dominantStyles: ["Electronic", "Pop", "R&B elements"] },
        { period: "2021-present", dominantStyles: ["Electronic", "R&B", "Alternative influences"] }
      ]
    };
    
    const mockInsights: ArtistInsight[] = [
      {
        id: "insight-1",
        title: "Lyrical Evolution",
        description: "Your themes have evolved from primarily relationship-focused to more socially conscious over your last 3 albums.",
        category: "lyrics",
        icon: <MessageCircle className="h-5 w-5" />
      },
      {
        id: "insight-2",
        title: "Production Signature",
        description: "Your combination of electronic beats with orchestral elements creates a distinctive sound signature found in 85% of your tracks.",
        category: "sound",
        icon: <Music className="h-5 w-5" />
      },
      {
        id: "insight-3",
        title: "Commercial Strength",
        description: "Your tracks perform 43% better on streaming when released in Q2 compared to other quarters.",
        category: "career",
        icon: <TrendingUp className="h-5 w-5" />
      },
      {
        id: "insight-4",
        title: "Audience Growth Opportunity",
        description: "Your audience in the 35-44 demographic has grown 28% this year, suggesting potential for targeting this group.",
        category: "career",
        icon: <BarChart2 className="h-5 w-5" />
      },
      {
        id: "insight-5",
        title: "Collaboration Impact",
        description: "Collaborations with electronic producers boost your streams by an average of 32% compared to solo releases.",
        category: "career",
        icon: <PieChart className="h-5 w-5" />
      }
    ];
    
    // Simulate an API call delay
    if (isAnalyzing) {
      const timer = setTimeout(() => {
        setLyricsAnalysis(mockLyricsAnalysis);
        setSoundAnalysis(mockSoundAnalysis);
        setCareerAnalysis(mockCareerAnalysis);
        setInsights(mockInsights);
        setIsAnalyzing(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnalyzing, artist, selectedTimeRange]);
  
  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    // Reset previous analysis
    setLyricsAnalysis(null);
    setSoundAnalysis(null);
    setCareerAnalysis(null);
    setInsights([]);
  };
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Artist Analysis</h2>
          <p className="text-muted-foreground">
            Deep insights into {artist.name}'s musical style, lyrics, and career trends
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select 
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
              <SelectItem value="sixMonths">Past 6 Months</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleStartAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Analyzing...
              </>
            ) : (
              'Run Analysis'
            )}
          </Button>
        </div>
      </div>
      
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-xl font-medium mb-2">Analyzing Artist Data</p>
          <p className="text-muted-foreground text-center max-w-md">
            Processing lyrics, sound patterns, and career metrics to generate insights...
          </p>
        </div>
      ) : lyricsAnalysis && soundAnalysis && careerAnalysis ? (
        <div className="space-y-8">
          {/* Key Insights Cards */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-primary" />
              Key Insights
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {insights.map(insight => (
                <Card key={insight.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-normal capitalize">
                        {insight.category}
                      </Badge>
                      <div className="p-1.5 rounded-full bg-primary/10">
                        {insight.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-2">{insight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{insight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="lyrics" className="mt-8">
            <TabsList className="grid grid-cols-3 w-full max-w-md mb-4">
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
              <TabsTrigger value="sound">Sound</TabsTrigger>
              <TabsTrigger value="career">Career</TabsTrigger>
            </TabsList>
            
            {/* Lyrics Analysis Tab */}
            <TabsContent value="lyrics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Themes</CardTitle>
                    <CardDescription>
                      Most common themes in {artist.name}'s lyrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lyricsAnalysis.topThemes.map((theme, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{theme.theme}</span>
                            <span className="text-sm text-muted-foreground">{theme.count} songs</span>
                          </div>
                          <Progress 
                            value={(theme.count / lyricsAnalysis.topThemes[0].count) * 100}
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Mood Distribution</CardTitle>
                    <CardDescription>
                      Emotional tone across {artist.name}'s catalog
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {lyricsAnalysis.moodDistribution.map((mood, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{mood.mood}</span>
                            <span className="text-sm text-muted-foreground">{mood.percentage}%</span>
                          </div>
                          <Progress value={mood.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vocabulary Stats</CardTitle>
                    <CardDescription>
                      Lyrical complexity and word usage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">Vocabulary Richness</span>
                          <span className="text-sm font-medium">{(lyricsAnalysis.vocabularyRichness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={lyricsAnalysis.vocabularyRichness * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          Higher percentages indicate more diverse vocabulary
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Average Words Per Song</p>
                          <p className="text-2xl font-bold">{lyricsAnalysis.averageWordCount}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Most Used Words</CardTitle>
                    <CardDescription>
                      Frequently appearing words in lyrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {lyricsAnalysis.topWords.map((word, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                          style={{
                            fontSize: `${Math.max(0.8, Math.min(1.5, (word.count / lyricsAnalysis.topWords[0].count) * 1.5))}rem`
                          }}
                        >
                          {word.word}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Sound Analysis Tab */}
            <TabsContent value="sound" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Genre Distribution</CardTitle>
                    <CardDescription>
                      Musical styles across {artist.name}'s catalog
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {soundAnalysis.genreDistribution.map((genre, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{genre.genre}</span>
                            <span className="text-sm text-muted-foreground">{genre.percentage}%</span>
                          </div>
                          <Progress value={genre.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tempo Analysis</CardTitle>
                    <CardDescription>
                      Speed and rhythm patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Average BPM</p>
                          <p className="text-2xl font-bold">{soundAnalysis.tempo.average}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium mb-2">Tempo Range</p>
                        <div className="relative h-8 bg-muted rounded-full">
                          <div 
                            className="absolute bg-primary h-full rounded-full"
                            style={{
                              left: `${(soundAnalysis.tempo.range[0] / 200) * 100}%`,
                              right: `${100 - (soundAnalysis.tempo.range[1] / 200) * 100}%`
                            }}
                          ></div>
                          <div className="absolute flex justify-between w-full px-2 h-full items-center text-xs">
                            <span>{soundAnalysis.tempo.range[0]} BPM</span>
                            <span>{soundAnalysis.tempo.range[1]} BPM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Production Elements</CardTitle>
                    <CardDescription>
                      Key components in {artist.name}'s sound
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {soundAnalysis.productionElements.map((element, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{element.element}</span>
                            <span className="text-sm text-muted-foreground">{element.percentage}%</span>
                          </div>
                          <Progress value={element.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Musical Keys</CardTitle>
                    <CardDescription>
                      Key signatures used in compositions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {soundAnalysis.keyDistribution.map((key, i) => (
                        <div 
                          key={i} 
                          className="border rounded-lg p-3 flex flex-col items-center justify-center text-center"
                          style={{
                            backgroundColor: `rgba(var(--primary), ${key.percentage / 100 * 0.2})`
                          }}
                        >
                          <span className="text-sm font-medium">{key.key}</span>
                          <span className="text-2xl font-bold">{key.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Career Analysis Tab */}
            <TabsContent value="career" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Career Trajectory</CardTitle>
                    <CardDescription>
                      Growth in monthly listeners over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-end space-x-2">
                      {careerAnalysis.evolutionByYear.map((data, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary rounded-t-sm"
                            style={{ 
                              height: `${(data.value / careerAnalysis.evolutionByYear[careerAnalysis.evolutionByYear.length-1].value) * 100}%`,
                              minHeight: '10%'
                            }}
                          ></div>
                          <div className="text-xs mt-2 text-center">
                            <p>{data.year}</p>
                            <p className="text-muted-foreground">{(data.value / 1000000).toFixed(1)}M</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Style Evolution</CardTitle>
                    <CardDescription>
                      How {artist.name}'s sound has changed over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {careerAnalysis.styleEvolution.map((period, i) => (
                        <div key={i} className="space-y-2">
                          <h4 className="text-sm font-medium">{period.period}</h4>
                          <div className="flex flex-wrap gap-2">
                            {period.dominantStyles.map((style, j) => (
                              <Badge key={j} variant="secondary">{style}</Badge>
                            ))}
                          </div>
                          {i < careerAnalysis.styleEvolution.length - 1 && (
                            <div className="border-l-2 border-dashed h-4 ml-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Audience Demographics</CardTitle>
                    <CardDescription>
                      Age distribution of {artist.name}'s listeners
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {careerAnalysis.fanDemographics.map((demo, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{demo.demographic}</span>
                            <span className="text-sm text-muted-foreground">{demo.percentage}%</span>
                          </div>
                          <Progress value={demo.percentage} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Top Collaborators</CardTitle>
                    <CardDescription>
                      Most frequent artistic partnerships
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {careerAnalysis.collaborationNetwork.map((collab, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                              <Mic2 className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="text-sm font-medium">{collab.artist}</span>
                          </div>
                          <Badge variant="outline">{collab.count} tracks</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center bg-muted/30 rounded-lg py-16">
          <BarChart2 className="h-16 w-16 text-muted mb-4" />
          <h3 className="text-xl font-medium mb-2">No Analysis Data</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Run an analysis to get deep insights into {artist.name}'s musical style, lyrical themes, and career trends.
          </p>
          <Button onClick={handleStartAnalysis}>Start Analysis</Button>
        </div>
      )}
    </div>
  );
} 