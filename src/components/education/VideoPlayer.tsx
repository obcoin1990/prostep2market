'use client';

import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  title: string;
  duration?: string;
}

export function VideoPlayer({ videoUrl, title, duration }: VideoPlayerProps) {
  // If no video URL, show placeholder
  if (!videoUrl) {
    return (
      <div className="relative aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted-foreground/10 mb-4">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">{title}</h3>
          {duration && <p className="text-sm text-muted-foreground">Duration: {duration}</p>}
          <p className="text-sm text-muted-foreground mt-2">
            Video content will be available soon
          </p>
        </div>
      </div>
    );
  }

  // Check if it's a YouTube/Vimeo URL
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  if (isYouTube) {
    // Extract video ID
    let videoId = '';
    if (videoUrl.includes('youtu.be/')) {
      videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (videoUrl.includes('youtube.com/watch')) {
      const urlParams = new URL(videoUrl).searchParams;
      videoId = urlParams.get('v') || '';
    }

    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (isVimeo) {
    // Extract video ID
    const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';

    return (
      <div className="aspect-video rounded-lg overflow-hidden bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title={title}
          className="w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Standard HTML5 video
  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}