import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import jwt from 'jsonwebtoken';

export interface Context {
  prisma: PrismaClient;
  pubsub: PubSub;
  user?: any;
}

const prisma = new PrismaClient();
const pubsub = new PubSub();

export function createContext({ req }: { req?: any }): Context {
  let user = null;

  // Extract JWT token from Authorization header
  if (req?.headers?.authorization) {
    const token = req.headers.authorization.replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      user = decoded;
    } catch (error) {
      // Invalid token, user remains null
      console.warn('Invalid JWT token:', error);
    }
  }

  return {
    prisma,
    pubsub,
    user,
  };
}
