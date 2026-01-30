# Quick Setup Guide

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MySQL database running locally or remotely

## Quick Start

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL=mysql://username:password@localhost:3306/github_mcp
   JWT_SECRET=your-random-secret-key-min-32-characters
   ```

3. **Set up database:**
   ```bash
   pnpm setup-db
   ```

4. **Start the application:**
   ```bash
   pnpm start
   ```
   
   Or run frontend and backend separately:
   ```bash
   pnpm dev:full
   ```

5. **Configure credentials:**
   - Open http://localhost:5173
   - Go to Settings
   - Add your GitHub Personal Access Token
   - Add your LLM API key (OpenAI, Anthropic, etc.)

## Vercel Deployment

### One-Click Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables:
   - `DATABASE_URL` - Your MySQL connection string (use PlanetScale, Railway, or similar)
   - `JWT_SECRET` - A random 32+ character string for encryption
4. Deploy!

### Environment Variables for Vercel

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Random string (32+ chars) for encryption |
| `NODE_ENV` | No | Set to `production` automatically |

### Recommended Database Providers

- **PlanetScale** - Serverless MySQL, generous free tier
- **Railway** - Easy MySQL setup with free tier
- **Neon** - PostgreSQL (requires schema changes)
- **Supabase** - PostgreSQL (requires schema changes)

## Troubleshooting

### Database Issues
- Make sure MySQL is running
- Check DATABASE_URL format: `mysql://user:password@host:port/database`
- Run `pnpm setup-db` to create tables

### GitHub PAT Issues
- Go to GitHub Settings → Developer settings → Personal access tokens
- Create token with `repo` scope
- Copy and paste in Settings page

### LLM API Issues
- For OpenAI: Get API key from https://platform.openai.com/api-keys
- For Anthropic: Get API key from https://console.anthropic.com
- Make sure you have sufficient API credits

### Vercel Deployment Issues
- Ensure all environment variables are set
- Check Vercel function logs for errors
- Verify database is accessible from Vercel's network

## Development

- `pnpm dev` - Frontend only (port 5173)
- `pnpm dev:server` - Backend only (port 8787)
- `pnpm dev:full` - Both frontend and backend
- `pnpm typecheck` - Type checking
- `pnpm build` - Production build

## Features

- **Modern Dark UI** - Glassmorphism design with gradient accents
- **Repository Browser** - Browse and navigate GitHub repositories
- **Code Editor** - View and edit files with syntax highlighting
- **AI Code Generation** - Generate code using GPT-4, Claude, or compatible models
- **Secure Credentials** - AES-256-GCM encryption for API keys
- **Responsive Design** - Works on desktop and mobile
- **TypeScript** - Full type safety throughout

The application is production-ready and optimized for Vercel deployment!