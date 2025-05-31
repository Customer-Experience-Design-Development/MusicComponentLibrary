import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  Play, 
  Pause, 
  Heart, 
  MessageCircle, 
  Share2, 
  Music, 
  MoreVertical,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Headphones,
  Mic,
  ThumbsUp
} from 'lucide-react';

interface MusicPost {
  id: string;
  artist: {
    name: string;
    username: string;
    avatar: string;
    verified: boolean;
  };
  track: {
    title: string;
    duration: number;
    waveform?: number[];
    genre: string[];
  };
  content: {
    text: string;
    backgroundImage?: string;
    backgroundColor?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    plays: number;
  };
  timestamp: string;
}

interface SocialMusicFeedProps {
  posts: MusicPost[];
  className?: string;
}

const SocialMusicPost = ({ post, isActive, onPlay }: { 
  post: MusicPost; 
  isActive: boolean; 
  onPlay: (id: string) => void; 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showWaveform, setShowWaveform] = useState(false);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
    onPlay(post.id);
  };

  const progress = (currentTime / post.track.duration) * 100;

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600"
        style={{
          backgroundImage: post.content.backgroundImage ? `url(${post.content.backgroundImage})` : undefined,
          backgroundColor: post.content.backgroundColor
        }}
      >
        {post.content.backgroundImage && (
          <div className="absolute inset-0 bg-black/40"></div>
        )}
      </div>

      {/* Grid overlay pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id={`grid-${post.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#grid-${post.id})`} className="text-white/30" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 border-2 border-white/20">
              <AvatarImage src={post.artist.avatar} alt={post.artist.name} />
              <AvatarFallback>{post.artist.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-sm">{post.artist.name}</span>
                {post.artist.verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <span className="text-xs text-white/60">@{post.artist.username}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white">
            <MoreVertical size={20} />
          </Button>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
          {/* Track info */}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold leading-tight">{post.track.title}</h3>
            <div className="flex items-center justify-center space-x-2">
              {post.track.genre.map((genre, index) => (
                <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>

          {/* Content text */}
          <p className="text-lg leading-relaxed max-w-xs">{post.content.text}</p>

          {/* Waveform toggle */}
          {post.track.waveform && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWaveform(!showWaveform)}
              className="text-white/80 hover:text-white"
            >
              <Music size={16} className="mr-2" />
              {showWaveform ? 'Hide' : 'Show'} Waveform
            </Button>
          )}

          {/* Waveform visualization */}
          {showWaveform && post.track.waveform && (
            <div className="w-full max-w-xs">
              <div className="flex items-center justify-center space-x-1 h-16">
                {post.track.waveform.map((height, index) => (
                  <div
                    key={index}
                    className={cn(
                      "w-1 bg-white/60 rounded-full transition-all duration-200",
                      index < (progress / 100) * post.track.waveform!.length && "bg-cyan-400"
                    )}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Play controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/80 hover:text-white"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          
          <Button
            variant="default"
            size="icon"
            onClick={handlePlayToggle}
            className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsLiked(!isLiked)}
            className={cn(
              "text-white/80 hover:text-white",
              isLiked && "text-red-400"
            )}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
          </Button>
        </div>

        {/* Bottom info */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart size={16} />
              <span>{formatNumber(post.engagement.likes)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle size={16} />
              <span>{formatNumber(post.engagement.comments)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 size={16} />
              <span>{formatNumber(post.engagement.shares)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-white/60">
            <Headphones size={14} />
            <span>{formatNumber(post.engagement.plays)} plays</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-2 w-full bg-white/20 rounded-full h-1">
          <div 
            className="bg-cyan-400 h-1 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Side action buttons */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
          onClick={() => setIsLiked(!isLiked)}
        >
          <ThumbsUp size={20} fill={isLiked ? "currentColor" : "none"} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          <MessageCircle size={20} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
        >
          <Share2 size={20} />
        </Button>
      </div>
    </div>
  );
};

export function SocialMusicFeed({ posts, className = '' }: SocialMusicFeedProps) {
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [activePost, setActivePost] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePostNavigation = (direction: 'up' | 'down') => {
    if (direction === 'up' && currentPostIndex > 0) {
      setCurrentPostIndex(currentPostIndex - 1);
    } else if (direction === 'down' && currentPostIndex < posts.length - 1) {
      setCurrentPostIndex(currentPostIndex + 1);
    }
  };

  const handlePlay = (postId: string) => {
    setActivePost(activePost === postId ? null : postId);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          handlePostNavigation('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handlePostNavigation('down');
          break;
        case ' ':
          e.preventDefault();
          if (posts[currentPostIndex]) {
            handlePlay(posts[currentPostIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPostIndex, posts]);

  return (
    <div className={cn("relative w-full h-full", className)} ref={containerRef}>
      {/* Current post */}
      <div className="w-full h-full">
        {posts[currentPostIndex] && (
          <SocialMusicPost
            post={posts[currentPostIndex]}
            isActive={activePost === posts[currentPostIndex].id}
            onPlay={handlePlay}
          />
        )}
      </div>

      {/* Navigation arrows */}
      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePostNavigation('up')}
          disabled={currentPostIndex === 0}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 disabled:opacity-30"
        >
          <ChevronUp size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handlePostNavigation('down')}
          disabled={currentPostIndex === posts.length - 1}
          className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 disabled:opacity-30"
        >
          <ChevronDown size={16} />
        </Button>
      </div>

      {/* Post counter */}
      <div className="absolute top-4 left-4 text-white/60 text-sm">
        {currentPostIndex + 1} / {posts.length}
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-white/60 text-xs">
        Use ↑↓ arrows or buttons to navigate • Space to play/pause
      </div>
    </div>
  );
} 