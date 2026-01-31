import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, AlertCircle, Github, Code2, Sparkles, GitBranch, FileCode, Rocket } from "lucide-react";
import { RepositoryBrowser } from "@/components/RepositoryBrowser";
import { CodeEditor } from "@/components/CodeEditor";
import { AICodeGenerator } from "@/components/AICodeGenerator";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>("main");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [, navigate] = useLocation();

  // Check if GitHub PAT and LLM key are configured
  const hasGithubPat = trpc.credentials.hasGitHubPat.useQuery();
  const hasLLMKey = trpc.credentials.hasLLMKey.useQuery();

  if (hasGithubPat.isLoading || hasLLMKey.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 glow animate-pulse">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-xl opacity-50 animate-pulse" />
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (hasGithubPat.error) {
    return (
      <div className="p-8 max-w-2xl mx-auto flex items-center justify-center min-h-screen">
        <Card className="glass border-red-500/30 card-hover w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              Error Loading Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 text-sm mb-6">
              {hasGithubPat.error instanceof Error ? hasGithubPat.error.message : "An error occurred while loading your dashboard"}
            </p>
            <Button
              onClick={() => hasGithubPat.refetch()}
              className="w-full btn-secondary"
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
      <div className="p-8 max-w-2xl mx-auto flex items-center justify-center min-h-screen">
        <Card className="glass border-yellow-500/30 card-hover w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-yellow-400">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              GitHub PAT Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-slate-300">
              To use the repository browser and file operations, you need to configure your GitHub Personal Access Token.
            </p>
            <Button
              onClick={() => navigate("/settings")}
              className="w-full btn-primary"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Go to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="glass-dark border-b border-indigo-500/10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient mb-1">Repository Manager</h1>
            <p className="text-slate-400 text-sm">Browse, edit, and manage your GitHub repositories with AI assistance</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedRepo && (
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                <Github className="w-4 h-4 text-indigo-400" />
                <span className="text-sm text-slate-300">{selectedRepo}</span>
              </div>
            )}
            {selectedBranch && selectedRepo && (
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
                <GitBranch className="w-4 h-4 text-cyan-400" />
                <span className="text-sm text-slate-300">{selectedBranch}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left Panel - Repository Browser */}
        <div className="w-80 glass-dark border-r border-indigo-500/10 overflow-y-auto flex flex-col">
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
              <TabsList className="border-b border-indigo-500/10 rounded-none glass-dark px-4 py-2 h-auto gap-2">
                <TabsTrigger 
                  value="editor" 
                  className="data-[state=active]:bg-indigo-500/20 data-[state=active]:text-white text-slate-400 rounded-lg px-4 py-2 transition-all"
                >
                  <FileCode className="w-4 h-4 mr-2" />
                  Editor
                </TabsTrigger>
                <TabsTrigger 
                  value="ai"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-slate-400 rounded-lg px-4 py-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI Assistant
                </TabsTrigger>
              </TabsList>

              <TabsContent value="editor" className="flex-1 overflow-hidden fade-in">
                <CodeEditor
                  repo={selectedRepo}
                  filePath={selectedFile}
                  branch={selectedBranch}
                />
              </TabsContent>

              <TabsContent value="ai" className="flex-1 overflow-hidden fade-in">
                {hasLLMKey.data ? (
                  <AICodeGenerator
                    repo={selectedRepo}
                    filePath={selectedFile}
                    branch={selectedBranch}
                  />
                ) : (
                  <div className="p-8 flex items-center justify-center h-full">
                    <Card className="glass border-yellow-500/30 max-w-md card-hover">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-yellow-400">
                          <div className="p-2 rounded-lg bg-yellow-500/20">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          LLM API Key Required
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 text-sm mb-6">
                          Configure your LLM API key in settings to unlock AI-powered code generation.
                        </p>
                        <Button
                          onClick={() => navigate("/settings")}
                          className="w-full btn-primary"
                        >
                          <Rocket className="w-4 h-4 mr-2" />
                          Go to Settings
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8">
              <Card className="glass max-w-lg card-hover text-center">
                <CardHeader className="pb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-6 glow float">
                    <Github className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gradient">Select a Repository</CardTitle>
                  <CardDescription className="text-slate-400 mt-2">
                    Choose a repository from the sidebar to start browsing files and generating code
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="p-4 glass rounded-xl text-center">
                      <FileCode className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Browse Files</p>
                    </div>
                    <div className="p-4 glass rounded-xl text-center">
                      <Code2 className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">Edit Code</p>
                    </div>
                    <div className="p-4 glass rounded-xl text-center">
                      <Sparkles className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">AI Generate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
