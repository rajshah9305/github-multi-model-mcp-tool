import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Copy, AlertCircle } from "lucide-react";
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
    toast.success("Copied to clipboard");
  };

  if (fileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p className="text-slate-600 text-sm">Loading file...</p>
        </div>
      </div>
    );
  }

  if (fileQuery.error) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <Card className="border-red-200 bg-red-50 max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertCircle className="w-5 h-5" />
              Error Loading File
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-800 text-sm">
              {fileQuery.error instanceof Error ? fileQuery.error.message : "Failed to load file"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 gap-4 overflow-y-auto bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{filePath}</h2>
          <p className="text-sm text-slate-600">Branch: {branch}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={!content}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          {!isEditing ? (
            <Button
              size="sm"
              onClick={() => setIsEditing(true)}
            >
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
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="flex-1 flex flex-col gap-4 min-h-0">
          <div className="flex-1 flex flex-col gap-2 min-h-0">
            <label className="text-sm font-medium">File Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 font-mono text-sm resize-none"
              placeholder="File content..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Commit Message</label>
            <Input
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Describe your changes..."
              className="text-sm"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending || !commitMessage.trim()}
            className="w-full"
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </div>
      ) : (
        <div className="flex-1 bg-slate-900 rounded-lg p-4 overflow-auto">
          <pre className="text-slate-100 font-mono text-sm whitespace-pre-wrap break-words">
            {content || "No content"}
          </pre>
        </div>
      )}
    </div>
  );
}
