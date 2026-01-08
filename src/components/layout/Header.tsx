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
import { MobileMenu } from './MobileMenu';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const { user, profile, isAdmin, signOut, updateProfile } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();

  const navItems = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.destinations, path: '/destinations' },
    { name: t.nav.tours, path: '/tours' },
    { name: t.home?.planYourJourney || 'Trip Planner', path: '/trip-planner' },
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
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const isHome = pathname === '/';
  const headerBg = isScrolled || !isHome
    ? 'bg-background/95 backdrop-blur-lg shadow-soft'
    : 'bg-transparent';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      headerBg
    )}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
  <Image
    src="/logo.png"
    alt="Dream Lanka Travels Logo"
    width={280}
    height={50}
    priority
    className={cn(
      "transition-all duration-300",
      isScrolled || !isHome ? "brightness-100" : "brightness-0 invert"
    )}
  />
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "font-medium transition-colors duration-300 underline-animated",
                  pathname === item.path
                    ? "text-sunset"
                    : isScrolled || !isHome
                      ? "text-foreground hover:text-sunset"
                      : "text-sand hover:text-sunset"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "gap-1.5",
                    isScrolled || !isHome ? "text-foreground" : "text-sand"
                  )}
                >
                  <Globe className="w-4 h-4" />
                  <span className="hidden sm:inline">{currentLang.flag}</span>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
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

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={cn(
                isScrolled || !isHome ? "text-foreground" : "text-sand"
              )}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {/* User Menu or Login */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "gap-2",
                      isScrolled || !isHome ? "text-foreground" : "text-sand"
                    )}
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline max-w-[100px] truncate">
                      {profile?.full_name || t.nav.account}
                    </span>
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      {t.nav.myDashboard}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        {t.nav.adminPanel}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
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
                    isScrolled || !isHome ? "text-foreground" : "text-sand"
                  )}
                >
                  {t.nav.signIn}
                </Button>
              </Link>
            )}

            {/* CTA Button */}
            <Link href="/quote" className="hidden md:block">
              <Button variant="hero" size="default">
                {t.nav.getQuote}
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "lg:hidden",
                isScrolled || !isHome ? "text-foreground" : "text-sand"
              )}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
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