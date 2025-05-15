import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function ComponentsIndex() {
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
        { title: "Component Showcase", path: "/components/showcase", active: true },
        { title: "Audio Player", path: "/components/audio-player" },
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

  // Component categories
  const components = [
    {
      category: "Players",
      items: [
        { name: "Audio Player", path: "/components/audio-player", icon: "ri-play-circle-line" },
        { name: "Mini Player", path: "/components/mini-player", icon: "ri-play-mini-line" },
        { name: "Playlist", path: "/components/playlist", icon: "ri-list-check" },
      ],
    },
    {
      category: "Visualizations",
      items: [
        { name: "Visualizer", path: "/components/visualizer", icon: "ri-bar-chart-box-line" },
        { name: "Waveform", path: "/components/waveform", icon: "ri-sound-module-line" },
        { name: "Equalizer", path: "/components/equalizer", icon: "ri-equalizer-line" },
      ],
    },
    {
      category: "Controls",
      items: [
        { name: "Volume Control", path: "/components/volume-control", icon: "ri-volume-up-line" },
        { name: "Transport Controls", path: "/components/transport-controls", icon: "ri-skip-forward-line" },
        { name: "Seek Bar", path: "/components/seek-bar", icon: "ri-drag-move-line" },
      ],
    },
    {
      category: "Content",
      items: [
        { name: "Media Card", path: "/components/media-card", icon: "ri-album-line" },
        { name: "Artist Profile", path: "/components/artist-profile", icon: "ri-user-star-line" },
        { name: "Track List", path: "/components/track-list", icon: "ri-file-music-line" },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Components" 
              description="Explore our comprehensive library of music-specific UI components designed for cross-platform compatibility."
            />
            
            {components.map((category, index) => (
              <section key={index} className="mb-10">
                <h2 className="text-xl font-bold mb-5">{category.category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.items.map((component, compIndex) => (
                    <Link key={compIndex} href={component.path}>
                      <a>
                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                                <i className={`${component.icon} text-xl text-primary`}></i>
                              </div>
                              <ArrowRight className="h-4 w-4 text-neutral-400" />
                            </div>
                            <CardTitle className="text-base mb-1">{component.name}</CardTitle>
                            <p className="text-xs text-muted-foreground">
                              View documentation and examples
                            </p>
                          </CardContent>
                        </Card>
                      </a>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
            
            <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-5 mt-8 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">Component Showcase</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  See all our components in action with interactive examples.
                </p>
              </div>
              <Link href="/components/showcase">
                <Button className="whitespace-nowrap">
                  View Showcase
                </Button>
              </Link>
            </div>
            
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-5 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="font-bold text-lg">Need a custom component?</h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Contact us to discuss creating custom components for your specific needs.
                </p>
              </div>
              <Button className="whitespace-nowrap">
                Request Component
              </Button>
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
