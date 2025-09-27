import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import { TemplateManager } from "./components/templates/TemplateManager";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Calls from "./pages/Calls";
import FollowUp from "./pages/FollowUp";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, profile } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (!profile?.onboarded) {
    return <OnboardingFlow onComplete={() => window.location.reload()} />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/clients" element={
              <ProtectedRoute>
                <AppLayout>
                  <Clients />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/appels" element={
              <ProtectedRoute>
                <AppLayout>
                  <Calls />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/suivi" element={
              <ProtectedRoute>
                <AppLayout>
                  <FollowUp />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytique" element={
              <ProtectedRoute>
                <AppLayout>
                  <Analytics />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/templates" element={
              <ProtectedRoute>
                <AppLayout>
                  <TemplateManager />
                </AppLayout>
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
