import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Zap, Sparkles, Brain, Lightbulb, Check, Cpu } from "lucide-react";
import { toast } from "sonner";

interface AICodeGeneratorProps {
  repo: string;
  filePath: string;
  branch: string;
}

export function AICodeGenerator({ repo, filePath, branch }: AICodeGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [model, setModel] = useState<string>("gpt-4o");
  const [copied, setCopied] = useState(false);

  const generateMutation = trpc.ai.generateCode.useMutation();
  const configQuery = trpc.ai.getConfig.useQuery();

  useEffect(() => {
    if (configQuery.data?.model) {
      setModel(configQuery.data.model);
    }
  }, [configQuery.data?.model]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        context: `File: ${filePath}\nRepository: ${repo}\nBranch: ${branch}`,
        model: model?.trim() ? model.trim() : undefined,
      });
      setGeneratedCode(result.code);
      toast.success("Code generated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col p-6 gap-6 overflow-y-auto fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 glow-purple">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gradient">AI Code Assistant</h2>
          <p className="text-sm text-slate-400">Generate intelligent code suggestions powered by AI</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-5 min-h-0">
        {/* Model Picker */}
        <div className="glass rounded-xl p-4">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            AI Model
          </label>
          <Input
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="gpt-4o"
            list="llm-models"
            className="input-modern rounded-xl"
          />
          <datalist id="llm-models">
            <option value="gpt-4o" />
            <option value="gpt-4.1" />
            <option value="gpt-4.1-mini" />
            <option value="gpt-4o-mini" />
            <option value="gpt-4-turbo" />
            <option value="gpt-3.5-turbo" />
            <option value="claude-3-opus" />
            <option value="claude-3-sonnet" />
            <option value="claude-3-haiku" />
          </datalist>
          <p className="text-xs text-slate-500 mt-2">
            {configQuery.data?.model
              ? `Default: ${configQuery.data.model}`
              : "Default: gpt-4o"}
          </p>
        </div>

        {/* Prompt Input */}
        <div className="glass rounded-xl p-4">
          <label className="text-sm font-medium text-slate-300 flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            What would you like to generate?
          </label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code you want to generate... Be specific about the language, framework, and requirements."
            className="h-28 resize-none input-modern rounded-xl mb-4"
          />
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !prompt.trim()}
            className="w-full btn-primary rounded-xl py-3 relative overflow-hidden group"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span>Generating...</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                <span>Generate Code</span>
                <Sparkles className="w-4 h-4 ml-2 opacity-50" />
              </>
            )}
          </Button>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="flex-1 flex flex-col gap-3 min-h-0 slide-in-right">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Generated Code
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="btn-secondary rounded-lg"
              >
                {copied ? (
                  <Check className="w-4 h-4 mr-2 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="flex-1 code-block p-4 overflow-auto">
              <pre className="text-slate-100 font-mono text-sm whitespace-pre-wrap break-words">
                {generatedCode}
              </pre>
            </div>
          </div>
        )}

        {/* Tips */}
        {!generatedCode && (
          <Card className="glass border-indigo-500/20 card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-300 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Tips for better results
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-400 space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <p>Be specific about what you want to generate</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <p>Include the programming language or framework</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                <p>Mention any specific requirements or constraints</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                <p>Provide context about the existing codebase</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
