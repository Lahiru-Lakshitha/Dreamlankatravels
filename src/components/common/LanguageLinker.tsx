"use client";

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'it', label: 'Italiano' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'zh-CN', label: '中文' },
    { code: 'ar', label: 'العربية' },
];

export function LanguageLinker() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log("LanguageLinker mounted"); // Debug log

        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLanguageClick = (langCode: string) => {
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${langCode}&u=${encodeURIComponent(currentUrl)}`;
        window.open(translateUrl, '_blank', 'noopener,noreferrer');
        setIsOpen(false);
    };

    return (
        <div className="relative flex items-center" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="
                    flex items-center justify-center
                    w-7 h-7 md:w-8 md:h-8
                    rounded-full
                    bg-white/10 hover:bg-white/20 
                    border border-white/10
                    transition-all duration-200
                    text-foreground/80 hover:text-foreground
                    cursor-pointer
                "
                aria-label="Select Language"
            >
                <Globe className="w-4 h-4 md:w-4.5 md:h-4.5" />
            </button>

            {isOpen && (
                <div className="
                    absolute right-0 top-full mt-2 w-40
                    bg-card/95 backdrop-blur-xl
                    border border-border/50
                    rounded-xl shadow-lg
                    py-1
                    z-50
                    overflow-hidden
                ">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageClick(lang.code)}
                            className="
                                w-full text-left px-4 py-2
                                text-sm font-medium
                                text-muted-foreground hover:text-foreground
                                hover:bg-accent/50
                                transition-colors
                                flex items-center justify-between
                            "
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
