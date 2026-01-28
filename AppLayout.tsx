import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Github, Code2, Settings, LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", path: "/", icon: Github },
    { label: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-slate-900 text-white transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Code2 className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-lg">GitHub MCP</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-slate-800 rounded transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-left text-sm font-medium"
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-800 p-4 space-y-2">
          {sidebarOpen && (
            <div className="px-2 py-2 text-xs text-slate-400">
              <p className="font-semibold text-white">{user?.name || "User"}</p>
              <p className="text-slate-500">{user?.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">{children}</div>
      </main>
    </div>
  );
}
