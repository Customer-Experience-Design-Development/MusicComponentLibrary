import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { MashupCreator } from '@/components/music-ui/MashupCreator';
import { Track } from '@/types/music';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
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

export default function MashupCreatorPage() {
  const { toast } = useToast();

  const vocalTrack: Track = {
    id: 1,
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
  
  const instrumentalTrack: Track = {
    id: 2,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 255, // 4:15
    albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    metadata: {
      bpm: 120,
      key: "C minor",
      genre: ["Electronic", "Ambient"]
    }
  };
  
  const vocalStems = [
    {
      name: "Lead Vocals",
      source: {
        url: "/stems/vocals_lead.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 100,
      muted: false,
      trackId: 1,
      type: 'vocal' as const
    },
    {
      name: "Backing Vocals",
      source: {
        url: "/stems/vocals_backing.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 85,
      muted: false,
      trackId: 1,
      type: 'vocal' as const
    },
    {
      name: "Vocal Effects",
      source: {
        url: "/stems/vocals_fx.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 70,
      muted: false,
      trackId: 1,
      type: 'vocal' as const
    }
  ];
  
  const instrumentalStems = [
    {
      name: "Drums",
      source: {
        url: "/stems/drums.mp3",
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
        url: "/stems/bass.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 95,
      muted: false,
      trackId: 2,
      type: 'instrumental' as const
    },
    {
      name: "Synth",
      source: {
        url: "/stems/synth.mp3",
        format: "mp3" as const,
        quality: "high" as const
      },
      volume: 85,
      muted: false,
      trackId: 2,
      type: 'instrumental' as const
    },
    {
      name: "Pads",
      source: {
        url: "/stems/pads.mp3",
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/mashup-creator" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Mashup Creator" 
              description="An advanced component for creating mashups by combining vocal stems from one track with instrumental stems from another, including tempo matching and timing adjustments."
            />
            
            <div className="mt-8">
              <Card className="p-6">
                <MashupCreator 
                  vocalTrack={vocalTrack}
                  instrumentalTrack={instrumentalTrack}
                  vocalStems={vocalStems}
                  instrumentalStems={instrumentalStems}
                  onSave={handleSaveMashup}
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