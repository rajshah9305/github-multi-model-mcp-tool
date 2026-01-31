import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Copy, AlertCircle, Edit3, X, Save, FileCode, GitCommit, Check } from "lucide-react";
import { toast } from "sonner";

interface CodeEditorProps {
  repo: string;
  filePath: string;
  branch: string;
}

export function CodeEditor({ repo, filePath, branch }: CodeEditorProps) {
  const [content, setContent] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [sha, setSha] = useState("");
  const [copied, setCopied] = useState(false);

  const [owner, repoName] = repo.split("/");

  const fileQuery = trpc.github.getFileContent.useQuery(
    { owner, repo: repoName, path: filePath, branch },
    { enabled: !!filePath && !!owner && !!repoName }
  );

  const updateMutation = trpc.github.updateFile.useMutation();

  useEffect(() => {
    if (fileQuery.data) {
      setContent(fileQuery.data.content);
      setSha(fileQuery.data.sha);
      setIsEditing(false);
      setCommitMessage("");
    }
  }, [fileQuery.data]);

  const handleSave = async () => {
    if (!commitMessage.trim()) {
      toast.error("Please enter a commit message");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        owner,
        repo: repoName,
        path: filePath,
        content,
        message: commitMessage,
        sha,
        branch,
      });
      toast.success("File updated successfully");
      setIsEditing(false);
      setCommitMessage("");
      fileQuery.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save file");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Get line count
  const lineCount = content.split('\n').length;

  if (fileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center mx-auto mb-4 glow animate-pulse">
            <FileCode className="w-6 h-6 text-white" />
          </div>
          <Loader2 className="w-6 h-6 animate-spin text-emerald-400 mx-auto mb-2" />
          <p className="text-stone-400 text-sm">Loading file...</p>
        </div>
      </div>
    );
  }

  if (fileQuery.error) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Card className="glass border-red-500/30 max-w-md card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-red-400">
              <div className="p-2 rounded-lg bg-red-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              Error Loading File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-300 text-sm">
              {fileQuery.error instanceof Error ? fileQuery.error.message : "Failed to load file"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 gap-4 overflow-y-auto fade-in">
      {/* Header */}
      <div className="flex items-center justify-between glass rounded-xl p-4">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-amber-500/20">
            <FileCode className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">{filePath.split('/').pop()}</h2>
            <p className="text-xs text-stone-500 font-mono">{filePath}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 glass rounded-lg text-xs text-stone-400">
            {lineCount} lines
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
            className="btn-secondary rounded-lg"
          >
            {copied ? (
              <Check className="w-4 h-4 mr-2 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
          {!isEditing ? (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
              className="btn-primary rounded-lg"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setContent(fileQuery.data?.content || "");
                setCommitMessage("");
              }}
              className="btn-secondary rounded-lg"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <label className="text-sm font-medium text-stone-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              File Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 font-mono text-sm resize-none input-modern rounded-xl"
              placeholder="File content..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-stone-300 flex items-center gap-2">
              <GitCommit className="w-4 h-4 text-orange-400" />
              Commit Message
            </label>
            <Input
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="text-sm input-modern rounded-xl"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !commitMessage.trim()}
            className="w-full btn-primary rounded-xl py-3"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="flex-1 code-block p-4 overflow-auto relative">
          {/* Line numbers */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-stone-900/50 to-transparent pointer-events-none" />
          <pre className="text-stone-100 font-mono text-sm whitespace-pre-wrap break-words pl-2">
            {content.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="w-10 text-right pr-4 text-stone-600 select-none text-xs">{i + 1}</span>
                <span className="flex-1">{line || ' '}</span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </div>
  );
}
