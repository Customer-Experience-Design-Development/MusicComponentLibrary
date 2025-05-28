import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Play, 
  Pause,
  ExternalLink,
  Calendar,
  Music,
  Video,
  FileText,
  Instagram,
  Twitter,
  Youtube,
  MoreHorizontal,
  Bookmark,
  Download,
  Eye,
  TrendingUp
} from 'lucide-react';

// Platform-specific icons mapping
const platformIcons: Record<PostPlatform | 'default', React.ComponentType<any>> = {
  spotify: Music,
  bandcamp: Music,
  soundcloud: Music,
  audius: Music,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  reddit: MessageCircle,
  facebook: Share2,
  blog: FileText,
  medium: FileText,
  substack: FileText,
  custom: FileText,
  default: FileText
};

export type PostType = 
  | 'blog' 
  | 'social' 
  | 'dsp_release' 
  | 'video' 
  | 'announcement'
  | 'review'
  | 'playlist'
  | 'live_event';

export type PostPlatform = 
  | 'spotify' 
  | 'bandcamp' 
  | 'soundcloud' 
  | 'audius'
  | 'youtube' 
  | 'instagram' 
  | 'twitter' 
  | 'reddit'
  | 'facebook'
  | 'blog'
  | 'medium'
  | 'substack'
  | 'custom';

export interface PostAuthor {
  id: string;
  name: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  role?: string;
  followerCount?: number;
}

export interface PostMedia {
  type: 'image' | 'video' | 'audio' | 'embed';
  url: string;
  thumbnail?: string;
  alt?: string;
  duration?: number;
  aspectRatio?: string;
}

export interface PostMetrics {
  likes?: number;
  comments?: number;
  shares?: number;
  views?: number;
  plays?: number;
  saves?: number;
  downloads?: number;
}

export interface PostAction {
  type: 'like' | 'comment' | 'share' | 'save' | 'download' | 'play' | 'external';
  label: string;
  icon?: React.ComponentType<any>;
  onClick?: () => void;
  href?: string;
  count?: number;
  active?: boolean;
}

export interface PostProps {
  id: string;
  type: PostType;
  platform: PostPlatform;
  author: PostAuthor;
  title?: string;
  content: string;
  media?: PostMedia[];
  tags?: string[];
  timestamp: string;
  metrics?: PostMetrics;
  actions?: PostAction[];
  featured?: boolean;
  pinned?: boolean;
  sponsored?: boolean;
  releaseInfo?: {
    releaseDate?: string;
    label?: string;
    genre?: string;
    trackCount?: number;
    duration?: number;
  };
  eventInfo?: {
    date: string;
    venue?: string;
    location?: string;
    ticketUrl?: string;
  };
  variant?: 'default' | 'compact' | 'featured' | 'minimal';
  showMetrics?: boolean;
  showActions?: boolean;
  maxContentLength?: number;
  className?: string;
  onAuthorClick?: (author: PostAuthor) => void;
  onPostClick?: (post: PostProps) => void;
}

export function Post({
  id,
  type,
  platform,
  author,
  title,
  content,
  media = [],
  tags = [],
  timestamp,
  metrics = {},
  actions = [],
  featured = false,
  pinned = false,
  sponsored = false,
  releaseInfo,
  eventInfo,
  variant = 'default',
  showMetrics = true,
  showActions = true,
  maxContentLength = 280,
  className,
  onAuthorClick,
  onPostClick
}: PostProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userActions, setUserActions] = useState<Record<string, boolean>>({});

  const PlatformIcon = platformIcons[platform] || platformIcons.default;
  
  const shouldTruncate = content.length > maxContentLength && !isExpanded;
  const displayContent = shouldTruncate 
    ? content.slice(0, maxContentLength) + '...'
    : content;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d`;
    return date.toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const handleActionClick = (action: PostAction) => {
    if (action.type === 'external' && action.href) {
      window.open(action.href, '_blank');
      return;
    }
    
    if (action.onClick) {
      action.onClick();
    }
    
    // Toggle user action state for interactive actions
    if (['like', 'save', 'play'].includes(action.type)) {
      setUserActions(prev => ({
        ...prev,
        [action.type]: !prev[action.type]
      }));
      
      if (action.type === 'play') {
        setIsPlaying(!isPlaying);
      }
    }
  };

  const getTypeColor = (type: PostType) => {
    const colors = {
      blog: 'bg-blue-100 text-blue-800',
      social: 'bg-purple-100 text-purple-800',
      dsp_release: 'bg-green-100 text-green-800',
      video: 'bg-red-100 text-red-800',
      announcement: 'bg-yellow-100 text-yellow-800',
      review: 'bg-orange-100 text-orange-800',
      playlist: 'bg-indigo-100 text-indigo-800',
      live_event: 'bg-pink-100 text-pink-800'
    };
    return colors[type] || colors.blog;
  };

  const renderMedia = () => {
    if (!media.length) return null;

    const primaryMedia = media[0];
    
    return (
      <div className="relative mt-3 overflow-hidden rounded-lg">
        {primaryMedia.type === 'image' && (
          <img
            src={primaryMedia.url}
            alt={primaryMedia.alt || 'Post media'}
            className="w-full object-cover"
            style={{ aspectRatio: primaryMedia.aspectRatio || '16/9' }}
          />
        )}
        
        {primaryMedia.type === 'video' && (
          <div className="relative">
            <img
              src={primaryMedia.thumbnail || primaryMedia.url}
              alt={primaryMedia.alt || 'Video thumbnail'}
              className="w-full object-cover"
              style={{ aspectRatio: primaryMedia.aspectRatio || '16/9' }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <Button
                size="lg"
                className="rounded-full bg-white/90 text-black hover:bg-white"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
            </div>
            {primaryMedia.duration && (
              <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {Math.floor(primaryMedia.duration / 60)}:{(primaryMedia.duration % 60).toString().padStart(2, '0')}
              </div>
            )}
          </div>
        )}
        
        {primaryMedia.type === 'audio' && (
          <div className="flex items-center gap-3 bg-muted p-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="text-sm font-medium">Audio Track</div>
              {primaryMedia.duration && (
                <div className="text-xs text-muted-foreground">
                  {Math.floor(primaryMedia.duration / 60)}:{(primaryMedia.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          </div>
        )}
        
        {media.length > 1 && (
          <div className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            +{media.length - 1} more
          </div>
        )}
      </div>
    );
  };

  const renderReleaseInfo = () => {
    if (!releaseInfo) return null;
    
    return (
      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Music className="h-4 w-4" />
          <span className="font-medium">Release Info</span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {releaseInfo.releaseDate && (
            <div>Release: {new Date(releaseInfo.releaseDate).toLocaleDateString()}</div>
          )}
          {releaseInfo.label && <div>Label: {releaseInfo.label}</div>}
          {releaseInfo.genre && <div>Genre: {releaseInfo.genre}</div>}
          {releaseInfo.trackCount && <div>Tracks: {releaseInfo.trackCount}</div>}
        </div>
      </div>
    );
  };

  const renderEventInfo = () => {
    if (!eventInfo) return null;
    
    return (
      <div className="mt-3 rounded-lg bg-muted/50 p-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Event Details</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          <div>{new Date(eventInfo.date).toLocaleDateString()}</div>
          {eventInfo.venue && <div>{eventInfo.venue}</div>}
          {eventInfo.location && <div>{eventInfo.location}</div>}
        </div>
        {eventInfo.ticketUrl && (
          <Button size="sm" className="mt-2" asChild>
            <a href={eventInfo.ticketUrl} target="_blank" rel="noopener noreferrer">
              Get Tickets
            </a>
          </Button>
        )}
      </div>
    );
  };

  const renderActions = () => {
    if (!showActions || !actions.length) return null;
    
    return (
      <div className="flex items-center justify-between pt-3">
        <div className="flex items-center gap-1">
          {actions.slice(0, 4).map((action, index) => {
            const Icon = action.icon || Heart;
            const isActive = userActions[action.type] || action.active;
            
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 gap-1 px-2",
                  isActive && "text-primary"
                )}
                onClick={() => handleActionClick(action)}
              >
                <Icon className="h-4 w-4" />
                {action.count !== undefined && (
                  <span className="text-xs">{formatNumber(action.count)}</span>
                )}
              </Button>
            );
          })}
        </div>
        
        {actions.length > 4 && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  const renderMetrics = () => {
    if (!showMetrics || !Object.keys(metrics).length) return null;
    
    return (
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        {metrics.views && (
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatNumber(metrics.views)}
          </div>
        )}
        {metrics.likes && (
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            {formatNumber(metrics.likes)}
          </div>
        )}
        {metrics.comments && (
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            {formatNumber(metrics.comments)}
          </div>
        )}
        {metrics.shares && (
          <div className="flex items-center gap-1">
            <Share2 className="h-3 w-3" />
            {formatNumber(metrics.shares)}
          </div>
        )}
        {metrics.plays && (
          <div className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            {formatNumber(metrics.plays)}
          </div>
        )}
      </div>
    );
  };

  if (variant === 'minimal') {
    return (
      <div className={cn("flex gap-3 py-3", className)}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{author.name}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground">{formatTimestamp(timestamp)}</span>
          </div>
          <p className="text-sm mt-1">{displayContent}</p>
          {tags.length > 0 && (
            <div className="flex gap-1 mt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn("overflow-hidden", featured && "ring-2 ring-primary", className)}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{author.name}</span>
                <PlatformIcon className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{formatTimestamp(timestamp)}</span>
              </div>
              {title && <h3 className="font-medium mt-1">{title}</h3>}
              <p className="text-sm text-muted-foreground mt-1">{displayContent}</p>
              {renderMetrics()}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-md",
      featured && "ring-2 ring-primary",
      pinned && "border-yellow-200 bg-yellow-50/50",
      variant === 'featured' && "border-primary/20 bg-primary/5",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar 
              className="h-10 w-10 cursor-pointer" 
              onClick={() => onAuthorClick?.(author)}
            >
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{author.name}</span>
                {author.verified && (
                  <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {author.username && (
                  <span className="text-sm text-muted-foreground">@{author.username}</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <PlatformIcon className="h-3 w-3" />
                <span>{formatTimestamp(timestamp)}</span>
                {author.followerCount && (
                  <>
                    <span>·</span>
                    <span>{formatNumber(author.followerCount)} followers</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {pinned && <Badge variant="secondary" className="text-xs">Pinned</Badge>}
            {sponsored && <Badge variant="outline" className="text-xs">Sponsored</Badge>}
            <Badge className={cn("text-xs", getTypeColor(type))}>
              {type.replace('_', ' ')}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {title && (
          <h2 className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary" 
              onClick={() => onPostClick?.({
                id, type, platform, author, title, content, media, tags, timestamp, 
                metrics, actions, featured, pinned, sponsored, releaseInfo, eventInfo,
                variant, showMetrics, showActions, maxContentLength, className,
                onAuthorClick, onPostClick
              })}>
            {title}
          </h2>
        )}
        
        <div className="prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{displayContent}</p>
          {shouldTruncate && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-primary"
              onClick={() => setIsExpanded(true)}
            >
              Show more
            </Button>
          )}
        </div>

        {renderMedia()}
        {renderReleaseInfo()}
        {renderEventInfo()}

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      {(showMetrics || showActions) && (
        <CardFooter className="pt-0">
          <div className="w-full space-y-2">
            {renderMetrics()}
            {showMetrics && showActions && <Separator />}
            {renderActions()}
          </div>
        </CardFooter>
      )}
    </Card>
  );
} 