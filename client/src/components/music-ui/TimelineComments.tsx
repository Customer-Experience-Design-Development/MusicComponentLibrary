import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { 
  MessageSquare, 
  Send, 
  Smile,
  MoreHorizontal,
  Lock,
  Share2, 
  Reply,
  User,
  Flag,
  Trash2
} from 'lucide-react';
import { TimelineComment, TimelineReaction } from './types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatTime } from '@/lib/utils';

interface TimelineCommentsProps {
  duration: number;
  currentTime: number;
  comments: TimelineComment[];
  onAddComment?: (comment: Omit<TimelineComment, 'id' | 'createdAt'>) => void;
  onAddReaction?: (commentId: string, reaction: Omit<TimelineReaction, 'id' | 'count' | 'users'>) => void;
  onSeekAudio?: (time: number) => void;
  onReply?: (commentId: string, reply: Omit<TimelineComment, 'id' | 'createdAt'>) => void;
  onDelete?: (commentId: string) => void;
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '🔥', '👏', '🎵', '🎸', '🎧', '✨', '💯'];
const DEFAULT_AVATAR = 'https://github.com/shadcn.png'; // Default avatar

export function TimelineComments({
  duration,
  currentTime,
  comments,
  onAddComment,
  onAddReaction,
  onSeekAudio,
  onReply,
  onDelete,
  currentUser = { id: 'user-1', name: 'Guest User' },
  className = ''
}: TimelineCommentsProps) {
  const [newComment, setNewComment] = useState('');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentMode, setCommentMode] = useState<'public' | 'private'>('public');
  const [visibleComments, setVisibleComments] = useState<TimelineComment[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Update the timeline visualization when duration/currentTime changes
  useEffect(() => {
    updateTimelineMarker();
  }, [currentTime, duration]);

  // Filter comments to show nearby ones based on current timestamp
  useEffect(() => {
    // Show comments within 10 seconds of current time, or all if viewing all comments
    const nearbyComments = comments.filter(comment => {
      const timeDiff = Math.abs(comment.timestamp - currentTime);
      return timeDiff <= 10;
    });
    
    setVisibleComments(nearbyComments);
  }, [comments, currentTime]);

  const updateTimelineMarker = () => {
    if (timelineRef.current && markerRef.current && duration > 0) {
      const position = (currentTime / duration) * 100;
      markerRef.current.style.left = `${position}%`;
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timelineRef.current && onSeekAudio) {
      const rect = timelineRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      const newTime = clickPosition * duration;
      onSeekAudio(newTime);
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !onAddComment) return;
    
    onAddComment({
      timestamp: currentTime,
      content: newComment,
      author: currentUser,
      isPrivate: commentMode === 'private',
      reactions: [],
      replies: []
    });
    
    setNewComment('');
  };

  const handleAddReaction = (commentId: string, emoji: string) => {
    if (onAddReaction) {
      onAddReaction(commentId, { emoji });
    }
  };

  const handleReply = (commentId: string) => {
    if (!replyText.trim() || !onReply) return;
    
    onReply(commentId, {
      timestamp: currentTime,
      content: replyText,
      author: currentUser,
      replyTo: commentId,
      isPrivate: false,
      reactions: [],
      replies: []
    });
    
    setReplyText('');
    setActiveCommentId(null);
  };

  const getCommentPosition = (timestamp: number) => {
    if (duration <= 0) return '0%';
    const position = (timestamp / duration) * 100;
    return `${Math.min(Math.max(position, 0), 100)}%`;
  };

  const renderComment = (comment: TimelineComment, isReply = false) => {
    const isActive = activeCommentId === comment.id;
    
    return (
      <div 
        key={comment.id}
        className={`group flex items-start gap-2 p-2 rounded-lg ${isReply ? 'pl-6 border-l border-gray-200 dark:border-gray-700 ml-8' : 'bg-white/5 hover:bg-white/10 dark:bg-gray-900/30 dark:hover:bg-gray-900/50'} transition-colors duration-200`}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar || DEFAULT_AVATAR} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            
            {comment.isPrivate && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Lock className="h-3 w-3 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>Private comment</TooltipContent>
              </Tooltip>
            )}
            
            <button 
              className="ml-auto text-xs text-blue-500 hover:underline"
              onClick={() => onSeekAudio?.(comment.timestamp)}
            >
              {formatTime(comment.timestamp)}
            </button>
          </div>
          
          <p className="text-sm mt-1">{comment.content}</p>
          
          <div className="flex flex-wrap gap-1 mt-2">
            {comment.reactions && comment.reactions.map(reaction => (
              <Button
                key={reaction.id}
                variant="outline"
                size="sm"
                className="h-6 px-2 py-0 text-xs bg-transparent"
                onClick={() => handleAddReaction(comment.id, reaction.emoji)}
              >
                {reaction.emoji} <span className="ml-1">{reaction.count}</span>
              </Button>
            ))}
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 py-0 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Smile className="h-3 w-3 mr-1" /> Add Reaction
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-fit p-2" align="start">
                <div className="flex flex-wrap gap-2 max-w-xs">
                  {COMMON_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      className="text-lg hover:bg-gray-100 dark:hover:bg-gray-800 rounded p-1"
                      onClick={() => {
                        handleAddReaction(comment.id, emoji);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 py-0 text-xs"
              onClick={() => setActiveCommentId(isActive ? null : comment.id)}
            >
              <Reply className="h-3 w-3 mr-1" /> Reply
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 py-0">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs">
                  <Share2 className="h-3 w-3 mr-2" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem className="text-xs">
                  <Flag className="h-3 w-3 mr-2" /> Report
                </DropdownMenuItem>
                {(currentUser.id === comment.author.id) && (
                  <DropdownMenuItem 
                    className="text-xs text-red-500 focus:text-red-500"
                    onClick={() => onDelete?.(comment.id)}
                  >
                    <Trash2 className="h-3 w-3 mr-2" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {isActive && (
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={currentUser.avatar || DEFAULT_AVATAR} />
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Add a reply..."
                className="h-8 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply(comment.id);
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8"
                onClick={() => handleReply(comment.id)}
                disabled={!replyText.trim()}
              >
                <Send className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Comments & Reactions</h3>
        <Tabs defaultValue="nearby" className="h-7">
          <TabsList className="h-7 p-0">
            <TabsTrigger value="nearby" className="px-2 h-7 text-xs">
              Nearby
            </TabsTrigger>
            <TabsTrigger value="all" className="px-2 h-7 text-xs">
              All Comments
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Timeline visualization */}
      <div className="relative h-8 mb-4">
        <div 
          ref={timelineRef}
          className="absolute inset-x-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer"
          onClick={handleTimelineClick}
        >
          <div 
            ref={markerRef}
            className="absolute top-1/2 -translate-y-1/2 h-3 w-3 bg-primary rounded-full -ml-1.5"
          />
          
          {/* Comment markers on timeline */}
          {comments.map(comment => (
            <Tooltip key={comment.id}>
              <TooltipTrigger asChild>
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-blue-500 rounded-full -ml-2 cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    left: getCommentPosition(comment.timestamp),
                    backgroundColor: comment.isPrivate ? 'rgba(100, 100, 100, 0.8)' : 'rgba(59, 130, 246, 0.8)'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSeekAudio?.(comment.timestamp);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs">
                  <p className="font-bold">{comment.author.name}</p>
                  <p className="max-w-xs truncate">{comment.content}</p>
                  <p className="text-gray-400">{formatTime(comment.timestamp)}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
      
      {/* Comment input */}
      <div className="flex items-center gap-2 mb-4">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.avatar || DEFAULT_AVATAR} />
          <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <Input
          ref={commentInputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment at current timestamp..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAddComment();
            }
          }}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={commentMode === 'private' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setCommentMode(commentMode === 'public' ? 'private' : 'public')}
              >
                {commentMode === 'private' ? <Lock className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {commentMode === 'private' ? 'Private comment' : 'Public comment'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button onClick={handleAddComment} disabled={!newComment.trim()}>
          <Send className="h-4 w-4 mr-2" /> Comment
        </Button>
      </div>
      
      {/* Comments list */}
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {visibleComments.length > 0 ? (
          visibleComments.map(comment => renderComment(comment))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-sm">No comments at this timestamp</p>
            <p className="text-xs mt-1">Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
} 