// TanStack implementation of the link shim.
// Maps the registry's `href: string` contract to the typed router Link.

import { Link as RouterLink } from "@tanstack/react-router";
import * as React from "react";

import { cn } from "@/lib/utils";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children?: React.ReactNode;
}

export function Link({ href, className, children, ...props }: LinkProps) {
  return (
    <RouterLink to={href} className={cn(className)} {...props}>
      {children}
    </RouterLink>
  );
}
