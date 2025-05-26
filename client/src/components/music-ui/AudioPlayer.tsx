import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { TimelineComment, TimelineReaction } from './types';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VolumeControl } from './VolumeControl';
import { Waveform } from './Waveform';
import { Equalizer } from './Equalizer';
import { TimelineComments } from './TimelineComments';
import { Heart, Share2, SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, Settings, MessageSquare } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AudioPlayerProps {
  track: Track;
  onNext?: () => void;
  onPrevious?: () => void;
  onTogglePlay?: (isPlaying: boolean) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  showWaveform?: boolean;
  showComments?: boolean;
  initialComments?: TimelineComment[];
  currentUser?: {
    id: string;
    name: string;
    avatar?: string;
  };
  className?: string;
}

export function AudioPlayer({
  track,
  onNext,
  onPrevious,
  onTogglePlay,
  onEnded,
  autoPlay = false,
  showWaveform = true,
  showComments = false,
  initialComments = [],
  currentUser = { id: 'user-1', name: 'Guest User' },
  className = ''
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(track.duration || 0);
  const [volume, setVolume] = useState(70);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [selectedSource, setSelectedSource] = useState<AudioSource | null>(null);
  const [showCommentsPanel, setShowCommentsPanel] = useState(showComments);
  const [comments, setComments] = useState<TimelineComment[]>(initialComments);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const animationRef = useRef<number>();

  // Initialize audio source
  useEffect(() => {
    if (track.audioSources && track.audioSources.length > 0) {
      // Select the highest quality source by default
      const sortedSources = [...track.audioSources].sort((a, b) => {
        const qualityOrder = { lossless: 4, high: 3, medium: 2, low: 1 };
        return (qualityOrder[b.quality || 'medium'] || 0) - (qualityOrder[a.quality || 'medium'] || 0);
      });
      setSelectedSource(sortedSources[0]);
    } else if (track.audioSrc) {
      // Legacy support
      setSelectedSource({
        url: track.audioSrc,
        format: 'mp3',
        quality: 'medium'
      });
    }
  }, [track]);

  // Reset player when track or source changes
  useEffect(() => {
    if (!selectedSource) return;

    setCurrentTime(0);
    setDuration(track.duration || 0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = selectedSource.url;
      
      if (autoPlay) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing audio:", err));
      } else {
        setIsPlaying(false);
      }
    }
  }, [track, selectedSource, autoPlay]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch(err => console.error("Error playing audio:", err));
    }
    
    setIsPlaying(!isPlaying);
    onTogglePlay && onTogglePlay(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };

  const handleWaveformClick = (position: number) => {
    if (!audioRef.current) return;
    const newTime = position * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = newVolume / 100;
    setVolume(newVolume);
  };

  const handleEnded = () => {
    if (isRepeating && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .catch(err => console.error("Error playing audio:", err));
    } else {
      setIsPlaying(false);
      onEnded && onEnded();
    }
  };

  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const handleSeekAudio = (timeInSeconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = timeInSeconds;
    setCurrentTime(timeInSeconds);
  };

  const handleAddComment = (comment: Omit<TimelineComment, 'id' | 'createdAt'>) => {
    const newComment: TimelineComment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleAddReaction = (commentId: string, reaction: Omit<TimelineReaction, 'id' | 'count' | 'users'>) => {
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === commentId) {
          // Check if this reaction type already exists
          const existingReactionIndex = comment.reactions?.findIndex(r => r.emoji === reaction.emoji);
          
          if (existingReactionIndex !== undefined && existingReactionIndex >= 0 && comment.reactions) {
            // Update existing reaction
            const updatedReactions = [...comment.reactions];
            const existingReaction = updatedReactions[existingReactionIndex];
            
            // Don't add duplicate user reactions
            if (!existingReaction.users.includes(currentUser.id)) {
              updatedReactions[existingReactionIndex] = {
                ...existingReaction,
                count: existingReaction.count + 1,
                users: [...existingReaction.users, currentUser.id]
              };
            }
            
            return { ...comment, reactions: updatedReactions };
          } else {
            // Add new reaction type
            return {
              ...comment,
              reactions: [
                ...(comment.reactions || []),
                {
                  id: uuidv4(),
                  emoji: reaction.emoji,
                  count: 1,
                  users: [currentUser.id]
                }
              ]
            };
          }
        } else if (comment.replies) {
          // Check in replies
          const updatedReplies = comment.replies.map(reply => {
            if (reply.id === commentId) {
              const existingReactionIndex = reply.reactions?.findIndex(r => r.emoji === reaction.emoji);
              
              if (existingReactionIndex !== undefined && existingReactionIndex >= 0 && reply.reactions) {
                const updatedReactions = [...reply.reactions];
                const existingReaction = updatedReactions[existingReactionIndex];
                
                if (!existingReaction.users.includes(currentUser.id)) {
                  updatedReactions[existingReactionIndex] = {
                    ...existingReaction,
                    count: existingReaction.count + 1,
                    users: [...existingReaction.users, currentUser.id]
                  };
                }
                
                return { ...reply, reactions: updatedReactions };
              } else {
                return {
                  ...reply,
                  reactions: [
                    ...(reply.reactions || []),
                    {
                      id: uuidv4(),
                      emoji: reaction.emoji,
                      count: 1,
                      users: [currentUser.id]
                    }
                  ]
                };
              }
            }
            return reply;
          });
          
          return { ...comment, replies: updatedReplies };
        }
        
        return comment;
      });
    });
  };

  const handleReply = (commentId: string, reply: Omit<TimelineComment, 'id' | 'createdAt'>) => {
    const newReply: TimelineComment = {
      ...reply,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setComments(prev => {
      return prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply]
          };
        }
        return comment;
      });
    });
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(prev => {
      // First check if it's a top-level comment
      const filteredComments = prev.filter(c => c.id !== commentId);
      
      // If lengths are the same, it might be a reply
      if (filteredComments.length === prev.length) {
        return prev.map(comment => {
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId)
            };
          }
          return comment;
        });
      }
      
      return filteredComments;
    });
  };

  // Create a vinyl-like rotating album cover
  const vinylStyle = isPlaying ? 'vinyl' : '';

  return (
    <div className={`${className}`}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-shrink-0 relative">
          <img 
            src={track.albumArt || `https://via.placeholder.com/64x64?text=${track.title[0]}`} 
            alt={`${track.title} album artwork`} 
            className={`w-16 h-16 rounded-md object-cover ${vinylStyle}`}
          />
          {isPlaying && (
            <div className="absolute inset-0 rounded-md border-4 border-white dark:border-neutral-800 overflow-hidden">
              <div className="absolute inset-0 rounded-full bg-black/80 w-6 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-white"></div>
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground truncate">{track.title}</h4>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">{track.artist}</p>
          {selectedSource && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {selectedSource.format.toUpperCase()} • {selectedSource.quality}
              {selectedSource.bitrate && ` • ${selectedSource.bitrate}kbps`}
            </p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {track.audioSources && track.audioSources.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {track.audioSources.map((source, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setSelectedSource(source)}
                    className={selectedSource?.url === source.url ? 'bg-primary/10' : ''}
                  >
                    {source.format.toUpperCase()} • {source.quality}
                    {source.bitrate && ` • ${source.bitrate}kbps`}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="w-10 h-10 rounded-full bg-primary text-white hover:bg-primary/90" 
            onClick={togglePlayPause}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full" onClick={onNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {showWaveform && (
        <div className="mb-3">
          <Waveform
            data={track.waveformData ? JSON.parse(track.waveformData) : undefined}
            currentTime={currentTime}
            duration={duration}
            onClick={handleWaveformClick}
          />
        </div>
      )}
      
      <div className="flex justify-between items-center text-sm text-neutral-500 dark:text-neutral-400">
        <span>{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className={`p-1 rounded ${isRepeating ? 'text-primary' : 'hover:text-primary'} transition-colors`}
            onClick={toggleRepeat}
          >
            <Repeat className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`p-1 rounded ${isShuffle ? 'text-primary' : 'hover:text-primary'} transition-colors`}
            onClick={toggleShuffle}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button
            variant={showCommentsPanel ? "secondary" : "ghost"}
            size="icon"
            className="p-1 rounded"
            onClick={() => setShowCommentsPanel(!showCommentsPanel)}
          >
            <MessageSquare className="h-4 w-4" />
            {comments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white rounded-full h-4 w-4 flex items-center justify-center text-[10px]">
                {comments.length}
              </span>
            )}
          </Button>
        </div>
        <span>{formatTime(duration)}</span>
      </div>
      
      <div className="flex items-center justify-end mt-4 space-x-4">
        <VolumeControl 
          initialVolume={volume} 
          onChange={handleVolumeChange} 
        />
      </div>
      
      {showCommentsPanel && (
        <div className="mt-8 border-t pt-4 dark:border-gray-800">
          <TimelineComments 
            duration={duration}
            currentTime={currentTime}
            comments={comments}
            onAddComment={handleAddComment}
            onAddReaction={handleAddReaction}
            onSeekAudio={handleSeekAudio}
            onReply={handleReply}
            onDelete={handleDeleteComment}
            currentUser={currentUser}
          />
        </div>
      )}
    </div>
  );
}
