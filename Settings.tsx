import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const [githubPat, setGithubPat] = useState("");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [llmModel, setLlmModel] = useState("gpt-4o");
  const [llmBaseUrl, setLlmBaseUrl] = useState("https://api.openai.com/v1");

  const credentialsQuery = trpc.credentials.get.useQuery();
  const saveMutation = trpc.credentials.save.useMutation();

  const handleSaveCredentials = async () => {
    try {
      await saveMutation.mutateAsync({
        githubPat: githubPat || undefined,
        llmApiKey: llmApiKey || undefined,
        llmModel: llmModel || undefined,
        llmBaseUrl: llmBaseUrl || undefined,
      });
      toast.success("Credentials saved successfully");
      setGithubPat("");
      setLlmApiKey("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save credentials");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-slate-600">Configure your GitHub and AI credentials</p>
      </div>

      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="github">GitHub</TabsTrigger>
          <TabsTrigger value="llm">AI Model</TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GitHub Personal Access Token</CardTitle>
              <CardDescription>
                Required to access your repositories and perform file operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub PAT</label>
                <Input
                  type="password"
                  placeholder="ghp_..."
                  value={githubPat}
                  onChange={(e) => setGithubPat(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {credentialsQuery.data?.githubPat
                    ? "✓ GitHub PAT is configured"
                    : "No GitHub PAT configured"}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>How to create a GitHub PAT:</strong>
                </p>
                <ol className="text-sm text-blue-800 mt-2 list-decimal list-inside space-y-1">
                  <li>Go to GitHub Settings → Developer settings → Personal access tokens</li>
                  <li>Click "Generate new token (classic)"</li>
                  <li>Select scopes: repo (full control of private repositories)</li>
                  <li>Copy the token and paste it here</li>
                </ol>
              </div>

              <Button
                onClick={handleSaveCredentials}
                disabled={!githubPat && !llmApiKey && !llmModel && !llmBaseUrl}
                className="w-full"
              >
                {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Configuration</CardTitle>
              <CardDescription>
                Configure your LLM API credentials for code generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">API Key</label>
                <Input
                  type="password"
                  placeholder="sk-..."
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  className="font-mono"
                />
                <p className="text-xs text-slate-500 mt-2">
                  {credentialsQuery.data?.llmApiKey
                    ? "✓ LLM API key is configured"
                    : "No LLM API key configured"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Model Name</label>
                <Input
                  placeholder="gpt-4o"
                  value={llmModel}
                  onChange={(e) => setLlmModel(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Base URL</label>
                <Input
                  placeholder="https://api.openai.com/v1"
                  value={llmBaseUrl}
                  onChange={(e) => setLlmBaseUrl(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Supported Models:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
                  <li>OpenAI: gpt-4o, gpt-4-turbo, gpt-3.5-turbo</li>
                  <li>Anthropic: claude-3-opus, claude-3-sonnet</li>
                  <li>Other compatible APIs with OpenAI-like interface</li>
                </ul>
              </div>

              <Button
                onClick={handleSaveCredentials}
                disabled={!githubPat && !llmApiKey && !llmModel && !llmBaseUrl}
                className="w-full"
              >
                {saveMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
