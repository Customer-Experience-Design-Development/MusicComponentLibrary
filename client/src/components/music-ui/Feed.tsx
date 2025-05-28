import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Post, type PostProps } from './Post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Search, 
  Filter, 
  SortAsc, 
  Grid3X3, 
  List, 
  Columns, 
  LayoutGrid,
  RefreshCw,
  TrendingUp,
  Clock,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type FeedLayout = 
  | 'grid' 
  | 'masonry' 
  | 'list' 
  | 'cards' 
  | 'magazine' 
  | 'compact';

export type FeedSource = 
  | 'all'
  | 'following'
  | 'trending'
  | 'recent'
  | 'featured'
  | 'saved'
  | 'custom';

export type PaginationType = 
  | 'numbered'
  | 'loadmore'
  | 'infinite'
  | 'cursor';

export interface FeedProps {
  posts: PostProps[];
  layout?: FeedLayout;
  source?: FeedSource;
  paginationType?: PaginationType;
  postsPerPage?: number;
  showFilters?: boolean;
  showSearch?: boolean;
  showLayoutSwitcher?: boolean;
  showSourceTabs?: boolean;
  enableInfiniteScroll?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  columnCount?: number;
  className?: string;
  onPostClick?: (post: PostProps) => void;
  onAuthorClick?: (author: PostProps['author']) => void;
  onLoadMore?: () => void;
  onSourceChange?: (source: FeedSource) => void;
  onLayoutChange?: (layout: FeedLayout) => void;
  customSources?: { key: string; label: string; count?: number }[];
}

export function Feed({
  posts,
  layout = 'grid',
  source = 'all',
  paginationType = 'numbered',
  postsPerPage = 12,
  showFilters = true,
  showSearch = true,
  showLayoutSwitcher = true,
  showSourceTabs = true,
  enableInfiniteScroll = false,
  loadingMore = false,
  hasMore = true,
  columnCount,
  className,
  onPostClick,
  onAuthorClick,
  onLoadMore,
  onSourceChange,
  onLayoutChange,
  customSources = []
}: FeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLayout, setCurrentLayout] = useState<FeedLayout>(layout);
  const [currentSource, setCurrentSource] = useState<FeedSource>(source);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const observerRef = useRef<IntersectionObserver>();
  const lastPostElementRef = useRef<HTMLDivElement>(null);

  // Filter and sort posts
  const filteredPosts = posts
    .filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === 'all' || post.type === selectedType;
      const matchesPlatform = selectedPlatform === 'all' || post.platform === selectedPlatform;
      
      return matchesSearch && matchesType && matchesPlatform;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'timestamp':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'likes':
          return (b.metrics?.likes || 0) - (a.metrics?.likes || 0);
        case 'engagement':
          const aEngagement = (a.metrics?.likes || 0) + (a.metrics?.comments || 0) + (a.metrics?.shares || 0);
          const bEngagement = (b.metrics?.likes || 0) + (b.metrics?.comments || 0) + (b.metrics?.shares || 0);
          return bEngagement - aEngagement;
        case 'views':
          return (b.metrics?.views || 0) - (a.metrics?.views || 0);
        default:
          return 0;
      }
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = paginationType === 'infinite' ? filteredPosts : filteredPosts.slice(startIndex, endIndex);

  // Infinite scroll setup
  const lastPostRef = useCallback((node: HTMLDivElement) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && enableInfiniteScroll) {
        onLoadMore?.();
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, enableInfiniteScroll, onLoadMore]);

  const uniqueTypes = Array.from(new Set(posts.map(post => post.type)));
  const uniquePlatforms = Array.from(new Set(posts.map(post => post.platform)));

  const layoutIcons = {
    grid: Grid3X3,
    masonry: LayoutGrid,
    list: List,
    cards: Columns,
    magazine: LayoutGrid,
    compact: List
  };

  const sources = [
    { key: 'all', label: 'All Posts', count: posts.length },
    { key: 'trending', label: 'Trending', count: posts.filter(p => (p.metrics?.likes || 0) > 100).length },
    { key: 'recent', label: 'Recent', count: posts.filter(p => new Date(p.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length },
    { key: 'featured', label: 'Featured', count: posts.filter(p => p.featured).length },
    ...customSources
  ];

  const handleLayoutChange = (newLayout: FeedLayout) => {
    setCurrentLayout(newLayout);
    onLayoutChange?.(newLayout);
  };

  const handleSourceChange = (newSource: string) => {
    const sourceValue = newSource as FeedSource;
    setCurrentSource(sourceValue);
    onSourceChange?.(sourceValue);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getLayoutClasses = () => {
    switch (currentLayout) {
      case 'grid':
        if (columnCount) {
          return `grid gap-4 sm:gap-5 lg:gap-6`;
        }
        return 'adaptive-grid gap-4 sm:gap-5 lg:gap-6';
      case 'masonry':
        if (columnCount) {
          return `gap-4 sm:gap-5 lg:gap-6 space-y-4 sm:space-y-5 lg:space-y-6`;
        }
        return 'columns-1 sm:columns-2 md:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 sm:gap-5 lg:gap-6 space-y-4 sm:space-y-5 lg:space-y-6';
      case 'list':
        return 'space-y-3 sm:space-y-4 lg:space-y-5';
      case 'cards':
        if (columnCount) {
          return `grid gap-4 sm:gap-5 lg:gap-6`;
        }
        return 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6';
      case 'magazine':
        if (columnCount) {
          return `grid gap-4 sm:gap-5 lg:gap-6`;
        }
        return 'grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 lg:gap-6';
      case 'compact':
        if (columnCount) {
          return `grid gap-2 sm:gap-3 lg:gap-4`;
        }
        return 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4';
      default:
        if (columnCount) {
          return `grid gap-4 sm:gap-5 lg:gap-6`;
        }
        return 'adaptive-grid gap-4 sm:gap-5 lg:gap-6';
    }
  };

  const getPostVariant = () => {
    switch (currentLayout) {
      case 'list':
        return 'default';
      case 'compact':
        return 'compact';
      case 'magazine':
        return 'featured';
      case 'cards':
      case 'grid':
      case 'masonry':
      default:
        return 'default';
    }
  };

  const renderMagazineLayout = () => {
    if (currentPosts.length === 0) return null;
    
    const [featured, ...regular] = currentPosts;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Featured post */}
        <div className="md:col-span-8 lg:col-span-7 xl:col-span-8">
          <Post
            {...featured}
            variant="featured"
            featured={true}
            onPostClick={onPostClick}
            onAuthorClick={onAuthorClick}
          />
        </div>
        
        {/* Sidebar posts */}
        <div className="md:col-span-4 lg:col-span-5 xl:col-span-4 space-y-3 sm:space-y-4 lg:space-y-5">
          {regular.slice(0, 4).map((post, index) => (
            <Post
              key={post.id}
              {...post}
              variant="compact"
              onPostClick={onPostClick}
              onAuthorClick={onAuthorClick}
            />
          ))}
        </div>
        
        {/* Remaining posts in grid */}
        {regular.length > 4 && (
          <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-4 sm:mt-5 lg:mt-6">
            {regular.slice(4).map((post, index) => (
              <Post
                key={post.id}
                {...post}
                variant="default"
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTimelineLayout = () => {
    return (
      <div className="space-y-4 sm:space-y-5 lg:space-y-6 relative">
        {currentPosts.map((post, index) => (
          <div key={post.id} className="relative pl-12 sm:pl-14 lg:pl-16">
            <div className="absolute left-4 sm:left-5 lg:left-6 top-3 sm:top-4 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full border-2 sm:border-4 border-background"></div>
            <Post
              {...post}
              variant="default"
              onPostClick={onPostClick}
              onAuthorClick={onAuthorClick}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderMosaicLayout = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-2 sm:gap-3 lg:gap-4">
        {currentPosts.map((post, index) => {
          // Create varied sizes for mosaic effect - responsive patterns
          const sizes = [
            'col-span-1 row-span-1',
            'col-span-2 row-span-1 sm:col-span-1 sm:row-span-1',
            'col-span-1 row-span-2',
            'col-span-2 row-span-2 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-2'
          ];
          const sizeClass = sizes[index % sizes.length];
          
          return (
            <div key={post.id} className={cn('break-inside-avoid', sizeClass)}>
              <Post
                {...post}
                variant="compact"
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderSubstackLayout = () => {
    if (currentPosts.length === 0) return null;
    
    const [featured, ...regular] = currentPosts;
    
    return (
      <div className="max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto space-y-6 sm:space-y-7 lg:space-y-8">
        {/* Featured post */}
        <div className="border-b border-border pb-6 sm:pb-7 lg:pb-8">
          <Post
            {...featured}
            variant="featured"
            featured={true}
            onPostClick={onPostClick}
            onAuthorClick={onAuthorClick}
          />
        </div>
        
        {/* Regular posts in clean list */}
        <div className="space-y-4 sm:space-y-5 lg:space-y-6">
          {regular.map((post) => (
            <div key={post.id} className="border-b border-border pb-4 sm:pb-5 lg:pb-6 last:border-b-0">
              <Post
                {...post}
                variant="minimal"
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEditorialLayout = () => {
    if (currentPosts.length === 0) return null;
    
    const [hero, ...rest] = currentPosts;
    const featured = rest.slice(0, 3);
    const sidebar = rest.slice(3, 8);
    const remaining = rest.slice(8);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Hero section */}
        <div className="lg:col-span-8 xl:col-span-7 2xl:col-span-8">
          <Post
            {...hero}
            variant="featured"
            featured={true}
            onPostClick={onPostClick}
            onAuthorClick={onAuthorClick}
          />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-5 2xl:col-span-4 space-y-4 sm:space-y-5 lg:space-y-6">
          <div className="border-l-2 sm:border-l-4 border-primary pl-3 sm:pl-4">
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Featured</h3>
            <div className="space-y-3 sm:space-y-4">
              {featured.map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="compact"
                  onPostClick={onPostClick}
                  onAuthorClick={onAuthorClick}
                />
              ))}
            </div>
          </div>
          
          {sidebar.length > 0 && (
            <div className="border-l-2 sm:border-l-4 border-muted pl-3 sm:pl-4">
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">More Stories</h3>
              <div className="space-y-2 sm:space-y-3">
                {sidebar.map((post) => (
                  <Post
                    key={post.id}
                    {...post}
                    variant="minimal"
                    onPostClick={onPostClick}
                    onAuthorClick={onAuthorClick}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Remaining posts in grid */}
        {remaining.length > 0 && (
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 mt-6 sm:mt-7 lg:mt-8 pt-6 sm:pt-7 lg:pt-8 border-t border-border">
            {remaining.map((post) => (
              <Post
                key={post.id}
                {...post}
                variant="default"
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSportsLayout = () => {
    if (currentPosts.length === 0) return null;
    
    const [hero, ...rest] = currentPosts;
    const topStories = rest.slice(0, 4);
    const headlines = rest.slice(4, 10);
    const remaining = rest.slice(10);
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6">
        {/* Hero section */}
        <div className="lg:col-span-8 xl:col-span-7 2xl:col-span-8">
          <Post
            {...hero}
            variant="featured"
            featured={true}
            onPostClick={onPostClick}
            onAuthorClick={onAuthorClick}
          />
        </div>
        
        {/* Top stories sidebar */}
        <div className="lg:col-span-4 xl:col-span-5 2xl:col-span-4">
          <div className="bg-muted/30 rounded-lg p-4 sm:p-5 lg:p-6">
            <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
              Top Stories
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {topStories.map((post) => (
                <Post
                  key={post.id}
                  {...post}
                  variant="compact"
                  onPostClick={onPostClick}
                  onAuthorClick={onAuthorClick}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Headlines section */}
        {headlines.length > 0 && (
          <div className="lg:col-span-12">
            <div className="border-t border-border pt-4 sm:pt-5 lg:pt-6">
              <h3 className="font-bold text-lg sm:text-xl mb-4 sm:mb-5 lg:mb-6">Headlines</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {headlines.map((post) => (
                  <Post
                    key={post.id}
                    {...post}
                    variant="compact"
                    onPostClick={onPostClick}
                    onAuthorClick={onAuthorClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Remaining posts */}
        {remaining.length > 0 && (
          <div className="lg:col-span-12">
            <div className="border-t border-border pt-4 sm:pt-5 lg:pt-6 mt-4 sm:mt-5 lg:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {remaining.map((post) => (
                  <Post
                    key={post.id}
                    {...post}
                    variant="compact"
                    onPostClick={onPostClick}
                    onAuthorClick={onAuthorClick}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderBlogLayout = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
        {currentPosts.map((post) => (
          <div key={post.id} className="group">
            <Card className="h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <Post
                {...post}
                variant="default"
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            </Card>
          </div>
        ))}
      </div>
    );
  };

  const renderFlipboardLayout = () => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-1 sm:gap-2 lg:gap-3">
        {currentPosts.map((post, index) => {
          // Create varied sizes for magazine-style layout - responsive patterns
          const sizes = [
            'col-span-2 row-span-2 sm:col-span-2 sm:row-span-2', // Large featured
            'col-span-1 row-span-1', // Small
            'col-span-1 row-span-2 sm:col-span-1 sm:row-span-2', // Tall
            'col-span-2 row-span-1 md:col-span-2 md:row-span-1', // Wide
            'col-span-1 row-span-1', // Small
            'col-span-1 row-span-1', // Small
          ];
          const sizeClass = sizes[index % sizes.length];
          
          return (
            <div 
              key={post.id} 
              className={cn(
                'relative overflow-hidden rounded-md sm:rounded-lg group cursor-pointer transition-all duration-300 hover:scale-105 hover:z-10',
                sizeClass,
                // Responsive heights using CSS classes
                sizeClass.includes('row-span-2') 
                  ? 'min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]'
                  : 'min-h-[100px] sm:min-h-[125px] lg:min-h-[150px]'
              )}
            >
              {/* Background image */}
              {post.media?.[0] && (
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${post.media[0].url})`
                  }}
                />
              )}
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 p-2 sm:p-3 lg:p-4 flex flex-col justify-end text-white">
                {/* Platform badge */}
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.platform}
                  </Badge>
                </div>
                
                {/* Author info */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <img 
                    src={post.author.avatar} 
                    alt={post.author.name}
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 rounded-full border border-white/20"
                  />
                  <span className="text-xs sm:text-sm font-medium truncate">{post.author.name}</span>
                  {post.author.verified && (
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                
                {/* Title/Content */}
                <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 sm:line-clamp-3">
                  {post.title || post.content}
                </h3>
                
                {/* Metrics */}
                {post.metrics && (
                  <div className="flex items-center gap-2 sm:gap-3 mt-1 sm:mt-2 text-xs text-white/80">
                    {post.metrics.likes && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">{post.metrics.likes}</span>
                      </span>
                    )}
                    {post.metrics.views && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">{post.metrics.views}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Calculate content complexity for adaptive sizing
  const getContentComplexity = (post: PostProps) => {
    let complexity = 1; // Base complexity
    
    // Content length factor
    const contentLength = (post.content?.length || 0) + (post.title?.length || 0);
    if (contentLength > 200) complexity += 0.5;
    if (contentLength > 400) complexity += 0.5;
    
    // Media factor
    if (post.media && post.media.length > 0) {
      complexity += 0.3;
      if (post.media.length > 1) complexity += 0.2;
    }
    
    // Engagement factor
    const totalEngagement = (post.metrics?.likes || 0) + (post.metrics?.comments || 0) + (post.metrics?.shares || 0);
    if (totalEngagement > 100) complexity += 0.2;
    if (totalEngagement > 500) complexity += 0.3;
    
    // Featured content
    if (post.featured) complexity += 0.4;
    
    // Type-specific adjustments
    if (post.type === 'video') complexity += 0.3;
    if (post.type === 'blog') complexity += 0.2;
    if (post.type === 'live_event') complexity += 0.2;
    
    return Math.min(complexity, 2.5); // Cap at 2.5x
  };

  const renderPosts = () => {
    if (currentLayout === 'magazine') {
      return renderMagazineLayout();
    }

        if (currentLayout === 'grid') {
      const gridStyle = columnCount ? {
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`
      } : {};
      
      return (
        <div className={getLayoutClasses()} style={gridStyle}>
          {currentPosts.map((post, index) => {
            const isLast = index === currentPosts.length - 1;
            const complexity = getContentComplexity(post);
            
            // Calculate grid column span based on content complexity and available space
            const getGridSpan = () => {
              // Only span multiple columns if we have enough content and space, and if columnCount allows it
              if (!columnCount || columnCount < 2) return 'col-span-1'; // No spanning if forced column count is too small
              if (complexity >= 2.0 && index % 3 === 0) return 'col-span-2'; // Large content, strategic placement
              if (complexity >= 1.8 && post.featured) return 'col-span-2'; // Featured content
              return 'col-span-1'; // Standard content
            };
            
            return (
              <div
                key={post.id}
                ref={isLast && enableInfiniteScroll ? lastPostRef : null}
                className={cn(
                  'adaptive-grid-item',
                  !columnCount && getGridSpan() // Only apply span classes when not using fixed columns
                )}
                style={{
                  '--content-complexity': complexity,
                  gridRowEnd: complexity >= 2.0 && getGridSpan().includes('col-span-2') ? 'span 2' : 'auto'
                } as React.CSSProperties}
              >
                <Post
                  {...post}
                  variant={getPostVariant()}
                  onPostClick={onPostClick}
                  onAuthorClick={onAuthorClick}
                />
              </div>
            );
          })}
        </div>
      );
    }

    // Apply column count for grid-based layouts  
    const getGridStyleForLayout = (): React.CSSProperties => {
      if (!columnCount) return {};
      
      const layout = currentLayout as FeedLayout;
      
      if (layout === 'cards' || layout === 'compact') {
        return { gridTemplateColumns: `repeat(${columnCount}, 1fr)` };
      }
      if (layout === 'masonry') {
        return { columnCount: columnCount };
      }
      if (layout === 'magazine') {
        return { gridTemplateColumns: `repeat(${columnCount}, 1fr)` };
      }
      return {};
    };

    return (
      <div className={getLayoutClasses()} style={getGridStyleForLayout()}>
        {currentPosts.map((post, index) => {
          const isLast = index === currentPosts.length - 1;
          
          return (
            <div
              key={post.id}
              ref={isLast && enableInfiniteScroll ? lastPostRef : null}
              className={cn(
                currentLayout === 'masonry' && 'break-inside-avoid mb-6'
              )}
            >
              <Post
                {...post}
                variant={getPostVariant()}
                onPostClick={onPostClick}
                onAuthorClick={onAuthorClick}
              />
            </div>
          );
        })}
      </div>
    );
  };

  const renderPagination = () => {
    if (paginationType === 'infinite' || paginationType === 'loadmore') {
      return null;
    }

    if (paginationType === 'numbered') {
      return (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return null;
  };

  const renderLoadingSkeletons = () => {
    const skeletonCount = currentLayout === 'list' ? 3 : 6;
    
    return (
      <div className={getLayoutClasses()}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-32 w-full rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with source tabs - Following Priority+ Pattern */}
      {showSourceTabs && (
        <div className="space-y-4">
          <Tabs value={currentSource} onValueChange={handleSourceChange}>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Primary navigation - Most important sources first */}
              <div className="flex-1">
                <TabsList className="grid w-full max-w-lg grid-cols-2 md:grid-cols-4 h-12">
                  {sources.slice(0, 4).map((src) => (
                    <TabsTrigger 
                      key={src.key} 
                      value={src.key} 
                      className="flex flex-col gap-1 text-xs h-full"
                    >
                      <span className="font-medium">{src.label}</span>
                      {src.count !== undefined && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {src.count}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Secondary controls - Following Fitts's Law with larger targets */}
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="min-w-[44px] h-10"
                  aria-label="Refresh feed"
                >
                  <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                  <span className="hidden sm:inline ml-2">Refresh</span>
                </Button>
                
                {showLayoutSwitcher && (
                  <Select value={currentLayout} onValueChange={handleLayoutChange}>
                    <SelectTrigger className="w-36 h-10">
                      <div className="flex items-center gap-2">
                        {React.createElement(layoutIcons[currentLayout], { className: "h-4 w-4" })}
                        <SelectValue />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <div className="p-2">
                        <div className="text-xs font-medium text-muted-foreground mb-2">Layout Options</div>
                        {Object.entries(layoutIcons).map(([layoutKey, Icon]) => (
                          <SelectItem key={layoutKey} value={layoutKey} className="cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Icon className="h-4 w-4" />
                              <span>{layoutKey.charAt(0).toUpperCase() + layoutKey.slice(1)}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </div>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </Tabs>
        </div>
      )}

      {/* Smart Filters and Search - Progressive Disclosure */}
      {(showFilters || showSearch) && (
        <Card className="border-0 shadow-sm bg-muted/30">
          <CardContent className="pt-6">
            <div className="space-y-6">
              {showSearch && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Search Content
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, authors, or content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-11 bg-background"
                      aria-label="Search posts"
                    />
                  </div>
                </div>
              )}
              
              {showFilters && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      Filter & Sort
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Content Type
                      </label>
                      <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="h-11 bg-background">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          {uniqueTypes.map(type => (
                            <SelectItem key={type} value={type}>
                              {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Platform
                      </label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger className="h-11 bg-background">
                          <SelectValue placeholder="All Platforms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Platforms</SelectItem>
                          {uniquePlatforms.map(platform => (
                            <SelectItem key={platform} value={platform}>
                              {platform.charAt(0).toUpperCase() + platform.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Sort Order
                      </label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="h-11 bg-background">
                          <SortAsc className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Recent" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="timestamp">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>Most Recent</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="likes">
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4" />
                              <span>Most Liked</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="views">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              <span>Most Viewed</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="engagement">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-4 w-4" />
                              <span>Most Engaged</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results info - Better Information Architecture */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 px-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-medium">
              {currentPosts.length} of {filteredPosts.length} posts
            </span>
          </div>
          
          {(searchQuery || selectedType !== 'all' || selectedPlatform !== 'all') && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                Filtered
              </Badge>
              {searchQuery && (
                <Badge variant="secondary" className="text-xs">
                  "{searchQuery}"
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span>Layout:</span>
            <span className="font-medium text-foreground">
              {currentLayout.charAt(0).toUpperCase() + currentLayout.slice(1)}
            </span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            <span>Sort:</span>
            <span className="font-medium text-foreground">
              {sortBy === 'timestamp' ? 'Recent' : 
               sortBy === 'likes' ? 'Liked' :
               sortBy === 'views' ? 'Viewed' : 'Engaged'}
            </span>
          </span>
        </div>
      </div>

      {/* Posts - Enhanced States */}
      {isRefreshing ? (
        renderLoadingSkeletons()
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {searchQuery || selectedType !== 'all' || selectedPlatform !== 'all' 
                  ? 'No matching posts found' 
                  : 'No posts available'
                }
              </h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedType !== 'all' || selectedPlatform !== 'all' 
                  ? 'Try adjusting your search terms or filters to find more content.' 
                  : 'Check back later for new posts and updates.'
                }
              </p>
            </div>
            {(searchQuery || selectedType !== 'all' || selectedPlatform !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedPlatform('all');
                }}
                className="mt-4"
              >
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        renderPosts()
      )}

      {/* Loading more indicator for infinite scroll */}
      {enableInfiniteScroll && loadingMore && (
        <div className="text-center py-6">
          <div className="flex items-center justify-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading more posts...</span>
          </div>
        </div>
      )}

      {/* Load more button */}
      {paginationType === 'loadmore' && hasMore && !enableInfiniteScroll && (
        <div className="text-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
          >
            {loadingMore ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      )}

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
} 