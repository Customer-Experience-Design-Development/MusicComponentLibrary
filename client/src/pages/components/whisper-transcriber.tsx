import { useState, useRef } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { WhisperTranscriber } from '@/components/music-ui/WhisperTranscriber';
import { SongLyrics } from '@/components/music-ui/SongLyrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Transcription } from '@/components/music-ui/types';

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

export default function WhisperTranscriberPage() {
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [formattedLyrics, setFormattedLyrics] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTranscriptionComplete = (
    transcription: Transcription, 
    formattedLyrics: string
  ) => {
    setTranscription(transcription);
    setFormattedLyrics(formattedLyrics);
  };

  const handleSeekAudio = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play().catch(error => console.error("Audio playback error:", error));
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/whisper-transcriber" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Whisper Transcriber" 
              description="A component for transcribing audio to lyrics using OpenAI's Whisper model, with time synchronization and confidence scoring."
            />
            
            <div className="mt-8">
              <Tabs defaultValue="preview" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="documentation">Documentation</TabsTrigger>
                  <TabsTrigger value="workflow">Workflow</TabsTrigger>
                </TabsList>
                
                <TabsContent value="preview" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Transcribe Audio Demo</h3>
                    <p className="text-sm text-neutral-500 mb-6">
                      You can record or upload audio to transcribe it into lyrics. 
                      For demo purposes, the transcription process is simulated.
                    </p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <WhisperTranscriber 
                        onTranscriptionComplete={handleTranscriptionComplete} 
                      />
                      
                      {transcription && formattedLyrics && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium">Generated Lyrics</h3>
                          <audio 
                            ref={audioRef}
                            controls
                            className="w-full mb-4"
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
                      )}
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="documentation" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Documentation</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Overview</h4>
                      <p>The WhisperTranscriber component provides functionality to transcribe audio recordings or uploaded files into lyrics using OpenAI's Whisper model. Key features include:</p>
                      <ul>
                        <li>Record audio directly from the browser</li>
                        <li>Upload audio files for transcription</li>
                        <li>Timestamped transcription results</li>
                        <li>Confidence scoring for each segment</li>
                        <li>Automatic formatting of lyrics</li>
                        <li>Identification of segments that may need review</li>
                      </ul>
                      
                      <h4>Props</h4>
                      <pre><code>{`interface WhisperTranscriberProps {
  onTranscriptionComplete?: (
    transcription: Transcription, 
    formattedLyrics: string
  ) => void;
  className?: string;
}`}</code></pre>
                      
                      <h4>Usage</h4>
                      <pre><code>{`import { WhisperTranscriber } from '@/components/music-ui/WhisperTranscriber';
import { SongLyrics } from '@/components/music-ui/SongLyrics';
import { Transcription } from '@/components/music-ui/types';
import { useState, useRef } from 'react';

function MyComponent() {
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [formattedLyrics, setFormattedLyrics] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTranscriptionComplete = (
    transcription: Transcription, 
    formattedLyrics: string
  ) => {
    setTranscription(transcription);
    setFormattedLyrics(formattedLyrics);
  };

  const handleSeekAudio = (timeInSeconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = timeInSeconds;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <WhisperTranscriber 
        onTranscriptionComplete={handleTranscriptionComplete} 
      />
      
      {transcription && formattedLyrics && (
        <div>
          <audio ref={audioRef} controls />
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
      )}
    </div>
  );
}`}</code></pre>
                    </div>
                  </Card>
                </TabsContent>
                
                <TabsContent value="workflow" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Transcription Workflow</h3>
                    <div className="prose dark:prose-invert max-w-none">
                      <h4>Step 1: Record or Upload Audio</h4>
                      <p>
                        The component provides two methods to input audio: direct recording from the microphone or uploading an audio file.
                        The audio is then processed by the Whisper model to generate timestamped transcription segments.
                      </p>
                      
                      <h4>Step 2: Process Transcription</h4>
                      <p>
                        The audio is sent to OpenAI's Whisper model for processing. The model returns a
                        transcription with segments that include timestamps, text, and confidence scores.
                      </p>
                      
                      <h4>Step 3: Format and Review</h4>
                      <p>
                        The component automatically formats the transcription into proper lyrics format,
                        identifying potential chorus sections based on repeated lines. It also flags segments
                        with low confidence scores for manual review.
                      </p>
                      
                      <h4>Step 4: Integrate with SongLyrics Component</h4>
                      <p>
                        The transcription data can be directly used with the SongLyrics component to create
                        an interactive lyrics display with time synchronization to the original audio.
                        This allows for easy editing, annotation, and further refinement of the lyrics.
                      </p>
                      
                      <h4>Integration with Audio Production Workflow</h4>
                      <p>
                        This component fits into a larger audio production workflow by:
                      </p>
                      <ul>
                        <li>Automatically generating initial lyrics from recordings</li>
                        <li>Supporting songwriting and composing processes</li>
                        <li>Enabling collaborative editing of lyrics</li>
                        <li>Providing synchronized lyrics for mixing and mastering phases</li>
                        <li>Preparing lyrics for distribution and publication</li>
                      </ul>
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