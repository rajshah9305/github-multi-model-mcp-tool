import { useState } from "react";
import { useLocation } from "wouter";
import { Github, Code2, Settings, Menu, X, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: "Dashboard", path: "/", icon: Github, description: "Manage repositories" },
    { label: "Settings", path: "/settings", icon: Settings, description: "Configure credentials" },
  ];

  return (
    <div className="flex h-screen bg-gradient-animated">
      {/* Sidebar */}
      <aside
        className={cn(
          "sidebar text-white transition-all duration-300 flex flex-col relative",
          sidebarOpen ? "w-72" : "w-20"
        )}
      >
        {/* Decorative gradient line */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-emerald-500/50 via-amber-500/30 to-transparent" />
        
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-emerald-500/10">
          {sidebarOpen && (
            <div className="flex items-center gap-3 fade-in">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-600 flex items-center justify-center glow">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-lg text-gradient">GitHub MCP</span>
                <p className="text-xs text-stone-400">AI-Powered Code Manager</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-500/10 rounded-lg transition-all duration-200 hover:scale-105"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-stone-400" />
            ) : (
              <Menu className="w-5 h-5 text-stone-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left group",
                  isActive 
                    ? "bg-gradient-to-r from-emerald-500/20 to-amber-500/10 border border-emerald-500/30 text-white"
                    : "hover:bg-emerald-500/10 text-stone-300 hover:text-white"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-br from-emerald-500 to-amber-600 text-white"
                    : "bg-stone-800/50 text-stone-400 group-hover:bg-emerald-500/20 group-hover:text-emerald-400"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                {sidebarOpen && (
                  <div className="slide-in-left">
                    <span className="font-medium text-sm">{item.label}</span>
                    <p className="text-xs text-stone-500">{item.description}</p>
                  </div>
                )}
                {isActive && sidebarOpen && (
                  <Sparkles className="w-4 h-4 text-orange-400 ml-auto animate-pulse" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {sidebarOpen && (
          <div className="border-t border-emerald-500/10 p-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium text-white">Pro Tip</span>
              </div>
              <p className="text-xs text-stone-400">
                Use AI Assistant to generate code snippets based on your repository context.
              </p>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full fade-in">{children}</div>
      </main>
    </div>
  );
}
