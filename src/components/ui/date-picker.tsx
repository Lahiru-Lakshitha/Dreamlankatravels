"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    placeholder?: string;
    minDate?: Date;
    maxDate?: Date;
    error?: boolean;
    className?: string;
    disabled?: boolean;
}

export function DatePicker({
    date,
    setDate,
    placeholder = "Pick a date",
    minDate,
    maxDate,
    error,
    className,
    disabled,
}: DatePickerProps) {
    const isMobile = useIsMobile();
    const [open, setOpen] = React.useState(false);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const triggerButton = (
        <Button
            variant="outline"
            className={cn(
                "w-full justify-start text-left font-normal rounded-xl h-12 border-input shadow-sm transition-all duration-300",
                !date && "text-muted-foreground",
                date && "text-foreground font-medium bg-secondary/20 border-primary/20",
                error && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20",
                "focus-visible:ring-2 focus-visible:ring-primary/20",
                className
            )}
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            type="button"
        >
            <CalendarIcon className={cn("mr-2 h-4 w-4", date ? "text-primary" : "text-muted-foreground")} />
            {date ? format(date, "PPP") : <span>{placeholder}</span>}
        </Button>
    );

    // Desktop View - Popover
    if (!isMounted || !isMobile) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    {triggerButton}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => {
                            setDate(newDate);
                            setOpen(false);
                        }}
                        disabled={(date) =>
                            (minDate ? date < minDate : false) ||
                            (maxDate ? date > maxDate : false)
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        );
    }

    // Mobile View - Native Input
    // We overlay the native input on top of the styled button to ensure native behavior handles the interaction
    return (
        <div className="relative w-full">
            <div className="relative w-full">
                {/* Visual Icon */}
                <CalendarIcon className={cn("absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 z-10 pointer-events-none", date ? "text-primary" : "text-muted-foreground")} />

                {/* Native Input: This does the heavy lifting on mobile */}
                <input
                    type="date"
                    inputMode="none" // Key fix for iOS to prevent keyboard
                    disabled={disabled}
                    value={date ? format(date, "yyyy-MM-dd") : ""}
                    min={minDate ? format(minDate, "yyyy-MM-dd") : undefined}
                    max={maxDate ? format(maxDate, "yyyy-MM-dd") : undefined}
                    onChange={(e) => {
                        const val = e.target.value;
                        if (!val) {
                            setDate(undefined);
                        } else {
                            // Create date at noon to avoid timezone shifting
                            const d = new Date(val + "T12:00:00");
                            setDate(d);
                        }
                    }}
                    className={cn(
                        "w-full h-12 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
                        "pl-10", // Space for icon
                        !date && "text-muted-foreground",
                        date && "text-foreground font-medium bg-secondary/20 border-primary/20",
                        error && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20",
                        className
                    )}
                    style={{
                        WebkitAppearance: "none", // Force iOS removal of default styles
                        opacity: 1, // Ensure it's visible so it processes touches correctly
                        position: "relative",
                        zIndex: 1
                    }}
                />
            </div>
        </div>
    );
}
