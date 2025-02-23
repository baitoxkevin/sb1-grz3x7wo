import './App.css';
import { useState } from 'react';
import CalendarPage from './pages/CalendarPage';
import CompaniesPage from './pages/CompaniesPage';
import ProjectsPage from './pages/ProjectsPage';
import InvitesPage from './pages/InvitesPage';
import TodoPage from './pages/TodoPage';
import CandidatesPage from './pages/CandidatesPage';
import SettingsPage from './pages/SettingsPage';
import { SidebarDemo } from './components/sidebar-demo';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
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
  );
}

export default App;
