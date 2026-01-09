"use client";
import Image from "next/image";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Moon, Sun, Globe, ChevronDown, User, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { logout } from '@/app/auth/actions';
import { MobileMenu } from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { user, profile, isAdmin, updateProfile, isLoading } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.destinations, path: '/destinations' },
    { name: t.nav.tours, path: '/tours' },
    { name: t.home?.planYourJourney || 'Plan Trip', path: '/trip-planner' },
    { name: t.nav.about, path: '/about' },
    { name: t.nav.blog, path: '/blog' },
    { name: "FAQ", path: "/faq" },
    { name: t.nav.contact, path: '/contact' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Check profile dark mode preference first, then localStorage
    if (profile) {
      setIsDark(profile.dark_mode);
      if (profile.dark_mode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setIsDark(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, [profile]);

  const toggleTheme = async () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }

    // Save to database if logged in
    if (user && updateProfile) {
      await updateProfile({ dark_mode: newDarkMode });
    }
  };

  const handleSignOut = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const isHome = pathname === '/';
  // Premium Header Logic: Transparent initially on Home, Glass/Solid on scroll or other pages
  const headerBg = isScrolled || !isHome
    ? 'bg-background/80 dark:bg-black/60 backdrop-blur-md shadow-soft border-b border-border/10 dark:border-white/5'
    : 'bg-transparent';

  const textColor = isScrolled || !isHome ? "text-foreground" : "text-white";
  const hoverColor = isScrolled || !isHome ? "hover:text-primary" : "hover:text-white/80";

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        headerBg,
        isScrolled ? "h-20" : "h-24 md:h-28" // Taller initial state for premium feel
      )}
    >
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative group">
          <div className={cn(
            "transition-all duration-500 ease-in-out",
            isScrolled ? "w-32 md:w-40" : "w-40 md:w-52"
          )}>
            <Image
              src="/logo.png"
              alt="Dream Lanka Travels Logo"
              width={280}
              height={80}
              priority
              className={cn(
                "w-full h-auto object-contain transition-all duration-500",
                // Invert logic: On Home (top), logo should be white (inverted) if the logo image is dark by default.
                // Assuming logo.png is dark text.
                isScrolled || !isHome ? "brightness-100" : "brightness-0 invert drop-shadow-md"
              )}
            />
          </div>
        </Link>

        {/* Desktop Navigation - Centered & Elegant */}
        <nav className="hidden lg:flex items-center gap-8 md:gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "text-sm uppercase tracking-widest font-medium transition-all duration-300 relative group py-2",
                textColor,
                pathname === item.path ? "text-primary font-semibold" : ""
              )}
            >
              {item.name}
              <span className={cn(
                "absolute bottom-0 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full",
                isScrolled || !isHome ? "bg-primary" : "bg-white"
              )} />
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "gap-2 px-2 hover:bg-white/10 rounded-full",
                  textColor
                )}
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">{currentLang.flag}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl shadow-xl border-border/50 backdrop-blur-xl bg-background/95">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-2.5 transition-colors focus:bg-accent",
                    language === lang.code && "bg-accent/50 text-accent-foreground font-medium"
                  )}
                >
                  <span className="mr-3 text-lg">{lang.flag}</span>
                  <span className="text-sm tracking-wide">{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "rounded-full hover:bg-white/10 w-9 h-9 transition-transform hover:rotate-12",
              textColor
            )}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* User Menu or Login */}
          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-2 px-2 hover:bg-white/10 rounded-full",
                    textColor
                  )}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-current">
                    <User className="w-4 h-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl shadow-xl border-border/50 backdrop-blur-xl bg-background/95">
                <div className="px-3 py-2 border-b border-border/50 mb-2">
                  <p className="text-sm font-semibold truncate">{profile?.full_name || 'Traveler'}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>

                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer rounded-lg px-3 py-2.5">
                    <LayoutDashboard className="w-4 h-4 mr-3" />
                    {t.nav.myDashboard}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="cursor-pointer rounded-lg px-3 py-2.5">
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      {t.nav.adminPanel}
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator className="my-1 bg-border/50" />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:bg-destructive/10 rounded-lg px-3 py-2.5">
                  <LogOut className="w-4 h-4 mr-3" />
                  {t.nav.signOut}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth" className="hidden sm:block">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "font-medium tracking-wide hover:bg-white/10 rounded-full px-4",
                  textColor
                )}
              >
                {t.nav.signIn}
              </Button>
            </Link>
          )}

          {/* CTA Button - Premium Style */}
          <Link href="/quote" className="hidden md:block ml-2">
            <Button
              variant={isScrolled || !isHome ? "ocean" : "hero"} // Use 'hero' variant when on top of hero image
              size="lg" // Larger button
              className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              {t.nav.getQuote}
            </Button>
          </Link>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden rounded-full hover:bg-white/10",
              textColor
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu - Rendered via Portal */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        user={user}
        isAdmin={isAdmin}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        onSignOut={handleSignOut}
      />
    </header>
  );
}