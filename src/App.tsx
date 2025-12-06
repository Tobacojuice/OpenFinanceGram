import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Header, Sidebar } from "@/components/layout";
import { TutorialButton } from "@/components/common";
import { ProtectedRoute } from "@/components/auth";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import Community from "./pages/Community";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import JobSea from "./pages/JobSea";
import OpenBBRedirect from "./pages/OpenBBRedirect";
import Resources from "./pages/Resources";
import StudyAssistant from "./pages/StudyAssistant";
import News from "./pages/News";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserPreferencesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                <Header />
                <div className="flex-1 p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/jobsea" replace />} />
                    <Route path="/jobsea" element={
                      <ProtectedRoute>
                        <JobSea />
                      </ProtectedRoute>
                    } />
                    <Route path="/news" element={
                      <ProtectedRoute>
                        <News />
                      </ProtectedRoute>
                    } />
                    <Route path="/resources" element={
                      <ProtectedRoute>
                        <Resources />
                      </ProtectedRoute>
                    } />
                    <Route path="/study" element={
                      <ProtectedRoute>
                        <StudyAssistant />
                      </ProtectedRoute>
                    } />
                    <Route path="/community" element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } />
                    <Route path="/openbb" element={<OpenBBRedirect />} />
                    <Route path="/settings" element={
                      <ProtectedRoute>
                        <Settings />
                      </ProtectedRoute>
                    } />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
              </main>
            </div>
            <TutorialButton />
          </SidebarProvider>
        </BrowserRouter>
      </UserPreferencesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
