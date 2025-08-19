import { z } from 'zod';
export declare const StreamPlatform: z.ZodEnum<["youtube", "twitch", "facebook", "instagram", "generic", "hls", "rtmp"]>;
export type StreamPlatform = z.infer<typeof StreamPlatform>;
export declare const StreamDataSchema: z.ZodObject<{
    id: z.ZodString;
    url: z.ZodString;
    title: z.ZodString;
    platform: z.ZodEnum<["youtube", "twitch", "facebook", "instagram", "generic", "hls", "rtmp"]>;
    thumbnail: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    isLive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    url: string;
    title: string;
    platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
    isLive: boolean;
    createdAt: Date;
    updatedAt: Date;
    thumbnail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
}, {
    id: string;
    url: string;
    title: string;
    platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
    createdAt: Date;
    updatedAt: Date;
    thumbnail?: string | undefined;
    metadata?: Record<string, unknown> | undefined;
    isLive?: boolean | undefined;
}>;
export type StreamData = z.infer<typeof StreamDataSchema>;
export declare const GridPositionSchema: z.ZodObject<{
    x: z.ZodNumber;
    y: z.ZodNumber;
    width: z.ZodDefault<z.ZodNumber>;
    height: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    x: number;
    y: number;
    width: number;
    height: number;
}, {
    x: number;
    y: number;
    width?: number | undefined;
    height?: number | undefined;
}>;
export type GridPosition = z.infer<typeof GridPositionSchema>;
export declare const ViewStateSchema: z.ZodObject<{
    id: z.ZodString;
    streamId: z.ZodNullable<z.ZodString>;
    position: z.ZodObject<{
        x: z.ZodNumber;
        y: z.ZodNumber;
        width: z.ZodDefault<z.ZodNumber>;
        height: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        x: number;
        y: number;
        width: number;
        height: number;
    }, {
        x: number;
        y: number;
        width?: number | undefined;
        height?: number | undefined;
    }>;
    audioEnabled: z.ZodDefault<z.ZodBoolean>;
    blurred: z.ZodDefault<z.ZodBoolean>;
    visible: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    streamId: string | null;
    position: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    audioEnabled: boolean;
    blurred: boolean;
    visible: boolean;
}, {
    id: string;
    streamId: string | null;
    position: {
        x: number;
        y: number;
        width?: number | undefined;
        height?: number | undefined;
    };
    audioEnabled?: boolean | undefined;
    blurred?: boolean | undefined;
    visible?: boolean | undefined;
}>;
export type ViewState = z.infer<typeof ViewStateSchema>;
export declare const SessionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    gridCols: z.ZodDefault<z.ZodNumber>;
    gridRows: z.ZodDefault<z.ZodNumber>;
    views: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        streamId: z.ZodNullable<z.ZodString>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodDefault<z.ZodNumber>;
            height: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            width: number;
            height: number;
        }, {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        }>;
        audioEnabled: z.ZodDefault<z.ZodBoolean>;
        blurred: z.ZodDefault<z.ZodBoolean>;
        visible: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        audioEnabled: boolean;
        blurred: boolean;
        visible: boolean;
    }, {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        };
        audioEnabled?: boolean | undefined;
        blurred?: boolean | undefined;
        visible?: boolean | undefined;
    }>, "many">;
    isPublic: z.ZodDefault<z.ZodBoolean>;
    createdBy: z.ZodString;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    gridCols: number;
    gridRows: number;
    views: {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        audioEnabled: boolean;
        blurred: boolean;
        visible: boolean;
    }[];
    isPublic: boolean;
    createdBy: string;
    description?: string | undefined;
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    views: {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        };
        audioEnabled?: boolean | undefined;
        blurred?: boolean | undefined;
        visible?: boolean | undefined;
    }[];
    createdBy: string;
    description?: string | undefined;
    gridCols?: number | undefined;
    gridRows?: number | undefined;
    isPublic?: boolean | undefined;
}>;
export type Session = z.infer<typeof SessionSchema>;
export declare const UserRole: z.ZodEnum<["viewer", "editor", "admin"]>;
export type UserRole = z.infer<typeof UserRole>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    username: z.ZodString;
    email: z.ZodString;
    role: z.ZodEnum<["viewer", "editor", "admin"]>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
    role: "viewer" | "editor" | "admin";
}, {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    username: string;
    email: string;
    role: "viewer" | "editor" | "admin";
}>;
export type User = z.infer<typeof UserSchema>;
export declare const DataSourceTypeSchema: z.ZodEnum<["json_api", "toml_file", "manual"]>;
export type DataSourceType = z.infer<typeof DataSourceTypeSchema>;
export declare const DataSourceSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["json_api", "toml_file", "manual"]>;
    url: z.ZodOptional<z.ZodString>;
    filePath: z.ZodOptional<z.ZodString>;
    refreshInterval: z.ZodDefault<z.ZodNumber>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    lastSync: z.ZodOptional<z.ZodDate>;
    createdAt: z.ZodDate;
    updatedAt: z.ZodDate;
}, "strip", z.ZodTypeAny, {
    type: "json_api" | "toml_file" | "manual";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    refreshInterval: number;
    enabled: boolean;
    url?: string | undefined;
    filePath?: string | undefined;
    lastSync?: Date | undefined;
}, {
    type: "json_api" | "toml_file" | "manual";
    id: string;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url?: string | undefined;
    filePath?: string | undefined;
    refreshInterval?: number | undefined;
    enabled?: boolean | undefined;
    lastSync?: Date | undefined;
}>;
export type DataSource = z.infer<typeof DataSourceSchema>;
export declare const StreamEventSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    type: z.ZodLiteral<"stream_added">;
    stream: z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        platform: z.ZodEnum<["youtube", "twitch", "facebook", "instagram", "generic", "hls", "rtmp"]>;
        thumbnail: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        isLive: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        isLive: boolean;
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        isLive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "stream_added";
    stream: {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        isLive: boolean;
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
}, {
    type: "stream_added";
    stream: {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        isLive?: boolean | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"stream_updated">;
    stream: z.ZodObject<{
        id: z.ZodString;
        url: z.ZodString;
        title: z.ZodString;
        platform: z.ZodEnum<["youtube", "twitch", "facebook", "instagram", "generic", "hls", "rtmp"]>;
        thumbnail: z.ZodOptional<z.ZodString>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        isLive: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        isLive: boolean;
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        isLive?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "stream_updated";
    stream: {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        isLive: boolean;
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
    };
}, {
    type: "stream_updated";
    stream: {
        id: string;
        url: string;
        title: string;
        platform: "youtube" | "twitch" | "facebook" | "instagram" | "generic" | "hls" | "rtmp";
        createdAt: Date;
        updatedAt: Date;
        thumbnail?: string | undefined;
        metadata?: Record<string, unknown> | undefined;
        isLive?: boolean | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"stream_removed">;
    streamId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "stream_removed";
    streamId: string;
}, {
    type: "stream_removed";
    streamId: string;
}>, z.ZodObject<{
    type: z.ZodLiteral<"view_updated">;
    sessionId: z.ZodString;
    view: z.ZodObject<{
        id: z.ZodString;
        streamId: z.ZodNullable<z.ZodString>;
        position: z.ZodObject<{
            x: z.ZodNumber;
            y: z.ZodNumber;
            width: z.ZodDefault<z.ZodNumber>;
            height: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            x: number;
            y: number;
            width: number;
            height: number;
        }, {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        }>;
        audioEnabled: z.ZodDefault<z.ZodBoolean>;
        blurred: z.ZodDefault<z.ZodBoolean>;
        visible: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        audioEnabled: boolean;
        blurred: boolean;
        visible: boolean;
    }, {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        };
        audioEnabled?: boolean | undefined;
        blurred?: boolean | undefined;
        visible?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "view_updated";
    sessionId: string;
    view: {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width: number;
            height: number;
        };
        audioEnabled: boolean;
        blurred: boolean;
        visible: boolean;
    };
}, {
    type: "view_updated";
    sessionId: string;
    view: {
        id: string;
        streamId: string | null;
        position: {
            x: number;
            y: number;
            width?: number | undefined;
            height?: number | undefined;
        };
        audioEnabled?: boolean | undefined;
        blurred?: boolean | undefined;
        visible?: boolean | undefined;
    };
}>, z.ZodObject<{
    type: z.ZodLiteral<"session_updated">;
    session: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        gridCols: z.ZodDefault<z.ZodNumber>;
        gridRows: z.ZodDefault<z.ZodNumber>;
        views: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            streamId: z.ZodNullable<z.ZodString>;
            position: z.ZodObject<{
                x: z.ZodNumber;
                y: z.ZodNumber;
                width: z.ZodDefault<z.ZodNumber>;
                height: z.ZodDefault<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                x: number;
                y: number;
                width: number;
                height: number;
            }, {
                x: number;
                y: number;
                width?: number | undefined;
                height?: number | undefined;
            }>;
            audioEnabled: z.ZodDefault<z.ZodBoolean>;
            blurred: z.ZodDefault<z.ZodBoolean>;
            visible: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            audioEnabled: boolean;
            blurred: boolean;
            visible: boolean;
        }, {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width?: number | undefined;
                height?: number | undefined;
            };
            audioEnabled?: boolean | undefined;
            blurred?: boolean | undefined;
            visible?: boolean | undefined;
        }>, "many">;
        isPublic: z.ZodDefault<z.ZodBoolean>;
        createdBy: z.ZodString;
        createdAt: z.ZodDate;
        updatedAt: z.ZodDate;
    }, "strip", z.ZodTypeAny, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        gridCols: number;
        gridRows: number;
        views: {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            audioEnabled: boolean;
            blurred: boolean;
            visible: boolean;
        }[];
        isPublic: boolean;
        createdBy: string;
        description?: string | undefined;
    }, {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        views: {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width?: number | undefined;
                height?: number | undefined;
            };
            audioEnabled?: boolean | undefined;
            blurred?: boolean | undefined;
            visible?: boolean | undefined;
        }[];
        createdBy: string;
        description?: string | undefined;
        gridCols?: number | undefined;
        gridRows?: number | undefined;
        isPublic?: boolean | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    type: "session_updated";
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        gridCols: number;
        gridRows: number;
        views: {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width: number;
                height: number;
            };
            audioEnabled: boolean;
            blurred: boolean;
            visible: boolean;
        }[];
        isPublic: boolean;
        createdBy: string;
        description?: string | undefined;
    };
}, {
    type: "session_updated";
    session: {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        views: {
            id: string;
            streamId: string | null;
            position: {
                x: number;
                y: number;
                width?: number | undefined;
                height?: number | undefined;
            };
            audioEnabled?: boolean | undefined;
            blurred?: boolean | undefined;
            visible?: boolean | undefined;
        }[];
        createdBy: string;
        description?: string | undefined;
        gridCols?: number | undefined;
        gridRows?: number | undefined;
        isPublic?: boolean | undefined;
    };
}>]>;
export type StreamEvent = z.infer<typeof StreamEventSchema>;
export declare const PaginationSchema: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
    total: z.ZodNumber;
    totalPages: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}, {
    total: number;
    totalPages: number;
    page?: number | undefined;
    limit?: number | undefined;
}>;
export type Pagination = z.infer<typeof PaginationSchema>;
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
export interface StreamList extends Array<StreamData> {
}
export interface ViewContentMap {
    [key: string]: {
        content: ViewContent;
        spaces: number[];
    };
}
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
export declare class StreamwallError extends Error {
    code: string;
    statusCode: number;
    constructor(message: string, code: string, statusCode?: number);
}
export declare function createStreamId(): string;
export declare function createSessionId(): string;
export declare function createViewId(): string;
export declare function detectStreamPlatform(url: string): StreamPlatform;
