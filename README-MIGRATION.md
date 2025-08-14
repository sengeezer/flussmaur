# Streamwall - Phase 1 Complete

## Architecture Overview

This is the new modern web-based architecture for Streamwall, replacing the Electron desktop application:

```
packages/
├── streamwall-shared/     # Shared types and utilities
├── streamwall-api/        # Node.js GraphQL API backend  
└── streamwall-web/        # Next.js frontend application
```

## Technology Stack

### Backend (streamwall-api)
- **Framework**: Node.js with Apollo Server v4
- **API**: GraphQL with subscriptions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth

### Frontend (streamwall-web)  
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client + Zustand
- **UI Components**: Headless UI + Hero Icons

### Shared (streamwall-shared)
- **Validation**: Zod schemas
- **Types**: TypeScript interfaces
- **Utilities**: Platform detection, ID generation

## Database Schema

The new schema supports:
- **Users**: Authentication and role-based access control
- **Streams**: Multi-platform stream management
- **Sessions**: Collaborative stream grid layouts  
- **Views**: Individual stream positions in grid
- **Data Sources**: External stream data integration

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up database**:
   ```bash
   # Copy environment file
   cp packages/streamwall-api/.env.example packages/streamwall-api/.env
   
   # Edit DATABASE_URL in .env file
   # Run migrations
   npm run migrate
   ```

3. **Start development servers**:
   ```bash
   # Start API server (GraphQL)
   npm run dev:api
   
   # Start web server (Next.js) 
   npm run dev:web
   ```

## Key Changes from Electron Version

### ✅ Completed in Phase 1
- [x] Monorepo setup with workspaces
- [x] Shared type definitions with Zod validation
- [x] GraphQL API foundation with Apollo Server
- [x] Database schema design with Prisma
- [x] Next.js frontend foundation with Tailwind CSS
- [x] Basic project structure and build system

### 🔄 Removed/Replaced
- ❌ Electron desktop application → ✅ Web-based Next.js app
- ❌ Twitch-specific IRC bot → ✅ Generic platform support
- ❌ Local file-based storage → ✅ PostgreSQL database
- ❌ Direct video rendering → ✅ Platform embed APIs

## Next Steps (Remaining Phases)

See the migration plan for the complete roadmap:

- **Phase 2**: Core Stream Management
- **Phase 3**: Real-time Collaboration  
- **Phase 4**: Platform Integration Replacement
- **Phase 5**: User Interface Migration
- **Phase 6**: Advanced Features
- **Phase 7**: Deployment & DevOps

## Running the Application

Currently the foundation is set up. To run:

```bash
# Install all dependencies
npm install

# Start the API server
npm run dev:api

# Start the web interface  
npm run dev:web
```

The API will be available at `http://localhost:4000/graphql`
The web interface will be available at `http://localhost:3000`
