import { PubSub } from 'graphql-subscriptions';
import { Context } from '../context';

export class SubscriptionService {
  private pubsub: PubSub;

  constructor(pubsub: PubSub) {
    this.pubsub = pubsub;
  }

  // Session-related events
  async publishSessionUpdate(sessionId: string, session: any) {
    await this.pubsub.publish(`SESSION_UPDATED_${sessionId}`, {
      sessionUpdated: session
    });
  }

  async publishSessionViewUpdate(sessionId: string, view: any) {
    await this.pubsub.publish(`SESSION_VIEW_UPDATED_${sessionId}`, {
      sessionViewUpdated: view
    });
  }

  async publishSessionUserJoined(sessionId: string, user: any) {
    await this.pubsub.publish(`SESSION_USER_JOINED_${sessionId}`, {
      sessionUserJoined: { sessionId, user }
    });
  }

  async publishSessionUserLeft(sessionId: string, user: any) {
    await this.pubsub.publish(`SESSION_USER_LEFT_${sessionId}`, {
      sessionUserLeft: { sessionId, user }
    });
  }

  // Stream-related events
  async publishStreamAdded(stream: any) {
    await this.pubsub.publish('STREAM_ADDED', {
      streamAdded: stream
    });
  }

  async publishStreamUpdated(stream: any) {
    await this.pubsub.publish('STREAM_UPDATED', {
      streamUpdated: stream
    });
  }

  async publishStreamRemoved(streamId: string) {
    await this.pubsub.publish('STREAM_REMOVED', {
      streamRemoved: { id: streamId }
    });
  }

  // Live status events
  async publishStreamStatusChanged(streamId: string, isLive: boolean) {
    await this.pubsub.publish('STREAM_STATUS_CHANGED', {
      streamStatusChanged: { streamId, isLive }
    });
  }

  // Session management events
  async publishSessionCreated(session: any) {
    await this.pubsub.publish('SESSION_CREATED', {
      sessionCreated: session
    });
  }

  async publishSessionDeleted(sessionId: string) {
    await this.pubsub.publish('SESSION_DELETED', {
      sessionDeleted: { id: sessionId }
    });
  }

  // Active sessions tracking
  async publishActiveSessionsUpdate(activeSessions: any[]) {
    await this.pubsub.publish('ACTIVE_SESSIONS_UPDATED', {
      activeSessionsUpdated: activeSessions
    });
  }

  // Grid layout changes
  async publishGridLayoutUpdate(sessionId: string, layout: any) {
    await this.pubsub.publish(`GRID_LAYOUT_UPDATED_${sessionId}`, {
      gridLayoutUpdated: { sessionId, layout }
    });
  }

  // User presence in sessions
  async publishUserPresenceUpdate(sessionId: string, userId: string, presence: 'online' | 'away' | 'offline') {
    await this.pubsub.publish(`USER_PRESENCE_UPDATED_${sessionId}`, {
      userPresenceUpdated: { sessionId, userId, presence }
    });
  }

  // Chat/communication events (for future use)
  async publishSessionMessage(sessionId: string, message: any) {
    await this.pubsub.publish(`SESSION_MESSAGE_${sessionId}`, {
      sessionMessage: message
    });
  }

  // Subscription resolvers
  getSubscriptionResolvers() {
    return {
      // Session subscriptions
      sessionUpdated: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`SESSION_UPDATED_${args.sessionId}`);
        }
      },

      sessionViewUpdated: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`SESSION_VIEW_UPDATED_${args.sessionId}`);
        }
      },

      sessionUserJoined: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`SESSION_USER_JOINED_${args.sessionId}`);
        }
      },

      sessionUserLeft: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`SESSION_USER_LEFT_${args.sessionId}`);
        }
      },

      // Stream subscriptions
      streamAdded: {
        subscribe: () => this.pubsub.asyncIterator('STREAM_ADDED')
      },

      streamUpdated: {
        subscribe: () => this.pubsub.asyncIterator('STREAM_UPDATED')
      },

      streamRemoved: {
        subscribe: () => this.pubsub.asyncIterator('STREAM_REMOVED')
      },

      streamStatusChanged: {
        subscribe: () => this.pubsub.asyncIterator('STREAM_STATUS_CHANGED')
      },

      // Session management subscriptions
      sessionCreated: {
        subscribe: () => this.pubsub.asyncIterator('SESSION_CREATED')
      },

      sessionDeleted: {
        subscribe: () => this.pubsub.asyncIterator('SESSION_DELETED')
      },

      activeSessionsUpdated: {
        subscribe: () => this.pubsub.asyncIterator('ACTIVE_SESSIONS_UPDATED')
      },

      // Grid layout subscriptions
      gridLayoutUpdated: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`GRID_LAYOUT_UPDATED_${args.sessionId}`);
        }
      },

      // User presence subscriptions
      userPresenceUpdated: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`USER_PRESENCE_UPDATED_${args.sessionId}`);
        }
      },

      // Session messages (for future chat feature)
      sessionMessage: {
        subscribe: (_parent: any, args: { sessionId: string }, _context: Context) => {
          return this.pubsub.asyncIterator(`SESSION_MESSAGE_${args.sessionId}`);
        }
      }
    };
  }
}
