import { Link, useLocation } from "wouter";
import { NavCategory } from "@/types/music";
import { navigate } from "wouter/use-browser-location";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  activePath: string;
  className?: string;
  onLinkClick?: () => void;
}

// Default expansion state
const defaultExpandedState = {
  'Getting Started': true,
  'Components': true,
  'Resources': true,
  'Playback': true,
  'Visualization': false,
  'Collections': false,
  'Analytics': false,
  'Music Learning': false,
  'Search': false,
  'Details': false,
};

export function Sidebar({ activePath, className = '', onLinkClick }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  // Initialize state from localStorage or use defaults
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    // Try to get saved state from localStorage
    const savedState = localStorage.getItem('sidebarExpandedState');
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (e) {
        console.error('Failed to parse saved sidebar state', e);
        return defaultExpandedState;
      }
    }
    return defaultExpandedState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('sidebarExpandedState', JSON.stringify(expandedCategories));
  }, [expandedCategories]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleLinkClick = (path: string) => {
    if (onLinkClick) {
      onLinkClick();
    }
    navigate(path);
  };

  if (isMobile) {
    return null;
  }

  // Group components by their logical categories
  const componentGroups = {
    'Playback': [
      { title: 'Audio Player', path: '/components/audio-player' },
      { title: 'Mini Player', path: '/components/mini-player' },
      { title: 'Song Card Player', path: '/components/song-card-player' },
      { title: 'Volume Control', path: '/components/volume-control' },
    ],
    'Visualization': [
      { title: 'Visualizer', path: '/components/visualizer' },
      { title: 'Waveform', path: '/components/waveform' },
      { title: 'Equalizer', path: '/components/equalizer' },
      { title: 'Theory Visualizer', path: '/components/theory-visualizer' },
    ],
    'Collections': [
      { title: 'Playlist', path: '/components/playlist' },
      { title: 'Album Grid', path: '/components/album-grid' },
      { title: 'Media Card', path: '/components/media-card' },
      { title: 'Release Calendar', path: '/components/release-calendar' },
    ],
    'Mobile': [
      { title: 'Mobile UI Showcase', path: '/components/mobile-ui-showcase' },
      { title: 'Mobile Mashup Creator', path: '/components/mobile-mashup' },
    ],
    'Analytics': [
      { title: 'Performance Chart', path: '/components/performance-chart' },
      { title: 'Audience Map (Missing)', path: '/components/audience-map' },
    ],
    'Music Learning': [
      { title: 'Practice Timer (Missing)', path: '/components/practice-timer' },
      { title: 'Notation Display (Missing)', path: '/components/notation-display' },
    ],
    'Search': [
      { title: 'Song Search', path: '/components/song-search' },
      { title: 'Artist Search (Missing)', path: '/components/artist-search' },
      { title: 'Album Search (Missing)', path: '/components/album-search' },
      { title: 'Song Lyrics Search', path: '/components/song-lyrics-search' },
      { title: 'Artist Lyrics Search (Missing)', path: '/components/artist-lyrics-search' },
      { title: 'Album Lyrics Search (Missing)', path: '/components/album-lyrics-search' },
    ],
    'Details': [
      { title: 'Song Details', path: '/components/song-details' },
      { title: 'Artist Details (Missing)', path: '/components/artist-details' },
      { title: 'Album Details (Missing)', path: '/components/album-details' },
      { title: 'Song Lyrics', path: '/components/song-lyrics' },
      { title: 'Artist Lyrics (Missing)', path: '/components/artist-lyrics' },
      { title: 'Album Lyrics (Missing)', path: '/components/album-lyrics' },
    ],
  };

  const categories = [
    {
      title: 'Getting Started',
      links: [
        { title: 'Introduction', path: '/docs/introduction' },
        { title: 'Installation', path: '/docs/installation' },
        { title: 'Quick Start', path: '/docs/quick-start' },
      ],
    },
    {
      title: 'Components',
      subCategories: componentGroups,
      links: [
        { title: 'Overview', path: '/components' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { title: 'Figma Integration', path: '/resources/figma' },
        { title: 'Platform Support', path: '/resources/platforms' },
      ],
    },
  ];

  return (
    <aside className="col-span-12 lg:col-span-3 lg:pr-8">
      <div className="sticky top-20 h-[calc(100vh-5rem)]">
        <ScrollArea className="h-full pr-4">
          {categories.map((category, index) => (
          <div className="mb-6" key={index}>
            <div 
              className="flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 cursor-pointer"
              onClick={() => toggleCategory(category.title)}
            >
              <h2>{category.title}</h2>
              {category.subCategories && (
                expandedCategories[category.title] ? 
                <ChevronDown size={16} /> : 
                <ChevronRight size={16} />
              )}
            </div>

            {expandedCategories[category.title] && (
              <>
                <ul className="space-y-1 mb-4">
                  {category.links.map((link, linkIndex) => {
                    const isActive = location === link.path;
                    return (
                      <li key={linkIndex}>
                        <Link href={link.path}>
                          <div
                            className={`flex items-center text-sm px-3 py-1.5 rounded-md transition cursor-pointer ${
                              isActive
                                ? "font-medium text-primary bg-primary/5"
                                : "hover:text-primary"
                            }`}
                          >
                            {link.title}
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                {category.subCategories && (
                  <div className="pl-2">
                    {Object.entries(category.subCategories).map(([subCategoryName, subCategoryLinks]) => (
                      <div key={subCategoryName} className="mb-4">
                        <div 
                          className="flex items-center justify-between text-xs font-medium text-neutral-400 dark:text-neutral-500 mb-1.5 pl-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCategories(prev => ({
                              ...prev,
                              [subCategoryName]: !prev[subCategoryName]
                            }));
                          }}
                        >
                          <span>{subCategoryName}</span>
                          {expandedCategories[subCategoryName] ? 
                            <ChevronDown size={14} /> : 
                            <ChevronRight size={14} />
                          }
                        </div>
                        
                        {expandedCategories[subCategoryName] && (
                          <ul className="space-y-1 ml-2">
                            {subCategoryLinks.map((link, linkIndex) => {
                              const isActive = location === link.path;
                              const isMissingComponent = link.title.includes('Missing');
                              
                              return (
                                <li key={linkIndex}>
                                  <Link href={link.path}>
                                    <div
                                      className={`flex items-center text-xs px-3 py-1.5 rounded-md transition cursor-pointer ${
                                        isActive
                                          ? "font-medium text-primary bg-primary/5"
                                          : isMissingComponent
                                          ? "text-neutral-400 dark:text-neutral-500 italic"
                                          : "hover:text-primary"
                                      }`}
                                    >
                                      {link.title.replace(' (Missing)', '')}
                                      {isMissingComponent && <span className="ml-1 text-xs">(Coming Soon)</span>}
                                    </div>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
        </ScrollArea>
      </div>
    </aside>
  );
}
