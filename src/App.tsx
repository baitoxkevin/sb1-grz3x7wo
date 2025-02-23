import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';
import LoginPage from './pages/LoginPage';
import CalendarPage from './pages/CalendarPage';
import CompaniesPage from './pages/CompaniesPage';
import ProjectsPage from './pages/ProjectsPage';
import InvitesPage from './pages/InvitesPage';
import TodoPage from './pages/TodoPage';
import CandidatesPage from './pages/CandidatesPage';
import SettingsPage from './pages/SettingsPage';
import DocumentsPage from './pages/DocumentsPage';
import { SidebarDemo } from './components/sidebar-demo';

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        checkSuperAdmin(session);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await checkSuperAdmin(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSuperAdmin = async (session: Session) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('raw_user_meta_data')
        .eq('id', user.id)
        .single();
      
      setIsSuperAdmin(userData?.raw_user_meta_data?.is_super_admin || false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background text-foreground flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-background text-foreground p-[2px] flex items-center justify-center">
        <SidebarDemo activeView={activeView} onViewChange={setActiveView}>
          <Routes>
            {isSuperAdmin ? (
              <>
                <Route path="/admin/documents" element={<DocumentsPage />} />
                <Route path="/admin/companies" element={<CompaniesPage />} />
                <Route path="/admin/projects" element={<ProjectsPage />} />
                <Route path="/admin/invites" element={<InvitesPage />} />
                <Route path="/admin/candidates" element={<CandidatesPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />
                <Route path="/admin" element={<Navigate to="/admin/documents" />} />
              </>
            ) : (
              <>
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/invites" element={<InvitesPage />} />
                <Route path="/todo" element={<TodoPage />} />
                <Route path="/candidates" element={<CandidatesPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/calendar" />} />
              </>
            )}
          </Routes>
        </SidebarDemo>
      </div>
    </BrowserRouter>
  );
}

export default App;
