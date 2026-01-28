import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, Zap } from "lucide-react";
import { toast } from "sonner";

interface AICodeGeneratorProps {
  repo: string;
  filePath: string;
  branch: string;
}

export function AICodeGenerator({ repo, filePath, branch }: AICodeGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");

  const generateMutation = trpc.ai.generateCode.useMutation();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    try {
      const result = await generateMutation.mutateAsync({
        prompt,
        context: `File: ${filePath}\nRepository: ${repo}\nBranch: ${branch}`,
      });
      setGeneratedCode(result.code);
      toast.success("Code generated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to generate code");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="h-full flex flex-col p-6 gap-4 overflow-y-auto bg-background">
      <div>
        <h2 className="text-xl font-bold mb-2">AI Code Assistant</h2>
        <p className="text-sm text-slate-600">Generate code suggestions using AI</p>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        {/* Prompt Input */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">What would you like to generate?</label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="h-24 resize-none"
          />
          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !prompt.trim()}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>

        {/* Generated Code Display */}
        {generatedCode && (
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Code</label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-auto">
              <pre className="text-slate-100 font-mono text-sm whitespace-pre-wrap break-words">
                {generatedCode}
              </pre>
            </div>
          </div>
        )}

        {/* Tips */}
        {!generatedCode && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-900">Tips for better results</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-1">
              <p>• Be specific about what you want to generate</p>
              <p>• Include the programming language or framework</p>
              <p>• Mention any specific requirements or constraints</p>
              <p>• Provide context about the existing codebase</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
