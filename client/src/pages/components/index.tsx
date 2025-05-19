import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import {
  CircleDollarSign,
  Music2,
  BarChart3,
  BookOpen,
  BookText,
  Radio,
  Disc,
  LayoutGrid,
  Activity,
  Volume2,
  SlidersHorizontal,
  ArrowRight,
} from 'lucide-react';

export default function ComponentsIndex() {
  // Sidebar categories
  

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

  // Component categories
  const componentCategories = [
    {
      title: "Core Audio",
      description: "Essential components for audio playback and control",
      icon: <Music2 className="h-8 w-8 text-primary" />,
      components: [
        { name: "Audio Player", path: "/components/audio-player", description: "Full-featured audio player with waveform visualization" },
        { name: "Mini Player", path: "/components/mini-player", description: "Compact audio player for space-constrained UIs" },
        { name: "Volume Control", path: "/components/volume-control", description: "Audio volume adjustment with visual feedback" },
      ]
    },
    {
      title: "Visualization",
      description: "Components for visualizing audio data and music",
      icon: <Activity className="h-8 w-8 text-primary" />,
      components: [
        { name: "Visualizer", path: "/components/visualizer", description: "Real-time audio visualization with multiple styles" },
        { name: "Waveform", path: "/components/waveform", description: "Static and interactive audio waveform display" },
        { name: "Equalizer", path: "/components/equalizer", description: "Visual representation of audio frequencies" },
      ]
    },
    {
      title: "Collection Management",
      description: "Components for organizing and displaying music collections",
      icon: <LayoutGrid className="h-8 w-8 text-primary" />,
      components: [
        { name: "Album Grid", path: "/components/album-grid", description: "Grid-based display for album collections" },
        { name: "Playlist", path: "/components/playlist", description: "Ordered list of tracks with playback controls" },
        { name: "Media Card", path: "/components/media-card", description: "Display card for individual tracks or albums" },
      ]
    },
    {
      title: "Artist Tools",
      description: "Components for artists to monitor and manage their music",
      icon: <BarChart3 className="h-8 w-8 text-primary" />,
      components: [
        { name: "Performance Chart", path: "/components/performance-chart", description: "Data visualization for streaming and engagement metrics" },
        { name: "Release Calendar", path: "/components/release-calendar", description: "Planning and scheduling tool for music releases" },
        { name: "Audience Map", path: "/components/audience-map", description: "Geographic visualization of listener distribution" },
      ]
    },
    {
      title: "Education",
      description: "Components for music education and theory",
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      components: [
        { name: "Theory Visualizer", path: "/components/theory-visualizer", description: "Interactive visualization of music theory concepts" },
        { name: "Practice Timer", path: "/components/practice-timer", description: "Specialized timer for music practice sessions" },
        { name: "Notation Display", path: "/components/notation-display", description: "Sheet music and notation rendering" },
      ]
    },
    {
      title: "Industry",
      description: "Components for music industry professionals",
      icon: <CircleDollarSign className="h-8 w-8 text-primary" />,
      components: [
        { name: "Rights Manager", path: "/components/rights-manager", description: "Interface for managing music rights and licensing" },
        { name: "Contract Viewer", path: "/components/contract-viewer", description: "Specialized document viewer for music contracts" },
        { name: "Royalty Calculator", path: "/components/royalty-calculator", description: "Tool for calculating and visualizing royalty splits" },
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        categories={footerCategories} 
        socialLinks={socialLinks} 
      />
    </div>
  );
}