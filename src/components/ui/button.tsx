import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "crimson" | "gold";
  size?: "default" | "sm" | "lg" | "icon" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
    
    const variants: Record<string, string> = {
      default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
      outline: "border border-border/80 bg-background/50 hover:bg-accent hover:text-accent-foreground shadow-sm",
      secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      crimson: "bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-md hover:opacity-95 ring-1 ring-white/20",
      gold: "bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-amber-950 font-black shadow-md hover:brightness-105 border border-amber-300/60"
    };

    const sizes: Record<string, string> = {
      default: "h-9 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-10 rounded-xl px-6",
      icon: "h-9 w-9 p-0",
      pill: "h-7 px-3 text-xs rounded-full"
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
