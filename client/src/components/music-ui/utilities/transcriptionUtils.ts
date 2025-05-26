import { TranscriptionSegment } from '../types';

/**
 * Converts Whisper transcription segments to plain text lyrics
 * @param segments Whisper transcription segments
 * @returns Plain text lyrics
 */
export function transcriptionToLyrics(segments: TranscriptionSegment[]): string {
  return segments.map(segment => segment.text).join('\n');
}

/**
 * Identifies potential chorus sections in the lyrics based on repetition
 * @param segments Whisper transcription segments
 * @returns Indices of segments that might be part of a chorus
 */
export function identifyChorusSections(segments: TranscriptionSegment[]): number[] {
  const texts = segments.map(segment => segment.text.trim().toLowerCase());
  const potentialChorus: number[] = [];
  
  // Find repeated lines that may indicate a chorus
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      if (texts[i] === texts[j]) {
        // Check surrounding lines for additional matches (chorus usually has multiple lines)
        let matchCount = 1;
        let k = 1;
        while (
          i + k < texts.length && 
          j + k < texts.length && 
          texts[i + k] === texts[j + k]
        ) {
          matchCount++;
          k++;
        }
        
        if (matchCount >= 3) {
          // Found at least 3 consecutive matching lines - likely a chorus
          for (let l = 0; l < matchCount; l++) {
            if (!potentialChorus.includes(i + l)) potentialChorus.push(i + l);
            if (!potentialChorus.includes(j + l)) potentialChorus.push(j + l);
          }
        }
      }
    }
  }
  
  return potentialChorus.sort((a, b) => a - b);
}

/**
 * Creates a more formatted song lyric structure with chorus labels
 * @param segments Whisper transcription segments
 * @returns Formatted lyrics with chorus markers
 */
export function createFormattedLyrics(segments: TranscriptionSegment[]): string {
  const chorusIndices = identifyChorusSections(segments);
  let formattedLyrics = '';
  let inChorus = false;
  
  segments.forEach((segment, index) => {
    // Check if this is the start of a chorus section
    if (chorusIndices.includes(index) && !inChorus && (!chorusIndices.includes(index - 1))) {
      formattedLyrics += '\n[Chorus]\n';
      inChorus = true;
    } 
    // Check if this is the end of a chorus section
    else if (inChorus && !chorusIndices.includes(index)) {
      inChorus = false;
      formattedLyrics += '\n';
    }
    
    formattedLyrics += segment.text + '\n';
  });
  
  return formattedLyrics;
}

/**
 * Calculate confidence scores per section of lyrics
 * @param segments Whisper transcription segments
 * @returns Map of line indices to confidence scores
 */
export function calculateConfidenceByLine(segments: TranscriptionSegment[]): Map<number, number> {
  const confidenceMap = new Map<number, number>();
  
  segments.forEach((segment, index) => {
    confidenceMap.set(index, segment.confidence);
  });
  
  return confidenceMap;
}

/**
 * Format a timestamp in seconds to MM:SS format
 * @param timeInSeconds The time in seconds
 * @returns Formatted time string
 */
export function formatTimestamp(timeInSeconds: number): string {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Find segments with low confidence that might need review
 * @param segments Whisper transcription segments
 * @param threshold Confidence threshold (default 0.8)
 * @returns Indices of segments with confidence below threshold
 */
export function findLowConfidenceSegments(
  segments: TranscriptionSegment[], 
  threshold = 0.8
): number[] {
  return segments
    .map((segment, index) => ({ index, confidence: segment.confidence }))
    .filter(item => item.confidence < threshold)
    .map(item => item.index);
}

/**
 * Merge consecutive segments that form a complete sentence
 * @param segments Original Whisper segments
 * @returns Merged segments
 */
export function mergeSegments(segments: TranscriptionSegment[]): TranscriptionSegment[] {
  if (!segments.length) return [];
  
  const mergedSegments: TranscriptionSegment[] = [];
  let currentSegment = { ...segments[0] };
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const currentText = currentSegment.text;
    
    // Check if current segment ends with punctuation
    const endsWithPunctuation = /[.!?]$/.test(currentText.trim());
    
    if (endsWithPunctuation) {
      // Complete sentence detected, add to result and start new segment
      mergedSegments.push(currentSegment);
      currentSegment = { ...segment };
    } else {
      // Merge with current segment
      currentSegment = {
        start: currentSegment.start,
        end: segment.end,
        text: `${currentSegment.text} ${segment.text}`,
        confidence: (currentSegment.confidence + segment.confidence) / 2
      };
    }
  }
  
  // Add the last segment
  mergedSegments.push(currentSegment);
  
  return mergedSegments;
} 