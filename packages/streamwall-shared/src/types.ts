// Additional type definitions and legacy compatibility types
import { StreamData, ViewState } from './index';

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
