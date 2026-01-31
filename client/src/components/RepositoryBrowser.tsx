import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Folder, File, RefreshCw, ArrowLeft, Search, GitBranch, FolderOpen, FileCode, FileJson, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryBrowserProps {
  selectedRepo: string | null;
  selectedBranch: string;
  selectedFile: string | null;
  onRepoSelect: (repo: string | null) => void;
  onBranchSelect: (branch: string) => void;
  onFileSelect: (file: string | null) => void;
}

// Get file icon based on extension
function getFileIcon(filename: string) {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'ts':
    case 'tsx':
    case 'js':
    case 'jsx':
      return <FileCode className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
    case 'json':
      return <FileJson className="w-4 h-4 text-green-400 flex-shrink-0" />;
    case 'md':
    case 'txt':
      return <FileText className="w-4 h-4 text-stone-400 flex-shrink-0" />;
    case 'css':
    case 'scss':
      return <FileCode className="w-4 h-4 text-rose-400 flex-shrink-0" />;
    case 'html':
      return <FileCode className="w-4 h-4 text-orange-400 flex-shrink-0" />;
    default:
      return <File className="w-4 h-4 text-stone-500 flex-shrink-0" />;
  }
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
      <div className="p-4 border-b border-emerald-500/10 space-y-3">
        {!selectedRepo ? (
            <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <Input
                    placeholder="Search repositories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-modern text-sm rounded-xl"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => reposQuery.refetch()}
                  disabled={reposQuery.isLoading}
                  className="w-full btn-secondary rounded-xl"
                >
                  {reposQuery.isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Refresh Repositories
                </Button>
            </>
        ) : (
            <div className="space-y-3">
                 <Button 
                   variant="ghost" 
                   size="sm" 
                   onClick={handleBackToRepos} 
                   className="w-full justify-start text-stone-400 hover:text-white hover:bg-emerald-500/10 rounded-xl"
                 >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Repositories
                 </Button>
                 <div className="glass rounded-xl p-3">
                   <p className="text-xs text-stone-500 mb-1">SELECTED REPOSITORY</p>
                   <p className="font-semibold text-sm text-white truncate">{selectedRepo}</p>
                 </div>
            </div>
        )}
      </div>

      {!selectedRepo ? (
          // Repositories List
          <div className="flex-1 overflow-y-auto p-2">
            {reposQuery.isLoading ? (
              <div className="p-8 flex flex-col items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-400 mb-3" />
                  <p className="text-sm text-stone-500">Loading repositories...</p>
              </div>
            ) : filteredRepos.length === 0 ? (
              <div className="p-8 text-center">
                  <FolderOpen className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                  <p className="text-sm text-stone-500">
                    {searchTerm ? "No repositories found" : "No repositories available"}
                  </p>
              </div>
            ) : (
              <div className="space-y-1">
                  {filteredRepos.map((r, index) => (
                    <button
                        key={r.id}
                        onClick={() => handleRepoSelect(r.fullName)}
                        className="w-full text-left px-3 py-3 rounded-xl text-sm font-medium hover:bg-emerald-500/10 text-stone-300 hover:text-white transition-all duration-200 group fade-in"
                        style={{ animationDelay: `${index * 30}ms` }}
                    >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                            <Folder className="w-4 h-4 text-emerald-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="truncate block">{r.name}</span>
                            {r.description && (
                              <p className="text-xs text-stone-500 truncate mt-0.5">{r.description}</p>
                            )}
                          </div>
                        </div>
                    </button>
                  ))}
              </div>
            )}
        </div>
      ) : (
          <div className="flex-1 flex flex-col min-h-0">
               {/* Branch Selector */}
                <div className="p-4 border-b border-emerald-500/10">
                    <p className="text-xs font-semibold text-stone-500 mb-2 flex items-center gap-2">
                      <GitBranch className="w-3 h-3" />
                      BRANCH
                    </p>
                    {branchesQuery.isLoading ? (
                        <div className="flex items-center justify-center py-3">
                          <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                        </div>
                    ) : branchesQuery.data ? (
                        <select
                          value={selectedBranch}
                          onChange={(e) => {
                              onBranchSelect(e.target.value);
                              setCurrentPath("");
                              onFileSelect(null);
                          }}
                          className="w-full px-3 py-2 rounded-xl text-sm input-modern cursor-pointer"
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
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1 mb-3 px-2 text-xs text-stone-500 font-mono">
                        {currentPath ? (
                            <button 
                              className="flex items-center gap-1 hover:text-emerald-400 transition-colors p-1 rounded hover:bg-emerald-500/10"
                              onClick={handleGoUp}
                            >
                                <ArrowLeft className="w-3 h-3" />
                                <span>..</span>
                            </button>
                        ) : null}
                        <span className="text-emerald-500/50">/</span>
                        <span className="truncate text-stone-400">{currentPath || "root"}</span>
                    </div>

                    {filesQuery.isLoading ? (
                        <div className="flex flex-col items-center justify-center p-8">
                          <Loader2 className="animate-spin w-6 h-6 text-emerald-400 mb-2" />
                          <p className="text-xs text-stone-500">Loading files...</p>
                        </div>
                    ) : filesQuery.error ? (
                        <div className="text-red-400 p-4 text-xs text-center glass rounded-xl border border-red-500/20">
                          Error loading files
                        </div>
                    ) : !filesQuery.data?.length ? (
                        <div className="text-stone-500 p-8 text-sm text-center">
                          <FolderOpen className="w-10 h-10 text-stone-600 mx-auto mb-2" />
                          Empty directory
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {filesQuery.data?.sort((a, b) => {
                                if (a.type === b.type) return a.name.localeCompare(b.name);
                                return a.type === 'dir' ? -1 : 1;
                            }).map((item, index) => (
                                <button
                                    key={item.path}
                                    onClick={() => handleFileClick(item)}
                                    className={cn(
                                        "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-3 transition-all duration-200 fade-in",
                                        selectedFile === item.path && item.type === "file" 
                                          ? "bg-emerald-500/20 text-white border-l-2 border-emerald-400"
                                          : "text-stone-400 hover:bg-emerald-500/10 hover:text-white"
                                    )}
                                    style={{ animationDelay: `${index * 20}ms` }}
                                >
                                    {item.type === "dir" 
                                      ? <Folder className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                      : getFileIcon(item.name)
                                    }
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
