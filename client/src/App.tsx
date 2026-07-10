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
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Support from "@/pages/Support";
import NotFound from "@/pages/not-found";

// Lazy load heavy/less critical pages
const Apply = lazy(() => import("@/pages/Apply"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const VerifyEmail = lazy(() => import("@/pages/auth/VerifyEmail"));
const Onboarding = lazy(() => import("@/pages/auth/Onboarding"));
const Settings = lazy(() => import("@/pages/user/Settings"));
const Notifications = lazy(() => import("@/pages/user/Notifications"));
const ActivityFeed = lazy(() => import("@/pages/user/ActivityFeed"));
const Connections = lazy(() => import("@/pages/user/Connections"));
const Cookies = lazy(() => import("@/pages/legal/Cookies"));
const AdsDisclosure = lazy(() => import("@/pages/legal/AdsDisclosure"));
const ServerError = lazy(() => import("@/pages/system/ServerError"));
const Maintenance = lazy(() => import("@/pages/system/Maintenance"));
const Changelog = lazy(() => import("@/pages/system/Changelog"));
const ApiDocs = lazy(() => import("@/pages/system/ApiDocs"));

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
            <Route path="/apply" component={Apply} />

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
            <Route path="/support" component={Support} />
            <Route path="/cookies" component={Cookies} />
            <Route path="/ads-disclosure" component={AdsDisclosure} />

            {/* User Routes */}
            <Route path="/settings" component={Settings} />
            <Route path="/notifications" component={Notifications} />
            <Route path="/activity" component={ActivityFeed} />
            <Route path="/connections" component={Connections} />

            {/* Fallback */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
