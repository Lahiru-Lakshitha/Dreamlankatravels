"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";

interface FloatingChatProps {
    phoneNumber?: string;
}

export function FloatingChat({ phoneNumber = "94771234567" }: FloatingChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const { t } = useLanguage();

    // Auto-open chat after 5 seconds to invite user
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setIsOpen(true);
            }
        }, 5000);
        return () => clearTimeout(timer);
    }, [hasInteracted]);

    const handleOpen = () => {
        setIsOpen(true);
        setHasInteracted(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setHasInteracted(true);
    };

    const handleWhatsAppClick = () => {
        const message = "Hello! I am interested in planning a trip to Sri Lanka.";
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-white dark:bg-card border border-border/50 shadow-elevated rounded-2xl w-80 overflow-hidden mb-2 origin-bottom-right"
                    >
                        <div className="bg-ocean p-4 flex justify-between items-center text-white">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                        <MessageCircle className="w-6 h-6" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-ocean rounded-full"></span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-sm">Travel Expert</h3>
                                    <p className="text-xs text-white/80">Online now</p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-white/80 hover:text-white transition-colors"
                                aria-label="Close chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-4 bg-muted/30">
                            <div className="bg-white dark:bg-muted p-3 rounded-2xl rounded-tl-none shadow-sm mb-4 text-sm text-foreground/80 leading-relaxed">
                                {t.dashboard?.chatWithUs || "Hello! planning a trip to Sri Lanka? I can help you create a custom itinerary."}
                            </div>

                            <Button
                                onClick={handleWhatsAppClick}
                                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-full gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Start WhatsApp Chat
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "w-14 h-14 rounded-full shadow-elevated transition-transform hover:scale-110",
                    isOpen ? "bg-muted text-muted-foreground hover:bg-muted/80" : "bg-[#25D366] hover:bg-[#20BD5A] text-white"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}

                {/* Pulse effect if closed and not interacted */}
                {!isOpen && !hasInteracted && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-[#25D366] opacity-30"></span>
                )}
            </Button>
        </div>
    );
}
