import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Loader2, Code2 } from "lucide-react";

export default function Login() {
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      window.location.href = "/";
    }
  }, [isAuthenticated, user]);

  const handleLogin = () => {
    window.location.href = getLoginUrl();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Code2 className="w-10 h-10 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">GitHub MCP</h1>
          </div>
          <p className="text-slate-400">Repository Management & AI Code Generation</p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-700 bg-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-400">
              Sign in to manage your repositories and generate code with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Features List */}
            <div className="space-y-3 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Browse Repositories</p>
                  <p className="text-xs text-slate-400">Access all your GitHub repositories</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Edit Files</p>
                  <p className="text-xs text-slate-400">Create, update, and delete files with commit messages</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">AI Code Generation</p>
                  <p className="text-xs text-slate-400">Generate code using AI with context awareness</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Secure Storage</p>
                  <p className="text-xs text-slate-400">Your credentials are encrypted and secure</p>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-11"
            >
              <Github className="w-5 h-5 mr-2" />
              Sign in with GitHub
            </Button>

            {/* Info Text */}
            <p className="text-xs text-slate-400 text-center mt-4">
              We use OAuth to securely authenticate with your GitHub account. Your credentials are never stored.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            Powered by Manus • GitHub MCP Frontend
          </p>
        </div>
      </div>
    </div>
  );
}
