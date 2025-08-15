import { PrismaClient } from '@prisma/client';
import { SubscriptionService } from './subscriptionService';

export class SessionService {
  private prisma: PrismaClient;
  private subscriptionService: SubscriptionService;
  private activeUsers: Map<string, Set<string>> = new Map(); // sessionId -> Set of userIds

  constructor(prisma: PrismaClient, subscriptionService: SubscriptionService) {
    this.prisma = prisma;
    this.subscriptionService = subscriptionService;
  }

  // Session CRUD operations with real-time events
  async createSession(data: {
    name: string;
    description?: string;
    gridCols?: number;
    gridRows?: number;
    isPublic?: boolean;
    createdBy: string;
  }) {
    const session = await this.prisma.session.create({
      data: {
        name: data.name,
        description: data.description,
        gridCols: data.gridCols || 3,
        gridRows: data.gridRows || 2,
        isPublic: data.isPublic || false,
        createdBy: data.createdBy,
      },
      include: {
        creator: true,
        views: {
          include: { stream: true }
        }
      }
    });

    // Publish session creation event
    await this.subscriptionService.publishSessionCreated(session);
    await this.updateActiveSessions();

    return session;
  }

  async updateSession(id: string, data: {
    name?: string;
    description?: string;
    gridCols?: number;
    gridRows?: number;
    isPublic?: boolean;
  }) {
    const session = await this.prisma.session.update({
      where: { id },
      data,
      include: {
        creator: true,
        views: {
          include: { stream: true }
        }
      }
    });

    // Publish session update event
    await this.subscriptionService.publishSessionUpdate(id, session);

    return session;
  }

  async deleteSession(id: string) {
    await this.prisma.session.delete({
      where: { id }
    });

    // Publish session deletion event
    await this.subscriptionService.publishSessionDeleted(id);
    await this.updateActiveSessions();

    return true;
  }

  // Real-time collaboration features
  async joinSession(sessionId: string, userId: string) {
    // Add user to active users for this session
    if (!this.activeUsers.has(sessionId)) {
      this.activeUsers.set(sessionId, new Set());
    }
    this.activeUsers.get(sessionId)!.add(userId);

    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      // Publish user joined event
      await this.subscriptionService.publishSessionUserJoined(sessionId, user);
      
      // Update user presence
      await this.subscriptionService.publishUserPresenceUpdate(sessionId, userId, 'online');
    }

    return this.getActiveUsers(sessionId);
  }

  async leaveSession(sessionId: string, userId: string) {
    // Remove user from active users
    if (this.activeUsers.has(sessionId)) {
      this.activeUsers.get(sessionId)!.delete(userId);
      
      // Clean up empty sessions
      if (this.activeUsers.get(sessionId)!.size === 0) {
        this.activeUsers.delete(sessionId);
      }
    }

    // Get user data
    const user = await this.prisma.user.findUnique({
      where: { id: userId }
    });

    if (user) {
      // Publish user left event
      await this.subscriptionService.publishSessionUserLeft(sessionId, user);
      
      // Update user presence
      await this.subscriptionService.publishUserPresenceUpdate(sessionId, userId, 'offline');
    }

    return this.getActiveUsers(sessionId);
  }

  async updateUserPresence(sessionId: string, userId: string, presence: 'online' | 'away' | 'offline') {
    await this.subscriptionService.publishUserPresenceUpdate(sessionId, userId, presence);
  }

  getActiveUsers(sessionId: string): string[] {
    return Array.from(this.activeUsers.get(sessionId) || []);
  }

  // Grid layout management with real-time sync
  async updateGridLayout(sessionId: string, layout: any) {
    // Here you could also persist the layout to the database if needed
    // For now, we just broadcast the change
    await this.subscriptionService.publishGridLayoutUpdate(sessionId, layout);
    
    return layout;
  }

  // View management with real-time updates
  async createView(data: {
    sessionId: string;
    streamId?: string;
    positionX: number;
    positionY: number;
    width?: number;
    height?: number;
  }) {
    const view = await this.prisma.view.create({
      data: {
        sessionId: data.sessionId,
        streamId: data.streamId,
        positionX: data.positionX,
        positionY: data.positionY,
        width: data.width || 1,
        height: data.height || 1,
        audioEnabled: true,
        blurred: false,
        visible: true,
      },
      include: {
        stream: true,
        session: true
      }
    });

    // Publish view update for the session
    await this.subscriptionService.publishSessionViewUpdate(data.sessionId, view);

    return view;
  }

  async updateView(id: string, data: {
    streamId?: string;
    positionX?: number;
    positionY?: number;
    width?: number;
    height?: number;
    audioEnabled?: boolean;
    blurred?: boolean;
    visible?: boolean;
  }) {
    const view = await this.prisma.view.update({
      where: { id },
      data,
      include: {
        stream: true,
        session: true
      }
    });

    // Publish view update for the session
    await this.subscriptionService.publishSessionViewUpdate(view.sessionId, view);

    return view;
  }

  async deleteView(id: string) {
    const view = await this.prisma.view.findUnique({
      where: { id },
      include: { session: true }
    });

    if (!view) {
      throw new Error('View not found');
    }

    await this.prisma.view.delete({
      where: { id }
    });

    // Publish view update for the session
    await this.subscriptionService.publishSessionViewUpdate(view.sessionId, null);

    return true;
  }

  // Helper method to update active sessions list
  private async updateActiveSessions() {
    const sessions = await this.prisma.session.findMany({
      include: {
        creator: true,
        views: {
          include: { stream: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    await this.subscriptionService.publishActiveSessionsUpdate(sessions);
  }

  // Get session with real-time data
  async getSessionWithActiveUsers(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        creator: true,
        views: {
          include: { stream: true },
          orderBy: [{ positionY: 'asc' }, { positionX: 'asc' }]
        }
      }
    });

    if (!session) {
      throw new Error('Session not found');
    }

    return {
      ...session,
      activeUsers: this.getActiveUsers(sessionId),
      activeUserCount: this.getActiveUsers(sessionId).length
    };
  }
}
