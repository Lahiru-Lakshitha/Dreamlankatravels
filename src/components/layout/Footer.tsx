"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, ArrowRight, Award, Users, Globe, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/voyageslanka', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com/voyageslanka', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/voyageslanka', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@voyageslanka', label: 'Youtube' },
];

export default function Footer() {
  const { t } = useLanguage();

  const trustBadges = [
    { icon: Award, label: t.home?.awardWinning || 'Award-Winning Tours' },
    { icon: Users, label: `15,000+ ${t.home?.happyTravelers || 'Travelers'}` },
    { icon: Globe, label: t.home?.localExpertGuides || 'Local Sri Lanka Experts' },
    { icon: Star, label: '5-Star Rated' },
  ];

  const footerLinks = {
    destinations: [
      { name: 'Sigiriya', path: '/destinations' },
      { name: 'Kandy', path: '/destinations' },
      { name: 'Galle', path: '/destinations' },
      { name: 'Ella', path: '/destinations' },
      { name: 'Yala', path: '/destinations' },
    ],
    tours: [
      { name: t.footer.culturalTours, path: '/tours' },
      { name: t.footer.wildlifeSafari, path: '/tours' },
      { name: t.footer.beachHolidays, path: '/tours' },
      { name: t.footer.adventureTours, path: '/tours' },
      { name: t.footer.honeymoonPackages, path: '/tours' },
    ],
    company: [
      { name: t.footer.aboutUs, path: '/about' },
      { name: t.footer.testimonials, path: '/' },
      { name: t.footer.blog, path: '/blog' },
      { name: t.footer.faq || 'FAQs', path: '/faq' },
      { name: t.footer.contact, path: '/contact' },
    ],
    legal: [
      { name: t.footer.privacyPolicy, path: '/privacy' },
      { name: t.footer.termsConditions, path: '/terms' },
      { name: t.footer.cookiePolicy, path: '/cookies' },
    ],
  };

  return (
    <footer className="bg-ocean-dark dark:bg-black/40 text-white relative overflow-hidden border-t border-transparent dark:border-white/10">
      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sunset to-transparent opacity-50" />

      {/* Trust Badges Row */}
      <div className="border-b border-ocean/5 dark:border-white/5 bg-white dark:bg-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 text-ocean-dark hover:text-ocean transition-colors duration-300 group"
              >
                <div className="p-2 rounded-full bg-ocean/5 dark:bg-white/10 group-hover:bg-ocean/10 transition-colors">
                  <badge.icon className="w-5 h-5 text-ocean dark:text-primary-foreground" />
                </div>
                <span className="text-sm font-bold tracking-wide text-ocean-dark dark:text-white">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 gap-y-12">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/logo.png"
                alt="Dream Lanka Travels Logo"
                width={180}
                height={55}
                priority
                className="transition-all duration-300 brightness-100"
              />
            </Link>
            <p className="text-white/60 text-sm mb-6 leading-relaxed max-w-sm">
              {t.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sunset hover:border-sunset hover:text-ocean-dark transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-sunset">
              {t.footer.destinations}
            </h4>
            <ul className="space-y-3">
              {footerLinks.destinations.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-sunset transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sunset" />
                    <span className="relative link-underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-sunset">
              {t.footer.ourTours}
            </h4>
            <ul className="space-y-3">
              {footerLinks.tours.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-sunset transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sunset" />
                    <span className="relative link-underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-sunset">
              {t.footer.company}
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-sunset transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-sunset" />
                    <span className="relative link-underline">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-medium mb-6 text-sunset">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded-full bg-white/5 group-hover:bg-sunset/20 transition-colors">
                  <MapPin className="w-4 h-4 text-sunset shrink-0" />
                </div>
                <span className="text-white/60 text-sm leading-relaxed">
                  123 Temple Road,<br />Colombo 03, Sri Lanka
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-sunset/20 transition-colors">
                  <Phone className="w-4 h-4 text-sunset shrink-0" />
                </div>
                <a
                  href="tel:+94112345678"
                  className="text-white/60 text-sm hover:text-sunset transition-colorsLink link-underline"
                >
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-sunset/20 transition-colors">
                  <Mail className="w-4 h-4 text-sunset shrink-0" />
                </div>
                <a
                  href="mailto:info@voyageslanka.com"
                  className="text-white/60 text-sm hover:text-sunset transition-colors link-underline"
                >
                  info@voyageslanka.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-xs text-center sm:text-left font-light tracking-wide">
              © {new Date().getFullYear()} Dream Lanka Travels. {t.footer.allRightsReserved}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={`${link.path}-${index}`}
                  href={link.path}
                  className="text-white/40 text-xs hover:text-sunset transition-colors link-underline"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
