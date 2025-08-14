'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_STREAMS = gql`
  query GetStreams($limit: Int, $offset: Int, $search: String) {
    streams(limit: $limit, offset: $offset, search: $search) {
      id
      url
      title
      platform
      thumbnail
      isLive
      createdAt
    }
  }
`;

const CREATE_STREAM = gql`
  mutation CreateStream($url: String!, $title: String!, $platform: String) {
    createStream(url: $url, title: $title, platform: $platform) {
      id
      url
      title
      platform
      isLive
    }
  }
`;

interface Stream {
  id: string;
  url: string;
  title: string;
  platform: string;
  thumbnail?: string;
  isLive: boolean;
  createdAt: string;
}

export default function StreamsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStream, setNewStream] = useState({
    url: '',
    title: '',
    platform: 'generic'
  });

  const { data, loading, error, refetch } = useQuery(GET_STREAMS, {
    variables: { limit: 50, offset: 0, search: searchTerm || undefined },
    errorPolicy: 'all'
  });

  const [createStream, { loading: creating }] = useMutation(CREATE_STREAM, {
    onCompleted: () => {
      setShowAddForm(false);
      setNewStream({ url: '', title: '', platform: 'generic' });
      refetch();
    },
    onError: (error) => {
      console.error('Error creating stream:', error);
      alert('Error creating stream: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStream.url || !newStream.title) {
      alert('Please fill in all required fields');
      return;
    }

    createStream({
      variables: {
        url: newStream.url,
        title: newStream.title,
        platform: newStream.platform
      }
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'youtube': return 'bg-red-100 text-red-800';
      case 'twitch': return 'bg-purple-100 text-purple-800';
      case 'facebook': return 'bg-blue-100 text-blue-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'hls': return 'bg-green-100 text-green-800';
      case 'rtmp': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Stream Management
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your stream sources and data feeds
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Stream
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="max-w-lg w-full lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search streams</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="search"
                name="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search streams..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Add Stream Form */}
        {showAddForm && (
          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Add New Stream
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                      Stream URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      id="url"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={newStream.url}
                      onChange={(e) => setNewStream({ ...newStream, url: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="Stream title"
                      value={newStream.title}
                      onChange={(e) => setNewStream({ ...newStream, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                      Platform
                    </label>
                    <select
                      id="platform"
                      name="platform"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={newStream.platform}
                      onChange={(e) => setNewStream({ ...newStream, platform: e.target.value })}
                    >
                      <option value="generic">Generic</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitch">Twitch</option>
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="hls">HLS Stream</option>
                      <option value="rtmp">RTMP Stream</option>
                    </select>
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {creating ? 'Adding...' : 'Add Stream'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Streams Grid */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="mt-2 text-gray-500">Loading streams...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error loading streams: {error.message}</p>
              <button
                onClick={() => refetch()}
                className="mt-2 text-indigo-600 hover:text-indigo-500"
              >
                Try again
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {data?.streams?.map((stream: Stream) => (
                <li key={stream.id}>
                  <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {stream.thumbnail ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={stream.thumbnail} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{stream.title}</div>
                          {stream.isLive && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-md">{stream.url}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlatformColor(stream.platform)}`}>
                        {stream.platform.toUpperCase()}
                      </span>
                      <div className="text-sm text-gray-500">
                        {new Date(stream.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </li>
              )) || (
                <li className="px-4 py-8 text-center text-gray-500">
                  No streams found. {searchTerm ? 'Try a different search term.' : 'Add your first stream to get started.'}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
