export const resolvers = {
  Query: {
    me: async (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return context.user;
    },

    streams: async (parent: any, args: any, context: any) => {
      const { limit = 50, offset = 0, search } = args;
      return context.prisma.stream.findMany({
        take: limit,
        skip: offset,
        where: search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { url: { contains: search, mode: 'insensitive' } },
          ],
        } : undefined,
        orderBy: { createdAt: 'desc' },
      });
    },

    sessions: async (parent: any, args: any, context: any) => {
      const { limit = 50, offset = 0, isPublic } = args;
      return context.prisma.session.findMany({
        take: limit,
        skip: offset,
        where: isPublic !== undefined ? { isPublic } : undefined,
        orderBy: { updatedAt: 'desc' },
        include: {
          creator: true,
          views: {
            include: {
              stream: true,
            },
          },
        },
      });
    },
  },

  Mutation: {
    createStream: async (parent: any, args: any, context: any) => {
      if (!context.user || context.user.role === 'VIEWER') {
        throw new Error('Insufficient permissions');
      }

      const { url, title, platform } = args;
      return context.prisma.stream.create({
        data: {
          url,
          title,
          platform: platform || 'GENERIC',
        },
      });
    },

    createSession: async (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { name, description, gridCols = 3, gridRows = 3, isPublic = false } = args;
      return context.prisma.session.create({
        data: {
          name,
          description,
          gridCols,
          gridRows,
          isPublic,
          createdBy: context.user.id,
        },
        include: {
          creator: true,
          views: {
            include: {
              stream: true,
            },
          },
        },
      });
    },

    updateView: async (parent: any, args: any, context: any) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }

      const { id, ...updateData } = args;
      const view = await context.prisma.view.findUnique({
        where: { id },
        include: { session: true },
      });

      if (!view) {
        throw new Error('View not found');
      }

      // Check permissions
      if (view.session.createdBy !== context.user.id && context.user.role !== 'ADMIN') {
        throw new Error('Insufficient permissions');
      }

      return context.prisma.view.update({
        where: { id },
        data: updateData,
        include: {
          session: true,
          stream: true,
        },
      });
    },
  },

  Subscription: {
    streamAdded: {
      subscribe: (parent: any, args: any, context: any) => context.pubsub.asyncIterator(['STREAM_ADDED']),
    },
    sessionUpdated: {
      subscribe: (parent: any, args: any, context: any) => {
        return context.pubsub.asyncIterator([`SESSION_UPDATED_${args.sessionId}`]);
      },
    },
  },

  // Resolvers for nested fields
  Stream: {
    views: async (parent: any, args: any, context: any) => {
      return context.prisma.view.findMany({
        where: { streamId: parent.id },
        include: { session: true },
      });
    },
  },

  Session: {
    creator: async (parent: any, args: any, context: any) => {
      return context.prisma.user.findUnique({
        where: { id: parent.createdBy },
      });
    },
    views: async (parent: any, args: any, context: any) => {
      return context.prisma.view.findMany({
        where: { sessionId: parent.id },
        include: { stream: true },
        orderBy: [{ positionY: 'asc' }, { positionX: 'asc' }],
      });
    },
  },

  View: {
    session: async (parent: any, args: any, context: any) => {
      return context.prisma.session.findUnique({
        where: { id: parent.sessionId },
      });
    },
    stream: async (parent: any, args: any, context: any) => {
      if (!parent.streamId) return null;
      return context.prisma.stream.findUnique({
        where: { id: parent.streamId },
      });
    },
  },
};
