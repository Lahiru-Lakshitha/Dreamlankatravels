"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingChatProps {
    phoneNumber?: string;
}

const contacts = [
    {
        name: "Charith",
        role: "Travel Consultant",
        number: "94771234567",
        message: "Hi Charith, I'm interested in planning a trip to Sri Lanka!"
    },
    {
        name: "Nuwan",
        role: "Customer Support",
        number: "94771234567",
        message: "Hi Nuwan, I have a question about my booking."
    }
];

export function FloatingChat({ phoneNumber = "94771234567" }: FloatingChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobileBubbleVisible, setIsMobileBubbleVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Initial mount & Mobile Bubble Timer
    useEffect(() => {
        setIsMounted(true);
        // Match original animation timing logic
        const timer = setTimeout(() => {
            setIsMobileBubbleVisible(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setHasInteracted(true);
    };

    const handleContactClick = (number: string, message: string) => {
        window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!isMounted) return null;

    return (
        <div
            ref={containerRef}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5"
        >
            {/* Popup Card */}
            <div
                className={cn(
                    "w-[340px] bg-[#f0f2f5] rounded-2xl shadow-2xl overflow-hidden origin-bottom-right transition-all ease-out mb-2",
                    // Popup Animation: Fast and snappy (200ms) to feel instant
                    "duration-200",
                    isOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 translate-y-4 pointer-events-none absolute bottom-16 right-0"
                )}
            >
                {/* Header - Matches reference exactly */}
                <div className="bg-[#075E54] px-6 py-5 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <h3 className="font-bold text-lg mb-1 relative z-10">Start a Conversation</h3>
                    <p className="text-white/90 text-[13px] leading-relaxed relative z-10">
                        Hi! Click one of our members below to chat on WhatsApp
                    </p>
                </div>

                {/* Contact List */}
                <div className="p-2 bg-[#dadbd6] flex flex-col gap-[1px]">
                    {contacts.map((contact) => (
                        <button
                            key={contact.name}
                            onClick={() => handleContactClick(contact.number, contact.message)}
                            className="w-full flex items-center justify-between bg-white p-4 hover:bg-gray-50 transition-colors group first:rounded-t-lg last:rounded-b-lg text-left relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 relative z-10">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#128C7E] flex items-center justify-center text-white shadow-sm flex-shrink-0">
                                    <MessageCircle className="w-5 h-5 fill-current" />
                                </div>
                                {/* Info */}
                                <div>
                                    <p className="font-bold text-gray-900 text-[15px]">{contact.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{contact.role}</p>
                                </div>
                            </div>
                            {/* Icon */}
                            <div className="text-gray-300 group-hover:text-[#25D366] transition-colors relative z-10">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pointer-events-none">
                {/* Text Bubble - Matches PREVIOUS animation EXACTLY (duration-500) */}
                <div
                    className={cn(
                        "pointer-events-auto bg-white dark:bg-[#0c2b1e] text-[#0a4a36] dark:text-[#e8f5e9]",
                        "px-4 py-2.5 rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.12)]",
                        "font-medium text-[13px] whitespace-nowrap",
                        "transition-all ease-out origin-right",
                        // STRICT RULE: duration-500 to match original request
                        "duration-500",
                        "hover:scale-105 hover:shadow-[0_8px_24px_rgba(0,0,0,0.16)] cursor-pointer",
                        isOpen ? "opacity-0 scale-90 translate-x-4 pointer-events-none" :
                            (isMobileBubbleVisible ? "opacity-100 scale-100 translate-x-0" : "opacity-0 translate-x-8 scale-95 pointer-events-none absolute right-20 md:relative md:opacity-100 md:scale-100 md:translate-x-0")
                    )}
                    onClick={() => setIsOpen(true)}
                >
                    Need Help? Chat with us
                </div>

                {/* Main Toggle Button */}
                <button
                    onClick={handleToggle}
                    className={cn(
                        "pointer-events-auto relative group",
                        "w-12 h-12 flex items-center justify-center",
                        "rounded-full shadow-[0_6px_20px_rgba(0,0,0,0.15)]",
                        "transition-all duration-300 ease-out",
                        isOpen ? "bg-[#075E54] rotate-90" : "bg-[#25D366] hover:bg-[#20BD5A] hover:scale-110 hover:shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
                    )}
                    aria-label={isOpen ? "Close chat" : "Open chat"}
                    aria-expanded={isOpen}
                >
                    {isOpen ? (
                        <X className="w-5 h-5 text-white" />
                    ) : (
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white relative z-10">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                    )}

                    {/* Restored Pulse Animation */}
                    {!isOpen && !hasInteracted && (
                        <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30 pointer-events-none" />
                    )}
                </button>
            </div>
        </div>
    );
}
