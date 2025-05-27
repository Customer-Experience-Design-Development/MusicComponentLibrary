
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import {
  CircleDollarSign,
  Music2,
  BarChart3,
  BookOpen,
  Radio,
  LayoutGrid,
  Activity,
  Volume2,
  Mic2,
  Search,
  PlayCircle,
  Calendar,
  ArrowRight
} from 'lucide-react';

export default function ComponentsIndex() {
  const componentCategories = [
    {
      title: "Playback",
      description: "Essential components for audio playback and control",
      icon: <Music2 className="h-8 w-8 text-primary" />,
      components: [
        { name: "Audio Player", path: "/components/audio-player", description: "Full-featured audio player with controls" },
        { name: "Mini Player", path: "/components/mini-player", description: "Compact audio player for minimal interfaces" },
        { name: "Song Card Player", path: "/components/song-card-player", description: "Card-based audio player component" },
        { name: "Volume Control", path: "/components/volume-control", description: "Audio volume adjustment component" }
      ]
    },
    {
      title: "Visualization",
      description: "Components for visualizing audio data",
      icon: <Activity className="h-8 w-8 text-primary" />,
      components: [
        { name: "Visualizer", path: "/components/visualizer", description: "Real-time audio visualization" },
        { name: "Waveform", path: "/components/waveform", description: "Audio waveform display" },
        { name: "Equalizer", path: "/components/equalizer", description: "Audio frequency visualization" },
        { name: "Theory Visualizer", path: "/components/theory-visualizer", description: "Music theory visualization" }
      ]
    },
    {
      title: "Collections",
      description: "Components for organizing music collections",
      icon: <LayoutGrid className="h-8 w-8 text-primary" />,
      components: [
        { name: "Playlist", path: "/components/playlist", description: "Playlist management component" },
        { name: "Album Grid", path: "/components/album-grid", description: "Grid layout for album collections" },
        { name: "Media Card", path: "/components/media-card", description: "Media information display card" },
        { name: "Release Calendar", path: "/components/release-calendar", description: "Release schedule management" }
      ]
    },
    {
      title: "Analytics",
      description: "Components for music performance tracking",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      components: [
        { name: "Performance Chart", path: "/components/performance-chart", description: "Music metrics visualization" }
      ]
    },
    {
      title: "Search",
      description: "Components for finding and exploring music",
      icon: <Search className="h-8 w-8 text-primary" />,
      components: [
        { name: "Song Search", path: "/components/song-search", description: "Music search interface" },
        { name: "Song Lyrics Search", path: "/components/song-lyrics-search", description: "Lyrics search interface" }
      ]
    },
    {
      title: "Details",
      description: "Components for displaying detailed information",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      components: [
        { name: "Song Details", path: "/components/song-details", description: "Detailed song information" },
        { name: "Artist Details", path: "/components/artist-details", description: "Detailed artist information" },
        { name: "Album Details", path: "/components/album-details", description: "Detailed album information" },
        { name: "Song Lyrics", path: "/components/song-lyrics", description: "Lyrics display component" }
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Components" 
              description="Explore our comprehensive library of UI components designed specifically for music applications."
            />
            
            <div className="mt-8 space-y-10">
              {componentCategories.map((category, i) => (
                <div key={i}>
                  <div className="flex items-start mb-4">
                    <div className="mr-4 p-2 bg-primary/10 rounded-lg">
                      {category.icon}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                      <p className="text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.components.map((component, j) => (
                      <Link key={j} href={component.path}>
                        <Card className="h-full cursor-pointer hover:border-primary transition-colors group">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors">
                              {component.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm">
                              {component.description}
                            </CardDescription>
                            <div className="mt-4 text-primary text-sm font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              View component <ArrowRight className="ml-1 h-4 w-4" />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      
      <Footer 
        categories={[
          {
            title: "Documentation",
            links: [
              { label: "Getting Started", href: "/docs/introduction" },
              { label: "API Reference", href: "/docs/api" },
              { label: "Examples", href: "/docs/examples" }
            ]
          },
          {
            title: "Resources",
            links: [
              { label: "GitHub", href: "https://github.com/musicui" },
              { label: "Discord", href: "https://discord.gg/musicui" }
            ]
          }
        ]}
        socialLinks={[
          { icon: "ri-github-fill", href: "https://github.com/musicui" },
          { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
        ]}
      />
    </div>
  );
}
