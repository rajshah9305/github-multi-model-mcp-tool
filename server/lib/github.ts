import { Octokit } from "@octokit/rest";
import { decryptValue } from "./encryption";

/**
 * Create an authenticated GitHub client
 */
export function createGitHubClient(encryptedPat: string) {
  const pat = decryptValue(encryptedPat);
  return new Octokit({ auth: pat });
}

/**
 * List repositories for the authenticated user
 */
export async function listRepositories(octokit: Octokit) {
  const { data } = await octokit.repos.listForAuthenticatedUser({
    per_page: 100,
  });
  return data;
}

/**
 * Get repository details
 */
export async function getRepository(octokit: Octokit, owner: string, repo: string) {
  const { data } = await octokit.repos.get({ owner, repo });
  return data;
}

/**
 * List branches in a repository
 */
export async function listBranches(octokit: Octokit, owner: string, repo: string) {
  const { data } = await octokit.repos.listBranches({ owner, repo, per_page: 100 });
  return data;
}

/**
 * Get file contents
 */
export async function getFileContent(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  branch?: string
) {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path,
    ref: branch,
  });

  if (Array.isArray(data)) {
    throw new Error("Path is a directory, not a file");
  }

  if (data.type !== "file" || !data.content) {
    throw new Error("Unable to read file content");
  }

  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
    path: data.path,
  };
}

/**
 * List directory contents
 */
export async function listDirectoryContents(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string = "",
  branch?: string
) {
  const { data } = await octokit.repos.getContent({
    owner,
    repo,
    path: path || "/",
    ref: branch,
  });

  if (!Array.isArray(data)) {
    throw new Error("Path is a file, not a directory");
  }

  return data.map((item) => ({
    name: item.name,
    path: item.path,
    type: item.type as "file" | "dir" | "symlink" | "submodule",
    size: item.size,
    url: item.url,
    isFile: item.type === "file",
  }));
}

/**
 * Create a new file
 */
export async function createFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch?: string
) {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    branch,
  });

  return {
    sha: data.content?.sha ?? "",
    path: data.content?.path ?? path,
    message: data.commit?.message ?? message,
  };
}

/**
 * Update an existing file
 */
export async function updateFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  sha: string,
  branch?: string
) {
  const { data } = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message,
    content: Buffer.from(content).toString("base64"),
    sha,
    branch,
  });

  return {
    sha: data.content?.sha ?? "",
    path: data.content?.path ?? path,
    message: data.commit?.message ?? message,
  };
}

/**
 * Delete a file
 */
export async function deleteFile(
  octokit: Octokit,
  owner: string,
  repo: string,
  path: string,
  message: string,
  sha: string,
  branch?: string
) {
  await octokit.repos.deleteFile({
    owner,
    repo,
    path,
    message,
    sha,
    branch,
  });

  return {
    message: "File deleted successfully",
  };
}
