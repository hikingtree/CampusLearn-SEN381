import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthProvider, useAuth } from "@/lib/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import Topics from "@/pages/Topics";
import Forum from "@/pages/Forum";
import Resources from "@/pages/Resources";
import Messages from "@/pages/Messages";
import Profile from "@/pages/Profile";
//Chatbot 
import ChatbotPage from "@/pages/Chatbot";


function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return <>{children}</>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/topics">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Topics />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/forum">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Forum />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/resources">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Resources />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/messages">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Messages />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/chatbot">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <ChatbotPage />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/profile">
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Profile />
          </AuthenticatedLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
