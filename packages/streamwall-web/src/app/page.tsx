'use client';

import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    streams(limit: 5) {
      id
      title
      platform
      isLive
    }
    sessions(limit: 5, isPublic: true) {
      id
      name
      gridCols
      gridRows
      creator {
        username
      }
    }
  }
`;

interface DashboardStream {
  id: string;
  title: string;
  platform: string;
  isLive: boolean;
}

interface DashboardSession {
  id: string;
  name: string;
  gridCols: number;
  gridRows: number;
  creator: {
    username: string;
  };
}

export default function Home() {
  const { data, loading } = useQuery(GET_DASHBOARD_DATA, {
    errorPolicy: 'all'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            <span className="block">Multi-Stream</span>
            <span className="block text-indigo-600">Viewing Platform</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            View multiple live streams simultaneously in customizable grid layouts. 
            Create sessions, share with others, and enjoy seamless multi-streaming experience.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/streams"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Manage Streams
            </Link>
            <Link
              href="/sessions"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Browse Sessions
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Multi-Platform Support</h3>
                  <p className="text-sm text-gray-500">YouTube, Twitch, Facebook, and more</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Flexible Grid Layouts</h3>
                  <p className="text-sm text-gray-500">Customize your viewing experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Real-time Collaboration</h3>
                  <p className="text-sm text-gray-500">Share sessions with others</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Streams */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Streams</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : data?.streams?.length > 0 ? (
                <ul className="space-y-3">
                  {data.streams.map((stream: DashboardStream) => (
                    <li key={stream.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className={`h-2 w-2 rounded-full ${stream.isLive ? 'bg-red-400' : 'bg-gray-300'}`}></div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {stream.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {stream.platform.toUpperCase()}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No streams available</p>
              )}
              <div className="mt-4">
                <Link
                  href="/streams"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  View all streams →
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Public Sessions</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                </div>
              ) : data?.sessions?.length > 0 ? (
                <ul className="space-y-3">
                  {data.sessions.map((session: DashboardSession) => (
                    <li key={session.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {session.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            by {session.creator.username}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">
                          {session.gridCols}×{session.gridRows}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No public sessions available</p>
              )}
              <div className="mt-4">
                <Link
                  href="/sessions"
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Browse all sessions →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
