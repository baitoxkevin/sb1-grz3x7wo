import './App.css';
import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import CalendarPage from './pages/CalendarPage';
import CompaniesPage from './pages/CompaniesPage';
import ProjectsPage from './pages/ProjectsPage';
import InvitesPage from './pages/InvitesPage';
import TodoPage from './pages/TodoPage';
import CandidatesPage from './pages/CandidatesPage';
import SettingsPage from './pages/SettingsPage';
import { SidebarDemo } from './components/sidebar-demo';
import { supabase } from './lib/supabase';
import { toast } from 'sonner';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
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
            setUser(data as User);
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
          
          setUser(data as User);
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
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route
        path="/"
        element={
          user ? (
            <div className="min-h-screen w-full bg-background text-foreground p-[2px] flex items-center justify-center">
              <SidebarDemo activeView={activeView} onViewChange={setActiveView}>
                {activeView === 'calendar' && <CalendarPage />}
                {activeView === 'companies' && <CompaniesPage />}
                {activeView === 'projects' && <ProjectsPage />}
                {activeView === 'invites' && <InvitesPage />}
                {activeView === 'todo' && <TodoPage />}
                {activeView === 'candidates' && <CandidatesPage />}
                {activeView === 'settings' && <SettingsPage />}
              </SidebarDemo>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
