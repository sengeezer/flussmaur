# Deployment Guide

## Architecture

Flussmaur consists of two main components:
- **Frontend**: Next.js web application (deployable to Vercel)
- **Backend**: GraphQL API with Prisma (deployable to Railway, Heroku, etc.)

## Frontend Deployment (Vercel)

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/sengeezer/flussmaur)

### Manual Deployment

1. **Fork or clone this repository**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the root directory as the project root

3. **Configure Environment Variables**
   In your Vercel dashboard, add these environment variables:
   
   ```
   NEXT_PUBLIC_GRAPHQL_URI=https://your-api-domain.com/graphql
   ```

4. **Deploy**
   - Vercel will automatically deploy when you push to the main branch
   - The build command is configured in `vercel.json`

## Backend Deployment (GraphQL API)

### Railway (Recommended)

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Connect your GitHub repository
   - Select the `packages/streamwall-api` directory as the root

2. **Add PostgreSQL Database**
   - In Railway, add a PostgreSQL service
   - Copy the connection string

3. **Configure Environment Variables**
   ```
   DATABASE_URL=postgresql://username:password@your-db-host:5432/flussmaur
   NODE_ENV=production
   PORT=4000
   ```

4. **Set Build Configuration**
   - Build Command: `npm run build`
   - Start Command: `npm start`

### Alternative: Heroku

1. **Create Heroku App**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   ```

2. **Deploy**
   ```bash
   git subtree push --prefix packages/streamwall-api heroku main
   ```

## Environment Variables Explained

### Frontend (Vercel)
- **NEXT_PUBLIC_GRAPHQL_URI**: URL to your deployed GraphQL API

### Backend (Railway/Heroku)
- **DATABASE_URL**: PostgreSQL connection string
- **NODE_ENV**: Set to "production" for production deployments
- **PORT**: Port for the server (usually set automatically by the platform)

## Database Setup

After deploying the backend, run database migrations:

### Railway
Use the Railway CLI or web console to run: `npm run migrate`

### Heroku  
```bash
heroku run npm run migrate --app your-app-name
```

## Full Deployment Process

1. **Deploy Backend First**
   - Deploy the GraphQL API to Railway/Heroku
   - Set up PostgreSQL database
   - Run migrations
   - Get the API URL

2. **Deploy Frontend**
   - Deploy to Vercel
   - Set `NEXT_PUBLIC_GRAPHQL_URI` to your API URL
   - Test the connection

## Local Development

For local development with production APIs:

```bash
# Frontend only (connecting to production API)
npm run dev:web

# Full stack development
npm run dev
```
