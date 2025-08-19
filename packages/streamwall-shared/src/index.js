"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamwallError = exports.PaginationSchema = exports.StreamEventSchema = exports.DataSourceSchema = exports.DataSourceTypeSchema = exports.UserSchema = exports.UserRole = exports.SessionSchema = exports.ViewStateSchema = exports.GridPositionSchema = exports.StreamDataSchema = exports.StreamPlatform = void 0;
exports.createStreamId = createStreamId;
exports.createSessionId = createSessionId;
exports.createViewId = createViewId;
exports.detectStreamPlatform = detectStreamPlatform;
const zod_1 = require("zod");
// Stream Platform Types
exports.StreamPlatform = zod_1.z.enum([
    'youtube',
    'twitch',
    'facebook',
    'instagram',
    'generic',
    'hls',
    'rtmp'
]);
// Stream Data Schema
exports.StreamDataSchema = zod_1.z.object({
    id: zod_1.z.string(),
    url: zod_1.z.string().url(),
    title: zod_1.z.string(),
    platform: exports.StreamPlatform,
    thumbnail: zod_1.z.string().url().optional(),
    metadata: zod_1.z.record(zod_1.z.unknown()).optional(),
    isLive: zod_1.z.boolean().default(false),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Grid Position Schema
exports.GridPositionSchema = zod_1.z.object({
    x: zod_1.z.number().int().min(0),
    y: zod_1.z.number().int().min(0),
    width: zod_1.z.number().int().min(1).default(1),
    height: zod_1.z.number().int().min(1).default(1),
});
// View State Schema
exports.ViewStateSchema = zod_1.z.object({
    id: zod_1.z.string(),
    streamId: zod_1.z.string().nullable(),
    position: exports.GridPositionSchema,
    audioEnabled: zod_1.z.boolean().default(false),
    blurred: zod_1.z.boolean().default(false),
    visible: zod_1.z.boolean().default(true),
});
// Session Schema
exports.SessionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    gridCols: zod_1.z.number().int().min(1).max(20).default(3),
    gridRows: zod_1.z.number().int().min(1).max(20).default(3),
    views: zod_1.z.array(exports.ViewStateSchema),
    isPublic: zod_1.z.boolean().default(false),
    createdBy: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// User Role Schema
exports.UserRole = zod_1.z.enum(['viewer', 'editor', 'admin']);
// User Schema
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string(),
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    role: exports.UserRole,
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Data Source Schema
exports.DataSourceTypeSchema = zod_1.z.enum(['json_api', 'toml_file', 'manual']);
exports.DataSourceSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    type: exports.DataSourceTypeSchema,
    url: zod_1.z.string().optional(),
    filePath: zod_1.z.string().optional(),
    refreshInterval: zod_1.z.number().int().min(30).default(300), // seconds
    enabled: zod_1.z.boolean().default(true),
    lastSync: zod_1.z.date().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date(),
});
// Real-time Events
exports.StreamEventSchema = zod_1.z.discriminatedUnion('type', [
    zod_1.z.object({
        type: zod_1.z.literal('stream_added'),
        stream: exports.StreamDataSchema,
    }),
    zod_1.z.object({
        type: zod_1.z.literal('stream_updated'),
        stream: exports.StreamDataSchema,
    }),
    zod_1.z.object({
        type: zod_1.z.literal('stream_removed'),
        streamId: zod_1.z.string(),
    }),
    zod_1.z.object({
        type: zod_1.z.literal('view_updated'),
        sessionId: zod_1.z.string(),
        view: exports.ViewStateSchema,
    }),
    zod_1.z.object({
        type: zod_1.z.literal('session_updated'),
        session: exports.SessionSchema,
    }),
]);
// API Response Types
exports.PaginationSchema = zod_1.z.object({
    page: zod_1.z.number().int().min(1).default(1),
    limit: zod_1.z.number().int().min(1).max(100).default(20),
    total: zod_1.z.number().int().min(0),
    totalPages: zod_1.z.number().int().min(0),
});
// Error Types
class StreamwallError extends Error {
    constructor(message, code, statusCode = 500) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'StreamwallError';
    }
}
exports.StreamwallError = StreamwallError;
// Utility Functions
function createStreamId() {
    return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function createSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function createViewId() {
    return `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
function detectStreamPlatform(url) {
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
    }
    catch {
        return 'generic';
    }
}
