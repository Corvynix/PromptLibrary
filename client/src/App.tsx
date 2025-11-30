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

// New Pages - System
const ServerError = lazy(() => import("@/pages/system/ServerError"));
const Maintenance = lazy(() => import("@/pages/system/Maintenance"));
const Changelog = lazy(() => import("@/pages/system/Changelog"));
const ApiDocs = lazy(() => import("@/pages/system/ApiDocs"));

// New Pages - Legal & Monetization
const Cookies = lazy(() => import("@/pages/legal/Cookies"));
const AdsDisclosure = lazy(() => import("@/pages/legal/AdsDisclosure"));
const Sponsored = lazy(() => import("@/pages/monetization/Sponsored"));

// New Pages - Discovery
const Leaderboard = lazy(() => import("@/pages/discovery/Leaderboard"));
const TagDetail = lazy(() => import("@/pages/discovery/TagDetail"));
const Search = lazy(() => import("@/pages/discovery/Search"));
const Categories = lazy(() => import("@/pages/discovery/Categories"));

// New Pages - Auth & User
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const Onboarding = lazy(() => import("@/pages/auth/Onboarding"));
const Settings = lazy(() => import("@/pages/user/Settings"));
const Notifications = lazy(() => import("@/pages/user/Notifications"));
const ActivityFeed = lazy(() => import("@/pages/user/ActivityFeed"));
const Connections = lazy(() => import("@/pages/user/Connections"));

// New Pages - Content & Community
const VersionHistory = lazy(() => import("@/pages/content/VersionHistory"));
const WorkflowBuilder = lazy(() => import("@/pages/content/WorkflowBuilder"));
const Community = lazy(() => import("@/pages/community/Community"));
const CommentThread = lazy(() => import("@/pages/community/CommentThread"));
const Hashtags = lazy(() => import("@/pages/community/Hashtags"));

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
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/verify-email" component={VerifyEmail} />
            <Route path="/onboarding" component={Onboarding} />

            {/* System Pages */}
            <Route path="/500" component={ServerError} />
            <Route path="/maintenance" component={Maintenance} />
            <Route path="/changelog" component={Changelog} />
            <Route path="/api-docs" component={ApiDocs} />

            {/* Legal Pages */}
            <Route path="/about" component={About} />
            <Route path="/terms" component={Terms} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/cookies" component={Cookies} />
            <Route path="/ads-disclosure" component={AdsDisclosure} />
            <Route path="/support" component={Support} />

            {/* Monetization */}
            <Route path="/sponsored" component={Sponsored} />

            {/* Discovery Routes (Wrapped in AppShell) */}
            <Route path="/explore">
              <AppShell><Feed /></AppShell>
            </Route>
            <Route path="/feed">
              <AppShell><Feed /></AppShell>
            </Route>
            <Route path="/search">
              <AppShell><Search /></AppShell>
            </Route>
            <Route path="/categories">
              <AppShell><Categories /></AppShell>
            </Route>
            <Route path="/leaderboard">
              <AppShell><Leaderboard /></AppShell>
            </Route>
            <Route path="/tags/:tag">
              <AppShell><TagDetail /></AppShell>
            </Route>
            <Route path="/hashtags">
              <AppShell><Hashtags /></AppShell>
            </Route>
            <Route path="/community">
              <AppShell><Community /></AppShell>
            </Route>

            {/* Content Routes */}
            <Route path="/prompt/:id">
              <AppShell><PromptDetail /></AppShell>
            </Route>
            <Route path="/prompt/:id/history">
              <AppShell><VersionHistory /></AppShell>
            </Route>
            <Route path="/prompt/:id/comments">
              <AppShell><CommentThread /></AppShell>
            </Route>
            <Route path="/remix/:id">
              <AppShell><RemixEditor /></AppShell>
            </Route>
            <Route path="/create" component={CreatePrompt} />
            <Route path="/workflow-builder">
              <AppShell><WorkflowBuilder /></AppShell>
            </Route>

            {/* User Routes */}
            <Route path="/profile/:username" component={Profile} />
            <Route path="/settings">
              <AppShell><Settings /></AppShell>
            </Route>
            <Route path="/notifications">
              <AppShell><Notifications /></AppShell>
            </Route>
            <Route path="/activity">
              <AppShell><ActivityFeed /></AppShell>
            </Route>
            <Route path="/connections">
              <AppShell><Connections /></AppShell>
            </Route>

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
