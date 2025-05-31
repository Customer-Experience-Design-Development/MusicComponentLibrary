import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { AudioPlayer } from '@/components/music-ui/AudioPlayer';
import { StemPlayer } from '@/components/music-ui/StemPlayer';
import { MashupCreator } from '@/components/music-ui/MashupCreator';
import { TimelineComment } from '@/components/music-ui/types';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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

// Demo comments for the track
const demoComments: TimelineComment[] = [
  {
    id: "comment-1",
    timestamp: 15.5,
    content: "Love the bass line that comes in here!",
    author: {
      id: "user-123",
      name: "Bass Enthusiast",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: "2024-06-15T14:30:00Z",
    reactions: [
      {
        id: "reaction-1",
        emoji: "👍",
        count: 5,
        users: ["user-1", "user-2", "user-3", "user-4", "user-5"]
      },
      {
        id: "reaction-2",
        emoji: "🔥",
        count: 3,
        users: ["user-6", "user-7", "user-8"]
      }
    ]
  },
  {
    id: "comment-2",
    timestamp: 45.2,
    content: "The synth melody at this part is so captivating!",
    author: {
      id: "user-456",
      name: "Synth Wave",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: "2024-06-15T15:45:00Z",
    reactions: [
      {
        id: "reaction-3",
        emoji: "💯",
        count: 2,
        users: ["user-9", "user-10"]
      }
    ]
  },
  {
    id: "comment-3",
    timestamp: 89.7,
    content: "This transition is perfect for the drop!",
    author: {
      id: "user-789",
      name: "DJ Mixer",
      avatar: "https://github.com/shadcn.png"
    },
    createdAt: "2024-06-15T16:20:00Z",
    reactions: [
      {
        id: "reaction-4",
        emoji: "🎵",
        count: 7,
        users: ["user-11", "user-12", "user-13", "user-14", "user-15", "user-16", "user-17"]
      }
    ],
    replies: [
      {
        id: "reply-1",
        timestamp: 89.7,
        content: "Absolutely! The filter sweep makes it so smooth.",
        author: {
          id: "user-456",
          name: "Synth Wave",
          avatar: "https://github.com/shadcn.png"
        },
        createdAt: "2024-06-15T16:35:00Z",
        reactions: [
          {
            id: "reaction-5",
            emoji: "👏",
            count: 2,
            users: ["user-789", "user-123"]
          }
        ]
      }
    ]
  }
];

// Example current user
const currentUser = {
  id: "user-current",
  name: "Music Explorer",
  avatar: "https://github.com/shadcn.png"
};

export default function AudioPlayerPage() {
  const [activeTab, setActiveTab] = useState('standard');
  const { toast } = useToast();

  const track: Track = {
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331, // 5:31
    albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    audioSrc: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
    metadata: {
      bpm: 120,
      key: "C minor",
      genre: ["Electronic", "Ambient"]
    }
  };

  const vocalTrack: Track = {
    id: 2,
    title: "Midnight Dreams",
    artist: "Vocal Legends",
    duration: 240, // 4:00
    albumArt: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    metadata: {
      bpm: 128,
      key: "C minor",
      genre: ["Pop", "R&B"]
    }
  };

  const stems = [
    {
      name: "Drums",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Bass",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Vocals",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Synth",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    }
  ];

  const vocalStems = [
    {
      name: "Lead Vocals",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false,
      trackId: 2,
      type: 'vocal' as const
    },
    {
      name: "Backing Vocals",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 85,
      muted: false,
      trackId: 2,
      type: 'vocal' as const
    }
  ];
  
  const instrumentalStems = [
    {
      name: "Drums",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false,
      trackId: 1,
      type: 'instrumental' as const
    },
    {
      name: "Bass",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 95,
      muted: false,
      trackId: 1,
      type: 'instrumental' as const
    }
  ];

  const handleSaveMashup = (mashupData: any) => {
    console.log('Mashup saved:', mashupData);
    toast({
      title: "Mashup Saved",
      description: `Created mashup of "${vocalTrack.title}" vocals with "${track.title}" instrumentals`,
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/audio-player" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Audio Player" 
              description="A comprehensive audio player component with advanced playback controls and interactive timeline comments."
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="standard">Standard Player</TabsTrigger>
                <TabsTrigger value="project">Project Style</TabsTrigger>
                <TabsTrigger value="comments">Player with Comments</TabsTrigger>
                <TabsTrigger value="stems">Stem Player</TabsTrigger>
                <TabsTrigger value="mashup">Mashup Creator</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard">
                <Card className="p-6">
                  <AudioPlayer track={track} />
                </Card>
              </TabsContent>
              
              <TabsContent value="project">
                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Project-Style Interface</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Inspired by modern music production interfaces with clean layouts and warm color schemes.
                  </p>
                  <AudioPlayer 
                    track={track} 
                    showWaveform={true}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="comments">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Interactive Timeline Comments</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Add comments, reactions, and emoji responses at specific timestamps in the audio.
                  </p>
                  <AudioPlayer 
                    track={track} 
                    showComments={true}
                    initialComments={demoComments}
                    currentUser={currentUser}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="stems">
                <Card className="p-6">
                  <StemPlayer 
                    track={track} 
                    stems={stems}
                    showWaveform={true}
                  />
                </Card>
              </TabsContent>
              
              <TabsContent value="mashup">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Create Mashups with Vocal and Instrumental Stems</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                    Mix vocals from one track with instrumentals from another, with tempo and timing alignment.
                  </p>
                  <MashupCreator 
                    vocalTrack={vocalTrack}
                    instrumentalTrack={track}
                    vocalStems={vocalStems}
                    instrumentalStems={instrumentalStems}
                    onSave={handleSaveMashup}
                  />
                </Card>
              </TabsContent>
            </Tabs>
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
