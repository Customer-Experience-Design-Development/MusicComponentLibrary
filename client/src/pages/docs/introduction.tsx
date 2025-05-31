import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Introduction() {
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

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/docs/introduction" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Introduction to MusicUI" 
              description="A comprehensive library of music interface components for modern applications"
            />

            {/* Hero Section */}
            <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2 text-primary">Welcome to MusicUI</h2>
                  <p className="text-lg text-muted-foreground mb-4">
                    Build beautiful music applications with our comprehensive component library. 
                    Whether you're creating a streaming platform, DJ software, or music education app, 
                    MusicUI provides the building blocks you need.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Tailwind CSS</Badge>
                    <Badge variant="secondary">iOS</Badge>
                    <Badge variant="secondary">Android</Badge>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/docs/installation">
                      <Button>Get Started</Button>
                    </Link>
                    <Link href="/components">
                      <Button variant="outline">View Components</Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-48 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                    <i className="ri-music-2-line text-4xl text-primary"></i>
                  </div>
                </div>
              </div>
            </div>

            {/* What is MusicUI */}
            <section className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>What is MusicUI?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    MusicUI is a modern, comprehensive component library specifically designed for music applications. 
                    It provides pre-built, customizable components that handle common music interface patterns, 
                    allowing developers to focus on their unique features rather than rebuilding basic functionality.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                        <i className="ri-palette-line text-primary"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Beautiful Design</h3>
                        <p className="text-sm text-muted-foreground">
                          Modern, accessible components with dark mode support and customizable theming
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                        <i className="ri-smartphone-line text-primary"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Cross-Platform</h3>
                        <p className="text-sm text-muted-foreground">
                          Available for React, iOS (Swift), and Android (Kotlin) with consistent APIs
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                        <i className="ri-code-line text-primary"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Developer Experience</h3>
                        <p className="text-sm text-muted-foreground">
                          TypeScript support, comprehensive documentation, and intuitive APIs
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                        <i className="ri-equalizer-line text-primary"></i>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Music-First</h3>
                        <p className="text-sm text-muted-foreground">
                          Purpose-built for music applications with audio handling and visualization features
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Key Features */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Key Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-play-circle-line text-xl mr-2 text-primary"></i>
                      Audio Playback
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Complete audio player components with controls, progress tracking, and queue management.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-bar-chart-line text-xl mr-2 text-primary"></i>
                      Visualizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Audio visualizers, waveforms, spectrograms, and real-time frequency analyzers.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-list-unordered text-xl mr-2 text-primary"></i>
                      Collections
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Playlists, album grids, media cards, and other components for organizing music content.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-search-line text-xl mr-2 text-primary"></i>
                      Search & Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Search interfaces for songs, artists, albums, and lyrics with autocomplete and filters.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-pie-chart-line text-xl mr-2 text-primary"></i>
                      Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Performance charts, engagement metrics, and analytics dashboards for music platforms.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-base">
                      <i className="ri-smartphone-line text-xl mr-2 text-primary"></i>
                      Mobile-First
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Responsive design with touch-optimized controls and mobile-specific interfaces.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Use Cases */}
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Perfect For</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-music-2-line text-xl mr-2 text-primary"></i>
                      Music Streaming Platforms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Audio players with queue management
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Playlist creation and management
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Search and discovery interfaces
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        User engagement analytics
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-disc-line text-xl mr-2 text-primary"></i>
                      DJ & Production Software
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Waveform displays and editing
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Real-time audio visualizations
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Equalizers and audio controls
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Performance monitoring
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-graduation-cap-line text-xl mr-2 text-primary"></i>
                      Music Education Apps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Interactive learning interfaces
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Progress tracking components
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Music theory visualizations
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Practice session management
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-building-line text-xl mr-2 text-primary"></i>
                      Music Industry Tools
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Rights management interfaces
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Analytics and reporting
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Release calendar management
                      </li>
                      <li className="flex items-center">
                        <i className="ri-check-line text-primary mr-2"></i>
                        Artist and label dashboards
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Next Steps */}
            <section className="mb-8">
              <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
                <CardHeader>
                  <CardTitle>Ready to Get Started?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Follow our step-by-step guide to add MusicUI to your project and start building 
                    beautiful music interfaces in minutes.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/docs/installation">
                      <Button className="w-full sm:w-auto">
                        <i className="ri-download-line mr-2"></i>
                        Installation Guide
                      </Button>
                    </Link>
                    <Link href="/docs/quick-start">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-rocket-line mr-2"></i>
                        Quick Start Tutorial
                      </Button>
                    </Link>
                    <Link href="/components">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <i className="ri-grid-line mr-2"></i>
                        Browse Components
                      </Button>
                    </Link>
                  </div>
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