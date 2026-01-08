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
    <footer className="bg-[hsl(160,60%,18%)] text-white">
      {/* Trust Badges Row */}
      <div className="border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-10">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-2 text-white/70 hover:text-[hsl(43,60%,52%)] transition-colors duration-300"
              >
                <badge.icon className="w-4 h-4 text-[hsl(43,60%,52%)]" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
  <Image
  src="/logo.png"
  alt="Dream Lanka Travels Logo"
  width={180}
  height={48}
  priority
  className="transition-all duration-300 brightness-100"

  />
</Link>
            <p className="text-white/60 text-sm mb-4 leading-relaxed max-w-xs">
              {t.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[hsl(43,60%,52%)] hover:border-[hsl(43,60%,52%)] hover:text-[hsl(160,60%,18%)] transition-all duration-300"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">
              {t.footer.destinations}
            </h4>
            <ul className="space-y-2">
              {footerLinks.destinations.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-[hsl(43,60%,52%)] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] group-hover:after:w-full after:transition-all after:duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tours */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">
              {t.footer.ourTours}
            </h4>
            <ul className="space-y-2">
              {footerLinks.tours.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-[hsl(43,60%,52%)] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] group-hover:after:w-full after:transition-all after:duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">
              {t.footer.company}
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={`${link.path}-${index}`}>
                  <Link
                    href={link.path}
                    className="text-white/60 text-sm hover:text-[hsl(43,60%,52%)] transition-colors duration-300 flex items-center gap-1 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] group-hover:after:w-full after:transition-all after:duration-300">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white">
              {t.footer.contactUs}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 group">
                <MapPin className="w-4 h-4 text-[hsl(43,60%,52%)] shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm leading-relaxed">
                  123 Temple Road,<br />Colombo 03
                </span>
              </li>
              <li className="flex items-center gap-2 group">
                <Phone className="w-4 h-4 text-[hsl(43,60%,52%)] shrink-0" />
                <a
                  href="tel:+94112345678"
                  className="text-white/60 text-sm hover:text-[hsl(43,60%,52%)] transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] hover:after:w-full after:transition-all after:duration-300"
                >
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 text-[hsl(43,60%,52%)] shrink-0" />
                <a
                  href="mailto:info@voyageslanka.com"
                  className="text-white/60 text-sm hover:text-[hsl(43,60%,52%)] transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] hover:after:w-full after:transition-all after:duration-300"
                >
                  info@voyageslanka.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Dream Lanka Travels. {t.footer.allRightsReserved}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {footerLinks.legal.map((link, index) => (
                <Link
                  key={`${link.path}-${index}`}
                  href={link.path}
                  className="text-white/40 text-xs hover:text-[hsl(43,60%,52%)] transition-colors relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[hsl(43,60%,52%)] hover:after:w-full after:transition-all after:duration-300"
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
