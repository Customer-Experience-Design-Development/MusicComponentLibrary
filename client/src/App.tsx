import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";

// Page imports
import Home from "@/pages/home";
import ComponentsIndex from "@/pages/components/index";
import ComponentShowcase from "@/pages/components/showcase";
import AudioPlayerPage from "@/pages/components/audio-player";
import PlaylistPage from "@/pages/components/playlist";
import VisualizerPage from "@/pages/components/visualizer";
import WaveformPage from "@/pages/components/waveform";
import VolumeControlPage from "@/pages/components/volume-control";
import MediaCardPage from "@/pages/components/media-card";
import EqualizerPage from "@/pages/components/equalizer";
import RightsManagerPage from "@/pages/components/rights-manager";
import TheoryVisualizerPage from "@/pages/components/theory-visualizer";
import PerformanceChartPage from "@/pages/components/performance-chart";
import AlbumGridPage from "@/pages/components/album-grid";
import MiniPlayerPage from "@/pages/components/mini-player";
import SongDetailsPage from "@/pages/components/song-details";
import SongLyricsPage from "@/pages/components/song-lyrics";
import SongSearchPage from "@/pages/components/song-search";
import SongLyricsSearchPage from "@/pages/components/song-lyrics-search";
import ReleaseCalendarPage from "@/pages/components/release-calendar";
import SongCardPlayerPage from "@/pages/components/song-card-player";
import ArtistDetailsPage from "@/pages/components/artist-details";
import AlbumDetailsPage from "@/pages/components/album-details";
// Resource pages
import Documentation from "@/pages/documentation";
import DesignSystem from "@/pages/design-system";
import PlatformsPage from "@/pages/resources/platforms";
import AccessibilityPage from "@/pages/resources/accessibility";
import NotFound from "@/pages/not-found";
import LyricDashboardPage from "@/pages/components/lyric-dashboard";

function Router() {
  return (
    <Switch>
      {/* Home and main pages */}
      <Route path="/" component={Home} />
      <Route path="/components" component={ComponentsIndex} />
      <Route path="/components/showcase" component={ComponentShowcase} />

      {/* Core audio components */}
      <Route path="/components/audio-player" component={AudioPlayerPage} />
      <Route path="/components/volume-control" component={VolumeControlPage} />
      <Route path="/components/equalizer" component={EqualizerPage} />
      <Route path="/components/waveform" component={WaveformPage} />
      <Route path="/components/visualizer" component={VisualizerPage} />

      {/* Playback and media components */}
      <Route path="/components/playlist" component={PlaylistPage} />
      <Route path="/components/media-card" component={MediaCardPage} />
      <Route path="/components/mini-player" component={MiniPlayerPage} />
      <Route
        path="/components/song-card-player"
        component={SongCardPlayerPage}
      />
      <Route
        path="/components/lyric-dashboard"
        component={LyricDashboardPage}
      />

      {/* Industry and analytics components */}
      <Route path="/components/rights-manager" component={RightsManagerPage} />
      <Route
        path="/components/theory-visualizer"
        component={TheoryVisualizerPage}
      />
      <Route
        path="/components/performance-chart"
        component={PerformanceChartPage}
      />
      <Route path="/components/album-grid" component={AlbumGridPage} />
      <Route
        path="/components/release-calendar"
        component={ReleaseCalendarPage}
      />

      {/* Song-related components */}
      <Route path="/components/song-details" component={SongDetailsPage} />
      <Route path="/components/song-lyrics" component={SongLyricsPage} />
      <Route path="/components/song-search" component={SongSearchPage} />
      <Route
        path="/components/song-lyrics-search"
        component={SongLyricsSearchPage}
      />
      <Route path="/components/artist-details" component={ArtistDetailsPage} />
      <Route path="/components/album-details" component={AlbumDetailsPage} />

      {/* Resource pages */}
      <Route path="/resources/platforms" component={PlatformsPage} />
      <Route path="/resources/figma" component={ComponentsIndex} />
      <Route path="/resources/accessibility" component={AccessibilityPage} />
      <Route path="/resources/changelog" component={ComponentsIndex} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/design-system" component={DesignSystem} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
