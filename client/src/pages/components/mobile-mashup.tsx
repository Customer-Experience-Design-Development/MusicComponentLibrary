import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { MobileMashupCreator } from '@/components/music-ui/MobileMashupCreator';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

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

export default function MobileMashupPage() {
  const [activeTab, setActiveTab] = useState('phone');
  const { toast } = useToast();

  const vocalTrack: Track = {
    id: 1,
    title: "Summer Vibes",
    artist: "Voice Collective",
    duration: 215, // 3:35
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    metadata: {
      bpm: 124,
      key: "G major",
      genre: ["Pop", "Dance"]
    }
  };
  
  const instrumentalTrack: Track = {
    id: 2,
    title: "Midnight Flow",
    artist: "Beat Makers",
    duration: 228, // 3:48
    albumArt: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    metadata: {
      bpm: 120,
      key: "G major",
      genre: ["Electronic", "Hip-Hop"]
    }
  };
  
  const vocalStems = [
    {
      name: "Lead Vocals",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false,
      trackId: 1,
      type: 'vocal' as const
    },
    {
      name: "Backing Vox",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 80,
      muted: false,
      trackId: 1,
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
      trackId: 2,
      type: 'instrumental' as const
    },
    {
      name: "Bass",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 90,
      muted: false,
      trackId: 2,
      type: 'instrumental' as const
    },
    {
      name: "Synth",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73c3a.mp3?filename=electronic-rock-beat-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 85,
      muted: false,
      trackId: 2,
      type: 'instrumental' as const
    },
    {
      name: "Percussion",
      source: {
        url: "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 75,
      muted: false,
      trackId: 2,
      type: 'instrumental' as const
    }
  ];
  
  const handleSaveMashup = (mashupData: any) => {
    console.log('Mashup saved:', mashupData);
    toast({
      title: "Mashup Saved",
      description: `Created mashup of "${vocalTrack.title}" vocals with "${instrumentalTrack.title}" instrumentals`,
    });
  };
  
  const handleShareMashup = (mashupData: any) => {
    console.log('Mashup shared:', mashupData);
    toast({
      title: "Mashup Shared",
      description: "Your mashup has been shared successfully!",
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/mobile-mashup" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Mobile Mashup Creator" 
              description="A touchscreen-optimized interface for creating mashups on mobile devices, inspired by professional DJ software."
            />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="mb-4">
                <TabsTrigger value="phone" className="flex items-center">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Phone
                </TabsTrigger>
                <TabsTrigger value="tablet" className="flex items-center">
                  <Tablet className="mr-2 h-4 w-4" />
                  Tablet
                </TabsTrigger>
                <TabsTrigger value="desktop" className="flex items-center">
                  <Monitor className="mr-2 h-4 w-4" />
                  Desktop
                </TabsTrigger>
              </TabsList>
              
              <Card>
                <TabsContent value="phone" className="flex justify-center p-6">
                  <div className="w-[320px] h-[600px] bg-black rounded-2xl overflow-hidden shadow-xl p-2 border-8 border-black">
                    <MobileMashupCreator 
                      vocalTrack={vocalTrack}
                      instrumentalTrack={instrumentalTrack}
                      vocalStems={vocalStems}
                      instrumentalStems={instrumentalStems}
                      onSave={handleSaveMashup}
                      onShare={handleShareMashup}
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="tablet" className="flex justify-center p-6">
                  <div className="w-[600px] h-[800px] bg-black rounded-2xl overflow-hidden shadow-xl p-3 border-8 border-black">
                    <MobileMashupCreator 
                      vocalTrack={vocalTrack}
                      instrumentalTrack={instrumentalTrack}
                      vocalStems={vocalStems}
                      instrumentalStems={instrumentalStems}
                      onSave={handleSaveMashup}
                      onShare={handleShareMashup}
                      className="w-full h-full rounded-xl"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="desktop" className="flex justify-center p-6">
                  <div className="w-[900px] h-[600px] bg-black rounded-lg overflow-hidden shadow-xl p-1">
                    <MobileMashupCreator 
                      vocalTrack={vocalTrack}
                      instrumentalTrack={instrumentalTrack}
                      vocalStems={vocalStems}
                      instrumentalStems={instrumentalStems}
                      onSave={handleSaveMashup}
                      onShare={handleShareMashup}
                      className="w-full h-full rounded-lg"
                    />
                  </div>
                </TabsContent>
              </Card>
              
              <div className="mt-6 text-sm text-muted-foreground">
                <h3 className="font-medium text-foreground mb-2">Mobile-Friendly Features:</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Touch-optimized interface with larger tap targets</li>
                  <li>Collapsible sections to maximize screen space</li>
                  <li>Quick stem pads for instant remixing</li>
                  <li>Simplified controls for BPM and timing adjustment</li>
                  <li>One-tap mute/solo for individual stems</li>
                  <li>Compact waveform visualization</li>
                  <li>Auto-sync feature for quick mashups</li>
                </ul>
              </div>
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