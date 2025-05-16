import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Playlist } from '@/components/music-ui';
import { Link } from 'wouter';

export default function PlaylistPage() {
  // Sample data for the sidebar
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

  // Sample tracks
  const tracks = [
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

  const [selectedTrackId, setSelectedTrackId] = useState<number | undefined>(undefined);

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Playlist Component" 
              description="A comprehensive playlist component for music applications."
            />
            
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Playlist</CardTitle>
                    <CardDescription>
                      A component for displaying and managing lists of audio tracks with playback controls.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="md:flex md:justify-between md:space-x-4">
                      <div className="md:flex-1">
                        <h3 className="text-lg font-medium mb-2">Features</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Display track information including title, artist, duration</li>
                          <li>Track selection</li>
                          <li>Visual feedback for currently playing track</li>
                          <li>Track controls (play, pause, next, previous)</li>
                          <li>Supports custom theme styling</li>
                          <li>Fully responsive design</li>
                        </ul>
                      </div>
                      <div className="md:flex-1 mt-4 md:mt-0">
                        <h3 className="text-lg font-medium mb-2">Use Cases</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Music streaming applications</li>
                          <li>Artist websites to showcase songs</li>
                          <li>Music education platforms</li>
                          <li>Podcast applications</li>
                          <li>Any audio content management UI</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Installation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md p-4">
                      <code className="text-sm">npm install music-ui</code>
                    </div>
                    <div className="mt-4 bg-neutral-100 dark:bg-neutral-800 rounded-md p-4">
                      <code className="text-sm">
                        {`import { Playlist } from 'music-ui';`}
                      </code>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Property</th>
                            <th className="text-left py-2 font-medium">Type</th>
                            <th className="text-left py-2 font-medium">Default</th>
                            <th className="text-left py-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">tracks</td>
                            <td className="py-2 font-mono text-sm">Track[]</td>
                            <td className="py-2 font-mono text-sm">Required</td>
                            <td className="py-2">Array of track objects to display in the playlist</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">selectedTrackId</td>
                            <td className="py-2 font-mono text-sm">number | undefined</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">ID of the currently selected track</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">onSelect</td>
                            <td className="py-2 font-mono text-sm">{`(track: Track) => void`}</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Callback when a track is selected</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">onShuffle</td>
                            <td className="py-2 font-mono text-sm">{`() => void`}</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Callback when shuffle button is clicked</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">onRepeat</td>
                            <td className="py-2 font-mono text-sm">{`() => void`}</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Callback when repeat button is clicked</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-sm">className</td>
                            <td className="py-2 font-mono text-sm">string</td>
                            <td className="py-2 font-mono text-sm">''</td>
                            <td className="py-2">Additional CSS class names</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Track Object Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Property</th>
                            <th className="text-left py-2 font-medium">Type</th>
                            <th className="text-left py-2 font-medium">Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">id</td>
                            <td className="py-2 font-mono text-sm">number</td>
                            <td className="py-2">Unique identifier for the track</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">title</td>
                            <td className="py-2 font-mono text-sm">string</td>
                            <td className="py-2">Title of the track</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">artist</td>
                            <td className="py-2 font-mono text-sm">string</td>
                            <td className="py-2">Artist name</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">duration</td>
                            <td className="py-2 font-mono text-sm">number</td>
                            <td className="py-2">Duration in seconds</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">albumArt</td>
                            <td className="py-2 font-mono text-sm">string | undefined</td>
                            <td className="py-2">URL to album artwork image</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-mono text-sm">audioSrc</td>
                            <td className="py-2 font-mono text-sm">string | undefined</td>
                            <td className="py-2">URL to audio file</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Example</CardTitle>
                    <CardDescription>A simple playlist with track selection.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Playlist 
                      tracks={tracks}
                      selectedTrackId={selectedTrackId}
                      onSelect={(track) => setSelectedTrackId(track.id)}
                    />
                  </CardContent>
                </Card>
                
                <div className="text-center mt-8">
                  <Link href="/components/showcase">
                    <Button>View All Components in Showcase</Button>
                  </Link>
                </div>
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