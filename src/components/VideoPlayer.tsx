import React, { useState } from 'react';
import { Play, Video, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  videoType?: 'youtube' | 'mp4' | 'none';
  thumbnailUrl?: string;
  appTitle: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoType = 'none',
  thumbnailUrl,
  appTitle,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoUrl || videoType === 'none') {
    return null;
  }

  // Parse YouTube video ID if youtube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const isYouTube = videoType === 'youtube' || videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const youtubeId = isYouTube ? getYouTubeId(videoUrl) : null;

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white">Video Trailer & Gameplay Preview</h3>
        </div>
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
        >
          <span>Watch Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
        {!isPlaying ? (
          <div
            onClick={() => setIsPlaying(true)}
            className="group relative w-full h-full cursor-pointer flex items-center justify-center"
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={`${appTitle} Video Preview`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center" />
            )}

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-2xl shadow-purple-600/50 group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 fill-current ml-1" />
              </div>
            </div>
            <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[11px] font-medium text-slate-200">
              Click to Play Trailer
            </div>
          </div>
        ) : isYouTube && youtubeId ? (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={`${appTitle} video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        ) : (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full h-full object-cover"
          >
            Your browser does not support HTML5 video.
          </video>
        )}
      </div>
    </div>
  );
};
