import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Folder, File, RefreshCw, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryBrowserProps {
  selectedRepo: string | null;
  selectedBranch: string;
  selectedFile: string | null;
  onRepoSelect: (repo: string | null) => void;
  onBranchSelect: (branch: string) => void;
  onFileSelect: (file: string | null) => void;
}

export function RepositoryBrowser({
  selectedRepo,
  selectedBranch,
  selectedFile,
  onRepoSelect,
  onBranchSelect,
  onFileSelect,
}: RepositoryBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPath, setCurrentPath] = useState("");

  const reposQuery = trpc.github.listRepositories.useQuery(undefined, {
      enabled: !selectedRepo
  });

  const [owner, repo] = selectedRepo?.split("/") || ["", ""];

  const branchesQuery = trpc.github.listBranches.useQuery(
    { owner, repo },
    { enabled: !!selectedRepo && !!owner && !!repo }
  );

  const filesQuery = trpc.github.listDirectoryContents.useQuery(
      { owner, repo, branch: selectedBranch, path: currentPath },
      { enabled: !!selectedRepo && !!selectedBranch }
  );

  const filteredRepos = reposQuery.data?.filter((r) =>
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRepoSelect = (fullName: string) => {
    onRepoSelect(fullName);
    const defaultBranch = "main";
    onBranchSelect(defaultBranch);
    setCurrentPath("");
    onFileSelect(null);
  };

  const handleBackToRepos = () => {
      onRepoSelect(null);
      onBranchSelect("main");
      setCurrentPath("");
      onFileSelect(null);
  };

  const handleFileClick = (item: any) => {
      if (item.type === "dir") {
          setCurrentPath(item.path);
      } else {
          onFileSelect(item.path);
      }
  };

  const handleGoUp = () => {
      if (!currentPath) return;
      const parts = currentPath.split("/");
      parts.pop();
      setCurrentPath(parts.join("/"));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b space-y-2">
        {!selectedRepo ? (
            <>
                <Input
                placeholder="Search repositories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm"
                />
                <Button
                variant="outline"
                size="sm"
                onClick={() => reposQuery.refetch()}
                disabled={reposQuery.isLoading}
                className="w-full"
                >
                {reposQuery.isLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh
                </Button>
            </>
        ) : (
            <div className="space-y-2">
                 <Button variant="ghost" size="sm" onClick={handleBackToRepos} className="w-full justify-start -ml-2">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Repositories
                 </Button>
                 <div className="font-semibold text-sm truncate px-1">{selectedRepo}</div>
            </div>
        )}
      </div>

      {!selectedRepo ? (
          // Repositories List
          <div className="flex-1 overflow-y-auto">
            {reposQuery.isLoading ? (
            <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            </div>
            ) : filteredRepos.length === 0 ? (
            <div className="p-4 text-sm text-slate-500 text-center">
                {searchTerm ? "No repositories found" : "No repositories"}
            </div>
            ) : (
            <div className="space-y-1 p-2">
                {filteredRepos.map((r) => (
                <button
                    key={r.id}
                    onClick={() => handleRepoSelect(r.fullName)}
                    className="w-full text-left px-3 py-2 rounded text-sm font-medium hover:bg-slate-200 text-slate-900 transition-colors"
                >
                    <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{r.name}</span>
                    </div>
                    {r.description && (
                    <p className="text-xs text-slate-500 ml-6 truncate">{r.description}</p>
                    )}
                </button>
                ))}
            </div>
            )}
        </div>
      ) : (
          <div className="flex-1 flex flex-col min-h-0">
               {/* Branch Selector */}
                <div className="p-4 border-b space-y-1">
                    <p className="text-xs font-semibold text-slate-600">BRANCH</p>
                    {branchesQuery.isLoading ? (
                        <div className="flex items-center justify-center py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                        </div>
                    ) : branchesQuery.data ? (
                        <select
                        value={selectedBranch}
                        onChange={(e) => {
                            onBranchSelect(e.target.value);
                            setCurrentPath("");
                            onFileSelect(null);
                        }}
                        className="w-full px-3 py-2 border rounded text-sm bg-white"
                        >
                        {branchesQuery.data.map((branch) => (
                            <option key={branch.name} value={branch.name}>
                            {branch.name}
                            </option>
                        ))}
                        </select>
                    ) : null}
                </div>

               {/* File Browser */}
               <div className="flex-1 overflow-y-auto p-2">
                    <div className="flex items-center gap-2 mb-2 px-2 text-sm text-slate-500 font-mono">
                        {currentPath ? (
                            <div className="flex items-center gap-1 hover:text-blue-500 cursor-pointer" onClick={handleGoUp}>
                                <ArrowLeft className="w-3 h-3" />
                                <span>..</span>
                            </div>
                        ) : null}
                        <span className="text-slate-300">/</span>
                        <span className="truncate">{currentPath}</span>
                    </div>

                    {filesQuery.isLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin w-4 h-4 text-blue-500" /></div>
                    ) : filesQuery.error ? (
                        <div className="text-red-500 p-2 text-xs">Error loading files</div>
                    ) : !filesQuery.data?.length ? (
                        <div className="text-slate-500 p-2 text-xs text-center">Empty directory</div>
                    ) : (
                        <div className="space-y-1">
                            {filesQuery.data?.sort((a, b) => {
                                if (a.type === b.type) return a.name.localeCompare(b.name);
                                return a.type === 'dir' ? -1 : 1;
                            }).map(item => (
                                <button
                                    key={item.path}
                                    onClick={() => handleFileClick(item)}
                                    className={cn(
                                        "w-full text-left px-2 py-1.5 rounded text-sm flex items-center gap-2 hover:bg-slate-100 transition-colors",
                                        selectedFile === item.path && item.type === "file" ? "bg-blue-100 text-blue-900" : "text-slate-700"
                                    )}
                                >
                                    {item.type === "dir" ? <Folder className="w-4 h-4 text-blue-400 flex-shrink-0" /> : <File className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                                    <span className="truncate">{item.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
               </div>
          </div>
      )}
    </div>
  );
}
