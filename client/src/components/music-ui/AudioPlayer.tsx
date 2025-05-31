import { useState, useRef, useEffect } from 'react';
import { Track, AudioSource } from '@/types/music';
import { TimelineComment, TimelineReaction } from './types';
import { formatTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { VolumeControl } from './VolumeControl';
import { Waveform } from './Waveform';
import { Equalizer } from './Equalizer';
import { TimelineComments } from './TimelineComments';
import { Heart, Share2, SkipBack, SkipForward, Play, Pause, Repeat, Shuffle, Settings, MessageSquare, MoreHorizontal, Music, ListMusic } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/card';
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

  const handleSeekAudio = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
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
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  return (
    <div className={`bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg border dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Now Playing
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Heart className="h-4 w-4 mr-2" />
              Add to favorites
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Share2 className="h-4 w-4 mr-2" />
              Share track
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ListMusic className="h-4 w-4 mr-2" />
              Add to playlist
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-12 gap-6">
        {/* Album Art */}
        <div className="col-span-12 md:col-span-4">
          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500 shadow-lg flex items-center justify-center">
            {track.albumArt ? (
              <img 
                src={track.albumArt} 
                alt={track.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <Music className="h-24 w-24 text-white/80" />
            )}
          </div>
        </div>

        {/* Track Info & Controls */}
        <div className="col-span-12 md:col-span-8 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {track.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              {track.artist}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>{formatTime(duration)}</span>
              {track.metadata?.bpm && <span>• {track.metadata.bpm} BPM</span>}
              {track.metadata?.key && <span>• {track.metadata.key}</span>}
            </div>
          </div>

          {/* Waveform */}
          {showWaveform && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <Waveform 
                currentTime={currentTime}
                duration={duration}
                onClick={handleSeekAudio}
              />
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                size="icon"
                className="h-12 w-12 rounded-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-0.5" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <div className="w-24 sm:w-32 lg:w-40">
                <VolumeControl 
                  initialVolume={volume} 
                  onChange={handleVolumeChange} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t dark:border-gray-700 pt-6">
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

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={track.audioSrc}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => {
          setIsPlaying(true);
          onTogglePlay?.(true);
        }}
        onPause={() => {
          setIsPlaying(false);
          onTogglePlay?.(false);
        }}
        preload="metadata"
      />
    </div>
  );
}
