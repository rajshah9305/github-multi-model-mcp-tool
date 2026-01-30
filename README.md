# GitHub MCP Frontend - Repository Management & AI Code Generation

A production-ready web application for managing GitHub repositories and generating code using AI. Built with React, TypeScript, tRPC, and AES-256-GCM encryption for secure credential storage.

## Features

### 🔐 Secure Credential Management
- **GitHub Personal Access Token (PAT)** - Securely store and manage GitHub credentials
- **LLM API Keys** - Support for OpenAI, Anthropic, and OpenAI-compatible APIs
- **AES-256-GCM Encryption** - Military-grade encryption for all sensitive credentials
- **Per-User Storage** - Isolated and encrypted credential storage per user

### 📁 Repository Management
- **Repository Browser** - Browse all GitHub repositories with search functionality
- **Branch Selection** - Switch between branches for operations
- **File Navigation** - Explore repository structure and view file contents
- **Real-time Status** - Live feedback for GitHub operations

### 📝 Code Editor
- **Syntax Highlighting** - Beautiful code display with proper formatting
- **File Editing** - Edit files directly with commit message support
- **Read-Only Mode** - View file contents safely
- **Copy to Clipboard** - Quick copy functionality for generated or existing code

### 🤖 AI Code Generation
- **Intelligent Code Generation** - Generate code based on natural language prompts
- **Context Awareness** - AI understands repository and file context
- **Multiple Model Support** - Works with GPT-4, Claude, and other compatible models
- **Streaming Results** - Real-time code generation feedback

### 🎨 Modern User Interface
- **Professional Design** - Dark sidebar navigation with responsive layout
- **Responsive Layout** - Works seamlessly on all screen sizes
- **Smooth Transitions** - Polished micro-interactions
- **Intuitive Navigation** - Easy-to-use dashboard and settings

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- MySQL database
- GitHub Personal Access Token
- LLM API Key (OpenAI, Anthropic, or compatible service)

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and API keys

# Start development server (frontend + backend)
pnpm dev:full

# Or separately:
pnpm dev              # Frontend on http://localhost:5173
pnpm dev:server       # Backend on http://localhost:8787
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Type Checking

```bash
# Run TypeScript compiler
pnpm typecheck
```

## Configuration

### 1. Database Setup

Set `DATABASE_URL` in your `.env`:
```
DATABASE_URL=mysql://user:password@localhost:3306/mcp_db
```

The application automatically creates tables on first run.

### 2. GitHub PAT Setup
- Go to GitHub Settings → Developer settings → Personal access tokens
- Click "Generate new token (classic)"
- Select scope: `repo` (full control of private repositories)
- Copy the token and add to application settings

### 3. LLM API Configuration

#### OpenAI
```
Model: gpt-4o (or gpt-4-turbo, gpt-3.5-turbo)
Base URL: https://api.openai.com/v1
API Key: Get from https://platform.openai.com/api-keys
```

#### Anthropic
```
Model: claude-3-opus (or claude-3-sonnet, claude-3-haiku)
Base URL: https://api.anthropic.com/v1
API Key: Get from https://console.anthropic.com
```

#### Other OpenAI-Compatible APIs
```
Base URL: Your provider's API endpoint
Model: Your model name
API Key: Your provider's API key
```

### 4. Application Settings

1. Launch the application
2. Navigate to Settings
3. Add GitHub PAT
4. Configure LLM API key and model
5. Save and use

## Deployment

### Vercel (Recommended)

1. Push repository to GitHub
2. Connect to Vercel: https://vercel.com
3. Set environment variables:
   - `DATABASE_URL` - Your MySQL database connection
   - `JWT_SECRET` - A random 32+ character string
4. Deploy

The project is pre-configured in `vercel.json` for instant deployment.

### Other Platforms

The application works on any Node.js-compatible platform:
- Railway
- Render
- AWS Lambda
- Azure App Service
- DigitalOcean App Platform
- Heroku (alternative)

Set the required environment variables and deploy.

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: Wouter for client-side navigation
- **State Management**: React Query + tRPC
- **HTTP Client**: tRPC with React Query integration

### Backend (tRPC + Node.js)
- **Framework**: Express with tRPC adapters
- **Database**: MySQL with Drizzle ORM
- **Authentication**: User-based credential storage
- **Encryption**: AES-256-GCM for sensitive data
- **API Integration**: GitHub Octokit, OpenAI SDK

### Database Schema

**Users Table**
- `id` - Primary key
- `openId` - OAuth identifier
- `name` - User name
- `email` - User email
- `role` - User role
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

**Credentials Table**
- `id` - Primary key
- `userId` - Foreign key to users
- `githubPat` - Encrypted GitHub PAT
- `llmApiKey` - Encrypted LLM API key
- `llmModel` - LLM model name
- `llmBaseUrl` - LLM API base URL
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

**Repository Cache Table**
- `id` - Primary key
- `userId` - Foreign key to users
- `repoName` - Full repository name (owner/repo)
- `description` - Repository description
- `defaultBranch` - Default branch name
- `url` - Repository URL
- `lastSyncedAt` - Last sync timestamp

## API Reference

### Credentials
- `credentials.get` - Retrieve user's credentials (masked)
- `credentials.save` - Save or update credentials
- `credentials.hasGitHubPat` - Check if GitHub PAT configured
- `credentials.hasLLMKey` - Check if LLM API key configured

### GitHub Operations
- `github.listRepositories` - List all user repositories
- `github.getRepository` - Get repository details
- `github.listBranches` - List repository branches
- `github.getFileContent` - Read file contents
- `github.listDirectory` - List directory contents
- `github.createFile` - Create new file with commit
- `github.updateFile` - Update existing file with commit
- `github.deleteFile` - Delete file with commit

### AI Code Generation
- `ai.generateCode` - Generate code from prompt with context
- `ai.getConfig` - Get LLM configuration

## Security

### Best Practices

1. **Never commit credentials** - Use `.env` and `.gitignore`
2. **Use strong secrets** - Generate random JWT_SECRET (32+ characters)
3. **Rotate credentials** - Periodically update PATs and API keys
4. **Enable 2FA on GitHub** - Protect your account
5. **Monitor API usage** - Check quotas and usage regularly
6. **Environment variables** - All secrets via environment, not code

### Encryption Details

- **Algorithm**: AES-256-GCM
- **Key Derivation**: SHA-256 from JWT_SECRET
- **Implementation**: Node.js crypto module
- **Credentials Encrypted**: GitHub PAT, LLM API Keys

## Development

### File Structure
```
├── components/          # React UI components
│   ├── ui/             # shadcn/ui components
│   ├── AICodeGenerator.tsx
│   ├── CodeEditor.tsx
│   └── RepositoryBrowser.tsx
├── lib/                # Utilities and helpers
│   └── trpc.ts         # tRPC client configuration
├── server/
│   └── _core/          # tRPC server handlers
├── App.tsx             # Main application component
├── main.tsx            # React entry point
├── routers.ts          # tRPC router configuration
├── credentials.ts      # Credentials router
├── routers_github.ts   # GitHub operations router
├── routers_ai.ts       # AI code generation router
├── github.ts           # GitHub API integration
├── llm.ts              # LLM API integration
├── db.ts               # Database queries
├── encryption.ts       # Encryption utilities
├── schema.ts           # Database schema with Drizzle ORM
└── package.json        # Project configuration
```

### Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, tRPC, Drizzle ORM
- **Database**: MySQL
- **APIs**: GitHub API (Octokit), OpenAI SDK
- **Security**: AES-256-GCM encryption
- **Build**: Vite
- **Deployment**: Vercel

### Development Workflow

1. Make changes to TypeScript files
2. Run `pnpm typecheck` to verify types
3. Run `pnpm dev:full` to test locally
4. Test all features (GitHub operations, AI generation)
5. Run `pnpm build` to verify production build
6. Commit and push to deploy on Vercel

## Troubleshooting

### GitHub PAT Issues
- Verify PAT has `repo` scope
- Check token hasn't expired
- Confirm repository access permissions
- Use `curl` to test GitHub API connectivity

### LLM API Issues
- Verify API key is correct
- Check API quota and usage limits
- Ensure model name is spelled correctly
- Test API endpoint connectivity with curl

### Database Issues
- Verify `DATABASE_URL` is correct
- Check database server is running
- Confirm user has create table permissions
- Check network connectivity to database

### Build/Deployment Issues
- Run `pnpm install` to ensure dependencies
- Run `pnpm typecheck` to check types
- Check `vercel.json` configuration
- Review Vercel build logs for details

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | MySQL connection string |
| `JWT_SECRET` | Yes | Random string (32+ chars) for encryption |
| `VITE_API_URL` | No | API base URL (auto-detected) |
| `VITE_APP_TITLE` | No | Application title (default: GitHub MCP Frontend) |
| `VITE_APP_LOGO` | No | Logo URL |
| `NODE_ENV` | No | Environment (development/production) |

## Performance

- Repository lists are cached to reduce API calls
- File content is fetched on-demand
- Credentials are encrypted once and reused
- UI components optimized with React hooks
- Database queries use connection pooling
- Vercel serverless functions with 60-second timeout

## Support & Issues

For issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Check application and server logs
4. Review GitHub issues on the repository

## License

MIT License - See LICENSE file for details

## Roadmap

Future enhancements planned:
- Multiple repository operations
- Advanced code review interface
- Diff viewer for changes
- Webhook support for real-time updates
- Advanced code generation with streaming
- Batch operations support
- Custom branch protection rules
- GitHub Actions integration
- Advanced search and filtering
