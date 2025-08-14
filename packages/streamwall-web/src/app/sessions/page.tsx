'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import StreamGrid from '@/components/StreamGrid';

const GET_SESSIONS = gql`
  query GetSessions($limit: Int, $offset: Int, $isPublic: Boolean) {
    sessions(limit: $limit, offset: $offset, isPublic: $isPublic) {
      id
      name
      description
      gridCols
      gridRows
      isPublic
      createdAt
      creator {
        id
        username
      }
    }
  }
`;

interface Session {
  id: string;
  name: string;
  description?: string;
  gridCols: number;
  gridRows: number;
  isPublic: boolean;
  createdAt: string;
  creator: {
    id: string;
    username: string;
  };
}

export default function SessionsPage() {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [showPublicOnly, setShowPublicOnly] = useState(true);

  const { data, loading, error, refetch } = useQuery(GET_SESSIONS, {
    variables: { limit: 50, offset: 0, isPublic: showPublicOnly || undefined },
    errorPolicy: 'all'
  });

  if (selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <button
              onClick={() => setSelectedSession(null)}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
            >
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Sessions
            </button>
          </div>
          <StreamGrid sessionId={selectedSession} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Sessions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse and manage stream viewing sessions
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create Session
            </button>
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="public-only"
              name="public-only"
              type="checkbox"
              checked={showPublicOnly}
              onChange={(e) => setShowPublicOnly(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="public-only" className="ml-2 block text-sm text-gray-700">
              Show public sessions only
            </label>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-500">Loading sessions...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error loading sessions: {error.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-indigo-600 hover:text-indigo-500"
              >
                Try again
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data?.sessions?.map((session: Session) => (
                <li key={session.id}>
                  <div 
                    className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{session.name}</div>
                            {session.isPublic && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                PUBLIC
                              </span>
                            )}
                          </div>
                          {session.description && (
                            <div className="text-sm text-gray-500 mt-1">{session.description}</div>
                          )}
                          <div className="text-sm text-gray-500 mt-1">
                            {session.gridCols} × {session.gridRows} grid • by {session.creator.username}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm text-gray-500">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </div>
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </li>
              )) || (
                <li className="px-4 py-8 text-center text-gray-500">
                  No sessions found. Create your first session to get started.
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
