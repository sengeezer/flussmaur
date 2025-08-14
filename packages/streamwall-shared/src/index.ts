import { z } from 'zod';

// Stream Platform Types
export const StreamPlatform = z.enum([
  'youtube',
  'twitch',
  'facebook',
  'instagram',
  'generic',
  'hls',
  'rtmp'
]);

export type StreamPlatform = z.infer<typeof StreamPlatform>;

// Stream Data Schema
export const StreamDataSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  platform: StreamPlatform,
  thumbnail: z.string().url().optional(),
  metadata: z.record(z.unknown()).optional(),
  isLive: z.boolean().default(false),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type StreamData = z.infer<typeof StreamDataSchema>;

// Grid Position Schema
export const GridPositionSchema = z.object({
  x: z.number().int().min(0),
  y: z.number().int().min(0),
  width: z.number().int().min(1).default(1),
  height: z.number().int().min(1).default(1),
});

export type GridPosition = z.infer<typeof GridPositionSchema>;

// View State Schema
export const ViewStateSchema = z.object({
  id: z.string(),
  streamId: z.string().nullable(),
  position: GridPositionSchema,
  audioEnabled: z.boolean().default(false),
  blurred: z.boolean().default(false),
  visible: z.boolean().default(true),
});

export type ViewState = z.infer<typeof ViewStateSchema>;

// Session Schema
export const SessionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  gridCols: z.number().int().min(1).max(20).default(3),
  gridRows: z.number().int().min(1).max(20).default(3),
  views: z.array(ViewStateSchema),
  isPublic: z.boolean().default(false),
  createdBy: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Session = z.infer<typeof SessionSchema>;

// User Role Schema
export const UserRole = z.enum(['viewer', 'editor', 'admin']);
export type UserRole = z.infer<typeof UserRole>;

// User Schema
export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
  role: UserRole,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

// Data Source Schema
export const DataSourceTypeSchema = z.enum(['json_api', 'toml_file', 'manual']);
export type DataSourceType = z.infer<typeof DataSourceTypeSchema>;

export const DataSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: DataSourceTypeSchema,
  url: z.string().optional(),
  filePath: z.string().optional(),
  refreshInterval: z.number().int().min(30).default(300), // seconds
  enabled: z.boolean().default(true),
  lastSync: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type DataSource = z.infer<typeof DataSourceSchema>;

// Real-time Events
export const StreamEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('stream_added'),
    stream: StreamDataSchema,
  }),
  z.object({
    type: z.literal('stream_updated'),
    stream: StreamDataSchema,
  }),
  z.object({
    type: z.literal('stream_removed'),
    streamId: z.string(),
  }),
  z.object({
    type: z.literal('view_updated'),
    sessionId: z.string(),
    view: ViewStateSchema,
  }),
  z.object({
    type: z.literal('session_updated'),
    session: SessionSchema,
  }),
]);

export type StreamEvent = z.infer<typeof StreamEventSchema>;

// API Response Types
export const PaginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Additional type definitions and legacy compatibility types
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ViewContent {
  url: string;
  title?: string;
  platform?: string;
}

export interface ViewPos {
  spaces: number[];
  rect: Rectangle;
}

// Legacy types for migration compatibility
export interface StreamList extends Array<StreamData> {}

export interface ViewContentMap {
  [key: string]: {
    content: ViewContent;
    spaces: number[];
  };
}

// Configuration types
export interface StreamWindowConfig {
  cols: number;
  rows: number;
  width: number;
  height: number;
  x?: number;
  y?: number;
  frameless?: boolean;
  activeColor?: string;
  backgroundColor?: string;
}

// State management types
export interface StreamwallState {
  identity: {
    role: string;
  };
  config: StreamWindowConfig;
  streams: StreamData[];
  customStreams: StreamData[];
  views: ViewState[];
  streamdelay?: any;
}

// Content display options
export interface ContentDisplayOptions {
  rotation?: number;
  blur?: boolean;
  volume?: number;
  muted?: boolean;
}

export interface ContentViewInfo {
  title?: string;
  platform?: string;
  isLive?: boolean;
  viewerCount?: number;
}

// Error Types
export class StreamwallError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'StreamwallError';
  }
}

// Utility Functions
export function createStreamId(): string {
  return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function createViewId(): string {
  return `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function detectStreamPlatform(url: string): StreamPlatform {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return 'youtube';
    }
    if (hostname.includes('twitch.tv')) {
      return 'twitch';
    }
    if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
      return 'facebook';
    }
    if (hostname.includes('instagram.com')) {
      return 'instagram';
    }
    if (url.includes('.m3u8')) {
      return 'hls';
    }
    if (url.includes('rtmp://')) {
      return 'rtmp';
    }
    
    return 'generic';
  } catch {
    return 'generic';
  }
}
