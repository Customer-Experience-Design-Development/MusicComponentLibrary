import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

// Import documentation markdown files (these will be fetched at runtime)
import DocsIndex from '../docs/index.md?raw';
import PersonasDoc from '../docs/personas.md?raw';
import ComponentCategoriesDoc from '../docs/component-categories.md?raw';
import SpecializedThemesDoc from '../docs/specialized-themes.md?raw';
import VisualizationEnhancementsDoc from '../docs/visualization-enhancements.md?raw';

export default function DesignSystem() {
  const [activeDocContent, setActiveDocContent] = useState(DocsIndex);
  const [activeDoc, setActiveDoc] = useState('index');

  // Documentation mapping
  const docs = {
    index: DocsIndex,
    personas: PersonasDoc,
    'component-categories': ComponentCategoriesDoc,
    'specialized-themes': SpecializedThemesDoc,
    'visualization-enhancements': VisualizationEnhancementsDoc
  };

  const handleDocChange = (docName: string) => {
    setActiveDoc(docName);
    setActiveDocContent(docs[docName]);
  };

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
      title: "Design System",
      links: [
        { title: "Documentation", path: "/design-system", active: true },
        { title: "User Personas", path: "/design-system?doc=personas" },
        { title: "Component Categories", path: "/design-system?doc=component-categories" },
        { title: "Themes", path: "/design-system?doc=specialized-themes" },
        { title: "Visualizations", path: "/design-system?doc=visualization-enhancements" },
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

  // Check for URL query parameters for direct access to a specific doc
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const docParam = urlParams.get('doc');
    if (docParam && docs[docParam]) {
      handleDocChange(docParam);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar categories={sidebarCategories} />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Design System & Documentation" 
              description="Comprehensive documentation for MusicUI component library organized by user personas and industry needs."
            />
            
            <Tabs 
              value={activeDoc} 
              onValueChange={handleDocChange}
              className="mb-8"
            >
              <TabsList className="w-full border-b p-0 mb-4">
                <TabsTrigger 
                  value="index"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="personas"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  User Personas
                </TabsTrigger>
                <TabsTrigger 
                  value="component-categories"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Component Categories
                </TabsTrigger>
                <TabsTrigger 
                  value="specialized-themes"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Specialized Themes
                </TabsTrigger>
                <TabsTrigger 
                  value="visualization-enhancements"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Visualizations
                </TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown>
                      {activeDocContent}
                    </ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            </Tabs>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Documentation by User Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-music-2-line text-xl mr-2 text-primary"></i>
                      For Artists
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building artist-focused music applications.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleDocChange('personas')}
                    >
                      View Artist Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-headphone-line text-xl mr-2 text-primary"></i>
                      For Fans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building fan-focused music experiences.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleDocChange('personas')}
                    >
                      View Fan Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-line-chart-line text-xl mr-2 text-primary"></i>
                      For Labels & Industry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building music industry professional tools.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleDocChange('personas')}
                    >
                      View Industry Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <i className="ri-book-open-line text-xl mr-2 text-primary"></i>
                      For Educators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building music education applications.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleDocChange('personas')}
                    >
                      View Education Documentation →
                    </button>
                  </CardContent>
                </Card>
              </div>
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