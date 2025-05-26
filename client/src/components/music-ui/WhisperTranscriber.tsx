import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mic, FileAudio, Upload, Save, ArrowRight, Check, X } from 'lucide-react';
import { Transcription, TranscriptionSegment } from './types';
import { createFormattedLyrics, findLowConfidenceSegments, formatTimestamp } from './utilities/transcriptionUtils';

interface WhisperTranscriberProps {
  onTranscriptionComplete?: (transcription: Transcription, formattedLyrics: string) => void;
  className?: string;
  externalAudioRef?: React.RefObject<HTMLAudioElement>;
}

export function WhisperTranscriber({
  onTranscriptionComplete,
  className = '',
  externalAudioRef
}: WhisperTranscriberProps) {
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'recording' | 'processing' | 'complete'>('idle');
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);
  const [transcription, setTranscription] = useState<Transcription | null>(null);
  const [formattedLyrics, setFormattedLyrics] = useState('');
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  
  // Use external audio ref if provided, otherwise use internal one
  const audioRef = externalAudioRef || internalAudioRef;

  // Mocked transcription process for demo purposes
  const processAudio = async (audioBlob: Blob) => {
    // In a real implementation, you would:
    // 1. Send the audio to a server with Whisper API
    // 2. Receive the transcription back
    // Here we'll simulate the process with a mock result
    
    setProgress(0);
    
    // Simulate processing time
    const mockProgress = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(mockProgress);
          return 95;
        }
        return prev + 5;
      });
    }, 300);
    
    // Mock transcription result after a delay
    return new Promise<Transcription>(resolve => {
      setTimeout(() => {
        clearInterval(mockProgress);
        setProgress(100);
        
        const mockTranscription: Transcription = {
          language: "English",
          confidence: 0.94,
          segments: [
            {
              start: 0.0,
              end: 6.2,
              text: "In the vast expanse of space",
              confidence: 0.92
            },
            {
              start: 6.8,
              end: 12.5,
              text: "Where stars dance in endless grace",
              confidence: 0.95
            },
            {
              start: 13.6,
              end: 19.2,
              text: "We find our cosmic harmony",
              confidence: 0.91
            },
            {
              start: 20.1,
              end: 26.7,
              text: "A symphony of eternity",
              confidence: 0.89
            },
            {
              start: 28.3,
              end: 34.2,
              text: "Through the void of time and space",
              confidence: 0.96
            },
            {
              start: 35.0,
              end: 41.5,
              text: "We journey at our own pace",
              confidence: 0.93
            },
            {
              start: 42.8,
              end: 48.6,
              text: "Finding rhythm in the stars",
              confidence: 0.88
            },
            {
              start: 49.2,
              end: 56.1,
              text: "As they guide us from afar",
              confidence: 0.94
            },
            {
              start: 58.4,
              end: 64.7,
              text: "Cosmic harmony eternal melody",
              confidence: 0.97
            },
            {
              start: 65.3,
              end: 71.8,
              text: "Dancing through infinity",
              confidence: 0.96
            },
            {
              start: 72.5,
              end: 79.0,
              text: "In perfect synchrony",
              confidence: 0.98
            },
            {
              start: 80.1,
              end: 88.3,
              text: "With the universe's symphony",
              confidence: 0.92
            }
          ]
        };
        
        resolve(mockTranscription);
      }, 3000);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
        
        setRecordingStatus('processing');
        try {
          const result = await processAudio(audioBlob);
          setTranscription(result);
          const formattedText = createFormattedLyrics(result.segments);
          setFormattedLyrics(formattedText);
          
          if (onTranscriptionComplete) {
            onTranscriptionComplete(result, formattedText);
          }
          
          setRecordingStatus('complete');
        } catch (error) {
          console.error('Transcription error:', error);
          setRecordingStatus('idle');
        }
      };
      
      mediaRecorder.start();
      setRecordingStatus('recording');
    } catch (error) {
      console.error('Could not start recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingStatus === 'recording') {
      mediaRecorderRef.current.stop();
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check if it's an audio file
    if (!file.type.startsWith('audio/')) {
      alert('Please upload an audio file');
      return;
    }
    
    setUploadStatus('uploading');
    
    // Create a URL for the audio file
    const audioUrl = URL.createObjectURL(file);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
    }
    
    // Process the file
    setUploadStatus('processing');
    processAudio(file)
      .then(result => {
        setTranscription(result);
        const formattedText = createFormattedLyrics(result.segments);
        setFormattedLyrics(formattedText);
        
        if (onTranscriptionComplete) {
          onTranscriptionComplete(result, formattedText);
        }
        
        setUploadStatus('complete');
      })
      .catch(error => {
        console.error('Transcription error:', error);
        setUploadStatus('idle');
      });
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getLowConfidenceSegments = () => {
    if (!transcription) return [];
    return findLowConfidenceSegments(transcription.segments, 0.9);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Transcribe Audio to Lyrics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="record" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as 'record' | 'upload')}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="record">Record Audio</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="record">
            <div className="space-y-4">
              <div className="flex gap-2">
                {recordingStatus === 'idle' ? (
                  <Button 
                    onClick={startRecording}
                    className="gap-2"
                  >
                    <Mic className="h-4 w-4" />
                    Start Recording
                  </Button>
                ) : recordingStatus === 'recording' ? (
                  <Button 
                    onClick={stopRecording}
                    variant="destructive"
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Stop Recording
                  </Button>
                ) : null}
              </div>
              
              {recordingStatus === 'recording' && (
                <div className="flex items-center gap-2">
                  <span className="animate-pulse text-red-500">●</span>
                  <span>Recording...</span>
                </div>
              )}
              
              {recordingStatus === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
              
              {(recordingStatus === 'complete' || uploadStatus === 'complete') && audioRef.current && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Audio Preview</h3>
                  <audio 
                    ref={audioRef} 
                    controls 
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                <Button 
                  onClick={triggerFileUpload}
                  disabled={uploadStatus === 'uploading' || uploadStatus === 'processing'}
                  className="gap-2"
                >
                  <FileAudio className="h-4 w-4" />
                  Choose Audio File
                </Button>
              </div>
              
              {uploadStatus === 'uploading' && (
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 animate-pulse" />
                  <span>Uploading...</span>
                </div>
              )}
              
              {uploadStatus === 'processing' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {transcription && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Transcription Result</h3>
              {onTranscriptionComplete && (
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => {
                    if (onTranscriptionComplete && transcription) {
                      onTranscriptionComplete(transcription, formattedLyrics);
                    }
                  }}
                >
                  <Save className="h-4 w-4" />
                  Save as Lyrics
                </Button>
              )}
            </div>
            
            <Tabs defaultValue="timestamped">
              <TabsList>
                <TabsTrigger value="timestamped">Timestamped</TabsTrigger>
                <TabsTrigger value="formatted">Formatted</TabsTrigger>
                <TabsTrigger value="review">Review</TabsTrigger>
              </TabsList>
              
              <TabsContent value="timestamped" className="space-y-4 mt-4">
                <div className="border rounded-md overflow-hidden">
                  {transcription.segments.map((segment, index) => (
                    <div 
                      key={index} 
                      className="flex p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b last:border-b-0"
                    >
                      <div className="w-20 text-sm font-mono">
                        {formatTimestamp(segment.start)}
                      </div>
                      <div className="flex-1">
                        {segment.text}
                      </div>
                      <div className="w-16 text-sm text-right">
                        {Math.round(segment.confidence * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="formatted" className="space-y-4 mt-4">
                <div className="border rounded-md p-4 whitespace-pre-line">
                  {formattedLyrics}
                </div>
              </TabsContent>
              
              <TabsContent value="review" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Low Confidence Segments</h4>
                  <p className="text-sm text-neutral-500">
                    These segments may need manual review due to lower confidence.
                  </p>
                  
                  {getLowConfidenceSegments().length === 0 ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-md">
                      <Check className="h-4 w-4" />
                      <span>No low confidence segments detected!</span>
                    </div>
                  ) : (
                    <div className="border rounded-md overflow-hidden">
                      {getLowConfidenceSegments().map(index => {
                        const segment = transcription.segments[index];
                        return (
                          <div 
                            key={index} 
                            className="flex p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b last:border-b-0"
                          >
                            <div className="w-20 text-sm font-mono">
                              {formatTimestamp(segment.start)}
                            </div>
                            <div className="flex-1">
                              {segment.text}
                            </div>
                            <div className="w-16 text-sm text-right text-amber-600">
                              {Math.round(segment.confidence * 100)}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 