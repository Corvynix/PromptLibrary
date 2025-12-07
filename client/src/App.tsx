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

            {/* Discovery Routes */}
            <Route path="/explore" component={Feed} />
            <Route path="/feed" component={Feed} />
            <Route path="/search" component={Search} />
            <Route path="/categories" component={Categories} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/tags/:tag" component={TagDetail} />
            <Route path="/hashtags" component={Hashtags} />
            <Route path="/community" component={Community} />

            {/* Content Routes */}
            <Route path="/prompt/:id" component={PromptDetail} />
            <Route path="/prompt/:id/history" component={VersionHistory} />
            <Route path="/prompt/:id/comments" component={CommentThread} />
            <Route path="/remix/:id" component={RemixEditor} />
            <Route path="/create" component={CreatePrompt} />
            <Route path="/workflow-builder" component={WorkflowBuilder} />

            {/* User Routes */}
            <Route path="/profile/:username" component={Profile} />
            <Route path="/settings" component={Settings} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/activity" component={ActivityFeed} />
            <Route path="/connections" component={Connections} />

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
