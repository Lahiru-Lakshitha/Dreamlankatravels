import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export function GlassCard({
    children,
    className,
    hoverEffect = true,
    ...props
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 dark:bg-black/40 dark:border-white/10 backdrop-blur-md shadow-soft transition-all duration-300",
                hoverEffect && "hover:shadow-strong hover:-translate-y-1 hover:bg-white/70 dark:hover:bg-black/50",
                className
            )}
            {...props}
        >
            {/* Glossy gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100" />
            {children}
        </div>
    );
}
