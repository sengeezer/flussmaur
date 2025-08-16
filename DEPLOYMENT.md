# Deployment Guide

## Vercel Deployment

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
   DATABASE_URL=postgresql://username:password@your-db-host:5432/flussmaur
   NEXTAUTH_SECRET=your-random-secret-key-here
   NEXTAUTH_URL=https://your-app.vercel.app
   ```

4. **Set up Database**
   - Use Vercel Postgres, Supabase, or any PostgreSQL provider
   - Copy the connection string to `DATABASE_URL`

5. **Deploy**
   - Vercel will automatically deploy when you push to the main branch
   - The build command is automatically configured in `vercel.json`

### Environment Variables Explained

- **DATABASE_URL**: PostgreSQL connection string for your database
- **NEXTAUTH_SECRET**: Random string for JWT token signing (generate with `openssl rand -base64 32`)
- **NEXTAUTH_URL**: Your app's URL (automatically set by Vercel in production)

### Database Setup

After deployment, you'll need to run database migrations:

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Run migrations: `vercel exec -- npm run migrate`

Or use the Vercel dashboard to run a one-time command: `npm run migrate`

## Other Deployment Options

### Docker
A Dockerfile can be added for containerized deployments.

### Railway
Similar to Vercel, Railway supports Next.js deployments with PostgreSQL.

### Netlify
For static deployments, though some server features may be limited.
