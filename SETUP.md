# Quick Setup Guide

## Database Setup

1. **Install MySQL** (if not already installed):
   ```bash
   # macOS with Homebrew
   brew install mysql
   brew services start mysql
   
   # Or use Docker
   docker run --name mysql-dev -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0
   ```

2. **Setup Database**:
   ```bash
   # Run the database setup script
   pnpm setup-db
   ```

3. **Start the Application**:
   ```bash
   # Install dependencies
   pnpm install
   
   # Start both frontend and backend
   pnpm dev:full
   ```

## Environment Variables

The `.env` file has been created with default values:
- `DATABASE_URL`: Points to local MySQL
- `JWT_SECRET`: Used for credential encryption
- `NODE_ENV`: Set to development

## Changes Made

1. **Fixed Settings Page**: 
   - All input fields now start blank
   - Removed auto-population of default values
   - Added proper data refresh after saving

2. **Database Setup**:
   - Created `.env` file with required variables
   - Added database setup script
   - Ensured proper table creation

3. **Credential Saving**:
   - Fixed mutation to use proper defaults
   - Added data refresh after successful save
   - Improved error handling

## Usage

1. Go to Settings page
2. Enter your GitHub Personal Access Token
3. Enter your LLM API key (OpenAI, Anthropic, etc.)
4. Optionally customize model name and base URL
5. Click "Save Credentials"

The credentials will be encrypted and stored securely in the database.