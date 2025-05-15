import { useState } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory, Track } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AudioPlayer } from '@/components/music-ui/AudioPlayer';

export default function AudioPlayerPage() {
  const [track, setTrack] = useState<Track>({
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331, // 5:31
    albumArt: "https://images.unsplash.com/photo-1462965326201-d02e4f455804?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  });

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
        { title: "Audio Player", path: "/components/audio-player", active: true },
        { title: "Playlist", path: "/components/playlist" },
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

  // Code examples
  const codeExample = `import { AudioPlayer } from 'music-ui';

// Minimal usage
function MyPlayer() {
  const track = {
    id: 1,
    title: "Cosmic Harmony",
    artist: "Astral Projections",
    duration: 331, // in seconds (5:31)
    albumArt: "path/to/album-art.jpg",
    audioSrc: "path/to/track.mp3",
  };
  
  return (
    <AudioPlayer 
      track={track}
      onNext={() => console.log('Next track')}
      onPrevious={() => console.log('Previous track')}
      onTogglePlay={(isPlaying) => console.log('Playing:', isPlaying)}
      autoPlay={false}
      showWaveform={true}
    />
  );
}`;

  const propsList = [
    { name: "track", type: "Track", description: "Track object containing title, artist, duration, etc.", required: true },
    { name: "onNext", type: "() => void", description: "Callback function when next button is clicked" },
    { name: "onPrevious", type: "() => void", description: "Callback function when previous button is clicked" },
    { name: "onTogglePlay", type: "(isPlaying: boolean) => void", description: "Callback function when play/pause is toggled" },
    { name: "onEnded", type: "() => void", description: "Callback function when track playback ends" },
    { name: "autoPlay", type: "boolean", description: "Automatically play track when loaded", defaultValue: "false" },
    { name: "showWaveform", type: "boolean", description: "Show waveform visualization", defaultValue: "true" },
    { name: "className", type: "string", description: "Additional CSS class names" },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Audio Player" 
              description="A comprehensive audio player component with support for playback controls, waveform visualization, and track metadata."
            />
            
            <Tabs defaultValue="preview" className="mb-8">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="props">Props</TabsTrigger>
              </TabsList>
              
              <TabsContent value="preview" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <AudioPlayer track={track} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="code" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      {codeExample}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="props" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Props</CardTitle>
                    <CardDescription>
                      Available properties for the AudioPlayer component
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                          <tr className="border-b border-neutral-200 dark:border-neutral-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Name</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Type</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Description</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Default</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                          {propsList.map((prop, index) => (
                            <tr key={index}>
                              <td className="py-3 px-4 text-sm">
                                {prop.name}
                                {prop.required && <span className="text-red-500 ml-1">*</span>}
                              </td>
                              <td className="py-3 px-4 text-sm font-mono text-primary">{prop.type}</td>
                              <td className="py-3 px-4 text-sm">{prop.description}</td>
                              <td className="py-3 px-4 text-sm">{prop.defaultValue || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Usage Examples</h2>
              
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Player</CardTitle>
                    <CardDescription>
                      Simple implementation with minimal configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AudioPlayer track={track} showWaveform={false} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>With Waveform</CardTitle>
                    <CardDescription>
                      Player with waveform visualization enabled
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AudioPlayer track={track} showWaveform={true} />
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Accessibility</h2>
              <Card>
                <CardContent className="p-6">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    The AudioPlayer component is built with accessibility in mind:
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
                    <li>All controls have appropriate ARIA labels</li>
                    <li>Keyboard navigation support for all interactive elements</li>
                    <li>Screen reader announcements for state changes</li>
                    <li>Support for reduced motion preferences</li>
                    <li>Color contrast ratios meet WCAG AA standards</li>
                  </ul>
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
