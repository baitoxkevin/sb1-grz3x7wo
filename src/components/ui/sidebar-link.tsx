import React from "react";
import { cn } from "@/lib/utils";

import { LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
    className?: string;
    "aria-label"?: string;
    "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false";
    "aria-disabled"?: boolean;
  };
  open?: boolean;
  className?: string;
  "aria-label"?: string;
  "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false";
  "aria-disabled"?: boolean;
}

export function SidebarLink({ 
  link,
  open,
  className,
  "aria-label": ariaLabel,
  "aria-current": ariaCurrent,
  "aria-disabled": ariaDisabled 
}: SidebarLinkProps) {
  return (
    <a
      href={link.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
        link.className,
        className
      )}
      onClick={link.onClick}
      aria-label={ariaLabel || link["aria-label"]}
      aria-current={ariaCurrent || link["aria-current"]}
      aria-disabled={ariaDisabled || link["aria-disabled"]}
    >
      {React.isValidElement(link.icon) 
        ? link.icon 
        : React.createElement(link.icon as React.ElementType, { className: "h-4 w-4" })}
      {open !== false && link.label}
    </a>
  );
}
