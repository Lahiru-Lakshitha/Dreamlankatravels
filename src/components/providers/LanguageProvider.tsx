"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Script from 'next/script';
import { getLanguageFromCookie, setLanguageCookie } from '@/lib/language-utils';

interface LanguageContextType {
    currentLang: string;
    changeLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [currentLang, setCurrentLang] = useState('en');

    // CRITICAL: SPA Navigation Blocker (MPA Mode)
    // When the site is translated (not English), we MUST disable Client-Side Routing.
    // Google Translate mutates the DOM, and React will crash if it tries to diff the mutated DOM.
    // We force a full page reload on every link click to ensure a fresh, consistent DOM.
    useEffect(() => {
        if (currentLang === 'en') return; // Allow normal SPA navigation for English

        const handleLinkClick = (e: MouseEvent) => {
            // Find the closest anchor tag
            const anchor = (e.target as HTMLElement).closest('a');
            if (!anchor) return;

            // Check if it's a valid internal link
            const href = anchor.getAttribute('href');
            if (!href) return;

            // Allow external links, anchors, and new tabs to behave normally
            if (
                anchor.target === '_blank' ||
                href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:')
            ) return;

            // Use a stricter check for internal links if needed, but for now, if it's relative or same origin:
            const isInternal = href.startsWith('/') || href.startsWith(window.location.origin);

            if (isInternal) {
                e.preventDefault();
                e.stopPropagation();
                // Force Hard Reload
                window.location.assign(href);
            }
        };

        // Capture phase to intercept before Next.js Link
        document.addEventListener('click', handleLinkClick, true);

        // CRITICAL: Handle Back/Forward Button (Popstate)
        // If we are translated, popping state (back/forward) might try to restore a React state
        // onto a dirty DOM. We must force a reload to ensure clean hydration.
        const handlePopState = (e: PopStateEvent) => {
            // We can't easily prevent the popstate itself, but we can force a reload immediately.
            // Since SPA routing is disabled, the browser handle history naturally for MPA.
            // However, if there was a mixed history stack, this ensures safety.
            window.location.reload();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            document.removeEventListener('click', handleLinkClick, true);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [currentLang]);

    useEffect(() => {
        // Initialize language from cookie
        const lang = getLanguageFromCookie();
        if (lang) {
            setCurrentLang(lang);
            if (lang === 'ar') {
                document.documentElement.setAttribute('dir', 'rtl');
            } else {
                document.documentElement.setAttribute('dir', 'ltr');
            }
        }
    }, []);

    const changeLanguage = (langCode: string) => {
        setLanguageCookie(langCode);

        // We don't just set state, we reload to apply the language cleanly
        // But updating state locally helps if we don't reload instantly (though we do)
        setCurrentLang(langCode);

        window.location.reload();
    };

    return (
        <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
            {/* 
        We use suppressHydrationWarning on the root of our content to strictly silence 
        hydration mismatches if they occur before the scripts take over. 
        However, with MPA mode, this is less critical but good practice.
      */}
            <div id="language-provider-root" suppressHydrationWarning>
                {children}
            </div>

            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" style={{ display: 'none' }}></div>

            {/* Google Translate Scripts */}
            <Script
                id="google-translate-init"
                strategy="afterInteractive"
            >
                {`
            function googleTranslateElementInit() {
                // Defer initialization to unblock main thread
                const init = () => {
                    if (window.google && window.google.translate) {
                        new window.google.translate.TranslateElement(
                            { pageLanguage: 'en', autoDisplay: false },
                            document.getElementById('google_translate_element')
                        );
                    }
                };
                
                if (window.requestIdleCallback) {
                    window.requestIdleCallback(init);
                } else {
                    setTimeout(init, 50); // Fallback for browsers without requestIdleCallback
                }
            }
        `}
            </Script>
            <Script
                src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
        </LanguageContext.Provider>
    );
}
