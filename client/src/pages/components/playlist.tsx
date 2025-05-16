import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Playlist } from '@/components/music-ui/Playlist';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PlaylistPage() {
  // Sample tracks for demo
  const tracks = [
    {
      id: 1,
      title: "Starlight Melody",
      artist: "Cosmic Dreams",
      duration: 237, // 3:57
      albumArt: "https://placehold.co/200x200/4F46E5/FFFFFF/png?text=Cosmic+Dreams",
      audioSrc: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
      waveformData: "0.1,0.15,0.2,0.15,0.15,0.11,0.125,0.15,0.175,0.2,0.23,0.25,0.26,0.24,0.23,0.22,0.21,0.2,0.18,0.16,0.14,0.126,0.125,0.12,0.135,0.15"
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Ambient Shores",
      duration: 184, // 3:04
      albumArt: "https://placehold.co/200x200/16A34A/FFFFFF/png?text=Ambient+Shores",
      audioSrc: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      waveformData: "0.15,0.16,0.17,0.18,0.19,0.17,0.16,0.15,0.14,0.13,0.15,0.17,0.19,0.2,0.21,0.20,0.19,0.18,0.17,0.16,0.15,0.14,0.15,0.16,0.17,0.18"
    },
    {
      id: 3,
      title: "Midnight Jazz",
      artist: "Urban Quartet",
      duration: 312, // 5:12
      albumArt: "https://placehold.co/200x200/CA8A04/FFFFFF/png?text=Urban+Quartet",
      audioSrc: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      waveformData: "0.12,0.13,0.14,0.15,0.16,0.17,0.18,0.19,0.2,0.21,0.22,0.21,0.2,0.19,0.18,0.17,0.18,0.19,0.2,0.21,0.22,0.23,0.22,0.21,0.2,0.19"
    },
    {
      id: 4,
      title: "Electric Dreams",
      artist: "Synthwave Collective",
      duration: 263, // 4:23
      albumArt: "https://placehold.co/200x200/DC2626/FFFFFF/png?text=Synthwave",
      audioSrc: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      waveformData: "0.2,0.25,0.3,0.35,0.3,0.25,0.2,0.15,0.1,0.15,0.2,0.25,0.3,0.35,0.3,0.25,0.2,0.15,0.1,0.15,0.2,0.25,0.3,0.25,0.2,0.15"
    },
    {
      id: 5,
      title: "Mountain Echo",
      artist: "Wilderness Sound",
      duration: 198, // 3:18
      albumArt: "https://placehold.co/200x200/7E22CE/FFFFFF/png?text=Wilderness",
      audioSrc: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3",
      waveformData: "0.1,0.12,0.14,0.16,0.18,0.2,0.22,0.24,0.26,0.24,0.22,0.2,0.18,0.16,0.14,0.12,0.1,0.12,0.14,0.16,0.18,0.2,0.18,0.16,0.14,0.12"
    }
  ];

  // Sidebar categories
  const sidebarCategories: NavCategory[] = [
    {
      title: "Getting Started",
      links: [
        { title: "Introduction", path: "/" },
        { title: "Installation", path: "/installation" },
        { title: "Usage", path: "/usage" },
        { title: "Theming", path: "/theming" },
      ]
    },
    {
      title: "Components",
      links: [
        { title: "Overview", path: "/components" },
        { title: "Component Showcase", path: "/components/showcase" },
        { title: "Audio Player", path: "/components/audio-player" },
        { title: "Playlist", path: "/components/playlist", active: true },
        { title: "Visualizer", path: "/components/visualizer" },
        { title: "Waveform", path: "/components/waveform" },
        { title: "Volume Control", path: "/components/volume-control" },
        { title: "Media Card", path: "/components/media-card" },
        { title: "Equalizer", path: "/components/equalizer" },
      ]
    },
    {
      title: "Resources",
      links: [
        { title: "Figma Integration", path: "/resources/figma" },
        { title: "Platform Support", path: "/resources/platforms" },
        { title: "Accessibility", path: "/resources/accessibility" },
        { title: "Changelog", path: "/resources/changelog" },
      ]
    }
  ];

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

  // Social links
  const socialLinks = [
    { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
    { icon: "ri-github-fill", href: "https://github.com/musicui" },
    { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Playlist Component" 
              description="Display and manage collections of tracks with playback controls."
            />
            
            <Tabs defaultValue="preview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="documentation">Documentation</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="p-0 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Playlist Demo</CardTitle>
                    <CardDescription>
                      Interactive demo of the Playlist component with full functionality.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="max-w-2xl mx-auto">
                      <Playlist 
                        tracks={tracks}
                        selectedTrackId={2}
                        onSelect={(track) => console.log('Selected track:', track)}
                        onShuffle={() => console.log('Shuffle clicked')}
                        onRepeat={() => console.log('Repeat clicked')}
                        onAddTrack={() => console.log('Add track clicked')}
                        onDownload={() => console.log('Download clicked')}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="documentation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentation</CardTitle>
                    <CardDescription>
                      Learn how to use the Playlist component in your applications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Overview</h3>
                      <p className="text-muted-foreground">
                        The Playlist component provides a comprehensive interface for displaying and interacting with 
                        collections of tracks. It supports track selection, reordering, shuffling, and more.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Props</h3>
                      <div className="border rounded-md divide-y">
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-medium">Name</div>
                          <div className="font-medium">Type</div>
                          <div className="font-medium">Description</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">tracks</div>
                          <div className="font-mono text-sm">Track[]</div>
                          <div>Array of track objects to display in the playlist.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">selectedTrackId</div>
                          <div className="font-mono text-sm">number?</div>
                          <div>ID of the currently selected/playing track.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">onSelect</div>
                          <div className="font-mono text-sm">(track: Track) =&gt; void</div>
                          <div>Callback when a track is selected.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">onShuffle</div>
                          <div className="font-mono text-sm">() =&gt; void</div>
                          <div>Callback when the shuffle button is clicked.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">onRepeat</div>
                          <div className="font-mono text-sm">() =&gt; void</div>
                          <div>Callback when the repeat button is clicked.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">onAddTrack</div>
                          <div className="font-mono text-sm">() =&gt; void</div>
                          <div>Callback when the add track button is clicked.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">onDownload</div>
                          <div className="font-mono text-sm">() =&gt; void</div>
                          <div>Callback when the download button is clicked.</div>
                        </div>
                        <div className="grid grid-cols-3 p-3">
                          <div className="font-mono text-sm">className</div>
                          <div className="font-mono text-sm">string?</div>
                          <div>Additional CSS classes to apply to the component.</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Track Object Structure</h3>
                      <div className="border rounded-md p-4 bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
  albumArt?: string;
  audioSrc?: string;
  waveformData?: string;
}`}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Usage Guidelines</h3>
                      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                        <li>Use the Playlist component when you need to display multiple tracks that can be selected for playback.</li>
                        <li>The component works best when paired with an AudioPlayer component that can play the selected track.</li>
                        <li>Set the selectedTrackId prop to highlight the currently playing track.</li>
                        <li>Implement the onSelect callback to handle track selection and playback.</li>
                        <li>The component supports keyboard navigation for accessibility.</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Implementation</CardTitle>
                    <CardDescription>
                      Code example of how to use the Playlist component.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-md p-4 bg-muted font-mono text-sm whitespace-pre overflow-auto">
{`import { useState } from 'react';
import { Playlist } from '@musicui/react';
import type { Track } from '@musicui/react';

export default function PlaylistExample() {
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  
  const tracks: Track[] = [
    {
      id: 1,
      title: "Starlight Melody",
      artist: "Cosmic Dreams",
      duration: 237,
      albumArt: "/album-art-1.jpg"
    },
    {
      id: 2,
      title: "Ocean Waves",
      artist: "Ambient Shores",
      duration: 184,
      albumArt: "/album-art-2.jpg"
    },
    // More tracks...
  ];
  
  return (
    <Playlist
      tracks={tracks}
      selectedTrackId={selectedTrack?.id}
      onSelect={(track) => setSelectedTrack(track)}
      onShuffle={() => {
        // Implement shuffle logic
      }}
      onRepeat={() => {
        // Implement repeat logic
      }}
    />
  );
}`}
                    </div>
                  </CardContent>
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