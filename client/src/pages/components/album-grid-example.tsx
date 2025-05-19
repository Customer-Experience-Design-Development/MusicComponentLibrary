import { useState } from 'react';
import { AlbumGrid } from '@musicui/react';
import { Album } from '@/types/music';

export default function AlbumGridExample() {
  const [albums, setAlbums] = useState<Album[]>([
    {
      id: 1,
      title: "Midnight Dreams",
      artist: "Luna Echo",
      releaseYear: 2023,
      albumArt: "https://example.com/album1.jpg",
      tracks: [
        {
          id: 1,
          title: "Midnight Dreams",
          artist: "Luna Echo",
          duration: 180,
          audioSources: [{
            url: "https://example.com/sample1.mp3",
            format: "mp3",
            quality: "high"
          }]
        }
      ]
    }
  ]);
  
  return (
    <AlbumGrid
      albums={albums}
      onPlay={(album: Album) => console.log('Play album:', album.title)}
      onSelect={(album: Album) => console.log('Select album:', album.title)}
      onLike={(album: Album) => console.log('Like album:', album.title)}
    />
  );
} 