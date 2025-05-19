import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { NavCategory } from '@/types/music';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DesignSystem() {
  const [activeSection, setActiveSection] = useState('overview');

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
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
        { title: "User Personas", path: "/design-system?section=personas" },
        { title: "Component Categories", path: "/design-system?section=categories" },
        { title: "Themes", path: "/design-system?section=themes" },
        { title: "Visualizations", path: "/design-system?section=visualizations" },
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

  // Check URL params for direct navigation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const section = urlParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, []);

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/design-system" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Design System & Documentation" 
              description="Comprehensive documentation for MusicUI component library organized by user personas and industry needs."
            />
            
            <Tabs 
              value={activeSection} 
              onValueChange={handleSectionChange}
              className="mb-8"
            >
              <TabsList className="w-full border-b p-0 mb-4">
                <TabsTrigger 
                  value="overview"
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
                  value="categories"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Component Categories
                </TabsTrigger>
                <TabsTrigger 
                  value="themes"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Specialized Themes
                </TabsTrigger>
                <TabsTrigger 
                  value="visualizations"
                  className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  Visualizations
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">MusicUI Component Library Documentation</h1>
                    
                    <p className="mb-4">
                      Welcome to the MusicUI component library documentation. This guide will help you
                      navigate our specialized music-focused UI components for various platforms and user needs.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-3">Documentation Map</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">User-Focused Resources</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('personas')}
                            >
                              User Personas
                            </button>
                            : Detailed profiles of the different music industry users
                          </li>
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('categories')}
                            >
                              Component Categories by User
                            </button>
                            : Components organized by user type
                          </li>
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('themes')}
                            >
                              Specialized Themes
                            </button>
                            : Theme configurations for different contexts
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Technical Resources</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('categories')}
                            >
                              Component Categories by Function
                            </button>
                            : Components organized by functionality
                          </li>
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('visualizations')}
                            >
                              Visualization Enhancements
                            </button>
                            : Advanced visualization techniques
                          </li>
                          <li>
                            <button 
                              className="text-primary hover:underline"
                              onClick={() => handleSectionChange('categories')}
                            >
                              Integration Patterns
                            </button>
                            : Recommended component combinations
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-3">Quick Start</h2>
                    
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded mb-6">
                      <h3 className="text-lg font-semibold mb-2">Installation</h3>
                      <pre className="bg-slate-200 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                        {`# Using npm
npm install music-ui

# Using yarn
yarn add music-ui

# Using pnpm
pnpm add music-ui`}
                      </pre>
                      
                      <h3 className="text-lg font-semibold mt-4 mb-2">Basic Usage</h3>
                      <pre className="bg-slate-200 dark:bg-slate-900 p-3 rounded text-sm overflow-x-auto">
                        {`import { AudioPlayer, Visualizer, Playlist } from 'music-ui';

function MusicApp() {
  const track = {
    id: 1,
    title: "Song Title",
    artist: "Artist Name",
    duration: 240, // in seconds
    audioSrc: "/path/to/audio.mp3",
    albumArt: "/path/to/album-art.jpg"
  };

  return (
    <div className="app">
      <AudioPlayer track={track} />
      <Visualizer audioElement={document.querySelector('audio')} />
      <Playlist tracks={[track]} />
    </div>
  );
}`}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="personas">
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">MusicUI User Personas</h1>
                    
                    <p className="mb-4">
                      This page outlines the primary user personas that the MusicUI component library
                      targets, helping developers understand the specific needs and use cases
                      of different user types in the music industry.
                    </p>
                    
                    <div className="space-y-8 mt-6">
                      {/* Artist Persona */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-3">Artists & Musicians</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Producer Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Alex<br />
                              <strong>Role:</strong> Electronic Music Producer<br />
                              <strong>Technical Level:</strong> Intermediate to Advanced<br />
                              <strong>Primary Devices:</strong> Desktop, Laptop
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Precise audio waveform visualization for detailed editing</li>
                                <li>Performance analytics to track music reception</li>
                                <li>Integration with production tools (DAWs)</li>
                                <li>Collaboration features with other producers/artists</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Performing Artist Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Jordan<br />
                              <strong>Role:</strong> Singer-Songwriter<br />
                              <strong>Technical Level:</strong> Basic to Intermediate<br />
                              <strong>Primary Devices:</strong> Mobile, Tablet, Laptop
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Simple, intuitive interfaces for quick actions</li>
                                <li>Visual representation of audience engagement</li>
                                <li>Tour and performance management</li>
                                <li>Fan engagement tools</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fan Persona */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-3">Music Consumers</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Casual Listener Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Taylor<br />
                              <strong>Role:</strong> Music Streaming User<br />
                              <strong>Technical Level:</strong> Basic<br />
                              <strong>Primary Devices:</strong> Mobile, Smart Speakers
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Simple, intuitive playback controls</li>
                                <li>Personalized recommendations</li>
                                <li>Social sharing capabilities</li>
                                <li>Playlist management</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Audiophile Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Morgan<br />
                              <strong>Role:</strong> Music Collector and Enthusiast<br />
                              <strong>Technical Level:</strong> Advanced<br />
                              <strong>Primary Devices:</strong> Desktop, High-end Audio Systems
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Detailed audio quality information</li>
                                <li>Advanced metadata management</li>
                                <li>Comprehensive library organization</li>
                                <li>Sophisticated playback controls</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Industry Professionals */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-3">Music Industry Professionals</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Label Manager Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Sam<br />
                              <strong>Role:</strong> Record Label Executive<br />
                              <strong>Technical Level:</strong> Intermediate<br />
                              <strong>Primary Devices:</strong> Laptop, Tablet
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Comprehensive analytics dashboards</li>
                                <li>Artist portfolio management</li>
                                <li>Release scheduling and tracking</li>
                                <li>Revenue and royalty visualization</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Music Supervisor Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Casey<br />
                              <strong>Role:</strong> Music Supervisor for Film/TV<br />
                              <strong>Technical Level:</strong> Intermediate<br />
                              <strong>Primary Devices:</strong> Laptop
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Efficient music search and discovery</li>
                                <li>Licensing and rights management</li>
                                <li>Project organization by production</li>
                                <li>Collaborative review tools</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Educators */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h2 className="text-xl font-semibold mb-3">Music Educators</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Music Teacher Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Jamie<br />
                              <strong>Role:</strong> Music Educator<br />
                              <strong>Technical Level:</strong> Basic to Intermediate<br />
                              <strong>Primary Devices:</strong> Tablet, Interactive Whiteboard
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Interactive music theory visualizations</li>
                                <li>Student progress tracking</li>
                                <li>Lesson planning and organization</li>
                                <li>Audio examples with visual components</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Music Student Persona</h3>
                            <p className="text-sm mb-3">
                              <strong>Name:</strong> Riley<br />
                              <strong>Role:</strong> Music Student<br />
                              <strong>Technical Level:</strong> Basic<br />
                              <strong>Primary Devices:</strong> Mobile, Tablet
                            </p>
                            
                            <div>
                              <h4 className="font-medium mb-1">Key Needs:</h4>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Clear, approachable visualizations</li>
                                <li>Practice tools and tracking</li>
                                <li>Reference materials and examples</li>
                                <li>Feedback mechanisms</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="categories">
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">MusicUI Component Categories</h1>
                    
                    <p className="mb-4">
                      This page outlines how components are organized by both functionality and user personas
                      to help developers choose the right components for their specific use cases.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-3">Functional Categories</h2>
                    
                    <div className="space-y-6">
                      {/* Audio Playback & Control */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Audio Playback & Control</h3>
                        <p className="text-sm mb-3">
                          Components focused on playing, controlling, and interacting with audio content.
                        </p>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                            <thead>
                              <tr>
                                <th className="text-left py-2 px-3 text-sm font-medium">Component</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Description</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Primary Users</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              <tr>
                                <td className="py-2 px-3 text-sm">AudioPlayer</td>
                                <td className="py-2 px-3 text-sm">Full-featured audio player with controls</td>
                                <td className="py-2 px-3 text-sm">All</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">MiniPlayer</td>
                                <td className="py-2 px-3 text-sm">Compact audio player for limited space</td>
                                <td className="py-2 px-3 text-sm">Fans, Artists</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">WaveformPlayer</td>
                                <td className="py-2 px-3 text-sm">Audio player with waveform visualization</td>
                                <td className="py-2 px-3 text-sm">Artists, Industry Professionals</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">PlaybackControls</td>
                                <td className="py-2 px-3 text-sm">Standalone playback control elements</td>
                                <td className="py-2 px-3 text-sm">All</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">VolumeControl</td>
                                <td className="py-2 px-3 text-sm">Audio volume adjustment with visualization</td>
                                <td className="py-2 px-3 text-sm">All</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Audio Visualization */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Audio Visualization</h3>
                        <p className="text-sm mb-3">
                          Components that provide visual representations of audio content.
                        </p>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                            <thead>
                              <tr>
                                <th className="text-left py-2 px-3 text-sm font-medium">Component</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Description</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Primary Users</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              <tr>
                                <td className="py-2 px-3 text-sm">Waveform</td>
                                <td className="py-2 px-3 text-sm">Static or interactive audio waveform display</td>
                                <td className="py-2 px-3 text-sm">Artists, Educators</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">Visualizer</td>
                                <td className="py-2 px-3 text-sm">Real-time audio frequency visualization</td>
                                <td className="py-2 px-3 text-sm">Fans, Artists</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">Equalizer</td>
                                <td className="py-2 px-3 text-sm">Audio frequency band visualization</td>
                                <td className="py-2 px-3 text-sm">Artists, Educators</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">SpectrumAnalyzer</td>
                                <td className="py-2 px-3 text-sm">Detailed frequency spectrum display</td>
                                <td className="py-2 px-3 text-sm">Educators, Artists</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm">BeatDetector</td>
                                <td className="py-2 px-3 text-sm">Visual beat indication for music</td>
                                <td className="py-2 px-3 text-sm">DJs, Producers</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mt-8 mb-3">Persona-Based Categories</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Artist-Focused Components */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h3 className="text-lg font-medium mb-2">Artist-Focused Components</h3>
                        <p className="text-sm mb-3">
                          Components primarily designed for musicians and content creators.
                        </p>
                        
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>AudioPlayer (Playback & Control)</li>
                          <li>Waveform (Visualization)</li>
                          <li>PerformanceChart (Analytics)</li>
                          <li>AudioRecorder (Creation)</li>
                          <li>FanInteraction (Engagement)</li>
                          <li>RoyaltyTracker (Rights)</li>
                          <li>ProfileBuilder (Marketing)</li>
                          <li>ReleaseManager (Content)</li>
                        </ul>
                      </div>
                      
                      {/* Fan-Centric Components */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h3 className="text-lg font-medium mb-2">Fan-Centric Components</h3>
                        <p className="text-sm mb-3">
                          Components enhancing the listener and music enthusiast experience.
                        </p>
                        
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>PlaylistPlayer (Playback & Control)</li>
                          <li>Visualizer (Visualization)</li>
                          <li>AlbumGrid (Content)</li>
                          <li>ShareCard (Engagement)</li>
                          <li>DiscoveryRadar (Content)</li>
                          <li>MoodSelector (Experience)</li>
                          <li>LyricsDisplay (Experience)</li>
                          <li>EventCalendar (Engagement)</li>
                        </ul>
                      </div>
                      
                      {/* Label & Marketing Components */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h3 className="text-lg font-medium mb-2">Label & Marketing Components</h3>
                        <p className="text-sm mb-3">
                          Components supporting music marketing and label operations.
                        </p>
                        
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>PerformanceChart (Analytics)</li>
                          <li>AudienceDemographics (Analytics)</li>
                          <li>CampaignTracker (Analytics)</li>
                          <li>MediaLibrary (Content)</li>
                          <li>ReleaseScheduler (Operations)</li>
                          <li>TrendAnalyzer (Analytics)</li>
                          <li>ContentPlanner (Operations)</li>
                          <li>BrandingControls (Marketing)</li>
                        </ul>
                      </div>
                      
                      {/* Industry Professional Components */}
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                        <h3 className="text-lg font-medium mb-2">Industry Professional Components</h3>
                        <p className="text-sm mb-3">
                          Components for music supervisors, licensors, and other industry roles.
                        </p>
                        
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>WaveformPlayer (Playback & Control)</li>
                          <li>MultiTrackCompare (Content)</li>
                          <li>RightsManager (Rights)</li>
                          <li>LicenseSelector (Rights)</li>
                          <li>ProjectManager (Operations)</li>
                          <li>BudgetVisualizer (Operations)</li>
                          <li>MetadataSearch (Content)</li>
                          <li>SoundalikeFinder (Discovery)</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="themes">
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">MusicUI Specialized Themes</h1>
                    
                    <p className="mb-4">
                      This document outlines specialized themes designed for different music industry users and contexts.
                      Each theme includes color palettes, typography recommendations, and component styling guidance.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-3">Theme Structure</h2>
                    
                    <p className="mb-4">
                      All MusicUI themes follow a consistent structure with the following customizable properties:
                    </p>
                    
                    <ul className="list-disc pl-5 mb-6">
                      <li><strong>Color Palette</strong>: Primary, secondary, accent, and neutral colors</li>
                      <li><strong>Typography</strong>: Font families, sizes, and weights</li>
                      <li><strong>Component Styling</strong>: Specific styling variants for components</li>
                      <li><strong>Animation</strong>: Motion characteristics and timing</li>
                      <li><strong>Spacing</strong>: Layout spacing scales</li>
                      <li><strong>Borders & Shadows</strong>: Elevation and separation styles</li>
                    </ul>
                    
                    <div className="space-y-8">
                      {/* Artist Themes */}
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Artist Themes</h2>
                        
                        <div className="space-y-6">
                          {/* Producer Theme */}
                          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                            <h3 className="text-lg font-medium mb-2">Producer Theme</h3>
                            <p className="text-sm mb-3">
                              Designed for electronic music producers and beatmakers with a focus on technical detail and modern aesthetics.
                            </p>
                            
                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded text-sm mb-4 overflow-x-auto">
                              <pre>{`:root {
  /* Colors */
  --primary: 265 85% 40%; /* #4f2cbd - Deep purple */
  --primary-foreground: 0 0% 100%;
  --secondary: 180 90% 40%; /* #0cc7c7 - Bright teal */
  --secondary-foreground: 0 0% 100%;
  --accent: 325 80% 50%; /* #e01b84 - Vivid pink */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
  
  /* Other properties */
  --border-radius: 4px;
  --animation-timing: cubic-bezier(0.16, 1, 0.3, 1);
  --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}`}</pre>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Usage Context:</p>
                              <p className="text-sm mb-2">DAW-like interfaces, beat-making applications, sound design tools</p>
                              
                              <p className="text-sm font-medium mb-1">Component Styling:</p>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Audio visualization with high detail and precision</li>
                                <li>Technical data displays that show exact values</li>
                                <li>Grid-based layouts with clear segmentation</li>
                                <li>Minimalist controls with hover effects</li>
                              </ul>
                            </div>
                          </div>
                          
                          {/* Performer Theme */}
                          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                            <h3 className="text-lg font-medium mb-2">Performer Theme</h3>
                            <p className="text-sm mb-3">
                              Designed for performing artists and bands with emphasis on brand identity and emotional impact.
                            </p>
                            
                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded text-sm mb-4 overflow-x-auto">
                              <pre>{`:root {
  /* Colors */
  --primary: 5 90% 50%; /* #f8252a - Energetic red */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 80% 45%; /* #1268d8 - Deep blue */
  --secondary-foreground: 0 0% 100%;
  --accent: 45 90% 50%; /* #f9c31b - Warm yellow */
  --accent-foreground: 0 0% 10%;
  
  /* Typography */
  --font-heading: "Montserrat", sans-serif;
  --font-body: "Source Sans Pro", sans-serif;
  --font-mono: "Roboto Mono", monospace;
  
  /* Other properties */
  --border-radius: 8px;
  --animation-timing: cubic-bezier(0.2, 0.9, 0.1, 1);
  --box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}`}</pre>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Usage Context:</p>
                              <p className="text-sm mb-2">Artist websites, EPKs (Electronic Press Kits), tour management</p>
                              
                              <p className="text-sm font-medium mb-1">Component Styling:</p>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Large hero areas for visual impact</li>
                                <li>Emphasis on media and imagery</li>
                                <li>Interactive elements with bold feedback</li>
                                <li>Brand-focused design with consistent identity</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Fan Themes */}
                      <div>
                        <h2 className="text-xl font-semibold mb-3">Fan Themes</h2>
                        
                        <div className="space-y-6">
                          {/* Listener Theme */}
                          <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded">
                            <h3 className="text-lg font-medium mb-2">Listener Theme</h3>
                            <p className="text-sm mb-3">
                              Designed for music consumers with focus on discovery and enjoyable listening experiences.
                            </p>
                            
                            <div className="bg-slate-200 dark:bg-slate-900 p-3 rounded text-sm mb-4 overflow-x-auto">
                              <pre>{`:root {
  /* Colors */
  --primary: 235 70% 50%; /* #425ff5 - Pleasant blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 140 50% 45%; /* #30a85e - Gentle green */
  --secondary-foreground: 0 0% 100%;
  --accent: 325 60% 50%; /* #cf3b7f - Soft pink */
  --accent-foreground: 0 0% 100%;
  
  /* Typography */
  --font-heading: "DM Sans", sans-serif;
  --font-body: "Nunito", sans-serif;
  --font-mono: "IBM Plex Mono", monospace;
  
  /* Other properties */
  --border-radius: 12px;
  --animation-timing: cubic-bezier(0.34, 1.56, 0.64, 1);
  --box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}`}</pre>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Usage Context:</p>
                              <p className="text-sm mb-2">Streaming apps, playlist creators, music discovery platforms</p>
                              
                              <p className="text-sm font-medium mb-1">Component Styling:</p>
                              <ul className="list-disc pl-5 text-sm">
                                <li>Rounded, friendly interface elements</li>
                                <li>Focus on content over controls</li>
                                <li>Smooth animations and transitions</li>
                                <li>Card-based layouts for browsing</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="visualizations">
                <Card>
                  <CardContent className="p-6">
                    <h1 className="text-2xl font-bold mb-4">MusicUI Visualization Enhancement Guide</h1>
                    
                    <p className="mb-4">
                      This document outlines recommended libraries and techniques for enhancing the visualization
                      capabilities of MusicUI components with a focus on the specific needs of the music industry.
                    </p>
                    
                    <h2 className="text-xl font-semibold mt-6 mb-3">Recommended Libraries</h2>
                    
                    <div className="space-y-6">
                      {/* Core Visualization Libraries */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Core Visualization Libraries</h3>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                            <thead>
                              <tr>
                                <th className="text-left py-2 px-3 text-sm font-medium">Library</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Specialization</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Best For</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Integration Complexity</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">D3.js</td>
                                <td className="py-2 px-3 text-sm">Custom data visualization</td>
                                <td className="py-2 px-3 text-sm">Complex analytics displays</td>
                                <td className="py-2 px-3 text-sm">High</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Three.js</td>
                                <td className="py-2 px-3 text-sm">3D visualization</td>
                                <td className="py-2 px-3 text-sm">Immersive experiences</td>
                                <td className="py-2 px-3 text-sm">High</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Tone.js</td>
                                <td className="py-2 px-3 text-sm">Audio processing & analysis</td>
                                <td className="py-2 px-3 text-sm">Real-time audio manipulation</td>
                                <td className="py-2 px-3 text-sm">Medium</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Wavesurfer.js</td>
                                <td className="py-2 px-3 text-sm">Waveform visualization</td>
                                <td className="py-2 px-3 text-sm">High-quality audio waveforms</td>
                                <td className="py-2 px-3 text-sm">Low</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Chart.js</td>
                                <td className="py-2 px-3 text-sm">Statistical visualization</td>
                                <td className="py-2 px-3 text-sm">Performance analytics</td>
                                <td className="py-2 px-3 text-sm">Low</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Specialized Audio Libraries */}
                      <div>
                        <h3 className="text-lg font-medium mb-2">Specialized Audio Libraries</h3>
                        
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-300 dark:divide-slate-700">
                            <thead>
                              <tr>
                                <th className="text-left py-2 px-3 text-sm font-medium">Library</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Specialization</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Best For</th>
                                <th className="text-left py-2 px-3 text-sm font-medium">Integration Complexity</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Peaks.js</td>
                                <td className="py-2 px-3 text-sm">Waveform interaction</td>
                                <td className="py-2 px-3 text-sm">Audio editing interfaces</td>
                                <td className="py-2 px-3 text-sm">Medium</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Howler.js</td>
                                <td className="py-2 px-3 text-sm">Audio playback</td>
                                <td className="py-2 px-3 text-sm">Cross-platform audio</td>
                                <td className="py-2 px-3 text-sm">Low</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Web Audio API</td>
                                <td className="py-2 px-3 text-sm">Audio processing</td>
                                <td className="py-2 px-3 text-sm">Building custom processors</td>
                                <td className="py-2 px-3 text-sm">High</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Pizzicato.js</td>
                                <td className="py-2 px-3 text-sm">Audio effects</td>
                                <td className="py-2 px-3 text-sm">Effect visualization</td>
                                <td className="py-2 px-3 text-sm">Medium</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-3 text-sm font-medium">Tonal.js</td>
                                <td className="py-2 px-3 text-sm">Music theory</td>
                                <td className="py-2 px-3 text-sm">Chord and scale visualization</td>
                                <td className="py-2 px-3 text-sm">Medium</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-xl font-semibold mt-8 mb-3">Best Practices</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Performance Considerations</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Use requestAnimationFrame for smooth visualizations</li>
                          <li>Consider throttling high-frequency updates</li>
                          <li>Implement canvas-based visualizations for complex graphics</li>
                          <li>Use WebGL for 3D or particle-heavy visualizations</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Accessibility</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Provide alternative representations of audio data</li>
                          <li>Ensure keyboard navigation for interactive visualizations</li>
                          <li>Include descriptive text explanations of what visualizations represent</li>
                          <li>Implement high-contrast modes for visualizations</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Mobile Optimization</h3>
                        <ul className="list-disc pl-5 text-sm">
                          <li>Reduce complexity on smaller screens</li>
                          <li>Optimize touch interactions for mobile</li>
                          <li>Consider battery and performance impacts</li>
                          <li>Implement responsive sizing and detail levels</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4">Documentation by User Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-xl mr-2 text-primary">🎵</span>
                      For Artists
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building artist-focused music applications.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleSectionChange('personas')}
                    >
                      View Artist Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-xl mr-2 text-primary">🎧</span>
                      For Fans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building fan-focused music experiences.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleSectionChange('personas')}
                    >
                      View Fan Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-xl mr-2 text-primary">📊</span>
                      For Labels & Industry
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building music industry professional tools.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleSectionChange('personas')}
                    >
                      View Industry Documentation →
                    </button>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <span className="text-xl mr-2 text-primary">📚</span>
                      For Educators
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Components and guidance for building music education applications.
                    </p>
                    <button 
                      className="text-primary text-sm font-medium hover:underline"
                      onClick={() => handleSectionChange('personas')}
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