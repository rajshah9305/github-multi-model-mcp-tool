# GitHub MCP Frontend - Repository Management & AI Code Generation

A powerful, elegant web application for managing GitHub repositories and generating code using AI. Built with React, TypeScript, tRPC, and secured credential storage.

## Features

### 🔐 Secure Credential Management
- **GitHub Personal Access Token (PAT)** - Securely store and manage your GitHub credentials
- **LLM API Keys** - Support for OpenAI, Anthropic, and other OpenAI-compatible APIs
- **AES-256-GCM Encryption** - Military-grade encryption for all sensitive credentials
- **Per-User Storage** - Each user's credentials are isolated and encrypted

### 📁 Repository Management
- **Repository Browser** - Browse all your GitHub repositories with search functionality
- **Branch Selection** - Switch between branches for all operations
- **File Navigation** - Explore repository structure and view file contents
- **Real-time Status** - Live feedback for all GitHub operations

### 📝 Code Editor
- **Syntax Highlighting** - Beautiful code display with proper formatting
- **File Editing** - Edit files directly with commit message support
- **Read-Only Mode** - View file contents safely
- **Copy to Clipboard** - Quick copy functionality for generated or existing code

### 🤖 AI Code Generation
- **Intelligent Code Generation** - Generate code based on natural language prompts
- **Context Awareness** - AI understands your repository and file context
- **Multiple Model Support** - Works with GPT-4, Claude, and other compatible models
- **Copy & Paste** - Easily copy generated code to clipboard

### 🎨 Elegant User Interface
- **Dark Sidebar Navigation** - Professional, modern design
- **Responsive Layout** - Works seamlessly on all screen sizes
- **Smooth Transitions** - Polished micro-interactions
- **Intuitive Navigation** - Easy-to-use dashboard and settings

## Getting Started

### Prerequisites
- Node.js 18+
- GitHub Personal Access Token
- LLM API Key (OpenAI, Anthropic, or compatible service)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test
```

### Configuration

1. **GitHub PAT Setup**
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Click "Generate new token (classic)"
   - Select scope: `repo` (full control of private repositories)
   - Copy the token

2. **LLM API Key Setup**
   - For OpenAI: Get your API key from https://platform.openai.com/api-keys
   - For Anthropic: Get your API key from https://console.anthropic.com
   - For other providers: Use their respective API endpoints

3. **Application Setup**
   - Navigate to Settings in the application
   - Paste your GitHub PAT
   - Configure your LLM API key and model
   - Save credentials

## Architecture

### Backend (tRPC)
- **Credentials Router** - Secure storage and retrieval of encrypted credentials
- **GitHub Router** - All GitHub API operations (list repos, read/write files, manage branches)
- **AI Router** - Code generation using configured LLM
- **Database** - MySQL with encrypted credential storage

### Frontend (React)
- **AppLayout** - Main application layout with sidebar navigation
- **Dashboard** - Repository browser and file editor
- **Settings** - Credential configuration page
- **RepositoryBrowser** - Repository and branch selection
- **CodeEditor** - File viewing and editing
- **AICodeGenerator** - AI-powered code generation interface

### Security
- **AES-256-GCM Encryption** - All credentials encrypted before storage
- **Protected Procedures** - All operations require authentication
- **No Credential Exposure** - Credentials never exposed to frontend
- **Secure Session Management** - OAuth-based authentication

## API Endpoints

### Credentials
- `credentials.get` - Retrieve current user's credentials (masked)
- `credentials.save` - Save or update credentials
- `credentials.hasGitHubPat` - Check if GitHub PAT is configured
- `credentials.hasLLMKey` - Check if LLM API key is configured

### GitHub Operations
- `github.listRepositories` - List all user repositories
- `github.getRepository` - Get repository details
- `github.listBranches` - List repository branches
- `github.getFileContent` - Read file contents
- `github.listDirectory` - List directory contents
- `github.createFile` - Create new file with commit message
- `github.updateFile` - Update existing file with commit message
- `github.deleteFile` - Delete file with commit message

### AI Code Generation
- `ai.generateCode` - Generate code from prompt with context
- `ai.getConfig` - Get LLM configuration

## Database Schema

### Users Table
- `id` - Primary key
- `openId` - OAuth identifier
- `name` - User name
- `email` - User email
- `role` - User role (admin/user)
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

### Credentials Table
- `id` - Primary key
- `userId` - Foreign key to users
- `githubPat` - Encrypted GitHub PAT
- `llmApiKey` - Encrypted LLM API key
- `llmModel` - LLM model name
- `llmBaseUrl` - LLM API base URL
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Repository Cache Table
- `id` - Primary key
- `userId` - Foreign key to users
- `repoName` - Full repository name (owner/repo)
- `description` - Repository description
- `defaultBranch` - Default branch name
- `url` - Repository URL
- `lastSyncedAt` - Last sync timestamp

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test credentials.test.ts
```

### Test Coverage
- Encryption/Decryption (5 tests)
- Authentication (1 test)

## Development

### File Structure
```
client/
  src/
    components/       # Reusable UI components
    pages/           # Page-level components
    lib/             # Utilities and helpers
    contexts/        # React contexts
    App.tsx          # Main app component
    main.tsx         # Entry point

server/
  routers/           # tRPC routers
  db.ts              # Database queries
  github.ts          # GitHub API integration
  llm.ts             # LLM integration
  encryption.ts      # Credential encryption
  routers.ts         # Main router

drizzle/
  schema.ts          # Database schema
  migrations/        # Database migrations
```

### Key Technologies
- **Frontend**: React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express, tRPC, Drizzle ORM
- **Database**: MySQL/TiDB
- **APIs**: GitHub API (Octokit), OpenAI SDK
- **Security**: AES-256-GCM encryption, OAuth 2.0

## Supported LLM Models

### OpenAI
- gpt-4o
- gpt-4-turbo
- gpt-3.5-turbo

### Anthropic
- claude-3-opus
- claude-3-sonnet
- claude-3-haiku

### Other Compatible APIs
- Any OpenAI-compatible API endpoint

## Troubleshooting

### GitHub PAT Issues
- Ensure PAT has `repo` scope selected
- Check that PAT hasn't expired
- Verify repository access permissions

### LLM API Issues
- Verify API key is correct
- Check API quota and usage limits
- Ensure model name is spelled correctly
- Test API endpoint connectivity

### Encryption Issues
- Ensure JWT_SECRET environment variable is set
- Check database connectivity
- Verify credentials table exists

## Performance Considerations

- Repository list is cached to reduce API calls
- File content is fetched on-demand
- Credentials are encrypted once and reused
- UI components are optimized with React hooks

## Security Best Practices

1. **Never share your GitHub PAT or API keys**
2. **Use strong, unique credentials**
3. **Rotate credentials periodically**
4. **Enable two-factor authentication on GitHub**
5. **Review repository access permissions**
6. **Monitor API usage and quotas**

## Contributing

This is a personal project. For modifications:

1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Test thoroughly before committing

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review GitHub issues
3. Check application logs in `.manus-logs/`

## Roadmap

Future enhancements:
- [ ] Multiple repository operations
- [ ] Code review interface
- [ ] Diff viewer for changes
- [ ] Webhook support for real-time updates
- [ ] Advanced code generation with streaming
- [ ] File upload support
- [ ] Batch operations
- [ ] Custom branch protection rules
- [ ] Integration with GitHub Actions
- [ ] Advanced search and filtering
