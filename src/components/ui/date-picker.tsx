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
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
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

    // Fallback to desktop view during SSR to prevent hydration mismatch
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

    // Mobile View - Drawer
    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                {triggerButton}
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm pt-6 pb-8 px-4">
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
                        className="mx-auto border rounded-xl"
                        initialFocus
                    />
                    <div className="mt-4 flex justify-center">
                        <Button variant="outline" onClick={() => setOpen(false)} className="w-full">
                            Close
                        </Button>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
