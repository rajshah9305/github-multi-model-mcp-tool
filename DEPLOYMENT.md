# Deployment Guide - GitHub MCP Frontend

This guide covers deploying the GitHub MCP Frontend to Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository with the code pushed
- Environment variables ready (see below)

## Environment Variables Required

Before deploying to Vercel, you'll need to set these environment variables:

### Database
- `DATABASE_URL` - MySQL connection string (e.g., `mysql://user:password@host:port/database`)

### Authentication
- `JWT_SECRET` - Secret key for session signing (generate a strong random string)

### Optional
- `VITE_APP_TITLE` - Application title (default: "GitHub MCP Frontend")
- `VITE_APP_LOGO` - Logo URL

## Deployment Steps

### Option 1: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel --prod

# Follow the prompts to:
# 1. Link to existing project or create new
# 2. Confirm project settings
# 3. Add environment variables when prompted
```

### Option 2: Deploy via GitHub Integration

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose the github-multi-model-mcp-tool repository
4. Configure project settings:
   - **Framework**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
5. Add environment variables in "Environment Variables" section
6. Click "Deploy"

### Option 3: Deploy via Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import from Git
4. Select your repository
5. Configure environment variables
6. Deploy

## Post-Deployment Configuration

### 1. Database Connection

Ensure your MySQL database is:
- Accessible from Vercel's servers
- Properly configured with the DATABASE_URL
- Has all required tables (run migrations if needed)

### 3. Verify Deployment

```bash
# Check deployment status
vercel --prod status

# View logs
vercel logs --prod

# Test the application
curl https://your-app.vercel.app/api/health
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | MySQL connection | `mysql://user:pass@host/db` |
| `JWT_SECRET` | Session signing | `your-secret-key-here` |

## Troubleshooting

### Build Fails

**Error**: `pnpm not found`
- Solution: Ensure `pnpm` is in package.json as a dependency or use `npm install -g pnpm`

**Error**: `Database connection failed`
- Solution: Verify DATABASE_URL is correct and database is accessible from Vercel

### Runtime Errors

**Error**: `Cannot find module`
- Solution: Ensure all dependencies are in package.json, run `pnpm install` locally first

**Error**: `Environment variable not found`
- Solution: Check Vercel dashboard Environment Variables section, ensure all required vars are set

**Error**: `Database query timeout`
- Solution: Increase Vercel function timeout in vercel.json (currently set to 60 seconds)

### Performance Issues

**Slow initial load**
- Check database query performance
- Verify network connectivity to database
- Consider adding caching headers

**High memory usage**
- Monitor function memory in Vercel dashboard
- Optimize database queries
- Consider increasing memory allocation in vercel.json

## Monitoring & Logs

### View Logs

```bash
# Real-time logs
vercel logs --prod --follow

# Last 100 lines
vercel logs --prod -n 100

# Filter by source
vercel logs --prod --source=stdout
```

### Performance Monitoring

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. Monitor:
   - Response times
   - Error rates
   - Request volume

### Error Tracking

Enable error tracking in Vercel:
1. Dashboard → Project → Settings
2. Enable "Error Tracking"
3. View errors in Analytics tab

## Scaling & Optimization

### Database Optimization

- Add indexes to frequently queried columns
- Optimize queries using EXPLAIN
- Consider connection pooling

### Function Optimization

- Reduce bundle size
- Implement caching strategies
- Use serverless database connections

### CDN & Caching

- Static assets cached for 1 year (immutable)
- API responses not cached (no-cache headers)
- Consider adding Redis for session caching

## Rollback

To rollback to a previous deployment:

```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>
```

## Custom Domain

1. Go to Vercel Dashboard → Project → Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update OAuth redirect URIs with new domain

## SSL/TLS

Vercel automatically provides SSL certificates for:
- `*.vercel.app` domains
- Custom domains (auto-renewed)

No additional configuration needed.

## Support & Resources

- Vercel Docs: https://vercel.com/docs
- Vercel Status: https://www.vercel-status.com
- GitHub Issues: Report issues in the repository

## Next Steps

After successful deployment:

1. Test all features (credentials, repository browsing, file operations)
2. Monitor logs for any errors
3. Set up automated backups for database
4. Configure monitoring and alerting
5. Plan for scaling if needed
