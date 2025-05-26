import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Footer } from '@/components/Footer';
import { PageHeader } from '@/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  AudioPlayer, 
  MiniPlayer, 
  AlbumGrid, 
  PerformanceChart,
  Visualizer,
  Equalizer,
  Waveform,
  TheoryVisualizer,
  RightsManager,
  StemPlayer,
  MashupCreator
} from '@/components/music-ui';
import type { Track } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

export default function ComponentShowcase() {
  const [activeTab, setActiveTab] = useState('core');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: 1,
    title: "Midnight Groove",
    artist: "The Sound Collective",
    duration: 196,
    albumArt: "https://picsum.photos/seed/track1/200/200",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    metadata: {
      bpm: 120,
      key: "Am"
    }
  });
  
  const vocalTrack: Track = {
    id: 2,
    title: "Vocal Dreams",
    artist: "Voice Harmony",
    duration: 210,
    albumArt: "https://picsum.photos/seed/track2/200/200",
    audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    metadata: {
      bpm: 128,
      key: "C"
    }
  };
  
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sample stems for the StemPlayer
  const stems = [
    {
      name: "Drums",
      source: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Bass",
      source: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 90,
      muted: false
    }
  ];
  
  // Sample stems for the MashupCreator
  const vocalStems = [
    {
      name: "Lead Vocals",
      source: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
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
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 80,
      muted: false,
      trackId: 2,
      type: 'vocal' as const
    }
  ];
  
  const instrumentalStems = [
    {
      name: "Drums",
      source: {
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
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
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 90,
      muted: false,
      trackId: 1,
      type: 'instrumental' as const
    }
  ];
  
  // Sample tracks
  const tracks: Track[] = [
    {
      id: 1,
      title: "Midnight Groove",
      artist: "The Sound Collective",
      duration: 196,
      albumArt: "https://picsum.photos/seed/track1/200/200",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
      id: 2,
      title: "Urban Rhythm",
      artist: "Echo Chamber",
      duration: 248,
      albumArt: "https://picsum.photos/seed/track2/200/200",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
      id: 3,
      title: "Electric Dreams",
      artist: "Neon Pulse",
      duration: 221,
      albumArt: "https://picsum.photos/seed/track3/200/200",
      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    }
  ];
  
  // Sample albums
  const albums = [
    {
      id: 1,
      title: "Midnight Sessions",
      artist: "The Sound Collective",
      releaseYear: 2023,
      albumArt: "https://picsum.photos/seed/album1/300/300",
      tracks: tracks.slice(0, 2)
    },
    {
      id: 2,
      title: "Electric Dreams",
      artist: "Neon Pulse",
      releaseYear: 2022,
      albumArt: "https://picsum.photos/seed/album2/300/300",
      tracks: [tracks[2]]
    },
    {
      id: 3,
      title: "Urban Stories",
      artist: "Echo Chamber",
      releaseYear: 2023,
      albumArt: "https://picsum.photos/seed/album3/300/300",
      tracks: tracks.slice(0, 3)
    },
    {
      id: 4,
      title: "Analog Memories",
      artist: "Vintage Vibes",
      releaseYear: 2021,
      albumArt: "https://picsum.photos/seed/album4/300/300",
      tracks: tracks.slice(1, 3)
    }
  ];
  
  // Sample performance data for charts
  const performanceData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    
    return {
      date: date.toISOString().split('T')[0],
      streams: Math.floor(Math.random() * 1000) + 500,
      saves: Math.floor(Math.random() * 50) + 10,
      shares: Math.floor(Math.random() * 20) + 5
    };
  });
  
  // Sample data for rights manager
  const rightsManagerTrack = {
    id: 1,
    title: "Midnight Groove",
    isrc: "USRC12345678",
    rightHolders: [
      {
        id: 1,
        name: "John Smith",
        role: "composer" as const,
        share: 50,
        verified: true
      },
      {
        id: 2,
        name: "Jane Doe",
        role: "producer" as const,
        share: 25,
        verified: true
      },
      {
        id: 3,
        name: "Indie Label Records",
        role: "publisher" as const,
        share: 25,
        verified: false
      }
    ],
    licenses: [
      {
        id: 1,
        licensee: "Music Streaming Co.",
        type: "mechanical" as const,
        territory: ["Worldwide"],
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        status: "active" as const,
        fee: 0.05,
        feeType: "royalty" as const
      },
      {
        id: 2,
        licensee: "TV Network Inc.",
        type: "sync" as const,
        territory: ["United States", "Canada"],
        startDate: "2023-03-15",
        status: "active" as const,
        fee: 5000,
        feeType: "flat" as const
      }
    ],
    registrations: [
      {
        provider: "ASCAP",
        id: "ASC123456789",
        date: "2023-01-15",
        status: "registered" as const
      },
      {
        provider: "SoundExchange",
        id: "SE987654321",
        date: "2023-02-01",
        status: "pending" as const
      }
    ]
  };
  
  // Handle audio playback
  const handleTrackChange = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };
  
  const handleTogglePlay = (playing: boolean) => {
    setIsPlaying(playing);
  };
  
  const handleSaveMashup = (mashupData: any) => {
    console.log('Mashup saved:', mashupData);
    toast({
      title: "Mashup Saved",
      description: `Created mashup of "${vocalTrack.title}" vocals with "${currentTrack.title}" instrumentals`,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <PageHeader
          title="Music UI Components Showcase"
          description="Explore our specialized components for music industry applications"
        />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="core">Core Playback</TabsTrigger>
            <TabsTrigger value="artists">For Artists</TabsTrigger>
            <TabsTrigger value="education">For Educators</TabsTrigger>
            <TabsTrigger value="industry">For Industry</TabsTrigger>
          </TabsList>
          
          <div className="mt-6 space-y-8">
            {/* Core Playback Components */}
            <TabsContent value="core" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Audio Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <AudioPlayer 
                    track={currentTrack} 
                    onTogglePlay={handleTogglePlay}
                    autoPlay={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mini Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <MiniPlayer 
                    track={currentTrack} 
                    onTogglePlay={handleTogglePlay}
                    autoPlay={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Stem Player</CardTitle>
                </CardHeader>
                <CardContent>
                  <StemPlayer
                    track={currentTrack}
                    stems={stems}
                    showWaveform={true}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Mashup Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <MashupCreator
                    vocalTrack={vocalTrack}
                    instrumentalTrack={currentTrack}
                    vocalStems={vocalStems}
                    instrumentalStems={instrumentalStems}
                    onSave={handleSaveMashup}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Visualizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-black rounded-md overflow-hidden">
                    <Visualizer 
                      audioElement={audioRef.current}
                      isActive={isPlaying}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Waveform</CardTitle>
                </CardHeader>
                <CardContent>
                  <Waveform 
                    data={Array.from({ length: 100 }, () => Math.random())}
                    currentTime={60}
                    duration={196}
                    color="#6200EA"
                    progressColor="#9D46FF"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Artist Components */}
            <TabsContent value="artists" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Album Grid</CardTitle>
                </CardHeader>
                <CardContent>
                  <AlbumGrid 
                    albums={albums} 
                    onPlay={(album) => {
                      if (album.tracks.length > 0) {
                        handleTrackChange(album.tracks[0]);
                      }
                    }}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <PerformanceChart 
                    data={performanceData}
                    title="Track Performance"
                    description="Streaming metrics for Midnight Groove"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Education Components */}
            <TabsContent value="education" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Music Theory Visualizer</CardTitle>
                </CardHeader>
                <CardContent>
                  <TheoryVisualizer />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Industry Components */}
            <TabsContent value="industry" className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Rights Manager</CardTitle>
                </CardHeader>
                <CardContent>
                  <RightsManager track={rightsManagerTrack} />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>
      
      <Footer 
        categories={[
          {
            title: "Resources",
            links: [
              { label: "Documentation", href: "/documentation" },
              { label: "API Reference", href: "/api" },
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
          }
        ]}
        socialLinks={[
          { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
          { icon: "ri-github-fill", href: "https://github.com/musicui" },
          { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
        ]}
      />
      
      <audio 
        ref={audioRef}
        src={currentTrack.audioSrc}
        className="hidden"
        autoPlay={isPlaying}
      />
    </div>
  );
}