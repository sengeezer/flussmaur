import { PrismaClient, Stream } from '@prisma/client';
import { StreamData, DataSourceType } from 'streamwall-shared';
import * as TOML from '@iarna/toml';
import { promises as fs } from 'fs';
import fetch from 'node-fetch';
import chokidar from 'chokidar';
import { EventEmitter } from 'events';

export interface DataSourceConfig {
  id: string;
  name: string;
  type: DataSourceType;
  url?: string;
  filePath?: string;
  refreshInterval: number;
  enabled: boolean;
}

export class StreamService extends EventEmitter {
  private prisma: PrismaClient;
  private watchers: Map<string, chokidar.FSWatcher> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  constructor(prisma: PrismaClient) {
    super();
    this.prisma = prisma;
  }

  async startDataSource(config: DataSourceConfig): Promise<void> {
    if (!config.enabled) {
      return;
    }

    await this.stopDataSource(config.id);

    switch (config.type) {
      case 'toml_file':
        if (config.filePath) {
          await this.startFileWatcher(config);
        }
        break;
      case 'json_api':
        if (config.url) {
          await this.startAPIPoller(config);
        }
        break;
      case 'manual':
        // Manual data sources don't need background processing
        break;
    }
  }

  async stopDataSource(id: string): Promise<void> {
    // Stop file watcher
    const watcher = this.watchers.get(id);
    if (watcher) {
      await watcher.close();
      this.watchers.delete(id);
    }

    // Stop API poller
    const interval = this.intervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(id);
    }
  }

  private async startFileWatcher(config: DataSourceConfig): Promise<void> {
    if (!config.filePath) return;

    const watcher = chokidar.watch(config.filePath);
    this.watchers.set(config.id, watcher);

    const loadFile = async () => {
      try {
        const text = await fs.readFile(config.filePath!, 'utf8');
        const data = TOML.parse(text);
        const streams = (data as any).streams || [];
        await this.processStreams(config.id, streams);
      } catch (error) {
        console.warn(`Error reading data file ${config.filePath}:`, error);
        this.emit('error', { dataSourceId: config.id, error });
      }
    };

    // Initial load
    await loadFile();

    // Watch for changes
    watcher.on('change', loadFile);
  }

  private async startAPIPoller(config: DataSourceConfig): Promise<void> {
    if (!config.url) return;

    const poll = async () => {
      try {
        const response = await fetch(config.url!);
        const streams = await response.json() as any[];
        await this.processStreams(config.id, streams);
      } catch (error) {
        console.warn(`Error polling API ${config.url}:`, error);
        this.emit('error', { dataSourceId: config.id, error });
      }
    };

    // Initial poll
    await poll();

    // Set up polling interval
    const interval = setInterval(poll, config.refreshInterval * 1000);
    this.intervals.set(config.id, interval);
  }

  private async processStreams(dataSourceId: string, rawStreams: any[]): Promise<void> {
    const streams: StreamData[] = [];

    for (const rawStream of rawStreams) {
      try {
        const stream = this.normalizeStreamData(rawStream, dataSourceId);
        if (stream) {
          streams.push(stream);
        }
      } catch (error) {
        console.warn('Error processing stream:', rawStream, error);
      }
    }

    await this.updateStreamsInDatabase(dataSourceId, streams);
    this.emit('streamsUpdated', { dataSourceId, streams });
  }

  private normalizeStreamData(rawStream: any, dataSourceId: string): StreamData | null {
    try {
      // Handle different formats from various sources
      const url = rawStream.url || rawStream.link || rawStream.src;
      const title = rawStream.title || rawStream.label || rawStream.name || 'Untitled Stream';
      
      if (!url) {
        console.warn('Stream missing URL:', rawStream);
        return null;
      }

      const platform = this.detectPlatform(url);
      
      return {
        id: this.generateStreamId(url, title),
        url,
        title,
        platform,
        thumbnail: rawStream.thumbnail || rawStream.thumb,
        metadata: {
          dataSource: dataSourceId,
          originalData: rawStream,
        },
        isLive: rawStream.isLive ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.warn('Error normalizing stream data:', error);
      return null;
    }
  }

  private detectPlatform(url: string): StreamData['platform'] {
    try {
      const parsedUrl = new URL(url);
      const host = parsedUrl.hostname.toLowerCase().replace('www.', '');

      if (host.includes('youtube.com') || host.includes('youtu.be')) {
        return 'youtube';
      } else if (host.includes('twitch.tv')) {
        return 'twitch';
      } else if (host.includes('facebook.com')) {
        return 'facebook';
      } else if (host.includes('instagram.com')) {
        return 'instagram';
      } else if (url.includes('.m3u8') || url.includes('hls')) {
        return 'hls';
      } else if (url.includes('rtmp://')) {
        return 'rtmp';
      } else {
        return 'generic';
      }
    } catch {
      return 'generic';
    }
  }

  private mapPlatformToPrisma(platform: StreamData['platform']): string {
    const mapping: Record<StreamData['platform'], string> = {
      'youtube': 'YOUTUBE',
      'twitch': 'TWITCH',
      'facebook': 'FACEBOOK',
      'instagram': 'INSTAGRAM',
      'generic': 'GENERIC',
      'hls': 'HLS',
      'rtmp': 'RTMP',
    };
    return mapping[platform];
  }

  private mapPlatformFromPrisma(platform: string): StreamData['platform'] {
    const mapping: Record<string, StreamData['platform']> = {
      'YOUTUBE': 'youtube',
      'TWITCH': 'twitch',
      'FACEBOOK': 'facebook',
      'INSTAGRAM': 'instagram',
      'GENERIC': 'generic',
      'HLS': 'hls',
      'RTMP': 'rtmp',
    };
    return mapping[platform] || 'generic';
  }

  private generateStreamId(url: string, title: string): string {
    // Generate a consistent ID based on URL and title
    const base = (title || url).toLowerCase()
      .replace(/[^\w]/g, '')
      .replace(/^the|^https?(www)?/, '')
      .substring(0, 8);
    
    const timestamp = Date.now().toString(36);
    return `${base}_${timestamp}`;
  }

  private async updateStreamsInDatabase(dataSourceId: string, streams: StreamData[]): Promise<void> {
    // Remove existing streams from this data source
    await this.prisma.stream.deleteMany({
      where: {
        metadata: {
          path: ['dataSource'],
          equals: dataSourceId
        }
      }
    });

    // Add new streams
    for (const stream of streams) {
      await this.prisma.stream.upsert({
        where: { id: stream.id },
        update: {
          url: stream.url,
          title: stream.title,
          platform: this.mapPlatformToPrisma(stream.platform) as any,
          thumbnail: stream.thumbnail,
          metadata: stream.metadata as any,
          isLive: stream.isLive,
          updatedAt: new Date(),
        },
        create: {
          id: stream.id,
          url: stream.url,
          title: stream.title,
          platform: this.mapPlatformToPrisma(stream.platform) as any,
          thumbnail: stream.thumbnail,
          metadata: stream.metadata as any,
          isLive: stream.isLive,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
  }

  async getStreams(): Promise<StreamData[]> {
    const streams = await this.prisma.stream.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return streams.map((stream: Stream) => ({
      id: stream.id,
      url: stream.url,
      title: stream.title,
      platform: this.mapPlatformFromPrisma(stream.platform),
      thumbnail: stream.thumbnail || undefined,
      metadata: stream.metadata as any,
      isLive: stream.isLive,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    }));
  }

  async addManualStream(streamData: Omit<StreamData, 'id' | 'createdAt' | 'updatedAt'>): Promise<StreamData> {
    const id = this.generateStreamId(streamData.url, streamData.title);
    const platform = streamData.platform || this.detectPlatform(streamData.url);

    const stream = await this.prisma.stream.create({
      data: {
        id,
        url: streamData.url,
        title: streamData.title,
        platform: this.mapPlatformToPrisma(platform) as any,
        thumbnail: streamData.thumbnail,
        metadata: streamData.metadata as any,
        isLive: streamData.isLive,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return {
      id: stream.id,
      url: stream.url,
      title: stream.title,
      platform: this.mapPlatformFromPrisma(stream.platform),
      thumbnail: stream.thumbnail || undefined,
      metadata: stream.metadata as any,
      isLive: stream.isLive,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    };
  }

  async removeStream(id: string): Promise<boolean> {
    try {
      await this.prisma.stream.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  async cleanup(): Promise<void> {
    // Stop all watchers and intervals
    for (const [id] of this.watchers) {
      await this.stopDataSource(id);
    }
  }
}
