"use client";

import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
}

export default function WhatsAppButton({
  phoneNumber = '94112345678',
  message,
  className
}: WhatsAppButtonProps) {
  const { t } = useLanguage();
  const defaultMessage = t.dashboard?.chatWithUs || 'Hello! I would like to inquire about your tours.';
  const encodedMessage = encodeURIComponent(message || defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300 group",
        className
      )}
    >
      <MessageCircle className="w-7 h-7 text-white" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-4 py-2.5 bg-foreground text-background text-sm font-medium rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 whitespace-nowrap shadow-lg">
        {t.dashboard?.chatWithUs || 'Chat with us!'}
      </span>

      {/* Soft ping animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulse-slow opacity-40" />
    </a>
  );
}
