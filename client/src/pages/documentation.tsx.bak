import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function Documentation() {
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

  const installationCode = `# Using npm
npm install music-ui

# Using yarn
yarn add music-ui

# Using pnpm
pnpm add music-ui`;

  const usageCode = `import { AudioPlayer, Visualizer, Playlist } from 'music-ui';

// In your component
function MusicApp() {
  return (
    <div>
      <AudioPlayer 
        track={track}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      
      <Visualizer 
        type="bars"
        audioElement={audioRef.current}
      />
      
      <Playlist 
        tracks={tracks}
        onSelect={handleTrackSelect}
      />
    </div>
  );
}`;

  const figmaIntegrationCode = `// Import from your Figma export
import { trackCard } from './figma-exports';

// Use the design tokens in your components
const MyComponent = () => {
  return (
    <div style={{ 
      borderRadius: trackCard.borderRadius,
      backgroundColor: trackCard.backgroundColor, 
      padding: trackCard.padding
    }}>
      {/* Component content */}
    </div>
  );
};`;

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Documentation" 
              description="Learn how to use MusicUI components in your music applications across different platforms."
            />
            
            <Tabs defaultValue="installation" className="mb-8">
              <TabsList>
                <TabsTrigger value="installation">Installation</TabsTrigger>
                <TabsTrigger value="usage">Basic Usage</TabsTrigger>
                <TabsTrigger value="theming">Theming</TabsTrigger>
                <TabsTrigger value="figma">Figma Integration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="installation" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Installation</CardTitle>
                    <CardDescription>
                      Add MusicUI to your project using your preferred package manager
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      {installationCode}
                    </pre>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Requirements</h3>
                    <p className="mb-4">MusicUI requires the following peer dependencies:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>React 18 or higher</li>
                      <li>React DOM 18 or higher</li>
                      <li>Tailwind CSS 3 or higher (for styling)</li>
                    </ul>
                    
                    <Alert className="mt-6">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Platform Support</AlertTitle>
                      <AlertDescription>
                        While MusicUI is primarily built for React, we also provide platform-specific implementations for iOS (Swift) and Android (Kotlin).
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="usage" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Usage</CardTitle>
                    <CardDescription>
                      Learn how to use MusicUI components in your application
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                      {usageCode}
                    </pre>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Component Structure</h3>
                    <p className="mb-4">
                      MusicUI components are designed to be modular and composable. You can use them independently or combine them to create more complex music interfaces.
                    </p>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Data Models</h3>
                    <p className="mb-4">
                      MusicUI uses standard data models for tracks, playlists, and other music-related entities:
                    </p>
                    
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                          <tr className="border-b border-neutral-200 dark:border-neutral-700">
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Model</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">Properties</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                          <tr>
                            <td className="py-3 px-4 text-sm font-mono">Track</td>
                            <td className="py-3 px-4 text-sm">id, title, artist, duration, albumArt, audioSrc, waveformData</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-sm font-mono">Playlist</td>
                            <td className="py-3 px-4 text-sm">id, name, tracks</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-4 text-sm font-mono">VisualizerType</td>
                            <td className="py-3 px-4 text-sm">'bars' | 'circle' | 'wave'</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="theming" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Theming</CardTitle>
                    <CardDescription>
                      Customize MusicUI components to match your brand identity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Theme Configuration</h3>
                    <p className="mb-4">
                      MusicUI uses CSS variables for theming. You can customize the colors, spacing, and other design tokens to match your brand.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-medium mb-2">Primary Colors</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-primary mr-2"></div>
                            <span className="text-sm font-mono">--primary</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-secondary mr-2"></div>
                            <span className="text-sm font-mono">--secondary</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-accent mr-2"></div>
                            <span className="text-sm font-mono">--accent</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">UI Colors</h4>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-background border mr-2"></div>
                            <span className="text-sm font-mono">--background</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-card border mr-2"></div>
                            <span className="text-sm font-mono">--card</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-6 h-6 rounded bg-muted border mr-2"></div>
                            <span className="text-sm font-mono">--muted</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Dark Mode Support</h3>
                    <p className="mb-4">
                      MusicUI automatically supports dark mode. The theme will adapt based on the user's system preferences or can be manually controlled.
                    </p>
                    
                    <div className="flex items-center space-x-4 p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
                      <div className="w-16 h-16 bg-card rounded-lg border flex items-center justify-center">
                        <i className="ri-sun-line text-2xl"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Automatic Theme Detection</h4>
                        <p className="text-sm text-muted-foreground">
                          Components adapt to light and dark mode based on system preferences
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="figma" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Figma Integration</CardTitle>
                    <CardDescription>
                      Seamlessly integrate MusicUI components with your Figma designs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Figma to Code</h3>
                    <p className="mb-4">
                      MusicUI provides a Figma plugin that allows you to export design tokens and component styles directly from your Figma designs.
                    </p>
                    
                    <pre className="bg-neutral-100 dark:bg-neutral-900 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6">
                      {figmaIntegrationCode}
                    </pre>
                    
                    <h3 className="text-lg font-semibold mt-6 mb-2">Component Library</h3>
                    <p className="mb-4">
                      Access the MusicUI component library in Figma to quickly prototype your music applications.
                    </p>
                    
                    <div className="border rounded-lg overflow-hidden p-6 flex flex-col items-center justify-center">
                      <i className="ri-layout-grid-line text-6xl text-primary mb-4"></i>
                      <h4 className="font-medium mb-1">MusicUI Figma Library</h4>
                      <p className="text-sm text-center text-muted-foreground mb-4">
                        Access our complete component library for your design projects
                      </p>
                      <button className="bg-primary text-primary-foreground hover:bg-primary/90 py-2 px-4 rounded">
                        Open in Figma
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Platform Implementation</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-reactjs-line text-xl mr-2 text-primary"></i>
                      React
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Full React implementation with hooks and context providers for state management.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Component Composition</li>
                      <li>State Management</li>
                      <li>Hooks for Audio Handling</li>
                      <li>Server-Side Rendering Support</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-apple-fill text-xl mr-2 text-primary"></i>
                      iOS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Native Swift implementation using UIKit and SwiftUI components.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>SwiftUI Components</li>
                      <li>UIKit Integration</li>
                      <li>AVFoundation Support</li>
                      <li>Adaptive Layouts</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-android-fill text-xl mr-2 text-primary"></i>
                      Android
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Native Kotlin implementation with Jetpack Compose support.
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Jetpack Compose UI</li>
                      <li>ExoPlayer Integration</li>
                      <li>Material Design Components</li>
                      <li>Adaptive Layouts</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Accessibility</h2>
              
              <Card>
                <CardContent className="p-6">
                  <p className="text-neutral-700 dark:text-neutral-300 mb-4">
                    MusicUI is built with accessibility as a core principle:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-keyboard-box-line text-xl mr-2 text-primary"></i>
                        Keyboard Navigation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All interactive elements are fully keyboard accessible with logical tab order and focus management.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-braille-line text-xl mr-2 text-primary"></i>
                        Screen Readers
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Components are marked up with appropriate ARIA roles, states, and properties for screen reader users.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-contrast-2-line text-xl mr-2 text-primary"></i>
                        Color Contrast
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All color combinations meet WCAG 2.1 AA contrast standards for text readability.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center">
                        <i className="ri-cursor-line text-xl mr-2 text-primary"></i>
                        Reduced Motion
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Animations respect user preferences for reduced motion with appropriate fallbacks.
                      </p>
                    </div>
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
