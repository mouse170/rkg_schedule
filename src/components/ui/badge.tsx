import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "gold"
    | "crimson"
    | "cyan"
    | "teal"
    | "violet"
    | "blue"
    | "emerald";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants: Record<string, string> = {
    default: "border-transparent bg-primary text-primary-foreground shadow-sm",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
    outline: "text-foreground border border-border/80 bg-background/40",
    gold: "bg-gradient-to-r from-amber-400/20 via-amber-300/30 to-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-400/60 font-black shadow-sm ring-1 ring-amber-400/30",
    crimson: "bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-sm font-black border border-white/20",
    cyan: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300/80 dark:border-cyan-800/80 font-black",
    teal: "bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-teal-800/80 font-black",
    violet: "bg-violet-100 dark:bg-violet-950/80 text-violet-900 dark:text-violet-200 border border-violet-300/80 dark:border-violet-700/80 font-black shadow-sm",
    blue: "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/80 font-bold",
    emerald: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-bold"
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };
