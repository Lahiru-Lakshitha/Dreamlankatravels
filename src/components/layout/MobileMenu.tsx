"use client";

import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, Moon, Sun, Globe, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  isAdmin: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onSignOut: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  user,
  isAdmin,
  isDark,
  onToggleTheme,
  onSignOut,
}: MobileMenuProps) {
  const pathname = usePathname();
  const { language, setLanguage, t, languages } = useLanguage();
  const currentLang = languages.find(l => l.code === language) || languages[0];

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.destinations, path: '/destinations' },
    { name: t.nav.tours, path: '/tours' },
    { name: t.home?.planYourJourney || 'Trip Planner', path: '/trip-planner' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.blog, path: '/blog' },
    { name: t.nav.contact, path: '/contact' },
  ];

  if (!isOpen) return null;

  const menuContent = (
    <div className="fixed inset-0 z-[99999]" role="dialog" aria-modal="true">
      {/* Backdrop - subtle dim */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-500 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right Side Panel - slides in from right */}
      <div
        className="absolute top-0 right-0 bottom-0 w-[80%] max-w-[340px] bg-background shadow-2xl animate-slide-in-right overflow-hidden"
        style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem' }}
      >
        {/* Left edge gradient accent */}
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-primary via-primary/60 to-primary/30" />

        {/* Panel Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
          <span className="font-serif text-xl font-semibold text-foreground">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-4 pb-32" style={{ height: 'calc(100vh - 180px)' }}>
          {/* Navigation Links */}
          <nav className="py-4 space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={cn(
                  "flex items-center py-3.5 px-5 rounded-xl text-base font-medium transition-all duration-300",
                  "opacity-0 animate-slide-in-right",
                  pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted/60"
                )}
                style={{ animationDelay: `${100 + index * 60}ms`, animationFillMode: 'forwards' }}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider */}
          <div className="border-t border-border/40 my-3" />

          {/* User Section */}
          <div className="py-2 space-y-1">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={onClose}
                  className="flex items-center gap-3 py-3.5 px-5 rounded-xl text-base font-medium text-foreground hover:bg-muted/60 transition-all duration-200"
                >
                  <LayoutDashboard className="w-5 h-5 text-primary" />
                  {t.nav.myDashboard}
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center gap-3 py-3.5 px-5 rounded-xl text-base font-medium text-foreground hover:bg-muted/60 transition-all duration-200"
                  >
                    <LayoutDashboard className="w-5 h-5 text-primary" />
                    {t.nav.adminPanel}
                  </Link>
                )}
                <button
                  onClick={() => { onSignOut(); onClose(); }}
                  className="flex items-center gap-3 w-full py-3.5 px-5 rounded-xl text-base font-medium text-destructive hover:bg-destructive/10 text-left transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  {t.nav.signOut}
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={onClose}
                className="flex items-center gap-3 py-3.5 px-5 rounded-xl text-base font-medium text-foreground hover:bg-muted/60 transition-all duration-200"
              >
                <User className="w-5 h-5 text-primary" />
                {t.nav.signIn}
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border/40 my-3" />

          {/* Language & Theme Row */}
          <div className="px-4 py-4 flex items-center justify-between bg-muted/40 rounded-xl">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2 h-9 px-3 text-foreground hover:bg-transparent">
                    <span className="text-lg">{currentLang.flag}</span>
                    <span className="text-sm font-medium">{currentLang.name}</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-44">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={cn(
                        "cursor-pointer",
                        language === lang.code && "bg-accent"
                      )}
                    >
                      <span className="mr-2">{lang.flag}</span>
                      {lang.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="w-10 h-10 text-foreground hover:bg-muted"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* CTA Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-background border-t border-border/30">
          <Link href="/quote" onClick={onClose}>
            <Button
              size="lg"
              className="w-full text-base py-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              {t.nav.getQuote}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  // Render at body level using Portal
  return createPortal(menuContent, document.body);
}
