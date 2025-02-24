import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar, SidebarBody } from "./ui/sidebar";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { 
  LayoutDashboard, 
  UserCog, 
  Calendar as CalendarIcon, 
  ListTodo,
  Building2, 
  Moon, 
  Sun, 
  UserPlus,
  FolderKanban,
  Settings
} from "lucide-react";

const LOGO_URL = "https://i.postimg.cc/28D4j6hk/Submark-Alternative-Colour.png";

const Logo = () => (
  <Link
    to="/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <img
      src={LOGO_URL}
      className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
      alt="Logo"
    />
    <span className="font-medium text-black dark:text-white whitespace-pre">
      BaitoAI Labs
    </span>
    <div className="absolute bottom-0 left-0 right-0 h-px bg-neutral-200 dark:bg-neutral-700" />
    <div className="absolute bottom-[-20px] left-0 right-0 text-center text-xs text-neutral-500 dark:text-neutral-400">
      v0.0.1
    </div>
  </Link>
);

const LogoIcon = () => (
  <Link
    to="/dashboard"
    className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
  >
    <img
      src={LOGO_URL}
      className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
      alt="Logo"
    />
  </Link>
);



interface SidebarDemoProps {
  children: React.ReactNode;
  activeView?: string;
  onViewChange?: (view: string) => void;
}

export function SidebarDemo({ children }: SidebarDemoProps) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard" && "bg-muted"
      ),
      "aria-label": "Go to Dashboard"
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: <FolderKanban className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/projects" && "bg-muted"
      )
    },
    {
      label: "Calendar",
      href: "/dashboard/calendar",
      icon: <CalendarIcon className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/calendar" && "bg-muted"
      )
    },
    {
      label: "Candidates",
      href: "/dashboard/candidates",
      icon: <UserPlus className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/candidates" && "bg-muted"
      )
    },
    {
      label: "To-Do-List",
      href: "/dashboard/todo",
      icon: <ListTodo className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/todo" && "bg-muted"
      )
    },
    {
      label: "Companies",
      href: "/dashboard/companies",
      icon: <Building2 className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/companies" && "bg-muted"
      )
    },
    {
      label: "Theme",
      href: "#",
      icon: theme === "dark" ? (
        <Moon className="sidebar-link-icon" />
      ) : (
        <Sun className="sidebar-link-icon" />
      ),
      className: "sidebar-link theme-toggle"
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="sidebar-link-icon" />,
      className: cn(
        "sidebar-link",
        location.pathname === "/dashboard/settings" && "bg-muted"
      )
    }
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
                link.href === "#" ? (
                  <button
                    key={idx}
                    onClick={() => {
                      const newTheme = theme === "dark" ? "light" : "dark";
                      setTheme(newTheme);
                    }}
                    className={link.className}
                  >
                    {link.icon}
                    {open && <span>{link.label}</span>}
                  </button>
                ) : (
                  <Link
                    key={idx}
                    to={link.href}
                    className={link.className}
                    aria-label={link["aria-label"]}
                    aria-current={location.pathname === link.href ? "page" : "false"}
                  >
                    {link.icon}
                    {open && <span>{link.label}</span>}
                  </Link>
                )
              ))}
            </div>
          </div>
          <div>
            <button className="sidebar-link">
              <UserCog className="sidebar-link-icon" />
              {open && <span>Kevin Reuben</span>}
            </button>
          </div>
        </SidebarBody>
      </Sidebar>
      {children}
    </div>
  );
}
