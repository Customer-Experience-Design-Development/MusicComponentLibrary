import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export default function PlatformsPage() {
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
        { title: "Platform Support", path: "/resources/platforms", active: true },
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

  // Platform compatibility data
  const platforms = [
    {
      name: "Web (React)",
      icon: "ri-reactjs-line",
      supportLevel: 100,
      features: [
        { name: "All Components", status: "full" },
        { name: "Theming", status: "full" },
        { name: "Audio Integration", status: "full" },
        { name: "Accessibility", status: "full" },
        { name: "Documentation", status: "full" },
      ]
    },
    {
      name: "React Native",
      icon: "ri-smartphone-line",
      supportLevel: 80,
      features: [
        { name: "Core Components", status: "full" },
        { name: "Advanced Visualizations", status: "partial" },
        { name: "Theming", status: "full" },
        { name: "Audio Integration", status: "partial" },
        { name: "Accessibility", status: "partial" },
      ]
    },
    {
      name: "iOS (Swift)",
      icon: "ri-apple-fill",
      supportLevel: 70,
      features: [
        { name: "Core Components", status: "full" },
        { name: "Advanced Visualizations", status: "partial" },
        { name: "Theming", status: "partial" },
        { name: "Audio Integration", status: "full" },
        { name: "Accessibility", status: "partial" },
      ]
    },
    {
      name: "Android (Kotlin)",
      icon: "ri-android-fill",
      supportLevel: 70,
      features: [
        { name: "Core Components", status: "full" },
        { name: "Advanced Visualizations", status: "partial" },
        { name: "Theming", status: "partial" },
        { name: "Audio Integration", status: "full" },
        { name: "Accessibility", status: "partial" },
      ]
    },
    {
      name: "Flutter",
      icon: "ri-flutter-fill",
      supportLevel: 50,
      features: [
        { name: "Core Components", status: "partial" },
        { name: "Advanced Visualizations", status: "minimal" },
        { name: "Theming", status: "partial" },
        { name: "Audio Integration", status: "partial" },
        { name: "Accessibility", status: "minimal" },
      ]
    },
    {
      name: "Vue.js",
      icon: "ri-vuejs-fill",
      supportLevel: 60,
      features: [
        { name: "Core Components", status: "full" },
        { name: "Advanced Visualizations", status: "partial" },
        { name: "Theming", status: "partial" },
        { name: "Audio Integration", status: "partial" },
        { name: "Accessibility", status: "partial" },
      ]
    }
  ];

  // Feature compatibility status colors
  const statusColors: Record<string, string> = {
    full: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    partial: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    minimal: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    none: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/resources/platforms" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Platform Support" 
              description="MusicUI is designed to work across multiple platforms and frameworks."
            />
            
            <div className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Platform Compatibility</CardTitle>
                  <CardDescription>
                    MusicUI is primarily built for React but offers varying levels of support
                    across multiple platforms and frameworks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {platforms.map((platform, index) => (
                      <div key={index} className="pb-4 border-b last:border-b-0 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <i className={`${platform.icon} text-xl mr-2 text-primary`}></i>
                            <h3 className="font-medium text-lg">{platform.name}</h3>
                          </div>
                          <Badge variant="outline" className="font-mono">
                            {platform.supportLevel}% Support
                          </Badge>
                        </div>
                        
                        <Progress value={platform.supportLevel} className="h-2 mb-4" />
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {platform.features.map((feature, fIndex) => (
                            <Badge 
                              key={fIndex} 
                              variant="secondary"
                              className={`${statusColors[feature.status]} justify-start`}
                            >
                              {feature.name}: {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Web (React)</h3>
                    <p className="text-muted-foreground">
                      Our primary implementation uses React with TypeScript. Components are built using
                      modern React patterns including hooks and functional components. The web version
                      leverages the Web Audio API for audio processing and HTML Canvas for visualizations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">React Native</h3>
                    <p className="text-muted-foreground">
                      The React Native implementation uses a combination of native modules and JavaScript.
                      Audio processing relies on the platform's native audio capabilities, while visualizations
                      use React Native's Canvas components or native renderers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">iOS & Android</h3>
                    <p className="text-muted-foreground">
                      Native implementations for iOS (Swift) and Android (Kotlin) provide better performance
                      for audio processing and visualizations. These implementations follow the same design
                      principles but leverage platform-specific capabilities.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg mb-2">Other Frameworks</h3>
                    <p className="text-muted-foreground">
                      Support for Vue.js, Flutter, and other frameworks is provided through either direct
                      ports or wrapper components. The level of support varies depending on the framework's
                      capabilities for audio processing and visualization.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Roadmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our roadmap for platform support includes the following priorities:
                  </p>
                  
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Improve React Native support for advanced visualizations</li>
                    <li>Complete Flutter port for core components</li>
                    <li>Enhance accessibility across all platforms</li>
                    <li>Add Angular support</li>
                    <li>Develop Svelte component wrappers</li>
                    <li>Create a unified API that works consistently across platforms</li>
                  </ol>
                </CardContent>
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