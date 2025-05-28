import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Post, type PostProps } from './Post';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, SortAsc } from 'lucide-react';

export interface PostFeedProps {
  posts: PostProps[];
  variant?: 'default' | 'compact' | 'minimal';
  showFilters?: boolean;
  showSearch?: boolean;
  className?: string;
  onPostClick?: (post: PostProps) => void;
  onAuthorClick?: (author: PostProps['author']) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

export function PostFeed({
  posts,
  variant = 'default',
  showFilters = true,
  showSearch = true,
  className,
  onPostClick,
  onAuthorClick,
  onLoadMore,
  hasMore = false,
  loading = false
}: PostFeedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('timestamp');

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
        default:
          return 0;
      }
    });

  const uniqueTypes = Array.from(new Set(posts.map(post => post.type)));
  const uniquePlatforms = Array.from(new Set(posts.map(post => post.platform)));

  return (
    <div className={cn("space-y-6", className)}>
      {/* Filters and Search */}
      {(showFilters || showSearch) && (
        <div className="space-y-4">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts, authors, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
          
          {showFilters && (
            <div className="flex flex-wrap gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Type" />
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

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Platform" />
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

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="timestamp">Recent</SelectItem>
                  <SelectItem value="likes">Most Liked</SelectItem>
                  <SelectItem value="engagement">Most Engaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Active filters display */}
          {(selectedType !== 'all' || selectedPlatform !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: "{searchQuery}"
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedType !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Type: {selectedType.replace('_', ' ')}
                  <button
                    onClick={() => setSelectedType('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedPlatform !== 'all' && (
                <Badge variant="secondary" className="gap-1">
                  Platform: {selectedPlatform}
                  <button
                    onClick={() => setSelectedPlatform('all')}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {searchQuery || selectedType !== 'all' || selectedPlatform !== 'all' 
                ? 'No posts match your filters' 
                : 'No posts to display'
              }
            </div>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <Post
              key={post.id}
              {...post}
              variant={variant}
              onPostClick={onPostClick}
              onAuthorClick={onAuthorClick}
            />
          ))
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="text-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            variant="outline"
            size="lg"
          >
            {loading ? 'Loading...' : 'Load More Posts'}
          </Button>
        </div>
      )}
    </div>
  );
} 