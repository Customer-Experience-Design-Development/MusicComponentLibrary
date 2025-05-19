import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { StemPlayer } from '@/components/music-ui/StemPlayer';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';

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

export default function StemPlayerPage() {
  const track: Track = {
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331, // 5:31
    albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  };

  const stems = [
    {
      name: "Drums",
      source: {
        url: "/stems/drums.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Bass",
      source: {
        url: "/stems/bass.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Vocals",
      source: {
        url: "/stems/vocals.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    },
    {
      name: "Synth",
      source: {
        url: "/stems/synth.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false
    }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/stem-player" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Stem Player" 
              description="A specialized audio player component for controlling individual stems of a track."
            />
            
            <div className="mt-8">
              <Card className="p-6">
                <StemPlayer 
                  track={track} 
                  stems={stems}
                  showWaveform={true}
                />
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