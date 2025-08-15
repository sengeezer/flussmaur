import { useEffect, useState, useCallback } from 'react';
import { useSubscription, gql } from '@apollo/client';

// GraphQL subscriptions
const SESSION_UPDATED_SUBSCRIPTION = gql`
  subscription SessionUpdated($sessionId: ID!) {
    sessionUpdated(sessionId: $sessionId) {
      id
      name
      description
      gridCols
      gridRows
      isPublic
      updatedAt
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

const SESSION_VIEW_UPDATED_SUBSCRIPTION = gql`
  subscription SessionViewUpdated($sessionId: ID!) {
    sessionViewUpdated(sessionId: $sessionId) {
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
`;

const SESSION_USER_JOINED_SUBSCRIPTION = gql`
  subscription SessionUserJoined($sessionId: ID!) {
    sessionUserJoined(sessionId: $sessionId) {
      sessionId
      userId
      user {
        id
        username
        email
      }
      timestamp
    }
  }
`;

const SESSION_USER_LEFT_SUBSCRIPTION = gql`
  subscription SessionUserLeft($sessionId: ID!) {
    sessionUserLeft(sessionId: $sessionId) {
      sessionId
      userId
      user {
        id
        username
        email
      }
      timestamp
    }
  }
`;

const USER_PRESENCE_UPDATED_SUBSCRIPTION = gql`
  subscription UserPresenceUpdated($sessionId: ID!) {
    userPresenceUpdated(sessionId: $sessionId) {
      sessionId
      userId
      presence
      timestamp
    }
  }
`;

const GRID_LAYOUT_UPDATED_SUBSCRIPTION = gql`
  subscription GridLayoutUpdated($sessionId: ID!) {
    gridLayoutUpdated(sessionId: $sessionId) {
      sessionId
      layout
      timestamp
    }
  }
`;

export interface SessionUser {
  id: string;
  username: string;
  email: string;
  presence: 'online' | 'away' | 'offline';
  joinedAt: Date;
}

export interface CollaborationState {
  activeUsers: SessionUser[];
  totalUsers: number;
  recentActivity: Array<{
    type: 'user_joined' | 'user_left' | 'presence_changed' | 'view_updated' | 'session_updated';
    userId?: string;
    username?: string;
    timestamp: Date;
    data?: any;
  }>;
}

export function useRealtimeCollaboration(sessionId: string) {
  const [collaborationState, setCollaborationState] = useState<CollaborationState>({
    activeUsers: [],
    totalUsers: 0,
    recentActivity: []
  });

  const [isConnected, setIsConnected] = useState(false);

  // Session updates subscription
  const { data: sessionData, error: sessionError } = useSubscription(
    SESSION_UPDATED_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.sessionUpdated) {
          addActivity({
            type: 'session_updated',
            timestamp: new Date(),
            data: subscriptionData.data.sessionUpdated
          });
        }
      }
    }
  );

  // View updates subscription
  const { data: viewData, error: viewError } = useSubscription(
    SESSION_VIEW_UPDATED_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.sessionViewUpdated) {
          addActivity({
            type: 'view_updated',
            timestamp: new Date(),
            data: subscriptionData.data.sessionViewUpdated
          });
        }
      }
    }
  );

  // User joined subscription
  const { data: userJoinedData } = useSubscription(
    SESSION_USER_JOINED_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.sessionUserJoined) {
          const { user, timestamp } = subscriptionData.data.sessionUserJoined;
          addUser({
            ...user,
            presence: 'online',
            joinedAt: new Date(timestamp)
          });
          addActivity({
            type: 'user_joined',
            userId: user.id,
            username: user.username,
            timestamp: new Date(timestamp)
          });
        }
      }
    }
  );

  // User left subscription
  const { data: userLeftData } = useSubscription(
    SESSION_USER_LEFT_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.sessionUserLeft) {
          const { user, timestamp } = subscriptionData.data.sessionUserLeft;
          removeUser(user.id);
          addActivity({
            type: 'user_left',
            userId: user.id,
            username: user.username,
            timestamp: new Date(timestamp)
          });
        }
      }
    }
  );

  // User presence subscription
  const { data: presenceData } = useSubscription(
    USER_PRESENCE_UPDATED_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.userPresenceUpdated) {
          const { userId, presence, timestamp } = subscriptionData.data.userPresenceUpdated;
          updateUserPresence(userId, presence);
          addActivity({
            type: 'presence_changed',
            userId,
            timestamp: new Date(timestamp),
            data: { presence }
          });
        }
      }
    }
  );

  // Grid layout subscription
  const { data: layoutData } = useSubscription(
    GRID_LAYOUT_UPDATED_SUBSCRIPTION,
    {
      variables: { sessionId },
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.gridLayoutUpdated) {
          // This would trigger a layout update in the parent component
          // The parent should listen to this data
        }
      }
    }
  );

  // Helper functions
  const addUser = useCallback((user: SessionUser) => {
    setCollaborationState(prev => {
      const existingUserIndex = prev.activeUsers.findIndex(u => u.id === user.id);
      if (existingUserIndex >= 0) {
        // Update existing user
        const updatedUsers = [...prev.activeUsers];
        updatedUsers[existingUserIndex] = user;
        return {
          ...prev,
          activeUsers: updatedUsers,
          totalUsers: updatedUsers.length
        };
      } else {
        // Add new user
        const updatedUsers = [...prev.activeUsers, user];
        return {
          ...prev,
          activeUsers: updatedUsers,
          totalUsers: updatedUsers.length
        };
      }
    });
  }, []);

  const removeUser = useCallback((userId: string) => {
    setCollaborationState(prev => {
      const updatedUsers = prev.activeUsers.filter(u => u.id !== userId);
      return {
        ...prev,
        activeUsers: updatedUsers,
        totalUsers: updatedUsers.length
      };
    });
  }, []);

  const updateUserPresence = useCallback((userId: string, presence: string) => {
    setCollaborationState(prev => {
      const updatedUsers = prev.activeUsers.map(user =>
        user.id === userId ? { ...user, presence: presence as any } : user
      );
      return {
        ...prev,
        activeUsers: updatedUsers
      };
    });
  }, []);

  const addActivity = useCallback((activity: any) => {
    setCollaborationState(prev => ({
      ...prev,
      recentActivity: [activity, ...prev.recentActivity].slice(0, 20) // Keep last 20 activities
    }));
  }, []);

  // Connection status monitoring
  useEffect(() => {
    const hasErrors = sessionError || viewError;
    setIsConnected(!hasErrors);
  }, [sessionError, viewError]);

  return {
    collaborationState,
    isConnected,
    sessionData: sessionData?.sessionUpdated,
    viewData: viewData?.sessionViewUpdated,
    layoutData: layoutData?.gridLayoutUpdated,
    errors: {
      session: sessionError,
      view: viewError
    }
  };
}

// Hook for managing user presence
export function useUserPresence(sessionId: string, userId: string) {
  const [presence, setPresence] = useState<'online' | 'away' | 'offline'>('online');

  useEffect(() => {
    // Set user as online when component mounts
    setPresence('online');

    // Set up visibility change listener to update presence
    const handleVisibilityChange = () => {
      setPresence(document.hidden ? 'away' : 'online');
    };

    // Set up beforeunload listener to set offline status
    const handleBeforeUnload = () => {
      setPresence('offline');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setPresence('offline');
    };
  }, [sessionId, userId]);

  return { presence };
}

// Hook for real-time session management
export function useSessionManagement() {
  const [activeSessions, setActiveSessions] = useState([]);

  const activeSessionsSubscription = useSubscription(
    gql`
      subscription ActiveSessionsUpdated {
        activeSessionsUpdated {
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
          }
        }
      }
    `,
    {
      onSubscriptionData: ({ subscriptionData }) => {
        if (subscriptionData.data?.activeSessionsUpdated) {
          setActiveSessions(subscriptionData.data.activeSessionsUpdated);
        }
      }
    }
  );

  return {
    activeSessions,
    loading: activeSessionsSubscription.loading,
    error: activeSessionsSubscription.error
  };
}
