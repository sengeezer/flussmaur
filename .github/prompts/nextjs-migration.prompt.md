## Streamwall Migration Plan: From Electron to NextJS + NodeJS + GraphQL

### Current Architecture Analysis

The current Streamwall application is an **Electron-based desktop application** with the following key components:

1. **Electron Main Process** (`src/main/`):
   - StreamWindow.ts - Manages multiple video stream views in a grid layout
   - ControlWindow.ts - Provides web-based control interface
   - TwitchBot.ts - IRC bot for Twitch chat integration
   - StreamdelayClient.ts - Integration with stream delay service
   - WebSocket server for real-time communication

2. **Frontend** (web, browser):
   - React/Preact-based control UI
   - Real-time state synchronization using Yjs (CRDT)
   - WebSocket communication for live updates

3. **Core Features**:
   - Multi-stream video grid display
   - Audio switching between streams
   - Stream data from JSON APIs and TOML files
   - Real-time collaborative state management
   - Stream overlay and background layers
   - Twitch chat bot integration with voting
   - Authentication and role-based access

### Proposed New Architecture

**Target Stack:**
- **Backend**: Node.js server with GraphQL API
- **Frontend**: Next.js 14+ with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: GraphQL Subscriptions + WebSockets
- **Authentication**: NextAuth.js
- **Deployment**: Docker containers

### Migration Prompt

```markdown
# Streamwall NextJS Migration Implementation Plan

## Phase 1: Foundation Setup
Create a new NextJS application with the following structure:

### 1.1 Initialize Project Structure
- Create `packages/streamwall-web/` for NextJS frontend
- Create `packages/streamwall-api/` for Node.js GraphQL backend  
- Create `packages/streamwall-shared/` for shared types and utilities
- Set up monorepo structure with proper workspace configuration

### 1.2 Backend GraphQL API Setup
- Initialize Node.js server with Apollo Server
- Set up PostgreSQL database with Prisma ORM
- Create GraphQL schema for:
  - Streams (id, url, title, platform, metadata)
  - Views (position, content, state, audio settings)
  - Sessions (collaborative editing state)
  - Users (authentication, roles, permissions)
- Implement GraphQL subscriptions for real-time updates
- Set up WebSocket server for live stream state synchronization

### 1.3 Database Schema Design
```sql
-- Core tables needed:
- streams (id, url, title, platform, metadata, created_at, updated_at)
- stream_sessions (id, name, grid_config, created_by, created_at)
- session_views (session_id, position_x, position_y, stream_id, audio_enabled, blurred)
- users (id, username, email, role, created_at)
- stream_data_sources (id, type, url, refresh_interval, enabled)
```

## Phase 2: Core Stream Management

### 2.1 Stream Data Sources
- Migrate stream data loading from TOML/JSON to GraphQL
- Create data source management system:
  - JSON API polling (replace current `pollDataURL`)
  - TOML file watching (replace current `watchDataFile`) 
  - Manual stream addition/editing
- Implement stream metadata enrichment and validation

### 2.2 Grid Layout System
- Create responsive CSS Grid layout for stream display
- Implement drag-and-drop stream positioning
- Add stream view management (show/hide, resize, swap positions)
- Build audio control system (single stream audio at a time)

### 2.3 Stream Rendering
- Replace Electron WebContentsView with iframe-based stream embedding
- Implement stream platform detection and appropriate embed logic:
  - YouTube: YouTube embed API
  - Twitch: Twitch embed API  
  - Direct video URLs: HTML5 video player with HLS.js
  - Generic web pages: iframe embedding
- Add stream overlay and blur effects using CSS

## Phase 3: Real-time Collaboration

### 3.1 State Synchronization
- Replace Yjs CRDT with GraphQL subscriptions
- Implement real-time view state updates
- Add collaborative cursor/selection indicators
- Build conflict resolution for simultaneous edits

### 3.2 Authentication & Authorization
- Set up NextAuth.js with multiple providers
- Implement role-based access control:
  - Viewer: read-only access
  - Editor: can modify streams and layout
  - Admin: full control including data sources
- Add session sharing and invite links

## Phase 4: Platform Integration Replacement

### 4.1 Remove Twitch-specific Features
- Remove TwitchBot.ts and IRC integration
- Remove Twitch chat voting system
- Remove Twitch-specific configuration options
- Create generic webhook/API system for external integrations

### 4.2 Generic Streaming Platform Support
- Build platform-agnostic stream detection
- Add support for major platforms without tight coupling:
  - YouTube Live
  - Twitch (view-only, no chat integration)
  - Facebook Live
  - Instagram Live
  - Generic RTMP/HLS streams
- Implement fallback iframe embedding for unsupported platforms

## Phase 5: User Interface Migration

### 5.1 Control Interface (NextJS Frontend)
- Recreate control UI using Next.js and React
- Implement responsive design for mobile/tablet control
- Add stream library/favorites management
- Build session management interface
- Create user dashboard and settings

### 5.2 Stream Display Interface
- Create full-screen stream grid view
- Implement picture-in-picture mode
- Add stream information overlays
- Build responsive breakpoints for different screen sizes

## Phase 6: Advanced Features

### 6.1 Stream Analytics
- Add view time tracking
- Implement stream popularity metrics
- Create usage dashboards
- Build stream health monitoring

### 6.2 Enhanced Collaboration
- Add chat/comments system for sessions
- Implement session recording/playback
- Create template/preset management
- Build public session sharing

## Phase 7: Deployment & DevOps

### 7.1 Containerization
- Create Docker containers for frontend and backend
- Set up docker-compose for local development
- Build production deployment configurations

### 7.2 Cloud Deployment
- Set up CI/CD pipelines
- Configure production database
- Implement monitoring and logging
- Add error tracking and performance monitoring

## Implementation Guidelines

### Technology Choices:
- **Frontend**: Next.js 14+ with App Router, TypeScript, Tailwind CSS
- **Backend**: Node.js, Apollo Server, GraphQL, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Real-time**: GraphQL Subscriptions + ws WebSocket library
- **Authentication**: NextAuth.js
- **State Management**: Zustand or React Context
- **Testing**: Jest, React Testing Library, Playwright

### Migration Strategy:
1. Build new system alongside existing Electron app
2. Migrate core functionality incrementally  
3. Preserve data export/import capabilities
4. Maintain backward compatibility for configuration files
5. Provide migration tools for existing users

### Key Requirements:
- Remove all Electron dependencies
- Remove Twitch-specific integrations
- Maintain grid-based stream layout functionality
- Preserve real-time collaboration features
- Support multiple stream platforms generically
- Implement web-based responsive UI
- Add proper authentication and user management
- Support both local and cloud deployment
```

This migration plan transforms Streamwall from a desktop Electron application with tight Twitch integration into a modern, web-based streaming platform that supports multiple platforms generically while maintaining the core collaborative stream viewing functionality.

Would you like me to proceed with implementing any specific phase of this migration plan?This migration plan transforms Streamwall from a desktop Electron application with tight Twitch integration into a modern, web-based streaming platform that supports multiple platforms generically while maintaining the core collaborative stream viewing functionality.

Would you like me to proceed with implementing any specific phase of this migration plan?