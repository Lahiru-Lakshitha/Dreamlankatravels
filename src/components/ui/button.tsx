import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles: Premium transitions, rounded corners, consistent sizing
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:transition-transform [&_svg]:duration-300",
  {
    variants: {
      variant: {
        // PRIMARY: Brand green background, white text, soft shadow, luxury hover
        default: 
          "bg-primary text-primary-foreground shadow-[var(--btn-shadow)] hover:bg-[hsl(var(--primary-hover))] hover:shadow-[var(--btn-shadow-hover)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[var(--btn-shadow)]",
        
        // DESTRUCTIVE: Red variant maintaining system consistency
        destructive: 
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:-translate-y-0.5 active:translate-y-0",
        
        // SECONDARY/OUTLINE: White background, green border & text, fills on hover
        outline: 
          "border-2 border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0",
        
        // SECONDARY: Muted background for subtle actions
        secondary: 
          "bg-muted text-primary hover:bg-primary/10 hover:-translate-y-0.5 active:translate-y-0",
        
        // GHOST: Minimal style for inline actions
        ghost: 
          "text-primary hover:bg-primary/10 hover:text-primary",
        
        // LINK: Underline style for text links
        link: 
          "text-primary underline-offset-4 hover:underline",
        
        // HERO PRIMARY: Main CTA buttons on hero sections - solid green
        hero: 
          "bg-primary text-primary-foreground font-semibold shadow-[var(--btn-shadow)] hover:bg-[hsl(var(--primary-hover))] hover:shadow-[var(--btn-glow),var(--btn-shadow-hover)] hover:-translate-y-0.5 active:translate-y-0",
        
        // HERO OUTLINE: Secondary hero buttons - glass effect with green border
        heroOutline: 
          "border-2 border-primary-foreground/80 bg-primary-foreground/10 text-primary-foreground backdrop-blur-md hover:bg-primary-foreground hover:text-primary font-semibold hover:-translate-y-0.5 active:translate-y-0",
        
        // OCEAN: Alias for primary green style
        ocean: 
          "bg-primary text-primary-foreground shadow-[var(--btn-shadow)] hover:bg-[hsl(var(--primary-hover))] hover:shadow-[var(--btn-shadow-hover)] hover:-translate-y-0.5 active:translate-y-0",
        
        // OCEAN OUTLINE: Green outline variant
        oceanOutline: 
          "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5 active:translate-y-0",
        
        // GOLD: Accent gold buttons (kept for specific use cases)
        gold: 
          "bg-accent text-accent-foreground shadow-sm hover:bg-accent/90 font-semibold hover:-translate-y-0.5 active:translate-y-0",
        
        // DARK BACKGROUND: Brighter green for visibility on dark sections
        onDark: 
          "bg-[hsl(var(--ocean-light))] text-primary-foreground font-semibold shadow-[0_2px_12px_hsl(160_40%_42%/0.3)] hover:bg-[hsl(160_35%_48%)] hover:shadow-[0_4px_20px_hsl(160_35%_48%/0.4)] hover:-translate-y-0.5 active:translate-y-0",
        
        // WHATSAPP: Green WhatsApp brand color
        whatsapp: 
          "bg-[#25D366] text-white shadow-sm hover:bg-[#20BD5A] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        default: "h-11 px-6 py-2.5",
        sm: "h-9 rounded-lg px-4 text-sm",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-2xl px-10 text-lg",
        icon: "h-11 w-11 rounded-xl",
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
