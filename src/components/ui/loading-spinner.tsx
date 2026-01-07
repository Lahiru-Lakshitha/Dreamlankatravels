import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-sunset", sizeClasses[size])} />
      {text && <p className="text-muted-foreground text-sm animate-pulse">{text}</p>}
    </div>
  );
}

interface PageLoadingProps {
  text?: string;
}

export function PageLoading({ text = "Loading..." }: PageLoadingProps) {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-background">
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
}

interface ContentLoadingProps {
  text?: string;
  className?: string;
}

export function ContentLoading({ text, className }: ContentLoadingProps) {
  return (
    <div className={cn("flex justify-center py-12", className)}>
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}
