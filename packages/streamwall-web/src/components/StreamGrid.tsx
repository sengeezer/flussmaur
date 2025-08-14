'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      name
      description
      gridCols
      gridRows
      views {
        id
        streamId
        position {
          x
          y
          width
          height
        }
        audioEnabled
        blurred
        visible
        stream {
          id
          url
          title
          platform
          thumbnail
          isLive
        }
      }
    }
  }
`;

interface GridPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StreamView {
  id: string;
  streamId?: string;
  position: GridPosition;
  audioEnabled: boolean;
  blurred: boolean;
  visible: boolean;
  stream?: {
    id: string;
    url: string;
    title: string;
    platform: string;
    thumbnail?: string;
    isLive: boolean;
  };
}

interface Session {
  id: string;
  name: string;
  description?: string;
  gridCols: number;
  gridRows: number;
  views: StreamView[];
}

interface StreamGridProps {
  sessionId: string;
  className?: string;
}

export default function StreamGrid({ sessionId, className = '' }: StreamGridProps) {
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { data, loading, error } = useQuery(GET_SESSION, {
    variables: { id: sessionId },
    errorPolicy: 'all'
  });

  const session: Session | undefined = data?.session;

  const getEmbedUrl = (url: string, platform: string): string => {
    try {
      const urlObj = new URL(url);
      
      switch (platform.toLowerCase()) {
        case 'youtube':
          if (urlObj.hostname.includes('youtube.com')) {
            const videoId = urlObj.searchParams.get('v');
            if (videoId) {
              return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            }
          } else if (urlObj.hostname.includes('youtu.be')) {
            const videoId = urlObj.pathname.slice(1);
            if (videoId) {
              return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            }
          }
          break;
        
        case 'twitch':
          if (urlObj.hostname.includes('twitch.tv')) {
            const channel = urlObj.pathname.slice(1);
            if (channel) {
              return `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname}&autoplay=true&muted=true`;
            }
          }
          break;
        
        case 'facebook':
          // Facebook embeds are more complex and may require additional handling
          return url;
        
        case 'hls':
          // For HLS streams, we'll need a custom player
          return url;
        
        default:
          return url;
      }
    } catch (error) {
      console.warn('Error parsing stream URL:', error);
    }
    
    return url;
  };

  const StreamCell = ({ view }: { view: StreamView }) => {
    const hasStream = view.stream;
    const embedUrl = hasStream ? getEmbedUrl(hasStream.url, hasStream.platform) : '';

    return (
      <div
        className={`
          relative border border-gray-300 bg-gray-900 overflow-hidden group cursor-pointer
          ${selectedView === view.id ? 'ring-2 ring-blue-500' : ''}
          ${view.blurred ? 'filter blur-sm' : ''}
          ${!view.visible ? 'opacity-50' : ''}
        `}
        style={{
          gridColumn: `${view.position.x + 1} / span ${view.position.width}`,
          gridRow: `${view.position.y + 1} / span ${view.position.height}`,
        }}
        onClick={() => setSelectedView(selectedView === view.id ? null : view.id)}
      >
        {hasStream ? (
          <>
            {/* Stream Content */}
            {hasStream.platform === 'hls' ? (
              <video
                src={hasStream.url}
                className="w-full h-full object-cover"
                autoPlay
                muted={!view.audioEnabled}
                loop
                controls={false}
              />
            ) : (
              <iframe
                src={embedUrl}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={hasStream.title}
              />
            )}
            
            {/* Overlay with stream info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="text-white text-sm font-medium truncate">
                {hasStream.title}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  hasStream.platform === 'youtube' ? 'bg-red-600' :
                  hasStream.platform === 'twitch' ? 'bg-purple-600' :
                  hasStream.platform === 'facebook' ? 'bg-blue-600' :
                  'bg-gray-600'
                }`}>
                  {hasStream.platform.toUpperCase()}
                </span>
                {hasStream.isLive && (
                  <span className="text-xs bg-red-600 px-2 py-0.5 rounded">LIVE</span>
                )}
                {view.audioEnabled && (
                  <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.536 13.2a1 1 0 01-.534-.854V7.654a1 1 0 01.534-.854L8.383 3.076zM12 5a1 1 0 011.555-.832 10.005 10.005 0 013.445 8.832A1 1 0 0115.444 14a8.005 8.005 0 00-2.444-7 1 1 0 01-.556-1zm2.444 3a1 1 0 011.111.832A6.005 6.005 0 0117 12a1 1 0 01-2 0 4.005 4.005 0 00-1.111-2.832A1 1 0 0114.444 8z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty cell */
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="mt-2 block text-sm font-medium">Empty</span>
            </div>
          </div>
        )}
        
        {/* Cell position indicator */}
        <div className="absolute top-1 left-1 text-xs text-white bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          {view.position.x},{view.position.y}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-2 text-gray-500">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="text-center">
          <p className="text-red-600">Error loading session</p>
          <p className="text-sm text-gray-500 mt-1">{error?.message || 'Session not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Session Header */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{session.name}</h2>
        {session.description && (
          <p className="text-sm text-gray-600 mt-1">{session.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          {session.gridCols} × {session.gridRows} grid • {session.views.length} views
        </p>
      </div>

      {/* Stream Grid */}
      <div
        ref={gridRef}
        className="grid gap-1 bg-gray-200 p-1 rounded-lg"
        style={{
          gridTemplateColumns: `repeat(${session.gridCols}, 1fr)`,
          gridTemplateRows: `repeat(${session.gridRows}, 1fr)`,
          aspectRatio: `${session.gridCols} / ${session.gridRows}`,
          minHeight: '400px',
        }}
      >
        {session.views.map((view) => (
          <StreamCell key={view.id} view={view} />
        ))}
      </div>

      {/* Controls */}
      {selectedView && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">View Controls</h3>
          <div className="flex space-x-4">
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              Edit Stream
            </button>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              Toggle Audio
            </button>
            <button className="text-sm text-indigo-600 hover:text-indigo-800">
              Toggle Blur
            </button>
            <button className="text-sm text-red-600 hover:text-red-800">
              Remove Stream
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
