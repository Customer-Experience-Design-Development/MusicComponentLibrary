import { Link, useLocation } from "wouter";
import { NavCategory } from "@/types/music";
import { navigate } from "wouter/use-browser-location";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  activePath: string;
  className?: string;
  onLinkClick?: () => void;
}

export function Sidebar({ activePath, className = '', onLinkClick }: SidebarProps) {
  const [location] = useLocation();
  const isMobile = useIsMobile();

  const handleLinkClick = (path: string) => {
    if (onLinkClick) {
      onLinkClick();
    }
    navigate(path);
  };

  if (isMobile) {
    return null;
  }

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
      links: [
        { title: 'Overview', path: '/components' },
        { title: 'Audio Player', path: '/components/audio-player' },
        { title: 'Song Detail Player', path: '/components/song-detail-player' },
        { title: 'Song Card Player', path: '/components/song-card-player' },
        { title: 'Playlist', path: '/components/playlist' },
        { title: 'Visualizer', path: '/components/visualizer' },
        { title: 'Waveform', path: '/components/waveform' },
        { title: 'Volume Control', path: '/components/volume-control' },
        { title: 'Media Card', path: '/components/media-card' },
        { title: 'Equalizer', path: '/components/equalizer' },
        { title: 'Album Grid', path: '/components/album-grid' },
        { title: 'Mini Player', path: '/components/mini-player' },
        { title: 'Release Calendar', path: '/components/release-calendar' },
        { title: 'Performance Chart', path: '/components/performance-chart' },
        { title: 'Audience Map', path: '/components/audience-map' },
        { title: 'Theory Visualizer', path: '/components/theory-visualizer' },
        { title: 'Practice Timer', path: '/components/practice-timer' },
        { title: 'Notation Display', path: '/components/notation-display' },
        { title: 'Song Search', path: '/components/song-search' },
        { title: 'Artist Search', path: '/components/artist-search' },
        { title: 'Album Search', path: '/components/album-search' },
        { title: 'Song Details', path: '/components/song-details' },
        { title: 'Artist Details', path: '/components/artist-details' },
        { title: 'Album Details', path: '/components/album-details' },
        { title: 'Song Lyrics', path: '/components/song-lyrics' },
        { title: 'Artist Lyrics', path: '/components/artist-lyrics' },
        { title: 'Album Lyrics', path: '/components/album-lyrics' },
        { title: 'Song Lyrics Search', path: '/components/song-lyrics-search' },
        { title: 'Artist Lyrics Search', path: '/components/artist-lyrics-search' },
        { title: 'Album Lyrics Search', path: '/components/album-lyrics-search' },
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
      <div className="sticky top-20">
        {categories.map((category, index) => (
          <div className="mb-8" key={index}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-4">
              {category.title}
            </h2>
            <ul className="space-y-2">
              {category.links.map((link, linkIndex) => {
                const isActive = location === link.path;
                return (
                  <li key={linkIndex}>
                    <Link href={link.path}>
                      <div
                        className={`flex items-center text-sm px-3 py-2 rounded-md transition cursor-pointer ${
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
          </div>
        ))}
      </div>
    </aside>
  );
}
