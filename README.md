# Flussmaur

:construction: Early WIP release! :construction:

Flussmaur (formerly Streamwall) makes it easy to compose multiple livestreams into a mosaic, with source attributions and audio control. This is a modern Next.js-based version with real-time collaboration features.

![Screenshot of Flussmaur displaying a grid of streams](screenshot.png)

## Modern Architecture

This version of Flussmaur is built with:
- **Next.js 15** - Modern React framework with App Router
- **GraphQL API** - Powered by Apollo Server and Prisma
- **Real-time Collaboration** - WebSocket-based shared sessions
- **Vercel Deployment** - Optimized for serverless deployment

## Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sengeezer/flussmaur)

## Development Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/sengeezer/flussmaur.git
   cd flussmaur
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the database:
   ```bash
   cd packages/streamwall-api
   npx prisma migrate dev
   ```

4. Start the development servers:
   ```bash
   # From the root directory
   npm run dev
   ```

This will start:
- Next.js web app on http://localhost:3000
- GraphQL API on http://localhost:4000

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set up a PostgreSQL database (Vercel Postgres recommended)
3. Configure environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for authentication
   - `NEXTAUTH_URL` - Your deployment URL

### Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/flussmaur"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

## Architecture

- **`packages/streamwall-web`** - Next.js frontend application
- **`packages/streamwall-api`** - GraphQL API with Prisma ORM
- **`packages/streamwall-shared`** - Shared TypeScript types

## Troubleshooting

### Environment Variables Not Loading

Make sure your `.env.local` file is in the root directory and contains all required variables.

### Database Connection Issues

Ensure your `DATABASE_URL` is correct and the database is accessible. For Vercel deployments, use Vercel Postgres or another cloud database provider.

### Build Errors on Vercel

Check that all dependencies are properly installed and environment variables are configured in your Vercel dashboard.

## Legacy Electron Version

The original Electron-based version is available in the `electron-legacy` branch. The modern web-based version provides better performance and deployment options.

## Credits

Original Streamwall by chromakode
SVG Icons are from Font Awesome by Dave Gandy - http://fontawesome.io
