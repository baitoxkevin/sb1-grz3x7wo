import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import LoginPage from '@/pages/auth/LoginPage';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';
import { SidebarDemo } from '@/components/sidebar-demo';
import { Dashboard } from '@/components/ui/dashboard';
import CalendarPage from '@/pages/CalendarPage';
import CompaniesPage from '@/pages/CompaniesPage';
import ProjectsPage from '@/pages/ProjectsPage';
import InvitesPage from '@/pages/InvitesPage';
import TodoPage from '@/pages/TodoPage';
import CandidatesPage from '@/pages/CandidatesPage';

function App() {
  const [user, setUser] = useState<Database['public']['Tables']['users']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    // Check current auth state
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
            setUser(data as Database['public']['Tables']['users']['Row']);
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
        toast.error('Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in');
        }
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          setUser(data as Database['public']['Tables']['users']['Row']);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage onViewChange={setActiveView} />} 
      />
      <Route
        path="/"
        element={
          user ? (
            <div className="min-h-screen w-full bg-background text-foreground p-[2px] flex items-center justify-center">
              <SidebarDemo activeView={activeView} onViewChange={setActiveView}>
                {activeView === 'dashboard' && <Dashboard />}
                {activeView === 'calendar' && <CalendarPage />}
                {activeView === 'companies' && <CompaniesPage />}
                {activeView === 'projects' && <ProjectsPage />}
                {activeView === 'invites' && <InvitesPage />}
                {activeView === 'todo' && <TodoPage />}
                {activeView === 'candidates' && <CandidatesPage />}
              </SidebarDemo>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
