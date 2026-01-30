import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, Github } from "lucide-react";
import { RepositoryBrowser } from "@/components/RepositoryBrowser";
import { CodeEditor } from "@/components/CodeEditor";
import { AICodeGenerator } from "@/components/AICodeGenerator";

export default function Dashboard() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  // Check if GitHub PAT and LLM key are configured
  const hasGithubPat = trpc.credentials.hasGitHubPat.useQuery();
  const hasLLMKey = trpc.credentials.hasLLMKey.useQuery();

  if (hasGithubPat.isLoading || hasLLMKey.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (hasGithubPat.error) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5" />
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 text-sm mb-4">
              {hasGithubPat.error instanceof Error ? hasGithubPat.error.message : "An error occurred while loading your dashboard"}
            </p>
            <Button
              onClick={() => hasGithubPat.refetch()}
              variant="outline"
              className="w-full"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!hasGithubPat.data) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-900">
              <AlertCircle className="w-5 h-5" />
              GitHub PAT Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-yellow-800">
              To use the repository browser and file operations, you need to configure your GitHub Personal Access Token.
            </p>
            <Button
              onClick={() => window.location.href = "/settings"}
              className="w-full"
            >
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-white p-6">
        <h1 className="text-2xl font-bold mb-2">GitHub Repository Manager</h1>
        <p className="text-slate-600">Browse, edit, and manage your repositories</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Repository Browser */}
        <div className="w-80 border-r bg-slate-50 overflow-y-auto flex flex-col">
          <RepositoryBrowser
            selectedRepo={selectedRepo}
            selectedBranch={selectedBranch}
            selectedFile={selectedFile}
            onRepoSelect={setSelectedRepo}
            onBranchSelect={setSelectedBranch}
            onFileSelect={setSelectedFile}
          />
        </div>

        {/* Right Panel - Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {selectedFile && selectedRepo ? (
            <Tabs defaultValue="editor" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="border-b rounded-none bg-white">
                <TabsTrigger value="editor">Editor</TabsTrigger>
                <TabsTrigger value="ai">AI Assistant</TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="flex-1 overflow-hidden">
                <CodeEditor
                  repo={selectedRepo}
                  filePath={selectedFile}
                  branch={selectedBranch}
                />
              </TabsContent>

              <TabsContent value="ai" className="flex-1 overflow-hidden">
                {hasLLMKey.data ? (
                  <AICodeGenerator
                    repo={selectedRepo}
                    filePath={selectedFile}
                    branch={selectedBranch}
                  />
                ) : (
                  <div className="p-8 flex items-center justify-center h-full">
                    <Card className="border-yellow-200 bg-yellow-50 max-w-md">
                      <CardHeader>
                        <CardTitle className="text-yellow-900">LLM API Key Required</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-yellow-800 text-sm mb-4">
                          Configure your LLM API key in settings to use the AI assistant.
                        </p>
                        <Button
                          onClick={() => window.location.href = "/settings"}
                          className="w-full"
                        >
                          Go to Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-slate-50">
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    Select a Repository
                  </CardTitle>
                  <CardDescription>
                    Choose a repository from the left panel to get started
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
