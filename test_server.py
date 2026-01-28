import asyncio
import os
from server import handle_call_tool, handle_list_tools
from dotenv import load_dotenv

load_dotenv()

async def test_list_tools():
    print("Testing list_tools...")
    tools = await handle_list_tools()
    for tool in tools:
        print(f"- {tool.name}: {tool.description}")
    print("Done.\n")

async def test_github_ops():
    # Note: This requires a valid GITHUB_PAT and a test repo
    repo_name = os.getenv("TEST_REPO")
    if not repo_name:
        print("Skipping GitHub ops test: TEST_REPO not set.")
        return

    print(f"Testing GitHub ops on {repo_name}...")
    
    # 1. List contents
    print("Listing root contents...")
    res = await handle_call_tool("github_list_contents", {"repo_name": repo_name})
    print(res[0].text)

    # 2. Create a test file
    test_file = "mcp_test_file.txt"
    print(f"Creating {test_file}...")
    res = await handle_call_tool("github_create_file", {
        "repo_name": repo_name,
        "file_path": test_file,
        "content": "Hello from MCP Tool!",
        "commit_message": "test: create mcp test file"
    })
    print(res[0].text)

    # 3. Read the file
    print(f"Reading {test_file}...")
    res = await handle_call_tool("github_read_file", {
        "repo_name": repo_name,
        "file_path": test_file
    })
    print(f"Content: {res[0].text}")

    # 4. Update the file
    print(f"Updating {test_file}...")
    res = await handle_call_tool("github_update_file", {
        "repo_name": repo_name,
        "file_path": test_file,
        "new_content": "Updated content from MCP Tool!",
        "commit_message": "test: update mcp test file"
    })
    print(res[0].text)

    # 5. Delete the file
    print(f"Deleting {test_file}...")
    res = await handle_call_tool("github_delete_file", {
        "repo_name": repo_name,
        "file_path": test_file,
        "commit_message": "test: delete mcp test file"
    })
    print(res[0].text)
    print("Done.\n")

async def test_ai_gen():
    if not os.getenv("LLM_API_KEY"):
        print("Skipping AI gen test: LLM_API_KEY not set.")
        return

    print("Testing AI generation...")
    res = await handle_call_tool("ai_generate_code", {
        "prompt": "Write a simple python function to add two numbers."
    })
    print(res[0].text)
    print("Done.\n")

if __name__ == "__main__":
    asyncio.run(test_list_tools())
    # asyncio.run(test_github_ops()) # Uncomment to test with real repo
    asyncio.run(test_ai_gen())
