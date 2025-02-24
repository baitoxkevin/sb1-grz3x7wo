import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { LoginPage } from './pages/auth/LoginPage';
import { supabase } from './lib/supabase';
import { Toaster } from './components/ui/toaster';
import { toast } from 'sonner';
import type { Database } from './types/database.types';
import { SidebarDemo } from './components/sidebar-demo';
import { Dashboard } from './components/ui/dashboard';
import CalendarPage from './pages/CalendarPage';
import CompaniesPage from './pages/CompaniesPage';
import ProjectsPage from './pages/ProjectsPage';
import InvitesPage from './pages/InvitesPage';
import TodoPage from './pages/TodoPage';
import CandidatesPage from './pages/CandidatesPage';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (data) {
          setUser(data);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  const location = useLocation();
  
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <div className="min-h-screen w-full bg-background p-[2px]">
              <SidebarDemo activeView={location.pathname.split('/')[2] || 'dashboard'} onViewChange={() => {}}>
                <Outlet />
              </SidebarDemo>
            </div>
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="invites" element={<InvitesPage />} />
        <Route path="todo" element={<TodoPage />} />
        <Route path="candidates" element={<CandidatesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
