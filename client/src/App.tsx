import { Switch, Route } from "wouter";
import { AppShell } from "@/components/layout/AppShell";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

// Pages
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Feed from "@/pages/Feed";
import PromptDetail from "@/pages/PromptDetail";
import RemixEditor from "@/pages/RemixEditor";
import Profile from "@/pages/Profile";
import AdminDashboard from "@/pages/AdminDashboard";
import NotFound from "@/pages/not-found";

function App() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Switch>
      {/* Public Landing Page */}
      <Route path="/" component={Landing} />

      {/* Auth Page */}
      <Route path="/auth" component={Auth} />

      {/* App Routes (Wrapped in AppShell) */}
      <Route path="/explore">
        <AppShell><Feed /></AppShell>
      </Route>

      <Route path="/prompt/:id">
        <AppShell><PromptDetail /></AppShell>
      </Route>

      <Route path="/remix/:id">
        <AppShell><RemixEditor /></AppShell>
      </Route>

      <Route path="/create">
        <AppShell><RemixEditor /></AppShell>
      </Route>

      <Route path="/profile/:username">
        <AppShell><Profile /></AppShell>
      </Route>

      <Route path="/admin">
        <AppShell><AdminDashboard /></AppShell>
      </Route>

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
