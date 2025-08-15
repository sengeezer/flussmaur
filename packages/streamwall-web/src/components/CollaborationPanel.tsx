'use client';

import React from 'react';
import { useRealtimeCollaboration, SessionUser } from '@/hooks/useRealtimeCollaboration';

interface CollaborationPanelProps {
  sessionId: string;
  currentUserId?: string;
  className?: string;
}

export function CollaborationPanel({ sessionId, currentUserId, className = '' }: CollaborationPanelProps) {
  const { collaborationState, isConnected, errors } = useRealtimeCollaboration(sessionId);

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined': return '👋';
      case 'user_left': return '👋';
      case 'presence_changed': return '🔄';
      case 'view_updated': return '📺';
      case 'session_updated': return '⚙️';
      default: return '📌';
    }
  };

  const formatActivityMessage = (activity: any) => {
    switch (activity.type) {
      case 'user_joined':
        return `${activity.username} joined the session`;
      case 'user_left':
        return `${activity.username} left the session`;
      case 'presence_changed':
        return `User went ${activity.data?.presence}`;
      case 'view_updated':
        return 'Stream layout updated';
      case 'session_updated':
        return 'Session settings updated';
      default:
        return 'Activity occurred';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  if (errors.session || errors.view) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-red-600">
          <span className="text-sm">⚠️ Connection error</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Live Collaboration
          </h3>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-gray-500">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Active Users ({collaborationState.totalUsers})
          </h4>
        </div>
        
        {collaborationState.activeUsers.length === 0 ? (
          <p className="text-sm text-gray-500">No other users in this session</p>
        ) : (
          <div className="space-y-2">
            {collaborationState.activeUsers.map((user: SessionUser) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getPresenceColor(user.presence)}`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.username}
                    {user.id === currentUserId && (
                      <span className="ml-1 text-xs text-gray-500">(you)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user.presence} • joined {formatTime(user.joinedAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
        
        {collaborationState.recentActivity.length === 0 ? (
          <p className="text-sm text-gray-500">No recent activity</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {collaborationState.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 rounded bg-gray-50">
                <span className="text-sm">{getActivityIcon(activity.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-600">
                    {formatActivityMessage(activity)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mini version for the main session view
export function CollaborationIndicator({ sessionId, className = '' }: { sessionId: string; className?: string }) {
  const { collaborationState, isConnected } = useRealtimeCollaboration(sessionId);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-sm text-gray-600">
        {collaborationState.totalUsers} user{collaborationState.totalUsers !== 1 ? 's' : ''} online
      </span>
      
      {collaborationState.activeUsers.length > 0 && (
        <div className="flex -space-x-1">
          {collaborationState.activeUsers.slice(0, 3).map((user: SessionUser) => (
            <div
              key={user.id}
              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
              title={user.username}
            >
              {user.username.charAt(0).toUpperCase()}
            </div>
          ))}
          {collaborationState.activeUsers.length > 3 && (
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
              +{collaborationState.activeUsers.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
