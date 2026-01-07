"use client";

import Link from 'next/link';
import { HelpCircle, ArrowRight } from 'lucide-react';

interface FAQPreviewProps {
  className?: string;
}

export function FAQPreview({ className }: FAQPreviewProps) {
  return (
    <div className={className}>
      <Link
        href="/faq"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-sunset transition-colors group"
      >
        <HelpCircle className="w-4 h-4" />
        Have questions? See our FAQs
        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
