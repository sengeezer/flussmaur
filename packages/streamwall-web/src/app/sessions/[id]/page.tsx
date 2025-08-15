'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, gql } from '@apollo/client';
import StreamGrid from '@/components/StreamGrid';
import { CollaborationPanel, CollaborationIndicator } from '@/components/CollaborationPanel';
import { useRealtimeCollaboration, useUserPresence } from '@/hooks/useRealtimeCollaboration';

const GET_SESSION = gql`
  query GetSession($id: ID!) {
    session(id: $id) {
      id
      name
      description
      gridCols
      gridRows
      isPublic
      createdAt
      updatedAt
      creator {
        id
        username
        email
      }
      views {
        id
        streamId
        positionX
        positionY
        width
        height
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

const UPDATE_SESSION = gql`
  mutation UpdateSession($id: ID!, $name: String, $description: String, $gridCols: Int, $gridRows: Int, $isPublic: Boolean) {
    updateSession(id: $id, name: $name, description: $description, gridCols: $gridCols, gridRows: $gridRows, isPublic: $isPublic) {
      id
      name
      description
      gridCols
      gridRows
      isPublic
      updatedAt
    }
  }
`;

export default function SessionViewPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  
  // Mock current user (in real app, this would come from auth context)
  const currentUserId = 'user-1';
  
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingSession, setEditingSession] = useState({
    name: '',
    description: '',
    gridCols: 3,
    gridRows: 2,
    isPublic: false
  });

  // Real-time collaboration hooks
  const { isConnected, sessionData, viewData, layoutData } = useRealtimeCollaboration(sessionId);
  useUserPresence(sessionId, currentUserId);

  // GraphQL operations
  const { data, loading, error, refetch } = useQuery(GET_SESSION, {
    variables: { id: sessionId },
    pollInterval: 30000, // Fallback polling every 30s
  });

  const [updateSession] = useMutation(UPDATE_SESSION, {
    onCompleted: () => {
      setIsEditMode(false);
      refetch();
    }
  });

  // Update local state when real-time data comes in
  useEffect(() => {
    if (sessionData) {
      // Session has been updated by another user
      refetch();
    }
  }, [sessionData, refetch]);

  useEffect(() => {
    if (viewData) {
      // Views have been updated by another user
      refetch();
    }
  }, [viewData, refetch]);

  useEffect(() => {
    if (layoutData) {
      // Grid layout has been updated by another user
      // This could trigger a custom layout synchronization
      console.log('Grid layout updated:', layoutData);
    }
  }, [layoutData]);

  // Initialize editing state
  useEffect(() => {
    if (data?.session) {
      setEditingSession({
        name: data.session.name,
        description: data.session.description || '',
        gridCols: data.session.gridCols,
        gridRows: data.session.gridRows,
        isPublic: data.session.isPublic
      });
    }
  }, [data?.session]);

  const handleSessionUpdate = async () => {
    try {
      await updateSession({
        variables: {
          id: sessionId,
          ...editingSession
        }
      });
    } catch (err) {
      console.error('Failed to update session:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Session Not Found</h1>
          <p className="text-gray-600 mb-4">The session you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
          <button
            onClick={() => router.push('/sessions')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Sessions
          </button>
        </div>
      </div>
    );
  }

  const session = data.session;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/sessions')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              
              {isEditMode ? (
                <input
                  type="text"
                  value={editingSession.name}
                  onChange={(e) => setEditingSession(prev => ({ ...prev, name: e.target.value }))}
                  className="text-xl font-bold text-gray-900 bg-transparent border-b-2 border-blue-600 focus:outline-none"
                />
              ) : (
                <h1 className="text-xl font-bold text-gray-900">{session.name}</h1>
              )}

              {session.isPublic && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Public
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Real-time collaboration indicator */}
              <CollaborationIndicator sessionId={sessionId} />

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {isEditMode ? (
                  <>
                    <button
                      onClick={handleSessionUpdate}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditMode(false)}
                      className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => setShowCollaboration(!showCollaboration)}
                  className={`px-3 py-1.5 rounded text-sm ${
                    showCollaboration 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                  }`}
                >
                  Collaboration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Stream grid */}
          <div className="flex-1">
            {isEditMode && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4">Session Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingSession.description}
                      onChange={(e) => setEditingSession(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grid Columns
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editingSession.gridCols}
                        onChange={(e) => setEditingSession(prev => ({ ...prev, gridCols: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Grid Rows
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editingSession.gridRows}
                        onChange={(e) => setEditingSession(prev => ({ ...prev, gridRows: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editingSession.isPublic}
                      onChange={(e) => setEditingSession(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Make this session public</span>
                  </label>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Stream Grid</h2>
                <div className="flex items-center space-x-2">
                  {!isConnected && (
                    <span className="text-xs text-red-600">⚠️ Offline mode</span>
                  )}
                  <span className="text-sm text-gray-500">
                    {session.gridCols} × {session.gridRows}
                  </span>
                </div>
              </div>

              <StreamGrid
                sessionId={sessionId}
              />
            </div>

            {session.description && (
              <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700">{session.description}</p>
              </div>
            )}
          </div>

          {/* Collaboration panel */}
          {showCollaboration && (
            <div className="w-80">
              <CollaborationPanel 
                sessionId={sessionId} 
                currentUserId={currentUserId}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
