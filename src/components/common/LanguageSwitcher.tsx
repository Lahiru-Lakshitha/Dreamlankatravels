"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { LANGUAGES } from '@/lib/language-utils';

export default function LanguageSwitcher() {
  const { currentLang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close menu on click outside
    function handleClickOutside(event: MouseEvent) {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLabel = LANGUAGES.find(l => l.code === currentLang)?.code.toUpperCase() || 'EN';

  return (
    <>
      <div id="lang-switcher" ref={switcherRef} className="notranslate" translate="no">
        <button
          id="lang-btn"
          aria-label="Change language"
          onClick={() => setIsOpen(!isOpen)}
        >
          🌐 <span id="lang-label">{currentLabel}</span>
        </button>

        <ul id="lang-menu" className={isOpen ? 'open' : ''}>
          {LANGUAGES.map((lang) => (
            <li
              key={lang.code}
              data-lang={lang.code}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              {lang.flag} {lang.label}
            </li>
          ))}
        </ul>
      </div>

      <style jsx global>{`
                #lang-switcher {
                    position: fixed;
                    bottom: 18px;
                    left: 18px;
                    z-index: 2147483647;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
                }

                #lang-btn {
                    background: #ffffff;
                    border: none;
                    border-radius: 999px;
                    padding: 8px 12px;
                    font-size: 13px;
                    font-weight: 600;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #333;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }
                
                #lang-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                }

                #lang-menu {
                    list-style: none;
                    margin: 8px 0 0;
                    padding: 6px;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 12px 30px rgba(0,0,0,0.18);
                    display: none;
                    max-height: 240px;
                    overflow-y: auto;
                    position: absolute;
                    bottom: 45px; /* Position above the button */
                    left: 0;
                    min-width: 160px;
                }

                #lang-menu.open {
                    display: block;
                    animation: fadeIn 0.2s ease-out;
                }

                #lang-menu li {
                    padding: 8px 12px;
                    font-size: 13px;
                    border-radius: 8px;
                    cursor: pointer;
                    white-space: nowrap;
                    color: #333;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: background 0.15s;
                }

                #lang-menu li:hover {
                    background: #f2f4f6;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    #lang-switcher {
                        bottom: 14px;
                        left: 14px;
                    }

                    #lang-btn {
                        padding: 10px 14px;
                        font-size: 14px;
                    }

                    #lang-menu {
                        max-height: 50vh;
                        font-size: 14px;
                    }

                    #lang-menu li {
                        padding: 12px 14px;
                    }
                }

                /* HARD BLOCK GOOGLE UI */
                .goog-te-banner-frame,
                .goog-te-gadget,
                .goog-logo-link,
                iframe[id^=":"] {
                    display: none !important;
                }

                body {
                    top: 0 !important;
                }
            `}</style>
    </>
  );
}
