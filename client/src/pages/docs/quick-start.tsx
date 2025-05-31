import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, CheckCircle, Play, Code } from "lucide-react";
import { Link } from 'wouter';

export default function QuickStart() {
  // Footer categories
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
        { label: "Twitter", href: "https://twitter.com/musicui" },
        { label: "Stack Overflow", href: "https://stackoverflow.com/questions/tagged/musicui" }
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

  // Social links
  const socialLinks = [
    { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
    { icon: "ri-github-fill", href: "https://github.com/musicui" },
    { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
  ];

  const projectSetupCode = `npx create-react-app my-music-app --template typescript
cd my-music-app

# Install MusicUI
npm install @musicui/react

# Install required dependencies
npm install tailwindcss autoprefixer postcss
npx tailwindcss init -p`;

  const basicPlayerCode = `import React, { useState, useRef } from 'react';
import { AudioPlayer, VolumeControl } from '@musicui/react';

function MyMusicApp() {
  const [currentTrack, setCurrentTrack] = useState({
    id: 1,
    title: "Summer Breeze",
    artist: "The Harmonics",
    duration: 195, // 3:15
    audioSrc: "/audio/summer-breeze.mp3",
    albumArt: "/images/summer-album.jpg"
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-card rounded-lg shadow-lg">
      <AudioPlayer
        track={currentTrack}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        audioRef={audioRef}
      />
      
      <div className="mt-4">
        <VolumeControl
          volume={volume}
          onVolumeChange={setVolume}
          audioRef={audioRef}
        />
      </div>
    </div>
  );
}

export default MyMusicApp;`;

  const playlistCode = `import React, { useState } from 'react';
import { AudioPlayer, Playlist } from '@musicui/react';

function MusicAppWithPlaylist() {
  const [tracks] = useState([
    {
      id: 1,
      title: "Summer Breeze",
      artist: "The Harmonics",
      duration: 195,
      audioSrc: "/audio/summer-breeze.mp3",
      albumArt: "/images/summer-album.jpg"
    },
    {
      id: 2,
      title: "City Lights",
      artist: "Urban Echo",
      duration: 248,
      audioSrc: "/audio/city-lights.mp3",
      albumArt: "/images/city-album.jpg"
    },
    {
      id: 3,
      title: "Mountain High",
      artist: "Nature's Call",
      duration: 312,
      audioSrc: "/audio/mountain-high.mp3",
      albumArt: "/images/mountain-album.jpg"
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentTrack = tracks[currentTrackIndex];

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const handleTrackSelect = (trackId: number) => {
    const trackIndex = tracks.findIndex(track => track.id === trackId);
    if (trackIndex !== -1) {
      setCurrentTrackIndex(trackIndex);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Player Section */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <AudioPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>

        {/* Playlist Section */}
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <Playlist
            tracks={tracks}
            currentTrackId={currentTrack.id}
            onTrackSelect={handleTrackSelect}
            showDuration
            showAlbumArt
          />
        </div>
      </div>
    </div>
  );
}

export default MusicAppWithPlaylist;`;

  const visualizerCode = `import React, { useRef, useEffect } from 'react';
import { AudioPlayer, Visualizer, Waveform } from '@musicui/react';

function AdvancedMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTrack] = useState({
    id: 1,
    title: "Electronic Dreams",
    artist: "Synth Master",
    duration: 285,
    audioSrc: "/audio/electronic-dreams.mp3",
    albumArt: "/images/electronic-album.jpg",
    waveformData: [0.2, 0.5, 0.8, 0.3, 0.9, 0.1, 0.7, 0.4, 0.6, 0.8, 0.2, 0.9] // Sample data
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(audioRef.current);
      const analyser = audioContext.createAnalyser();
      
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      setAnalyserNode(analyser);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Main Player */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <AudioPlayer
          track={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          audioRef={audioRef}
        />
      </div>

      {/* Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Real-time Visualizer</h3>
          <Visualizer
            type="bars"
            analyserNode={analyserNode}
            height={200}
            barCount={32}
            color="#3b82f6"
            responsive
          />
        </div>

        <div className="bg-card rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Waveform</h3>
          <Waveform
            waveformData={currentTrack.waveformData}
            progress={0} // Connect to actual progress
            height={200}
            interactive
            onSeek={(position) => {
              // Handle seeking to position
              console.log('Seek to:', position);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default AdvancedMusicPlayer;`;

  const completeAppCode = `import React, { useState, useRef } from 'react';
import {
  AudioPlayer,
  Playlist,
  VolumeControl,
  Visualizer,
  Waveform,
  MediaCard
} from '@musicui/react';

function CompleteMusicApp() {
  const [tracks] = useState([
    {
      id: 1,
      title: "Summer Breeze",
      artist: "The Harmonics",
      album: "Seasonal Sounds",
      duration: 195,
      audioSrc: "/audio/summer-breeze.mp3",
      albumArt: "/images/summer-album.jpg"
    },
    {
      id: 2,
      title: "City Lights",
      artist: "Urban Echo",
      album: "Metropolitan",
      duration: 248,
      audioSrc: "/audio/city-lights.mp3",
      albumArt: "/images/city-album.jpg"
    }
  ]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [view, setView] = useState<'player' | 'library'>('player');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = tracks[currentTrackIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Music App</h1>
          <nav className="flex space-x-4">
            <button
              onClick={() => setView('player')}
              className={\`px-4 py-2 rounded \${view === 'player' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}\`}
            >
              Player
            </button>
            <button
              onClick={() => setView('library')}
              className={\`px-4 py-2 rounded \${view === 'library' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}\`}
            >
              Library
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        {view === 'player' ? (
          <div className="space-y-6">
            {/* Player Controls */}
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <AudioPlayer
                track={currentTrack}
                isPlaying={isPlaying}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onNext={() => setCurrentTrackIndex((prev) => (prev + 1) % tracks.length)}
                onPrevious={() => setCurrentTrackIndex((prev) => prev === 0 ? tracks.length - 1 : prev - 1)}
                audioRef={audioRef}
              />
              
              <div className="mt-4 flex items-center justify-between">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={setVolume}
                  audioRef={audioRef}
                />
              </div>
            </div>

            {/* Visualizer */}
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Audio Visualizer</h3>
              <Visualizer
                type="bars"
                audioElement={audioRef.current}
                height={150}
                responsive
              />
            </div>

            {/* Queue */}
            <div className="bg-card rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Up Next</h3>
              <Playlist
                tracks={tracks}
                currentTrackId={currentTrack.id}
                onTrackSelect={(trackId) => {
                  const index = tracks.findIndex(t => t.id === trackId);
                  setCurrentTrackIndex(index);
                }}
                compact
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Music Library</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tracks.map((track) => (
                <MediaCard
                  key={track.id}
                  title={track.title}
                  artist={track.artist}
                  albumArt={track.albumArt}
                  duration={track.duration}
                  onPlay={() => {
                    const index = tracks.findIndex(t => t.id === track.id);
                    setCurrentTrackIndex(index);
                    setIsPlaying(true);
                    setView('player');
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CompleteMusicApp;`;

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/docs/quick-start" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Quick Start" 
              description="Build your first music application with MusicUI in just 15 minutes"
            />

            {/* Overview */}
            <section className="mb-8">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2 text-primary" />
                    What We'll Build
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    In this tutorial, we'll build a complete music player application that includes:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Audio player with playback controls
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Interactive playlist management
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Real-time audio visualization
                      </li>
                    </ul>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Volume controls and settings
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Responsive design for all devices
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        Beautiful, modern UI
                      </li>
                    </ul>
                  </div>
                  
                  <Alert className="mt-4">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Prerequisites</AlertTitle>
                    <AlertDescription>
                      Make sure you've completed the{" "}
                      <Link href="/docs/installation" className="text-primary hover:underline">
                        installation guide
                      </Link>{" "}
                      before starting this tutorial.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </section>

            {/* Tutorial Steps */}
            <Tabs defaultValue="setup" className="mb-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="player">Basic Player</TabsTrigger>
                <TabsTrigger value="playlist">Add Playlist</TabsTrigger>
                <TabsTrigger value="advanced">Advanced Features</TabsTrigger>
              </TabsList>
              
              <TabsContent value="setup" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">1</span>
                      Project Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Let's start by creating a new React project and installing MusicUI:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-4">
                      {projectSetupCode}
                    </pre>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Alternative Setup</AlertTitle>
                      <AlertDescription>
                        You can also use Vite or Next.js as your build tool. The MusicUI components work with any React setup.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>File Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Your project structure should look like this:
                    </p>
                    
                    <div className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm">
                      <div className="space-y-1">
                        <div>my-music-app/</div>
                        <div className="ml-4">├── public/</div>
                        <div className="ml-8">├── audio/ <span className="text-muted-foreground">(add your MP3 files here)</span></div>
                        <div className="ml-8">└── images/ <span className="text-muted-foreground">(add album art here)</span></div>
                        <div className="ml-4">├── src/</div>
                        <div className="ml-8">├── App.tsx</div>
                        <div className="ml-8">├── index.css</div>
                        <div className="ml-8">└── index.tsx</div>
                        <div className="ml-4">└── tailwind.config.js</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="player" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">2</span>
                      Create a Basic Audio Player
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Let's create a simple audio player component:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 mb-4">
                      {basicPlayerCode}
                    </pre>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>What's Happening?</AlertTitle>
                      <AlertDescription>
                        This creates a basic music player with play/pause functionality and volume control. The AudioPlayer component handles the UI while we manage the state.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="playlist" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">3</span>
                      Add Playlist Functionality
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Now let's add a playlist and track navigation:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 mb-4">
                      {playlistCode}
                    </pre>
                    
                    <div className="flex items-start space-x-3 mt-4">
                      <Badge variant="secondary">New Features</Badge>
                      <div className="space-y-1 text-sm">
                        <p>✓ Multiple tracks with metadata</p>
                        <p>✓ Next/Previous navigation</p>
                        <p>✓ Click to select tracks from playlist</p>
                        <p>✓ Current track highlighting</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="advanced" className="mt-4 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm mr-3">4</span>
                      Add Visualizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Let's add some impressive visual features:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96 mb-4">
                      {visualizerCode}
                    </pre>
                    
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Audio Context</AlertTitle>
                      <AlertDescription>
                        The Web Audio API requires user interaction before creating an AudioContext. The visualizer will start working after the user plays audio.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Complete Application</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Here's a complete music application with all features combined:
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto max-h-96">
                      {completeAppCode}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Testing Your App */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="w-5 h-5 mr-2 text-primary" />
                    Testing Your Application
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Running the Development Server</h3>
                      <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-3 font-mono text-sm">
                        npm start
                      </pre>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Adding Sample Audio Files</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Add some MP3 files to your <code className="bg-muted px-1 py-0.5 rounded">public/audio/</code> directory:
                      </p>
                      <ul className="text-sm space-y-1 ml-4">
                        <li>• summer-breeze.mp3</li>
                        <li>• city-lights.mp3</li>
                        <li>• mountain-high.mp3</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Adding Album Art</h3>
                      <p className="text-sm text-muted-foreground">
                        Add corresponding album art images to <code className="bg-muted px-1 py-0.5 rounded">public/images/</code> for a complete experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Next Steps */}
            <section className="mb-8">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>🎉 Congratulations!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    You've built a complete music application with MusicUI! Your app now includes audio playback, 
                    playlist management, visualizations, and a responsive design.
                  </p>
                  
                  <h3 className="font-semibold mb-2">What's Next?</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-1">Explore More Components</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Equalizer controls</li>
                        <li>• Search functionality</li>
                        <li>• Analytics dashboard</li>
                        <li>• Mobile-specific UI</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Add Advanced Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Cloud streaming integration</li>
                        <li>• User authentication</li>
                        <li>• Social features</li>
                        <li>• Offline playback</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/components">
                      <Button className="w-full sm:w-auto">
                        <i className="ri-grid-line mr-2"></i>
                        Explore All Components
                      </Button>
                    </Link>
                    <Link href="/components/showcase">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-eye-line mr-2"></i>
                        View Live Examples
                      </Button>
                    </Link>
                    <Link href="/documentation">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-book-line mr-2"></i>
                        Full Documentation
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </section>
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