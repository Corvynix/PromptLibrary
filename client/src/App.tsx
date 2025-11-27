import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Eager load critical pages
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import About from "@/pages/About";
import NotFound from "@/pages/not-found";

// Lazy load heavy/less critical pages
const Feed = lazy(() => import("@/pages/Feed"));
const PromptDetail = lazy(() => import("@/pages/PromptDetail"));
const CreatePrompt = lazy(() => import("@/pages/CreatePrompt"));
const RemixEditor = lazy(() => import("@/pages/RemixEditor"));
const Profile = lazy(() => import("@/pages/Profile"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Support = lazy(() => import("@/pages/Support"));

function App() {
  const { currentUser: user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen bg-background">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          }
        >
          <Switch>
            {/* Public Landing Page */}
            <Route path="/" component={Landing} />

            {/* Auth Pages */}
            <Route path="/auth" component={Auth} />
            <Route path="/login" component={Auth} />
            <Route path="/register" component={Auth} />

            {/* About Page */}
            <Route path="/about" component={About} />

            {/* Terms Page */}
            <Route path="/terms" component={Terms} />

            {/* Privacy Page */}
            <Route path="/privacy" component={Privacy} />

            {/* Support Page */}
            <Route path="/support" component={Support} />

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

            <Route path="/create" component={CreatePrompt} />

            <Route path="/profile/:username" component={Profile} />

            <Route path="/admin" component={AdminDashboard} />

            {/* Fallback */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
