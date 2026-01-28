import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Folder, File, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface RepositoryBrowserProps {
  selectedRepo: string | null;
  selectedBranch: string;
  selectedFile: string | null;
  onRepoSelect: (repo: string) => void;
  onBranchSelect: (branch: string) => void;
  onFileSelect: (file: string) => void;
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

  const reposQuery = trpc.github.listRepositories.useQuery();

  const [owner, repo] = selectedRepo?.split("/") || ["", ""];
  const branchesQuery = trpc.github.listBranches.useQuery(
    { owner, repo },
    { enabled: !!selectedRepo && !!owner && !!repo }
  );

  const filteredRepos = reposQuery.data?.filter((r) =>
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleRepoSelect = (fullName: string) => {
    onRepoSelect(fullName);
    const defaultBranch = "main";
    onBranchSelect(defaultBranch);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search and Refresh */}
      <div className="p-4 border-b space-y-2">
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
      </div>

      {/* Repositories List */}
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
                className={cn(
                  "w-full text-left px-3 py-2 rounded text-sm font-medium transition-colors",
                  selectedRepo === r.fullName
                    ? "bg-blue-100 text-blue-900"
                    : "hover:bg-slate-200 text-slate-900"
                )}
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

      {/* Branch Selector */}
      {selectedRepo && (
        <div className="border-t p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-600">BRANCH</p>
          {branchesQuery.isLoading ? (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            </div>
          ) : branchesQuery.data ? (
            <select
              value={selectedBranch}
              onChange={(e) => onBranchSelect(e.target.value)}
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
      )}
    </div>
  );
}
