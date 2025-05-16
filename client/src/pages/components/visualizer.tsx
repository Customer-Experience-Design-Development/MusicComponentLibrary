import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Visualizer } from '@/components/music-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

export default function VisualizerPage() {
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
        { title: "Playlist", path: "/components/playlist" },
        { title: "Visualizer", path: "/components/visualizer", active: true },
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

  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'circle' | 'wave'>('bars');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Visualizer Component" 
              description="Real-time audio visualization for music applications."
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
                    <CardTitle>Visualizer</CardTitle>
                    <CardDescription>
                      A component for creating real-time visual representations of audio frequencies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="md:flex md:justify-between md:space-x-4">
                      <div className="md:flex-1">
                        <h3 className="text-lg font-medium mb-2">Features</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Multiple visualization styles (bars, wave, circle)</li>
                          <li>Real-time frequency analysis</li>
                          <li>Customizable colors and appearance</li>
                          <li>Responsive design that adapts to container size</li>
                          <li>Performant with canvas-based rendering</li>
                          <li>Animation smoothing for visual appeal</li>
                        </ul>
                      </div>
                      <div className="md:flex-1 mt-4 md:mt-0">
                        <h3 className="text-lg font-medium mb-2">Use Cases</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Music playback interfaces with visual feedback</li>
                          <li>DJ and music creation applications</li>
                          <li>Audio recording and editing tools</li>
                          <li>Live music performances</li>
                          <li>Music education and theory applications</li>
                          <li>Background visuals for music-focused websites</li>
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
                        import {"{"} Visualizer {"}"} from 'music-ui';
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
                            <td className="py-2 font-mono text-sm">type</td>
                            <td className="py-2 font-mono text-sm">'bars' | 'circle' | 'wave'</td>
                            <td className="py-2 font-mono text-sm">'bars'</td>
                            <td className="py-2">The visualization style to display</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">colorPalette</td>
                            <td className="py-2 font-mono text-sm">string[]</td>
                            <td className="py-2 font-mono text-sm">['#6200EA', ...]</td>
                            <td className="py-2">Array of colors to use in the visualization</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">height</td>
                            <td className="py-2 font-mono text-sm">number</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Height of the visualization in pixels</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">isActive</td>
                            <td className="py-2 font-mono text-sm">boolean</td>
                            <td className="py-2 font-mono text-sm">false</td>
                            <td className="py-2">Whether the visualization is active</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">audioElement</td>
                            <td className="py-2 font-mono text-sm">HTMLAudioElement | null</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Audio element to analyze</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-mono text-sm">onTypeChange</td>
                            <td className="py-2 font-mono text-sm">(type: 'bars' | 'circle' | 'wave') => void</td>
                            <td className="py-2 font-mono text-sm">undefined</td>
                            <td className="py-2">Callback when visualization type changes</td>
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
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Example</CardTitle>
                    <CardDescription>An interactive visualizer with different visualization types.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Button onClick={handlePlayPause}>
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                        
                        <Select value={visualizerType} onValueChange={(value) => setVisualizerType(value as any)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Visualization Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bars">Bars</SelectItem>
                            <SelectItem value="circle">Circle</SelectItem>
                            <SelectItem value="wave">Wave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="aspect-video bg-black rounded-md overflow-hidden">
                        <Visualizer 
                          type={visualizerType}
                          audioElement={audioRef.current}
                          isActive={isPlaying}
                          colorPalette={['#6200EA', '#9D46FF', '#D0BCFF']}
                          onTypeChange={setVisualizerType}
                        />
                      </div>
                    </div>
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
      
      <audio 
        ref={audioRef}
        src={audioSrc}
        className="hidden"
        loop
      />
    </div>
  );
}