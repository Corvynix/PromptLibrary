import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/lib/auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PromptFeed from "@/pages/PromptFeed";
import PromptDetail from "@/pages/PromptDetail";
import CreatePrompt from "@/pages/CreatePrompt";
import UserProfile from "@/pages/UserProfile";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected routes */}
      <Route path="/feed">
        <ProtectedRoute>
          <PromptFeed />
        </ProtectedRoute>
      </Route>

      <Route path="/prompts/new">
        <ProtectedRoute>
          <CreatePrompt />
        </ProtectedRoute>
      </Route>

      <Route path="/prompts/:slug">
        {(params) => (
          <ProtectedRoute>
            <PromptDetail slug={params.slug} />
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/profile/:id">
        {(params) => (
          <ProtectedRoute>
            <UserProfile userId={parseInt(params.id)} />
          </ProtectedRoute>
        )}
      </Route>

      {/* Redirect root to feed */}
      <Route path="/">
        <ProtectedRoute>
          <PromptFeed />
        </ProtectedRoute>
      </Route>

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
