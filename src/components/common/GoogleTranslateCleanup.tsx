"use client";

import { useEffect } from 'react';

/**
 * Aggressively removes the Google Translate top banner, branding, and resets body styles.
 * Uses strict MutationObserver and Style Injection to ensure permanent removal.
 */
export function GoogleTranslateCleanup() {
    useEffect(() => {
        // 1. Define the aggressive cleanup logic
        const cleanup = () => {
            // A. Hide/Remove Banner Frames and Containers
            const bannerFrames = [
                ...Number(document.getElementsByClassName('goog-te-banner-frame')), // Use Spread for live collection
                ...Number(document.querySelectorAll('iframe[id^=":"]')), // Generic Google frames
                ...Number(document.getElementsByClassName('goog-te-banner')) // The div container
            ];

            // Use type assertion for iterating if needed, or simple loop
            const elements = document.querySelectorAll('.goog-te-banner-frame, iframe[id^=":"], .goog-te-banner, #goog-gt-tt, .goog-te-balloon-frame, .goog-tooltip');
            elements.forEach(el => {
                const element = el as HTMLElement;
                if (element) {
                    element.style.display = 'none';
                    element.style.visibility = 'hidden';
                    element.style.height = '0';
                    element.style.width = '0';
                    element.style.opacity = '0';
                    element.style.pointerEvents = 'none';
                    element.style.zIndex = '-9999';
                    // Optionally remove, but sometimes that triggers re-injection. Hiding is safer + removing pointer events.
                    // element.remove(); 
                }
            });

            // B. Reset Body/HTML Styles FORCEFULLY
            const body = document.body;
            const html = document.documentElement;

            if (body.style.top && body.style.top !== '0px') {
                body.style.top = '0px';
                body.style.marginTop = '0px';
                body.style.position = 'relative'; // Reset from static if Google changed it
            }
            if (html.style.top && html.style.top !== '0px') {
                html.style.top = '0px';
                html.style.marginTop = '0px';
            }
        };

        // 2. Run immediately
        cleanup();

        // 3. Set up MutationObserver
        const observer = new MutationObserver((mutations) => {
            let shouldCleanup = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // Check if added nodes look like Google stuff
                    mutation.addedNodes.forEach((node) => {
                        if (node instanceof HTMLElement) {
                            if (node.tagName === 'IFRAME' || node.classList.contains('goog-te-banner') || node.id.startsWith('goog')) {
                                shouldCleanup = true;
                            }
                        }
                    });
                } else if (mutation.type === 'attributes') {
                    if (mutation.target === document.body && (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                        shouldCleanup = true;
                    }
                }
            }

            // Just run cleanup anyway to be safe, it's cheap DOM manipulation
            cleanup();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true, // Watch subtree for iframes injected deep? usually immediate children of body
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // Also observe HTML for style changes
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        // 4. Force interval check (The "Hammer")
        const interval = setInterval(cleanup, 500); // Check every 500ms

        return () => {
            observer.disconnect();
            clearInterval(interval);
        };
    }, []);

    return null;
}
