import { useState, useRef } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { AudioPlayer, SongLyrics } from '@/components/music-ui';
import { TimelineComment } from '@/components/music-ui/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { v4 as uuidv4 } from 'uuid';

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

// Demo song with transcription
const song = {
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
In perfect harmony`,
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
      }
    ]
  }
};

// Demo track
const track = {
  id: 1,
  title: "Cosmic Harmony",
  artist: "Astral Projections",
  duration: 240, // 4:00
  albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3"
};

// Example initial comments
const initialComments: TimelineComment[] = [
  {
    id: uuidv4(),
    timestamp: 18.5,
    content: "The synth pad that comes in here is so atmospheric!",
    author: {
      id: "user-1",
      name: "Music Producer",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: new Date().toISOString(),
    reactions: [
      {
        id: uuidv4(),
        emoji: "🎹",
        count: 3,
        users: ["user-2", "user-3", "user-4"]
      }
    ]
  },
  {
    id: uuidv4(),
    timestamp: 48.2,
    content: "This transition is so smooth! The reverb tail is perfect.",
    author: {
      id: "user-2",
      name: "Mixing Engineer",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: new Date().toISOString(),
    reactions: []
  }
];

// Current user
const currentUser = {
  id: "current-user",
  name: "You",
  avatar: "https://github.com/shadcn.png"
};

export default function TimelineCommentsExample() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTab, setCurrentTab] = useState('audio-player');

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
          <Sidebar activePath="/examples/timeline-comments" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Timeline Comments Example" 
              description="Interactive comments and reactions on specific timestamps in audio tracks and lyrics."
            />
            
            <div className="mt-8">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Audio Track with Timeline Comments</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click the comments icon to show/hide the timeline comments panel. Add comments and reactions at specific timestamps.
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs value={currentTab} onValueChange={setCurrentTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="audio-player">Audio Player</TabsTrigger>
                      <TabsTrigger value="song-lyrics">Song Lyrics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="audio-player">
                      <AudioPlayer 
                        track={track} 
                        showComments={true}
                        initialComments={initialComments}
                        currentUser={currentUser}
                      />
                    </TabsContent>
                    
                    <TabsContent value="song-lyrics">
                      <div className="border rounded-lg p-4">
                        <audio
                          ref={audioRef}
                          src={track.audioSrc}
                          controls
                          className="w-full mb-6"
                        />
                        
                        <SongLyrics 
                          song={song}
                          audioRef={audioRef}
                          onSeekAudio={handleSeekAudio}
                          showTimelineComments={true}
                          initialComments={initialComments}
                          currentUser={currentUser}
                          className="mt-4"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Timeline Comments</h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>Add comments at specific timestamps</li>
                        <li>Add emoji reactions to comments</li>
                        <li>Reply to comments</li>
                        <li>Private or public comments</li>
                        <li>Delete your own comments</li>
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Timeline Visualization</h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        <li>Visual markers on timeline for comments</li>
                        <li>Filter to show comments near current playback time</li>
                        <li>Click markers to seek to comment timestamp</li>
                        <li>Synchronized with lyrics when applicable</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
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