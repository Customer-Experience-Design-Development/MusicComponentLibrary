import { useState, useRef, useEffect } from 'react';
import { AppHeader } from '@/components/AppHeader';
import { Sidebar } from '@/components/Sidebar';
import { PageHeader } from '@/components/PageHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  Volume2,
  Heart,
  Repeat,
  Shuffle,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Music,
  Waves,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Zap,
  Target,
  ChevronLeft,
  ChevronRight,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Track } from '@/types/music';
import { SocialMusicFeed } from '@/components/music-ui/SocialMusicFeed';
import { MobileDJController } from '@/components/music-ui/MobileDJController';

// Demo data
const demoTrack: Track = {
  id: 1,
  title: "Neon Dreams",
  artist: "Synthwave Collective",
  duration: 245,
  albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
  metadata: {
    bpm: 128,
    key: "A minor",
    genre: ["Synthwave", "Electronic"]
  }
};

const demoPlaylist = [
  {
    id: 1,
    title: "Neon Dreams",
    artist: "Synthwave Collective",
    duration: 245,
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 2,
    title: "Digital Horizon", 
    artist: "Cyber Pulse",
    duration: 198,
    albumArt: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 3,
    title: "Electric Nights",
    artist: "Future Bass",
    duration: 267,
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  },
  {
    id: 4,
    title: "Quantum Beat",
    artist: "Neural Networks",
    duration: 203,
    albumArt: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
  }
];

// Demo social music posts
const demoSocialPosts = [
  {
    id: "1",
    artist: {
      name: "Flux aka Jordan",
      username: "synthwaveflux",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    track: {
      title: "Weekly Synthesis",
      duration: 180,
      genre: ["Electronic", "Beats"],
      waveform: [40, 65, 80, 45, 90, 55, 70, 35, 85, 60, 75, 50, 95, 40, 60, 70, 80, 45, 65, 55]
    },
    content: {
      text: "This is Flux aka Jordan from the underground scene. Crafting modular compositions out here in Portland. Targeting one synthesis every week. Check back every Thursday for fresh algorithmic content.",
      backgroundColor: "#4F46E5"
    },
    engagement: {
      likes: 1200,
      comments: 89,
      shares: 45,
      plays: 5600
    },
    timestamp: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    artist: {
      name: "NEXUS",
      username: "nexuspatterns",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c33b2d0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: false
    },
    track: {
      title: "RESONANCE Sample Archive",
      duration: 240,
      genre: ["Ambient", "Samples"],
      waveform: [30, 55, 70, 85, 60, 75, 40, 95, 50, 65, 80, 45, 70, 55, 90, 35, 60, 75, 50, 85]
    },
    content: {
      text: "I collaborate with NEXUS and RESONANCE platforms. Electronic music is about open architecture, so I distribute patches globally. You can access all my modules here. Connect",
      backgroundImage: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=600"
    },
    engagement: {
      likes: 890,
      comments: 34,
      shares: 67,
      plays: 3200
    },
    timestamp: "2024-01-14T15:45:00Z"
  },
  {
    id: "3",
    artist: {
      name: "Geometric Assembly",
      username: "geoassembly",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
      verified: true
    },
    track: {
      title: "Midnight Patterns",
      duration: 210,
      genre: ["Minimal", "Techno"],
      waveform: [60, 45, 75, 50, 85, 65, 40, 80, 55, 70, 35, 90, 45, 60, 75, 50, 85, 40, 65, 55]
    },
    content: {
      text: "Late night laboratory sessions yielding different results. This sequence emerged through patch cable improvisation - sometimes the connections just align. 🔗⚡",
      backgroundColor: "#7C3AED"
    },
    engagement: {
      likes: 2300,
      comments: 156,
      shares: 89,
      plays: 8900
    },
    timestamp: "2024-01-13T22:20:00Z"
  }
];

// Avant-garde Mobile Player Component with modular synth aesthetic
const AvantGardeMobilePlayer = ({ track, className = '' }: { track: Track; className?: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(67);
  const [volume, setVolume] = useState(75);
  const [isLiked, setIsLiked] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (currentTime / track.duration) * 100;

  return (
    <div className={cn("relative h-full bg-violet-50 text-violet-900 overflow-hidden font-mono", className)}>
      {/* Modular block layout inspired by Teenage Engineering */}
      <div className="h-full flex flex-col">
        {/* Top status bar */}
        <div className="h-16 bg-violet-50 border-b border-violet-200 flex items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-xs">SYNC</span>
          </div>
          <div className="text-xs font-bold tracking-wider">MODULAR PLAYER</div>
          <div className="text-xs">
            {formatTime(currentTime)} / {formatTime(track.duration)}
          </div>
        </div>

        {/* Main content area with block layout */}
        <div className="flex-1 flex">
          {/* Left control column */}
          <div className="w-16 flex flex-col">
            {/* Album art indicator */}
            <div className="h-28 p-2 bg-violet-100 border border-violet-200 flex flex-col justify-center items-center">
              <Music size={24} className="text-violet-600" />
            </div>
            
            {/* Play/pause block */}
            <div className="h-20 p-2 bg-rose-50 border border-rose-200 flex flex-col justify-center items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 text-rose-600 hover:bg-rose-100"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>
            </div>
            
            {/* Volume control */}
            <div className="h-36 p-2 bg-blue-50 border border-blue-200 flex flex-col justify-center items-center">
              <Volume2 size={16} className="text-blue-600 mb-2" />
              <div className="h-20 w-4 bg-blue-100 rounded relative">
                <div 
                  className="absolute bottom-0 w-full bg-blue-400 rounded"
                  style={{ height: `${volume}%` }}
                />
              </div>
            </div>
            
            {/* Like button with count */}
            <div className="flex-1 p-2 bg-yellow-50 border border-lime-500 flex flex-col justify-center items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "w-8 h-8 mb-1",
                  isLiked ? "text-lime-600" : "text-lime-700"
                )}
              >
                <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
              </Button>
              <span className="text-xs text-lime-950 font-bold">1.2K</span>
            </div>
          </div>

          {/* Main content blocks */}
          <div className="flex-1 flex">
            {/* Current track display */}
            <div className="w-64 flex flex-col">
              {/* Album art block */}
              <div className="h-64 p-2 bg-white border border-violet-200 flex justify-center items-center">
                <img 
                  src={track.albumArt} 
                  alt={track.title}
                  className="w-full h-full object-cover rounded border border-violet-100"
                />
              </div>
              
              {/* Track info block */}
              <div className="flex-1 p-4 bg-violet-50 border border-violet-200">
                <h3 className="font-bold text-lg mb-2">{track.title}</h3>
                <p className="text-violet-700 mb-4">{track.artist}</p>
                <div className="text-xs space-y-1">
                  <div>BPM: {track.metadata?.bpm || 128}</div>
                  <div>Key: {track.metadata?.key || "A minor"}</div>
                  <div>Genre: {track.metadata?.genre?.[0] || "Electronic"}</div>
                </div>
              </div>
            </div>

            {/* Next track preview (semi-transparent) */}
            <div className="w-64 opacity-40 border border-violet-200">
              <img 
                src="https://images.unsplash.com/photo-1571330735066-03aaa9429d89?ixlib=rb-4.0.3&auto=format&fit=crop&w=252&h=567"
                alt="Next track"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom control blocks */}
        <div className="h-52 flex">
          {/* Main play control */}
          <div className="w-32 p-2 bg-violet-50 border border-sky-400 flex flex-col justify-center items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 text-violet-900 hover:bg-violet-100"
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </Button>
          </div>
          
          {/* Secondary controls */}
          <div className="w-44 flex flex-col">
            {/* Comments/info */}
            <div className="h-28 p-2 bg-red-200 border border-red-300 flex flex-col justify-center items-center">
              <MessageCircle size={32} className="text-rose-950" />
            </div>
            
            {/* Previous track */}
            <div className="h-24 p-2 bg-violet-50 rounded-tr-3xl border border-violet-200 flex flex-col justify-center items-center">
              <SkipBack size={32} className="text-violet-900" />
            </div>
          </div>
          
          {/* Next track */}
          <div className="flex-1 p-2 bg-violet-50 rounded-tl-3xl border border-violet-200 flex flex-col justify-center items-center">
            <SkipForward size={32} className="text-violet-900" />
          </div>
        </div>
      </div>
      
      {/* Progress indicator as modular block overlay */}
      <div className="absolute bottom-2 left-2 right-2 h-1 bg-violet-200 rounded">
        <div 
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// Geometric Playlist with modular block styling
const GeometricPlaylist = ({ playlist, className = '' }: { playlist: any[]; className?: string }) => {
  const [selectedTrack, setSelectedTrack] = useState(0);

  return (
    <div className={cn("h-full bg-violet-50 text-violet-900 font-mono", className)}>
      <div className="h-full flex flex-col">
        {/* Header block */}
        <div className="h-16 bg-violet-100 border-b border-violet-200 flex items-center justify-between px-4">
          <h3 className="font-bold text-sm tracking-wider">MODULAR QUEUE</h3>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          </div>
        </div>

        {/* Track blocks */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-1">
              {playlist.map((track, index) => {
                const isActive = selectedTrack === index;
                const colors = [
                  'bg-rose-100 border-rose-300',
                  'bg-blue-100 border-blue-300', 
                  'bg-green-100 border-green-300',
                  'bg-yellow-100 border-yellow-300'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div
                    key={track.id}
                    className={cn(
                      "h-16 border-2 rounded cursor-pointer transition-all duration-200 flex items-center",
                      isActive 
                        ? "bg-violet-200 border-violet-400 shadow-md" 
                        : colorClass + " hover:shadow-sm"
                    )}
                    onClick={() => setSelectedTrack(index)}
                  >
                    {/* Shape indicator */}
                    <div className="w-12 h-full flex items-center justify-center">
                      <div className={cn(
                        "w-6 h-6 border-2 flex items-center justify-center",
                        index % 4 === 0 && "rounded-full border-rose-500",
                        index % 4 === 1 && "border-blue-500",
                        index % 4 === 2 && "rotate-45 border-green-500",
                        index % 4 === 3 && "rounded border-yellow-500"
                      )}>
                        {isActive && <div className="w-2 h-2 bg-violet-600 rounded-full"></div>}
                      </div>
                    </div>

                    {/* Track artwork */}
                    <div className="w-10 h-10 mx-2 rounded border border-violet-200 overflow-hidden">
                      <img 
                        src={track.albumArt} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Track info */}
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-sm truncate">{track.title}</p>
                      <p className="text-xs text-violet-600 truncate">{track.artist}</p>
                    </div>

                    {/* Duration display */}
                    <div className="w-12 text-right">
                      <span className="text-xs font-mono">
                        {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Control blocks at bottom */}
        <div className="h-20 border-t border-violet-200 flex">
          <div className="w-16 bg-rose-100 border-r border-violet-200 flex items-center justify-center">
            <Shuffle size={20} className="text-rose-600" />
          </div>
          <div className="flex-1 bg-violet-100 flex items-center justify-center space-x-4">
            <SkipBack size={16} className="text-violet-600" />
            <div className="w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center">
              <Play size={12} className="text-white ml-0.5" />
            </div>
            <SkipForward size={16} className="text-violet-600" />
          </div>
          <div className="w-16 bg-blue-100 border-l border-violet-200 flex items-center justify-center">
            <Repeat size={20} className="text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Asymmetric Controls with modular synth block layout
const AsymmetricControls = ({ className = '' }: { className?: string }) => {
  const [activeControl, setActiveControl] = useState<string | null>(null);
  const [values, setValues] = useState({
    eq1: 50,
    eq2: 75,
    eq3: 60,
    reverb: 30,
    delay: 45,
    filter: 80
  });

  const controlBlocks = [
    { id: 'eq1', label: 'LOW', color: 'bg-red-100 border-red-300', position: 'top-4 left-4', size: 'w-16 h-20' },
    { id: 'eq2', label: 'MID', color: 'bg-yellow-100 border-yellow-300', position: 'top-4 right-4', size: 'w-20 h-16' },
    { id: 'eq3', label: 'HIGH', color: 'bg-blue-100 border-blue-300', position: 'top-32 left-8', size: 'w-14 h-24' },
    { id: 'reverb', label: 'SPACE', color: 'bg-purple-100 border-purple-300', position: 'bottom-32 right-8', size: 'w-18 h-18' },
    { id: 'delay', label: 'ECHO', color: 'bg-green-100 border-green-300', position: 'bottom-16 left-6', size: 'w-16 h-14' },
    { id: 'filter', label: 'FILTER', color: 'bg-cyan-100 border-cyan-300', position: 'top-20 left-1/2 -translate-x-1/2', size: 'w-20 h-20' }
  ];

  return (
    <div className={cn("h-full bg-violet-50 text-violet-900 font-mono relative overflow-hidden", className)}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="synth-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#synth-grid)" />
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 h-16 bg-violet-100 border-b border-violet-200 flex items-center justify-center">
        <h3 className="font-bold text-sm tracking-wider">MODULAR CONTROLS</h3>
      </div>

      {/* Control blocks */}
      <div className="relative z-10 h-full p-4">
        {controlBlocks.map((control) => {
          const isActive = activeControl === control.id;
          const value = values[control.id as keyof typeof values];
          
          return (
            <div
              key={control.id}
              className={cn(
                "absolute border-2 cursor-pointer transition-all duration-300 flex flex-col items-center justify-center",
                control.color,
                control.position,
                control.size,
                isActive && "shadow-lg scale-110 border-violet-500"
              )}
              onClick={() => setActiveControl(activeControl === control.id ? null : control.id)}
            >
              {/* Control indicator */}
              <div className={cn(
                "w-6 h-6 border-2 border-violet-600 mb-1 flex items-center justify-center",
                control.id === 'eq1' && "rounded-full",
                control.id === 'eq2' && "",
                control.id === 'eq3' && "rotate-45",
                control.id === 'reverb' && "rounded",
                control.id === 'delay' && "rounded-full",
                control.id === 'filter' && "rounded"
              )}>
                {isActive && <div className="w-2 h-2 bg-violet-600 rounded-full"></div>}
              </div>
              
              {/* Label */}
              <span className="text-xs font-bold">{control.label}</span>
              
              {/* Value display */}
              <span className="text-xs">{value}</span>
            </div>
          );
        })}
      </div>

      {/* Active control panel */}
      {activeControl && (
        <div className="absolute bottom-4 left-4 right-4 h-20 bg-white border-2 border-violet-300 rounded p-3 z-20">
          <div className="text-center mb-2">
            <span className="text-sm font-bold">
              {controlBlocks.find(c => c.id === activeControl)?.label}
            </span>
          </div>
          <Slider
            value={[values[activeControl as keyof typeof values]]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setValues(prev => ({ ...prev, [activeControl]: value[0] }))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

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

const socialLinks = [
  { icon: "ri-twitter-fill", href: "https://twitter.com/musicui" },
  { icon: "ri-github-fill", href: "https://github.com/musicui" },
  { icon: "ri-discord-fill", href: "https://discord.gg/musicui" }
];

export default function MobileUIShowcasePage() {
  const [activeTab, setActiveTab] = useState('player');
  const [viewportSize, setViewportSize] = useState('phone');
  const { toast } = useToast();

  const viewportSizes = {
    phone: { width: 375, height: 667, name: 'iPhone SE' },
    tablet: { width: 768, height: 1024, name: 'iPad' },
    desktop: { width: 1024, height: 768, name: 'Desktop' }
  };

  const currentViewport = viewportSizes[viewportSize as keyof typeof viewportSizes];

  const designPrinciples = [
    {
      title: "Geometric Harmony",
      description: "Using mathematical proportions and geometric shapes to create visually balanced interfaces that feel both modern and timeless.",
      example: "Circular progress indicators, hexagonal controls, and triangular navigation elements"
    },
    {
      title: "Asymmetric Balance",
      description: "Breaking traditional grid layouts to create dynamic, engaging interfaces that guide user attention naturally.",
      example: "Off-center album artwork, diagonal control layouts, and irregular content spacing"
    },
    {
      title: "Gradient Depth",
      description: "Multi-layered gradients create depth and dimension, making flat interfaces feel more tactile and engaging.",
      example: "Purple-to-cyan color transitions, layered background effects, and depth-based shadows"
    },
    {
      title: "Contextual Animation",
      description: "Micro-interactions that respond to user behavior, providing feedback and enhancing the sense of direct manipulation.",
      example: "Pulsing play buttons, morphing control states, and responsive touch feedback"
    }
  ];

  const mobileOptimizations = [
    "Touch targets sized for finger interaction (44px minimum)",
    "Gesture-based navigation with swipe support",
    "Optimized layout hierarchy for one-handed use",
    "High contrast ratios for outdoor visibility",
    "Reduced cognitive load with progressive disclosure",
    "Battery-efficient animations and transitions"
  ];

  return (
    <div className="min-h-screen">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 mt-4">
          <Sidebar activePath="/components/mobile-ui-showcase" />
          
          <main className="col-span-12 lg:col-span-9">
            <PageHeader 
              title="Mobile UI Showcase" 
              description="Explore avant-garde mobile music interfaces that push the boundaries of conventional design patterns. Interactive demos showcase how geometric layouts, asymmetric controls, and contextual animations create engaging mobile experiences."
            />
            
            {/* Viewport Size Selector */}
            <div className="mt-8 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <Label className="text-sm font-medium">Viewport Size:</Label>
                <Tabs value={viewportSize} onValueChange={setViewportSize} className="flex-1">
                  <TabsList>
                    <TabsTrigger value="phone" className="flex items-center">
                      <Smartphone className="mr-2 h-4 w-4" />
                      {viewportSizes.phone.name}
                    </TabsTrigger>
                    <TabsTrigger value="tablet" className="flex items-center">
                      <Tablet className="mr-2 h-4 w-4" />
                      {viewportSizes.tablet.name}
                    </TabsTrigger>
                    <TabsTrigger value="desktop" className="flex items-center">
                      <Monitor className="mr-2 h-4 w-4" />
                      {viewportSizes.desktop.name}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Current viewport: {currentViewport.width} × {currentViewport.height}px
              </div>
            </div>

            {/* Component Showcase */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
              <TabsList className="mb-6 w-full justify-start">
                <TabsTrigger value="player">Avant-Garde Player</TabsTrigger>
                <TabsTrigger value="playlist">Geometric Playlist</TabsTrigger>
                <TabsTrigger value="controls">Asymmetric Controls</TabsTrigger>
                <TabsTrigger value="principles">Design Principles</TabsTrigger>
              </TabsList>
              
              {/* Mobile Player Demo */}
              <TabsContent value="player">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Music className="mr-2 h-5 w-5" />
                        Avant-Garde Mobile Player
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div 
                        className="bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800"
                        style={{
                          width: Math.min(currentViewport.width * 0.8, 400),
                          height: Math.min(currentViewport.height * 0.8, 600)
                        }}
                      >
                        <AvantGardeMobilePlayer track={demoTrack} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Design Features</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">Geometric Layouts</Badge>
                          <p className="text-sm text-muted-foreground">
                            Circular progress rings, overlapping geometric shapes, and mathematical proportions create visual harmony.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">Gradient Depth</Badge>
                          <p className="text-sm text-muted-foreground">
                            Multi-layer gradients from purple to cyan create depth and visual interest without overwhelming the content.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">Contextual Animation</Badge>
                          <p className="text-sm text-muted-foreground">
                            Pulsing elements, rotating shapes, and smooth transitions provide feedback and enhance interactivity.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Mobile Optimizations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Large touch targets (44px+) for all interactive elements
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            High contrast text and iconography
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Thumb-friendly control placement
                          </li>
                          <li className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                            Progressive disclosure of complex features
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Geometric Playlist Demo */}
              <TabsContent value="playlist">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Waves className="mr-2 h-5 w-5" />
                        Geometric Playlist Interface
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div 
                        className="bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800"
                        style={{
                          width: Math.min(currentViewport.width * 0.8, 400),
                          height: Math.min(currentViewport.height * 0.8, 600)
                        }}
                      >
                        <GeometricPlaylist playlist={demoPlaylist} />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Visual Language</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">Shape Hierarchy</Badge>
                          <p className="text-sm text-muted-foreground">
                            Different geometric shapes (circles, squares, triangles) indicate track states and create visual categorization.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">Asymmetric Spacing</Badge>
                          <p className="text-sm text-muted-foreground">
                            Non-uniform spacing between elements creates rhythm and prevents monotonous scrolling experiences.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">State Animation</Badge>
                          <p className="text-sm text-muted-foreground">
                            Active tracks pulse and glow, while selection states morph smoothly between geometric forms.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Interaction Patterns</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Target className="w-4 h-4 text-blue-500 mr-3" />
                            Tap to select tracks with immediate visual feedback
                          </li>
                          <li className="flex items-center">
                            <Zap className="w-4 h-4 text-yellow-500 mr-3" />
                            Hold to preview tracks with haptic feedback
                          </li>
                          <li className="flex items-center">
                            <ChevronRight className="w-4 h-4 text-green-500 mr-3" />
                            Swipe left/right for quick actions (like, queue)
                          </li>
                          <li className="flex items-center">
                            <Waves className="w-4 h-4 text-purple-500 mr-3" />
                            Vertical scroll with momentum and snap points
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Asymmetric Controls Demo */}
              <TabsContent value="controls">
                <div className="grid lg:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Target className="mr-2 h-5 w-5" />
                        Asymmetric Sound Controls
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <div 
                        className="bg-black rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800"
                        style={{
                          width: Math.min(currentViewport.width * 0.8, 400),
                          height: Math.min(currentViewport.height * 0.8, 600)
                        }}
                      >
                        <AsymmetricControls />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Asymmetric Design Philosophy</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Badge variant="secondary" className="mb-2">Dynamic Balance</Badge>
                          <p className="text-sm text-muted-foreground">
                            Controls are positioned using the golden ratio and asymmetric principles to create natural, intuitive layouts.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">Spatial Relationships</Badge>
                          <p className="text-sm text-muted-foreground">
                            Related controls are clustered using proximity and connection lines, making complex interfaces more understandable.
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="mb-2">Gesture Recognition</Badge>
                          <p className="text-sm text-muted-foreground">
                            Multi-touch gestures allow for simultaneous control manipulation, mimicking real DJ equipment interactions.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Control Innovation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <Circle className="w-4 h-4 text-red-500 mr-3" />
                            Circular controls for continuous parameters (EQ, volume)
                          </li>
                          <li className="flex items-center">
                            <Square className="w-4 h-4 text-blue-500 mr-3" />
                            Square triggers for discrete actions (effects, samples)
                          </li>
                          <li className="flex items-center">
                            <Triangle className="w-4 h-4 text-green-500 mr-3" />
                            Triangular indicators for directional controls
                          </li>
                          <li className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-500 mr-3" />
                            Star shapes for special or premium features
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              {/* Design Principles */}
              <TabsContent value="principles">
                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>Avant-Garde Design Principles</CardTitle>
                      <p className="text-muted-foreground">
                        These principles guide the creation of innovative mobile music interfaces that challenge conventional design patterns while maintaining usability.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        {designPrinciples.map((principle, index) => (
                          <Card key={index} className="border border-border/50">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">{principle.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <p className="text-sm text-muted-foreground">
                                {principle.description}
                              </p>
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs font-medium text-muted-foreground mb-1">Example:</p>
                                <p className="text-xs">{principle.example}</p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Mobile-Specific Optimizations</CardTitle>
                      <p className="text-muted-foreground">
                        Essential considerations for creating effective mobile music interfaces.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {mobileOptimizations.map((optimization, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm">{optimization}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Implementation Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Performance Considerations</h4>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            Use CSS transforms instead of changing layout properties for animations. Leverage hardware acceleration with transform3d() and will-change properties.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Accessibility</h4>
                          <p className="text-sm text-green-800 dark:text-green-200">
                            Ensure all interactive elements have sufficient color contrast and are large enough for users with motor impairments. Provide alternative text for geometric indicators.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
                          <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">Platform Consistency</h4>
                          <p className="text-sm text-purple-800 dark:text-purple-200">
                            While pushing creative boundaries, maintain familiar interaction patterns and respect platform conventions for navigation and system integration.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
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