import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import { AppLayout } from "./AppLayout";
import Dashboard from "./Dashboard";
import Settings from "./SettingsPage";

// Mock NotFound
const NotFound = () => (
  <div className="flex items-center justify-center h-screen">
    <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path={"/"}>
        <AppLayout>
          <Dashboard />
        </AppLayout>
      </Route>
      <Route path={"/settings"}>
        <AppLayout>
          <Settings />
        </AppLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
  );
}

export default App;
