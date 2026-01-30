import os
import asyncio
from typing import Optional, List, Dict, Any
from github import Github, GithubException
# from mcp.server.fastapi import Context
from mcp.server import Server
from mcp.types import Tool, TextContent, ImageContent, EmbeddedResource
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

GITHUB_PAT = os.getenv("GITHUB_PAT")
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_BASE_URL = os.getenv("LLM_BASE_URL", "https://api.openai.com/v1")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o")

# Initialize GitHub client
gh = Github(GITHUB_PAT) if GITHUB_PAT else None

# Initialize OpenAI client for multi-model support
llm_client = OpenAI(api_key=LLM_API_KEY, base_url=LLM_BASE_URL) if LLM_API_KEY else None

# Create MCP Server
server = Server("github-multi-model-tool")

@server.list_tools()
async def handle_list_tools() -> List[Tool]:
    return [
        Tool(
            name="github_read_file",
            description="Read the content of a file from a GitHub repository.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_name": {"type": "string", "description": "Full repository name (e.g., 'owner/repo')"},
                    "file_path": {"type": "string", "description": "Path to the file"},
                    "branch": {"type": "string", "description": "Branch name (optional)"},
                },
                "required": ["repo_name", "file_path"],
            },
        ),
        Tool(
            name="github_list_contents",
            description="List files and directories in a GitHub repository path.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_name": {"type": "string", "description": "Full repository name"},
                    "path": {"type": "string", "description": "Directory path (optional, defaults to root)"},
                    "branch": {"type": "string", "description": "Branch name (optional)"},
                },
                "required": ["repo_name"],
            },
        ),
        Tool(
            name="github_create_file",
            description="Create a new file in a GitHub repository.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_name": {"type": "string", "description": "Full repository name"},
                    "file_path": {"type": "string", "description": "Path for the new file"},
                    "content": {"type": "string", "description": "Content of the file"},
                    "commit_message": {"type": "string", "description": "Commit message"},
                    "branch": {"type": "string", "description": "Branch name (optional)"},
                },
                "required": ["repo_name", "file_path", "content", "commit_message"],
            },
        ),
        Tool(
            name="github_update_file",
            description="Update an existing file in a GitHub repository.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_name": {"type": "string", "description": "Full repository name"},
                    "file_path": {"type": "string", "description": "Path to the file"},
                    "new_content": {"type": "string", "description": "New content of the file"},
                    "commit_message": {"type": "string", "description": "Commit message"},
                    "branch": {"type": "string", "description": "Branch name (optional)"},
                },
                "required": ["repo_name", "file_path", "new_content", "commit_message"],
            },
        ),
        Tool(
            name="github_delete_file",
            description="Delete a file from a GitHub repository.",
            inputSchema={
                "type": "object",
                "properties": {
                    "repo_name": {"type": "string", "description": "Full repository name"},
                    "file_path": {"type": "string", "description": "Path to the file"},
                    "commit_message": {"type": "string", "description": "Commit message"},
                    "branch": {"type": "string", "description": "Branch name (optional)"},
                },
                "required": ["repo_name", "file_path", "commit_message"],
            },
        ),
        Tool(
            name="ai_generate_code",
            description="Use a configured AI model to generate or refine code.",
            inputSchema={
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "Instruction for the AI model"},
                    "context": {"type": "string", "description": "Optional context or existing code"},
                },
                "required": ["prompt"],
            },
        ),
    ]

@server.call_tool()
async def handle_call_tool(name: str, arguments: Dict[str, Any]) -> List[TextContent]:
    if not gh:
        return [TextContent(type="text", text="Error: GITHUB_PAT not configured.")]

    try:
        if name == "github_read_file":
            repo = gh.get_repo(arguments["repo_name"])
            content = repo.get_contents(arguments["file_path"], ref=arguments.get("branch"))
            return [TextContent(type="text", text=content.decoded_content.decode("utf-8"))]

        elif name == "github_list_contents":
            repo = gh.get_repo(arguments["repo_name"])
            contents = repo.get_contents(arguments.get("path", ""), ref=arguments.get("branch"))
            if not isinstance(contents, list):
                contents = [contents]
            result = "\n".join([f"{'DIR' if c.type == 'dir' else 'FILE'}: {c.path}" for c in contents])
            return [TextContent(type="text", text=result)]

        elif name == "github_create_file":
            repo = gh.get_repo(arguments["repo_name"])
            repo.create_file(
                path=arguments["file_path"],
                message=arguments["commit_message"],
                content=arguments["content"],
                branch=arguments.get("branch", repo.default_branch)
            )
            return [TextContent(type="text", text=f"Successfully created {arguments['file_path']}")]

        elif name == "github_update_file":
            repo = gh.get_repo(arguments["repo_name"])
            file = repo.get_contents(arguments["file_path"], ref=arguments.get("branch"))
            repo.update_file(
                path=file.path,
                message=arguments["commit_message"],
                content=arguments["new_content"],
                sha=file.sha,
                branch=arguments.get("branch", repo.default_branch)
            )
            return [TextContent(type="text", text=f"Successfully updated {arguments['file_path']}")]

        elif name == "github_delete_file":
            repo = gh.get_repo(arguments["repo_name"])
            file = repo.get_contents(arguments["file_path"], ref=arguments.get("branch"))
            repo.delete_file(
                path=file.path,
                message=arguments["commit_message"],
                sha=file.sha,
                branch=arguments.get("branch", repo.default_branch)
            )
            return [TextContent(type="text", text=f"Successfully deleted {arguments['file_path']}")]

        elif name == "ai_generate_code":
            if not llm_client:
                return [TextContent(type="text", text="Error: LLM_API_KEY not configured.")]
            
            prompt = arguments["prompt"]
            if arguments.get("context"):
                prompt = f"Context:\n{arguments['context']}\n\nInstruction: {prompt}"
            
            response = llm_client.chat.completions.create(
                model=LLM_MODEL,
                messages=[{"role": "user", "content": prompt}]
            )
            return [TextContent(type="text", text=response.choices[0].message.content)]

        else:
            return [TextContent(type="text", text=f"Unknown tool: {name}")]

    except GithubException as e:
        return [TextContent(type="text", text=f"GitHub Error: {str(e)}")]
    except Exception as e:
        return [TextContent(type="text", text=f"Error: {str(e)}")]

if __name__ == "__main__":
    from mcp.server.stdio import stdio_server
    async def main():
        async with stdio_server() as (read_stream, write_stream):
            await server.run(read_stream, write_stream, server.create_initialization_options())
    
    asyncio.run(main())
