# GitHub Multi-Model MCP Tool

This is a custom Model Context Protocol (MCP) server that allows AI models to interact with GitHub repositories. It supports multiple AI models via an OpenAI-compatible API and uses a GitHub Personal Access Token (PAT) for authentication.

## Features
- **Read/Write/Update/Delete** files in any GitHub repository you have access to.
- **List contents** of repository directories.
- **Multi-model support**: Integrate with any OpenAI-compatible LLM (OpenAI, Gemini, Anthropic via gateway, etc.).
- **MCP Compatible**: Works with any MCP client like VS Code, Claude Desktop, or Cursor.

## Setup

### 1. Prerequisites
- Python 3.10+
- A GitHub Personal Access Token (PAT) with `repo` scope.
- (Optional) An API key for an OpenAI-compatible LLM.

### 2. Installation
```bash
pip install mcp PyGithub openai python-dotenv
```

### 3. Configuration
Create a `.env` file in the project root:
```env
GITHUB_PAT=your_github_pat
LLM_API_KEY=your_llm_api_key
LLM_BASE_URL=https://api.openai.com/v1
LLM_MODEL=gpt-4o
```

### 4. Usage
Run the server:
```bash
python server.py
```

To use with an MCP client, configure the client to run `python /path/to/server.py`.

## Tools Provided
- `github_read_file`: Read file content.
- `github_list_contents`: List directory contents.
- `github_create_file`: Create a new file.
- `github_update_file`: Update an existing file.
- `github_delete_file`: Delete a file.
- `ai_generate_code`: Use the configured LLM to generate code snippets.
