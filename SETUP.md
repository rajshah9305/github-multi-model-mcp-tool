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

## Development

- `pnpm dev` - Frontend only (port 5173)
- `pnpm dev:server` - Backend only (port 8787)
- `pnpm dev:full` - Both frontend and backend
- `pnpm typecheck` - Type checking
- `pnpm build` - Production build

## Features Working

✅ **UI Components** - All styled with Tailwind CSS
✅ **Database Setup** - Automatic table creation
✅ **GitHub Integration** - Repository browsing, file editing
✅ **AI Code Generation** - OpenAI/Anthropic integration
✅ **Secure Credentials** - AES-256-GCM encryption
✅ **Error Handling** - Proper error messages and logging
✅ **TypeScript** - Full type safety

The application is now fully functional and ready for development!