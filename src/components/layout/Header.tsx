"use client";
import { useState, useEffect, useRef, memo } from 'react';
import Image from "next/image";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'; // Kept imports for safety if used elsewhere, but removed useAuth
// Actually remove useAuth:
import { cn } from '@/lib/utils';
// import { useAuth } from '@/contexts/AuthContext'; // REMOVED
import { t } from '@/data/translations';
import dynamic from 'next/dynamic';
import { NavMenu } from './NavMenu';

const MobileMenu = dynamic(() => import('./MobileMenu').then(mod => mod.MobileMenu), {
  ssr: false,
});

function HeaderBase() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  // Auth Removed

  // Sentinel for IntersectionObserver (High Performance Scroll Spy)
  // When this pixel is visible, we are at the top. When hidden, we are scrolled.
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 60fps Scroll Detection without Event Listeners
    const observer = new IntersectionObserver(([entry]) => {
      setIsScrolled(!entry.isIntersecting);
    }, {
      root: null,
      threshold: 0,
      rootMargin: "0px"
    });

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, []);

  // Theme Logic
  useEffect(() => {
    // Removed auth profile theme sync, just use local storage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []); // Run once

  const toggleTheme = async () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const isHome = pathname === '/';

  // -- Strict Performance & Design Logic --
  // NO Height Animations (Layout Shift). Use fixed height.
  // We use standard h-20 (80px) which is elegant.
  const headerHeight = "h-20 lg:h-24";

  // Background State
  const backgroundClass = isScrolled || !isHome
    ? "bg-white/90 dark:bg-[#03140e]/90 backdrop-blur-xl shadow-soft dark:shadow-none border-b border-black/5 dark:border-white/10"
    : "bg-transparent";

  // Logo Logic: Scale transform instead of width change
  const logoScale = isScrolled || !isHome ? "scale-90" : "scale-100";
  const logoBrightness = isScrolled || !isHome
    ? "brightness-100"
    : "brightness-0 invert drop-shadow-lg";

  const iconColor = isScrolled || !isHome ? "text-foreground" : "text-white";

  return (
    <>
      {/* Sentinel Pixel - Anchored to document flow via relative Layout parent */}
      <div
        ref={sentinelRef}
        className="absolute top-0 left-0 w-full h-px bg-transparent pointer-events-none -z-10"
        aria-hidden="true"
      />

      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ease-in-out',
          headerHeight,
          backgroundClass
        )}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-50 group">
            <div className={cn(
              "relative transition-all duration-500 ease-out origin-left",
              logoScale
            )}>
              <div className={cn("w-32 md:w-48 transition-all duration-500", logoBrightness)}>
                <Image
                  src="/logo.png"
                  alt="Dream Lanka Travels"
                  width={200}
                  height={60}
                  priority
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          </Link>

          {/* Desktop Nav - Pure CSS */}
          <NavMenu isScrolled={isScrolled} isHome={isHome} />

          {/* Right Actions */}
          <div className="flex items-center gap-1 md:gap-3">

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                "rounded-full w-9 h-9 transition-transform hover:rotate-12 hover:bg-white/20",
                iconColor
              )}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Auth Menu Removed */}

            {/* CTA Button */}
            <Link href="/quote" className="hidden md:block ml-2">
              <Button
                className={cn(
                  "rounded-full px-6 shadow-lg transition-all hover:scale-105 hover:shadow-xl",
                  isScrolled || !isHome
                    ? "bg-primary hover:bg-primary-hover text-white dark:bg-primary dark:text-white"
                    : "bg-white text-primary hover:bg-white/90"
                )}
              >
                {t.nav.getQuote}
              </Button>
            </Link>

            {/* Mobile Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden rounded-full hover:bg-white/20", iconColor)}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Portal */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />
      </header>
    </>
  );
}

export default memo(HeaderBase);