"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut, Sun, Moon, ArrowRight, Instagram, Facebook, Twitter, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { t } from '@/data/translations';

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
  onSignOut
}: MobileMenuProps) {
  const pathname = usePathname();


  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.destinations, path: '/destinations' },
    { name: t.nav.tours, path: '/tours' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.blog, path: '/blog' },
    { name: "FAQ", path: "/faq" },
    { name: t.nav.contact, path: '/contact' },
  ];

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle mounting for portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md z-[100] lg:hidden"
          />

          {/* Right-Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200, mass: 0.8 }}
            className="fixed inset-y-0 right-0 z-[101] w-[300px] sm:w-[350px] bg-background shadow-2xl flex flex-col lg:hidden h-full"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border/10">
              <span className="font-serif text-xl font-bold text-foreground">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full hover:bg-muted text-muted-foreground hover:text-foreground h-8 w-8"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-sans font-medium text-base",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-muted/50 hover:text-primary"
                      )}
                    >
                      {item.name}
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </nav>

              {/* Extras */}
              <div className="mt-8 space-y-4 px-2">
                <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Dark Mode</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onToggleTheme}
                      className="rounded-full h-8 w-8 hover:bg-white/50"
                    >
                      {isDark ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-primary" />}
                    </Button>
                  </div>
                </div>

                {/* Auth */}
                {user ? (
                  <button
                    onClick={onSignOut}
                    className="flex items-center px-4 py-3 w-full text-destructive hover:bg-destructive/10 rounded-xl transition-colors text-sm font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                ) : (
                  <Link href="/auth" onClick={onClose} className="block">
                    <div className="flex items-center px-4 py-3 text-foreground hover:bg-muted/50 rounded-xl transition-colors text-sm font-medium">
                      <User className="w-4 h-4 mr-3" />
                      Sign In / Account
                    </div>
                  </Link>
                )}
              </div>
            </div>

            {/* Sticky Footer CTA */}
            <div className="p-5 border-t border-border/10 bg-muted/10">
              <Link href="/quote" onClick={onClose}>
                <Button className="w-full rounded-full shadow-md bg-primary hover:bg-primary-hover text-white h-12 text-base font-medium">
                  Plan Trip
                </Button>
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
