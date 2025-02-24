import React from "react";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}

export function Sidebar({ open, setOpen, children }: SidebarProps) {
  return (
    <div className={`${open ? "w-64" : "w-20"} transition-all duration-300 ease-in-out`}>
      {children}
    </div>
  );
}

interface SidebarBodyProps {
  className?: string;
  children: React.ReactNode;
}

export function SidebarBody({ className, children }: SidebarBodyProps) {
  return (
    <div className={`flex flex-col h-full p-4 ${className}`}>
      {children}
    </div>
  );
}
