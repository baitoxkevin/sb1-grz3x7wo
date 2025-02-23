import React, { useState } from "react";
import { useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  UserCog, 
  Settings, 
  LogOut, 
  Calendar as CalendarIcon, 
  Users,
  ListTodo,
  Clock, 
  Bell, 
  ChevronRight, 
  Building2, 
  Mail, 
  CalendarDays, 
  Zap, 
  Moon, 
  Sun, 
  Loader2,
  UserPlus,
  FolderKanban
} from "lucide-react";
import { useTheme } from "next-themes";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const LOGO_URL = "https://i.postimg.cc/28D4j6hk/Submark-Alternative-Colour.png";

const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      {LOGO_URL ? (
        <img
          src={LOGO_URL}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
          alt="Logo"
        />
      ) : (
        <Zap className="h-5 w-6 text-black dark:text-white flex-shrink-0" />
      )}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        BaitoAI Labs
      </motion.span>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-700" />
      <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs text-neutral-500 dark:text-neutral-400">
        v0.0.1
      </div>
    </a>
  );
};

const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      {LOGO_URL ? (
        <img
          src={LOGO_URL}
          className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
          alt="Logo"
        />
      ) : (
        <Zap className="h-5 w-6 text-black dark:text-white flex-shrink-0" />
      )}
    </a>
  );
};

const Dashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const meetings = [
    {
      title: "Design Review",
      time: "10:00 AM",
      attendees: 4,
      priority: "high"
    },
    {
      title: "Team Standup",
      time: "2:30 PM",
      attendees: 8,
      priority: "medium"
    },
    {
      title: "Project Planning",
      time: "4:00 PM",
      attendees: 6,
      priority: "low"
    }
  ];

  return (
    <div className="flex flex-1">
      <div className="p-2 sm:p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 sm:gap-4 w-full h-full overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-blue-500/10 text-blue-500">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Events</p>
              <p className="text-xl sm:text-2xl font-semibold">12</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-green-500/10 text-green-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Attendees</p>
              <p className="text-xl sm:text-2xl font-semibold">48</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-yellow-500/10 text-yellow-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Hours</p>
              <p className="text-xl sm:text-2xl font-semibold">24</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-purple-500/10 text-purple-500">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Reminders</p>
              <p className="text-xl sm:text-2xl font-semibold">8</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0 overflow-hidden">
          <div className="rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold">Calendar</h3>
              <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
                View all
              </button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border w-full"
            />
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold">Today's Meetings</h3>
              <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
                View all
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto">
              {meetings.map((meeting, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      meeting.priority === "high" ? "bg-red-500" :
                      meeting.priority === "medium" ? "bg-yellow-500" :
                      "bg-green-500"
                    )} />
                    <div>
                      <p className="text-sm sm:text-base font-medium">{meeting.title}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        <Clock className="h-3 w-3" />
                        <span>{meeting.time}</span>
                        <span>•</span>
                        <Users className="h-3 w-3" />
                        <span>{meeting.attendees}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CalendarContent = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const meetings = [
    {
      title: "Design Review",
      time: "10:00 AM",
      attendees: 4,
      priority: "high"
    },
    {
      title: "Team Standup",
      time: "2:30 PM",
      attendees: 8,
      priority: "medium"
    },
    {
      title: "Project Planning",
      time: "4:00 PM",
      attendees: 6,
      priority: "low"
    }
  ];

  return (
    <div className="flex flex-1">
      <div className="p-4 rounded-none md:rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-4 w-full h-full overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-blue-500/10 text-blue-500">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Events</p>
              <p className="text-xl sm:text-2xl font-semibold">12</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-green-500/10 text-green-500">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Attendees</p>
              <p className="text-xl sm:text-2xl font-semibold">48</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-yellow-500/10 text-yellow-500">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Hours</p>
              <p className="text-xl sm:text-2xl font-semibold">24</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gray-100 dark:bg-neutral-800">
            <div className="p-2.5 rounded-md bg-purple-500/10 text-purple-500">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium">Reminders</p>
              <p className="text-xl sm:text-2xl font-semibold">8</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 flex-1 min-h-0">
          <div className="rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold">Calendar</h3>
              <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
                View all
              </button>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => setDate(newDate)}
              className="rounded-md border w-full"
            />
          </div>
          <div className="rounded-lg bg-gray-100 dark:bg-neutral-800 p-3 sm:p-4 flex flex-col gap-3 sm:gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-semibold">Today's Meetings</h3>
              <button className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
                View all
              </button>
            </div>
            <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto">
              {meetings.map((meeting, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 sm:p-3 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      meeting.priority === "high" ? "bg-red-500" :
                      meeting.priority === "medium" ? "bg-yellow-500" :
                      "bg-green-500"
                    )} />
                    <div>
                      <p className="text-sm sm:text-base font-medium">{meeting.title}</p>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        <Clock className="h-3 w-3" />
                        <span>{meeting.time}</span>
                        <span>•</span>
                        <Users className="h-3 w-3" />
                        <span>{meeting.attendees}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SidebarDemoProps {
  children: React.ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export function SidebarDemo({ children, activeView, onViewChange }: SidebarDemoProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      onViewChange("dashboard");
      
      toast({
        title: "Dashboard loaded",
        description: "Welcome to your dashboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!mounted) {
    return null;
  }

  const links = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="sidebar-link-icon" />,
      onClick: handleDashboardClick,
      className: cn(
        "sidebar-link",
        activeView === "dashboard" && "bg-muted"
      ),
      "aria-label": "Go to Dashboard",
      "aria-current": activeView === "dashboard" ? "page" : undefined
    },
    {
      label: "Projects",
      href: "/admin/projects",
      icon: (
        <FolderKanban className="sidebar-link-icon" />
      ),
      onClick: (e) => {
        e.preventDefault();
        onViewChange("projects");
      },
      className: cn(
        "sidebar-link",
        activeView === "projects" && "bg-muted"
      ),
      "aria-current": activeView === "projects" ? "page" : undefined,
    },
    {
      label: "Calendar",
      href: "/admin/calendar",
      icon: (
        <CalendarIcon 
          className="sidebar-link-icon" 
        />
      ),
      onClick: (e) => {
        e.preventDefault();
        onViewChange("calendar");
      },
      className: cn(
        "sidebar-link",
        activeView === "calendar" && "bg-muted"
      ),
      "aria-current": activeView === "calendar" ? "page" : undefined,
    },
    {
      label: "Candidates",
      href: "/admin/candidates",
      icon: (
        <UserPlus className="sidebar-link-icon" />
      ),
      onClick: (e) => {
        e.preventDefault();
        onViewChange("candidates");
      },
      className: cn(
        "sidebar-link",
        activeView === "candidates" && "bg-muted"
      ),
      "aria-current": activeView === "candidates" ? "page" : undefined,
    },
    {
      label: "To-Do-List",
      href: "/admin/todo",
      icon: (
        <ListTodo className="sidebar-link-icon" />
      ),
      onClick: (e) => {
        e.preventDefault();
        onViewChange("todo");
      },
      className: cn(
        "sidebar-link",
        activeView === "todo" && "bg-muted"
      ),
      "aria-current": activeView === "todo" ? "page" : undefined,
    },
    {
      label: "Companies",
      href: "/admin/companies",
      icon: (
        <Building2 className="sidebar-link-icon" />
      ),
      onClick: (e) => {
        e.preventDefault();
        onViewChange("companies");
      },
      className: "sidebar-link",
      "aria-current": activeView === "companies" ? "page" : undefined,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="sidebar-link-icon" />,
      onClick: (e) => {
        e.preventDefault();
        onViewChange("settings");
      },
      className: "sidebar-link",
      "aria-current": activeView === "settings" ? "page" : undefined,
    },
    {
      label: "Theme",
      href: "/theme",
      icon: theme === "dark" ? (
        <Moon className="sidebar-link-icon" />
      ) : (
        <Sun className="sidebar-link-icon" />
      ),
      onClick: (e) => {
        e.preventDefault();
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      },
      className: cn("sidebar-link", "theme-toggle"),
    },
  ];

  return (
    <div
      className={cn(
        "rounded-xl flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full max-w-[1400px] mx-auto h-[calc(100vh-4px)] border border-neutral-200 dark:border-neutral-700 overflow-hidden shadow-xl"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  open={open}
                  className={link.className}
                  aria-label={link["aria-label"]}
                  aria-current={link["aria-current"]}
                  aria-disabled={link["aria-disabled"]}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              open={open}
              link={{
                label: "Kevin Reuben",
                href: "#",
                icon: (
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Kevin Reuben's avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      {activeView === "dashboard" ? <Dashboard /> : children}
    </div>
  );
}