"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect } from "react";
import { Home, ArrowLeft, Map, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import heroImage from '@/assets/hero-sigiriya.jpg';

const NotFound = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", pathname);
    document.title = "Page Not Found | Dream Lanka Travels";
  }, [pathname]);

  const suggestedLinks = [
    { to: '/destinations', label: t.notFound.exploreDestinations, icon: Map },
    { to: '/tours', label: t.notFound.browseTours, icon: Compass },
  ];

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroImage}
          alt="Sri Lanka landscape"
          fill
          className="object-cover opacity-10"
          placeholder="blur"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
        <div className="text-center px-4 max-w-lg mx-auto">
          {/* Animated 404 */}
          <div className="relative mb-8">
            <h1 className="font-serif text-[8rem] md:text-[10rem] font-bold text-sunset/20 leading-none select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-16 h-16 md:w-20 md:h-20 text-sunset animate-pulse" />
            </div>
          </div>

          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
            {t.notFound.title}
          </h2>

          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            {t.notFound.subtitle}
          </p>

          {/* Main Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/">
              <Button variant="ocean" size="lg" className="gap-2 w-full sm:w-auto">
                <Home className="w-5 h-5" />
                {t.notFound.backHome}
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              {t.notFound.goBack}
            </Button>
          </div>

          {/* Suggested Links */}
          <div className="pt-8 border-t border-border">
            <p className="text-muted-foreground text-sm mb-4">{t.notFound.popularPages}</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {suggestedLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} href={to}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
