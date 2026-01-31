import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Github, Sparkles, Key, Link, Cpu, CheckCircle2, XCircle, Shield, ExternalLink, Save, Zap, Play } from "lucide-react";

export default function SettingsPage() {
  const [githubPat, setGithubPat] = useState("");
  const [llmApiKey, setLlmApiKey] = useState("");
  const [llmModel, setLlmModel] = useState("");
  const [llmBaseUrl, setLlmBaseUrl] = useState("");

  const credentialsQuery = trpc.credentials.get.useQuery();
  const saveMutation = trpc.credentials.save.useMutation();
  const testConnectionMutation = trpc.ai.testConnection.useMutation();

  useEffect(() => {
    if (credentialsQuery.data) {
      if (credentialsQuery.data.llmModel) setLlmModel(credentialsQuery.data.llmModel);
      if (credentialsQuery.data.llmBaseUrl) setLlmBaseUrl(credentialsQuery.data.llmBaseUrl);
    }
  }, [credentialsQuery.data]);

  const handleSaveCredentials = async () => {
    try {
      await saveMutation.mutateAsync({
        githubPat: githubPat || undefined,
        llmApiKey: llmApiKey || undefined,
        llmModel: llmModel || "gpt-4o",
        llmBaseUrl: llmBaseUrl || "https://api.openai.com/v1",
      });
      toast.success("Credentials saved successfully");
      setGithubPat("");
      setLlmApiKey("");
      credentialsQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save credentials");
    }
  };

  const handleTestConnection = async () => {
    try {
      const result = await testConnectionMutation.mutateAsync();
      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Connection failed");
    }
  };

  const applyQuickSetup = (provider: string) => {
    switch (provider) {
      case "openai":
        setLlmBaseUrl("https://api.openai.com/v1");
        setLlmModel("gpt-4o");
        break;
      case "deepseek":
        setLlmBaseUrl("https://api.deepseek.com");
        setLlmModel("deepseek-chat");
        break;
      case "groq":
        setLlmBaseUrl("https://api.groq.com/openai/v1");
        setLlmModel("llama3-70b-8192");
        break;
      case "ollama":
        setLlmBaseUrl("http://localhost:11434/v1");
        setLlmModel("llama3");
        break;
    }
    toast.info(`Applied ${provider} defaults`);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Settings</h1>
            <p className="text-slate-400">Configure your GitHub and AI credentials securely</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-2 glass rounded-xl p-1 mb-6">
          <TabsTrigger 
            value="github"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/20 data-[state=active]:to-purple-500/20 data-[state=active]:text-white text-slate-400 rounded-lg py-3 transition-all"
          >
            <Github className="w-4 h-4 mr-2" />
            GitHub
          </TabsTrigger>
          <TabsTrigger 
            value="llm"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-pink-500/20 data-[state=active]:text-white text-slate-400 rounded-lg py-3 transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Model
          </TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-6 slide-in-left">
          <Card className="glass border-indigo-500/20 card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800">
                  <Github className="w-5 h-5" />
                </div>
                GitHub Personal Access Token
              </CardTitle>
              <CardDescription className="text-slate-400">
                Required to access your repositories and perform file operations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-indigo-400" />
                  GitHub PAT
                </label>
                <Input
                  type="password"
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                  value={githubPat}
                  onChange={(e) => setGithubPat(e.target.value)}
                  className="font-mono input-modern rounded-xl"
                />
                <div className="flex items-center gap-2 mt-2">
                  {credentialsQuery.data?.githubPat ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">GitHub PAT is configured</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500">No GitHub PAT configured</span>
                    </>
                  )}
                </div>
              </div>

              <div className="glass rounded-xl p-4 border border-indigo-500/20">
                <p className="text-sm text-slate-300 font-medium mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                  How to create a GitHub PAT:
                </p>
                <ol className="text-sm text-slate-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                    <span>Go to GitHub Settings → Developer settings → Personal access tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                    <span>Click "Generate new token (classic)"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                    <span>Select scopes: <code className="px-1 py-0.5 bg-slate-800 rounded text-cyan-400">repo</code> (full control of private repositories)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                    <span>Copy the token and paste it here</span>
                  </li>
                </ol>
              </div>

              <Button
                onClick={handleSaveCredentials}
                disabled={saveMutation.isPending}
                className="w-full btn-primary rounded-xl py-3"
              >
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="llm" className="space-y-6 slide-in-right">
          <Card className="glass border-purple-500/20 card-hover glow-purple">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-white">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                AI Model Configuration
              </CardTitle>
              <CardDescription className="text-slate-400">
                Configure your LLM API credentials for AI-powered code generation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Setup */}
              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <p className="text-sm text-slate-300 font-medium mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Quick Setup
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "openai", name: "OpenAI" },
                    { id: "deepseek", name: "DeepSeek" },
                    { id: "groq", name: "Groq" },
                    { id: "ollama", name: "Ollama (Local)" },
                  ].map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => applyQuickSetup(provider.id)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-xs text-indigo-300 border border-indigo-500/20 transition-all hover:scale-105"
                    >
                      {provider.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                  <Key className="w-4 h-4 text-purple-400" />
                  API Key
                </label>
                <Input
                  type="password"
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxx"
                  value={llmApiKey}
                  onChange={(e) => setLlmApiKey(e.target.value)}
                  className="font-mono input-modern rounded-xl"
                />
                <div className="flex items-center gap-2 mt-2">
                  {credentialsQuery.data?.llmApiKey ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-400">LLM API key is configured</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-slate-500" />
                      <span className="text-xs text-slate-500">No LLM API key configured</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Model Name
                  </label>
                  <Input
                    placeholder="gpt-4o"
                    value={llmModel}
                    onChange={(e) => setLlmModel(e.target.value)}
                    className="input-modern rounded-xl"
                    list="model-suggestions"
                  />
                  <datalist id="model-suggestions">
                    <option value="gpt-4o" />
                    <option value="gpt-4-turbo" />
                    <option value="gpt-3.5-turbo" />
                    <option value="deepseek-chat" />
                    <option value="deepseek-coder" />
                    <option value="llama3-70b-8192" />
                    <option value="llama3" />
                    <option value="claude-3-opus" />
                    <option value="claude-3-sonnet" />
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <Link className="w-4 h-4 text-pink-400" />
                    Base URL
                  </label>
                  <Input
                    placeholder="https://api.openai.com/v1"
                    value={llmBaseUrl}
                    onChange={(e) => setLlmBaseUrl(e.target.value)}
                    className="input-modern rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-4 text-xs text-slate-500">
                <span>Current Model: <span className="text-cyan-400">{credentialsQuery.data?.llmModel || "gpt-4o (default)"}</span></span>
                <span>Current URL: <span className="text-pink-400">{credentialsQuery.data?.llmBaseUrl || "https://api.openai.com/v1 (default)"}</span></span>
              </div>

              <div className="glass rounded-xl p-4 border border-purple-500/20">
                <p className="text-sm text-slate-300 font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Supported Models:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span>OpenAI: gpt-4o, gpt-4-turbo</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span>Anthropic: claude-3-opus</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span>DeepSeek & Groq</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-pink-400" />
                    <span>Any OpenAI-compatible API</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleSaveCredentials}
                  disabled={saveMutation.isPending}
                  className="flex-1 btn-primary rounded-xl py-3"
                >
                  {saveMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Credentials
                </Button>

                <Button
                  onClick={handleTestConnection}
                  disabled={testConnectionMutation.isPending || !credentialsQuery.data?.llmApiKey}
                  className="btn-secondary rounded-xl py-3 px-6"
                  title="Save credentials first before testing"
                >
                  {testConnectionMutation.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

