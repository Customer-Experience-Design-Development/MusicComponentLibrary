import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { SongLyrics } from '@/components/music-ui/SongLyrics';
import { WhisperTranscriber } from '@/components/music-ui/WhisperTranscriber';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Transcription } from '@/components/music-ui/types';
import { Plus, Download, ExternalLink, FileAudio } from 'lucide-react';
import { LyricalAnalysis } from '@/components/music-ui/analysis/LyricalAnalysis';
import { LyricStructureAnalysis } from '@/components/music-ui/analysis/LyricStructureAnalysis';
import { ThematicAnalysis } from '@/components/music-ui/analysis/ThematicAnalysis';
import { ProsodyAnalysis } from '@/components/music-ui/analysis/ProsodyAnalysis';
import { SensoryLanguageAnalysis } from '@/components/music-ui/analysis/SensoryLanguageAnalysis';
import { MetaphorAnalysis } from '@/components/music-ui/analysis/MetaphorAnalysis';
import { RhymeSchemeAnalysis } from '@/components/music-ui/analysis/RhymeSchemeAnalysis';
import { RhymeFlowVisualizer } from '@/components/music-ui/analysis/RhymeFlowVisualizer';

// Import RhymeGroup type from the same location as RhymeFlowVisualizer
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

interface RhymeGroup {
  id: string;
  color: string;
  words: RhymeWord[];
  type: 'perfect' | 'family' | 'slant' | 'assonance' | 'consonance';
  strength: number;
}

const footerCategories = [
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/documentation" },
      { label: "API Reference", href: "/api" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Examples", href: "/examples" }
    ]
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com/musicui" },
      { label: "Discord", href: "https://discord.gg/musicui" },
      { label: "Twitter", href: "https://twitter.com/musicui" }
    ]
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "License", href: "/license" }
    ]
  }
];

const socialLinks = [
  { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
  { icon: "ri-github-fill", href: "https://github.com/musicui" },
  { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
];

// Demo data for the SongLyrics component
const demoSong = {
  id: "1",
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  lyrics: `In the vast expanse of space
Where stars dance in endless grace
We find our cosmic harmony
A symphony of eternity

Through the void of time and space
We journey at our own pace
Finding rhythm in the stars
As they guide us from afar

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony

Through nebulas and galaxies
We search for melodies
That echo through the cosmic sea
In perfect harmony

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony

[Bridge]
Every note a star
Every chord a galaxy
Every beat a pulse
Of cosmic energy

[Chorus]
Cosmic harmony, eternal melody
Dancing through infinity
In perfect synchrony
With the universe's symphony`
};

// Demo with whisper transcription
const demoSongWithTranscription = {
  id: "2",
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  lyrics: demoSong.lyrics,
  transcription: {
    language: "English",
    confidence: 0.96,
    segments: [
      {
        start: 15.2,
        end: 21.5,
        text: "In the vast expanse of space",
        confidence: 0.95
      },
      {
        start: 22.1,
        end: 28.6,
        text: "Where stars dance in endless grace",
        confidence: 0.92
      },
      {
        start: 30.2,
        end: 35.8,
        text: "We find our cosmic harmony",
        confidence: 0.96
      },
      {
        start: 37.1,
        end: 43.4,
        text: "A symphony of eternity",
        confidence: 0.93
      },
      {
        start: 45.2,
        end: 51.5,
        text: "Through the void of time and space",
        confidence: 0.97
      },
      {
        start: 52.8,
        end: 59.3,
        text: "We journey at our own pace",
        confidence: 0.94
      },
      {
        start: 60.5,
        end: 66.9,
        text: "Finding rhythm in the stars",
        confidence: 0.90
      },
      {
        start: 68.2,
        end: 75.1,
        text: "As they guide us from afar",
        confidence: 0.88
      },
      {
        start: 78.3,
        end: 81.6,
        text: "Cosmic harmony, eternal melody",
        confidence: 0.97
      },
      {
        start: 82.9,
        end: 86.2,
        text: "Dancing through infinity",
        confidence: 0.98
      },
      {
        start: 87.4,
        end: 90.8,
        text: "In perfect synchrony",
        confidence: 0.95
      },
      {
        start: 92.1,
        end: 96.4,
        text: "With the universe's symphony",
        confidence: 0.91
      }
    ]
  }
};

// Demo song with annotations
const demoSongWithAnnotations = {
  ...demoSong,
  id: "3",
  title: "Cosmic Harmony (Annotated)",
};

const workflowExamples = [
  { 
    id: "demo1", 
    name: "New Song Creation", 
    description: "Create lyrics from scratch or through audio transcription" 
  },
  { 
    id: "demo2", 
    name: "Collaborative Editing", 
    description: "Add annotations and suggestions to existing lyrics" 
  },
  { 
    id: "demo3", 
    name: "Analysis & Refinement", 
    description: "Analyze lyrics structure and make improvements" 
  }
];

export default function SongLyricsPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentVariant, setCurrentVariant] = useState('basic');
  const [selectedWorkflow, setSelectedWorkflow] = useState(workflowExamples[0].id);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [formattedLyrics, setFormattedLyrics] = useState('');
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [showTranscriber, setShowTranscriber] = useState(false);
  const [analysisActiveTab, setAnalysisActiveTab] = useState('structure');
  const [analysisData, setAnalysisData] = useState<{
    rhymeGroups?: RhymeGroup[];
    selectedWords?: string[];
    patternName?: string;
  }>({});

  const handleSeekAudio = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play().catch(error => console.error("Audio playback error:", error));
    }
  };

  const handleTranscriptionComplete = (transcription: Transcription, lyrics: string) => {
    setTranscription(transcription);
    setFormattedLyrics(lyrics);
    setShowTranscriber(false);
  };

  const handleAnnotationAdd = (annotation: any) => {
    setAnnotations([...annotations, annotation]);
  };

  const handleRhymeAnalysisUpdate = (rhymeGroups: RhymeGroup[]) => {
    setAnalysisData((prev: {
      rhymeGroups?: RhymeGroup[];
      selectedWords?: string[];
      patternName?: string;
    }) => ({
      ...prev,
      rhymeGroups
    }));
  };

  const renderSelectedWorkflow = () => {
    switch (selectedWorkflow) {
      case "demo1":
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Lyrics Creation Workflow</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Begin with a blank slate or record audio for transcription</li>
                <li>If recording, use the WhisperTranscriber to generate lyrics with timestamps</li>
                <li>Edit and refine the transcribed lyrics</li>
                <li>Save and export the final lyrics</li>
              </ol>
            </div>

            {showTranscriber ? (
              <WhisperTranscriber 
                onTranscriptionComplete={handleTranscriptionComplete}
                externalAudioRef={audioRef}
              />
            ) : transcription && formattedLyrics ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Transcribed Lyrics</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowTranscriber(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Transcription
                  </Button>
                </div>
                <audio 
                  ref={audioRef}
                  controls
                  className="w-full"
                />
                <SongLyrics 
                  song={{
                    id: "transcribed-1",
                    title: "Transcribed Lyrics",
                    artist: "AI Generated",
                    lyrics: formattedLyrics,
                    transcription: transcription
                  }}
                  audioRef={audioRef}
                  onSeekAudio={handleSeekAudio}
                  isEditable={true}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="space-y-4 text-center">
                  <p className="text-neutral-500">Start by creating lyrics from audio or from scratch</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => setShowTranscriber(true)}>
                      <FileAudio className="h-4 w-4 mr-2" />
                      Transcribe Audio
                    </Button>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Create from Scratch
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      
      case "demo2":
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Collaborative Editing Workflow</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Select any line in the lyrics to add annotations</li>
                <li>Choose from different annotation types: comments, suggestions, corrections</li>
                <li>Add artist attributions to track collaborators</li>
                <li>View and manage annotations through the collaboration panel</li>
              </ol>
            </div>
            
            <SongLyrics 
              song={demoSongWithAnnotations} 
              isEditable={true}
              onAnnotationAdd={handleAnnotationAdd}
            />
          </div>
        );
      
      case "demo3":
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Analysis & Refinement Workflow</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm ml-2">
                <li>Use the analysis tool to examine your lyrics structure</li>
                <li>Identify patterns, repetition, and themes</li>
                <li>Make edits based on analysis insights</li>
                <li>Track changes through version history</li>
              </ol>
            </div>
            
            <SongLyrics 
              song={demoSong} 
              isEditable={true}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/song-lyrics" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Song Lyrics" 
              description="A comprehensive lyrics management system with transcription, annotation, and analysis capabilities."
            />
            
            <div className="mt-8">
              <Tabs defaultValue="variants" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="variants">Component Variants</TabsTrigger>
                  <TabsTrigger value="workflows">Workflow Examples</TabsTrigger>
                  <TabsTrigger value="advanced-analysis">Advanced Analysis</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="variants" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Tabs value={currentVariant} onValueChange={setCurrentVariant}>
                      <TabsList>
                        <TabsTrigger value="basic">Basic</TabsTrigger>
                        <TabsTrigger value="transcription">With Transcription</TabsTrigger>
                        <TabsTrigger value="editable">Editable</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {currentVariant === 'basic' && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Basic Lyrics View</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Simple and clean lyrics display with search functionality.
                      </p>
                      <SongLyrics song={demoSong} />
                    </Card>
                  )}

                  {currentVariant === 'transcription' && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">With Whisper Transcription</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Timestamped lyrics from Whisper transcription with confidence scores and audio synchronization.
                      </p>
                      <audio 
                        ref={audioRef}
                        controls
                        className="w-full"
                        src="/audio/cosmic-harmony-demo.mp3"
                      />
                      <SongLyrics 
                        song={demoSongWithTranscription} 
                        audioRef={audioRef}
                        onSeekAudio={handleSeekAudio}
                      />
                    </Card>
                  )}

                  {currentVariant === 'editable' && (
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Editable Lyrics</h3>
                      <p className="text-sm text-neutral-500 mb-4">
                        Full editing capabilities with annotations, version history, and analysis.
                      </p>
                      <SongLyrics 
                        song={demoSong} 
                        isEditable={true}
                        onSave={(lyrics) => console.log('Lyrics saved:', lyrics.substring(0, 20) + '...')}
                      />
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="workflows" className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Workflow Examples</h3>
                    <p className="text-sm text-neutral-500">
                      Explore different ways to use the lyrics system in real-world workflows.
                    </p>
                  </div>
                  
                  <div className="flex gap-4 mb-6">
                    <Select value={selectedWorkflow} onValueChange={setSelectedWorkflow}>
                      <SelectTrigger className="w-[300px]">
                        <SelectValue placeholder="Select a workflow" />
                      </SelectTrigger>
                      <SelectContent>
                        {workflowExamples.map(example => (
                          <SelectItem key={example.id} value={example.id}>
                            {example.name} - {example.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {renderSelectedWorkflow()}
                </TabsContent>
                
                <TabsContent value="advanced-analysis" className="space-y-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Advanced Lyrical Analysis</h3>
                    <p className="text-sm text-neutral-500">
                      Specialized tools for deep lyrical analysis based on Pat Pattison's methodologies, including structure mapping, thematic analysis, prosody alignment, sensory language tracking, metaphor analysis, and rhyme scheme visualization.
                    </p>
                  </div>
                  
                  <Tabs 
                    value={analysisActiveTab} 
                    onValueChange={setAnalysisActiveTab}
                    className="space-y-4"
                  >
                    <TabsList className="w-full justify-start overflow-x-auto">
                      <TabsTrigger value="structure">Structure</TabsTrigger>
                      <TabsTrigger value="themes">Themes</TabsTrigger>
                      <TabsTrigger value="prosody">Prosody</TabsTrigger>
                      <TabsTrigger value="sensory">Sensory Language</TabsTrigger>
                      <TabsTrigger value="metaphor">Figurative Language</TabsTrigger>
                      <TabsTrigger value="rhymes">Rhyme Scheme</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="structure" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Lyric Structure Mapping</h4>
                          <p className="text-sm text-neutral-500">
                            Break down lyrics into verses, choruses, and bridges to understand the song's architecture.
                          </p>
                        </div>
                      </div>
                      
                      <LyricStructureAnalysis 
                        lyrics={demoSong.lyrics} 
                        isEditable={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="themes" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Thematic Analysis</h4>
                          <p className="text-sm text-neutral-500">
                            Identify recurring themes or motifs to see how the central message evolves.
                          </p>
                        </div>
                      </div>
                      
                      <ThematicAnalysis 
                        lyrics={demoSong.lyrics} 
                        isEditable={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="prosody" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Prosodic Alignment</h4>
                          <p className="text-sm text-neutral-500">
                            Examine how well the lyrics' natural rhythms align with the music's beat and melody.
                          </p>
                        </div>
                      </div>
                      
                      <ProsodyAnalysis 
                        lyrics={demoSong.lyrics}
                        isEditable={true}
                        tempo={120}
                        audioRef={audioRef}
                        rhymeGroups={analysisData?.rhymeGroups}
                      />
                    </TabsContent>
                    
                    <TabsContent value="sensory" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Sensory Language Tracking</h4>
                          <p className="text-sm text-neutral-500">
                            Highlight sensory words to assess the vividness and emotional depth of the lyrics.
                          </p>
                        </div>
                      </div>
                      
                      <SensoryLanguageAnalysis 
                        lyrics={demoSong.lyrics}
                        isEditable={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="metaphor" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Figurative Language Analysis</h4>
                          <p className="text-sm text-neutral-500">
                            Analyze the use of metaphors and similes to understand the songwriter's creative expression.
                          </p>
                        </div>
                      </div>
                      
                      <MetaphorAnalysis 
                        lyrics={demoSong.lyrics}
                        isEditable={true}
                      />
                    </TabsContent>
                    
                    <TabsContent value="rhymes" className="space-y-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-base font-medium">Rhyme Scheme Analysis</h4>
                          <p className="text-sm text-neutral-500">
                            Visualize end rhyme patterns and internal rhymes to understand the song's sonic structure.
                          </p>
                        </div>
                      </div>
                      
                      <RhymeSchemeAnalysis 
                        lyrics={demoSong.lyrics} 
                        isEditable={true}
                        tempo={120}
                        audioRef={audioRef}
                        onSave={handleRhymeAnalysisUpdate}
                      />
                      
                      {analysisData?.rhymeGroups && analysisData.rhymeGroups.length > 0 && (
                        <div className="mt-6">
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <h4 className="text-base font-medium">Rhyme Flow Visualization</h4>
                              <p className="text-sm text-neutral-500">
                                Explore rhyme patterns and connections throughout the lyrics using different visualization approaches.
                              </p>
                            </div>
                          </div>
                          <RhymeFlowVisualizer
                            rhymeGroups={analysisData.rhymeGroups}
                            lyrics={demoSong.lyrics.split('\n')}
                            className="mt-2"
                            onWordSelect={(word, group) => {
                              // Optionally handle word selection here
                              console.log(`Selected word: ${word.word} from line ${word.line + 1}`, group);
                            }}
                          />
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The SongLyrics component provides a rich interface for displaying and interacting with song lyrics, including:</p>
                      <ul>
                        <li>Real-time search functionality</li>
                        <li>Highlighted search matches</li>
                        <li>Timestamped transcription view</li>
                        <li>Lyrics editing and version history</li>
                        <li>Annotation system with different types</li>
                        <li>Lyrical analysis</li>
                        <li>Copy, export and share options</li>
                      </ul>
                      
                      <h4>Key Features</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="border rounded-md p-4">
                          <h5 className="font-medium mb-2">Transcription Integration</h5>
                          <p className="text-sm text-neutral-500">
                            Integrate with WhisperTranscriber to automatically generate lyrics from audio recordings with precise timestamps and confidence scores.
                          </p>
                          <a href="/components/whisper-transcriber" className="text-sm text-blue-500 flex items-center mt-2">
                            View Transcriber <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h5 className="font-medium mb-2">Rich Annotation System</h5>
                          <p className="text-sm text-neutral-500">
                            Add comments, suggestions, corrections, and artist attributions to collaborate on lyrics.
                          </p>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h5 className="font-medium mb-2">Advanced Lyrical Analysis</h5>
                          <p className="text-sm text-neutral-500">
                            Analyze structure, themes, prosody, sensory language, and figurative devices using Pat Pattison's proven songwriting methodologies.
                          </p>
                        </div>
                        
                        <div className="border rounded-md p-4">
                          <h5 className="font-medium mb-2">Version History</h5>
                          <p className="text-sm text-neutral-500">
                            Track changes and revisions with a complete version history system.
                          </p>
                        </div>
                      </div>
                      
                      <h4 className="mt-6">Props</h4>
                      <pre><code>{`interface SongLyricsProps {
  song: {
    id: string;
    title: string;
    artist: string;
    lyrics: string;
    transcription?: {
      language: string;
      confidence: number;
      segments: {
        start: number;
        end: number;
        text: string;
        confidence: number;
      }[];
    };
  };
  className?: string;
  isEditable?: boolean;
  onSave?: (lyrics: string) => void;
  onAnnotationAdd?: (annotation: Annotation) => void;
  onAnnotationDelete?: (annotationId: string) => void;
  audioRef?: React.RefObject<HTMLAudioElement>;
  onSeekAudio?: (timeInSeconds: number) => void;
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
      
      <Footer 
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
} 