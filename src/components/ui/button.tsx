import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles: Premium transitions, rounded corners, consistent sizing
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300 active:scale-95",
  {
    variants: {
      variant: {
        // PRIMARY: Brand green background, white text, soft shadow, luxury hover
        default:
          "bg-primary text-primary-foreground shadow-soft hover:bg-primary-hover hover:shadow-strong hover:-translate-y-0.5",

        // DESTRUCTIVE: Red variant maintaining system consistency
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5",

        // SECONDARY/OUTLINE: White background, green border & text, fills on hover
        outline:
          "border border-primary/20 bg-background text-primary hover:bg-primary/5 hover:border-primary/50 shadow-sm",

        // SECONDARY: Muted background for subtle actions
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5 shadow-sm",

        // GHOST: Minimal style for inline actions
        ghost:
          "text-foreground/80 hover:bg-primary/5 hover:text-primary",

        // LINK: Underline style for text links
        link:
          "text-primary underline-offset-4 hover:underline",

        // HERO PRIMARY: Main CTA buttons on hero sections - solid green
        hero:
          "bg-gradient-to-r from-[hsl(var(--ocean))] to-[hsl(var(--ocean-light))] text-white font-semibold shadow-soft hover:shadow-[0_0_20px_hsl(var(--ocean)/0.3)] hover:scale-105 border border-white/10",

        // HERO OUTLINE: Secondary hero buttons - glass effect with green border
        heroOutline:
          "border border-white/30 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50 font-medium shadow-sm hover:translate-x-1",

        // OCEAN: Alias for primary green style
        ocean:
          "bg-primary text-white shadow-soft hover:bg-primary-hover hover:shadow-strong hover:-translate-y-0.5",

        // OCEAN OUTLINE: Green outline variant
        oceanOutline:
          "border border-primary text-primary hover:bg-primary hover:text-white shadow-sm hover:-translate-y-0.5",

        // GOLD: Accent gold buttons (kept for specific use cases)
        gold:
          "bg-gradient-to-r from-[hsl(var(--sunset))] to-[hsl(var(--sunset-light))] text-white shadow-soft hover:shadow-[0_0_20px_hsl(var(--sunset)/0.4)] font-semibold hover:-translate-y-0.5",

        // DARK BACKGROUND: Brighter green for visibility on dark sections
        onDark:
          "bg-white/10 backdrop-blur border border-white/20 text-white hover:bg-white/20 shadow-soft",

        // WHATSAPP: Green WhatsApp brand color
        whatsapp:
          "bg-[#25D366] text-white shadow-soft hover:bg-[#20BD5A] hover:shadow-strong hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 rounded-full px-4 text-xs tracking-wide uppercase",
        lg: "h-12 rounded-full px-8 text-base",
        xl: "h-14 rounded-full px-10 text-lg tracking-wide",
        icon: "h-11 w-11 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
