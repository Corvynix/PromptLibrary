import { ComponentType, lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Auth from "@/pages/Auth";
import Landing from "@/pages/Landing";
import Purchase from "@/pages/Purchase";
import NotFound from "@/pages/not-found";

const Diagnosis = lazy(() => import("@/pages/Diagnosis"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Onboarding = lazy(() => import("@/pages/auth/Onboarding"));
const Projects = lazy(() => import("@/pages/project/Projects"));
const Sprint = lazy(() => import("@/pages/sprint/Sprint"));
const Community = lazy(() => import("@/pages/community/Community"));
const Radar = lazy(() => import("@/pages/radar/Radar"));
const Vault = lazy(() => import("@/pages/vault/Vault"));
const Admin = lazy(() => import("@/pages/admin/Admin"));
const LegalPage = lazy(() => import("@/pages/Legal"));

function ProtectedRoute({ component: Page, requireAdmin = false }: { component: ComponentType; requireAdmin?: boolean }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex min-h-screen items-center justify-center" role="status" aria-label="جار التحميل"><Loader2 className="h-7 w-7 animate-spin" /></div>;
  if (!user) return <Redirect to={`/auth?returnTo=${encodeURIComponent(window.location.pathname)}`} />;
  if (requireAdmin && !user.roles.includes("admin")) return <Redirect to="/dashboard" />;
  return <Page />;
}

function AppRoutes() {
  return <Suspense fallback={<div className="flex min-h-screen items-center justify-center" role="status" aria-label="جار التحميل"><Loader2 className="h-7 w-7 animate-spin" /></div>}>
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/diagnose/:id" component={Diagnosis} />
      <Route path="/diagnose" component={Diagnosis} />
      <Route path="/purchase" component={Purchase} />
      <Route path="/privacy">{() => <LegalPage page="privacy" />}</Route>
      <Route path="/terms">{() => <LegalPage page="terms" />}</Route>
      <Route path="/refund">{() => <LegalPage page="refund" />}</Route>
      <Route path="/guidelines">{() => <LegalPage page="guidelines" />}</Route>
      <Route path="/:rest*"><AppShell><Switch>
        <Route path="/onboarding"><ProtectedRoute component={Onboarding} /></Route>
        <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
        <Route path="/projects"><ProtectedRoute component={Projects} /></Route>
        <Route path="/sprint"><ProtectedRoute component={Sprint} /></Route>
        <Route path="/sprint/day/:dayNumber"><ProtectedRoute component={Sprint} /></Route>
        <Route path="/sprint/crm"><ProtectedRoute component={Sprint} /></Route>
        <Route path="/payment/status"><ProtectedRoute component={Sprint} /></Route>
        <Route path="/community"><ProtectedRoute component={Community} /></Route>
        <Route path="/community/post/:id"><ProtectedRoute component={Community} /></Route>
        <Route path="/radar"><ProtectedRoute component={Radar} /></Route>
        <Route path="/vault"><ProtectedRoute component={Vault} /></Route>
        <Route path="/admin"><ProtectedRoute component={Admin} requireAdmin /></Route>
        <Route component={NotFound} />
      </Switch></AppShell></Route>
    </Switch>
  </Suspense>;
}

export default function App() {
  return <ErrorBoundary><QueryClientProvider client={queryClient}><AuthProvider><AppRoutes /><Toaster /></AuthProvider></QueryClientProvider></ErrorBoundary>;
}
