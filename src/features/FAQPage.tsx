"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { HelpCircle, Search, ArrowRight, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MetaTags } from '@/components/seo/MetaTags';
import { ContentLoading } from '@/components/ui/loading-spinner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQEntry {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_CATEGORIES = [
  { id: 'booking', label: 'Booking & Payments', icon: '💳' },
  { id: 'tours', label: 'Tours & Customization', icon: '🗺️' },
  { id: 'visas', label: 'Visas & Travel Requirements', icon: '🛂' },
  { id: 'cancellations', label: 'Cancellations & Refunds', icon: '↩️' },
  { id: 'general', label: 'General Questions', icon: '❓' },
];

// Fallback FAQs when database is empty
const FALLBACK_FAQS: FAQEntry[] = [
  { id: '1', category: 'booking', question: 'How do I book a tour?', answer: 'You can book a tour by selecting your preferred package, choosing your travel dates, and completing the booking form. We accept all major credit cards and PayPal. You\'ll receive a confirmation email within 24 hours.' },
  { id: '2', category: 'booking', question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, American Express, and PayPal. Bank transfers are also available for larger bookings. All payments are processed securely.' },
  { id: '3', category: 'booking', question: 'Do I need to pay a deposit?', answer: 'Yes, we require a 30% deposit to confirm your booking. The remaining balance is due 30 days before your tour start date.' },
  { id: '4', category: 'tours', question: 'Can I customize my tour?', answer: 'Absolutely! All our tours can be customized to match your preferences. Contact us with your requirements and we\'ll create a personalized itinerary just for you.' },
  { id: '5', category: 'tours', question: 'What is included in the tour price?', answer: 'Tour prices typically include accommodation, transportation, English-speaking guide, entrance fees to attractions, and specified meals. Check each tour\'s "What\'s Included" section for details.' },
  { id: '6', category: 'tours', question: 'Are meals included in the tours?', answer: 'Most tours include breakfast daily and select lunches/dinners. Each tour page specifies exactly which meals are included. Dietary requirements can be accommodated with advance notice.' },
  { id: '7', category: 'visas', question: 'Do I need a visa to visit Sri Lanka?', answer: 'Most visitors need an Electronic Travel Authorization (ETA) which can be obtained online. Tourist visas are valid for 30 days and can be extended. We recommend applying at least 2 weeks before travel.' },
  { id: '8', category: 'visas', question: 'What vaccinations do I need?', answer: 'No vaccinations are mandatory for Sri Lanka, but we recommend Hepatitis A, Typhoid, and keeping routine vaccinations up to date. Consult your doctor at least 6 weeks before travel.' },
  { id: '9', category: 'cancellations', question: 'What is your cancellation policy?', answer: 'Free cancellation up to 30 days before the tour. 50% refund for cancellations 15-29 days before. No refund for cancellations less than 14 days before the tour. We recommend travel insurance.' },
  { id: '10', category: 'cancellations', question: 'What if I need to change my dates?', answer: 'Date changes are free if requested more than 30 days before your tour, subject to availability. Changes within 30 days may incur a fee. Contact us as early as possible.' },
  { id: '11', category: 'general', question: 'What is the best time to visit Sri Lanka?', answer: 'Sri Lanka is a year-round destination. The west and south coasts are best from December to April, while the east coast shines from May to September. The Cultural Triangle is pleasant year-round.' },
  { id: '12', category: 'general', question: 'Is Sri Lanka safe for tourists?', answer: 'Yes, Sri Lanka is generally very safe for tourists. The local people are friendly and welcoming. We recommend standard travel precautions and keeping valuables secure.' },
];

export default function FAQPage() {
  const { t } = useLanguage();
  const [faqs, setFaqs] = useState<FAQEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const { data, error } = await supabase
        .from('faq_entries')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (data && data.length > 0) {
        setFaqs(data);
      } else {
        setFaqs(FALLBACK_FAQS);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setFaqs(FALLBACK_FAQS);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter FAQs based on search and category
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    // If searching, ignore category filter (search across all)
    const matchesCategory = searchQuery !== '' ? true : (activeCategory === null || faq.category === activeCategory);

    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category
  const groupedFAQs = FAQ_CATEGORIES.map(cat => ({
    ...cat,
    faqs: filteredFAQs.filter(f => f.category === cat.id)
  })).filter(cat => cat.faqs.length > 0);

  // JSON-LD for SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen pt-20 pb-16 bg-background">
      <MetaTags
        title="Frequently Asked Questions | Sri Lanka Travel FAQ"
        description="Find answers to common questions about booking tours, payments, visas, cancellations, and traveling in Sri Lanka."
      />

      {/* Schema.org FAQ markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section - Premium Redesign */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with Gradient and Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-dark via-primary to-ocean z-0"></div>
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10 z-0"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <HelpCircle className="w-5 h-5 text-sunset" />
            <span className="text-sunset font-medium text-sm tracking-wide uppercase">Help Center</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-sm">
            Frequently Asked Questions
          </h1>

          <p className="text-sand/90 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-sans leading-relaxed">
            Everything you need to know about your journey with Dream Lanka Travels.
            Can't find the answer? We're here to help.
          </p>

          {/* Search Bar - Premium/Glass */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sunset to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground dark:text-white/60 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-14 h-16 text-lg bg-white/95 dark:bg-white/10 backdrop-blur-xl border-white/20 dark:border-white/10 text-ocean-dark dark:text-white placeholder:text-muted-foreground/70 dark:placeholder:text-white/60 rounded-xl shadow-2xl focus:ring-2 focus:ring-sunset/50"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          <Button
            variant={activeCategory === null ? 'default' : 'outline'}
            onClick={() => setActiveCategory(null)}
            className="rounded-full"
          >
            All Questions
          </Button>
          {FAQ_CATEGORIES.map(cat => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setActiveCategory(cat.id)}
              className="rounded-full"
            >
              {cat.icon} {cat.label}
            </Button>
          ))}
        </div>

        {/* FAQ Content */}
        {isLoading ? (
          <ContentLoading text="Loading FAQs..." />
        ) : filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">
              No FAQs found matching &quot;{searchQuery}&quot;.
            </p>
            <Button variant="outline" onClick={() => { setSearchQuery(''); setActiveCategory(null); }}>
              Clear Search
            </Button>
          </div>
        ) : searchQuery !== '' ? (
          // Search Mode: Show flat list of all matching questions
          <div className="max-w-3xl mx-auto">
            <div className="mb-6 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-foreground">
                Found {filteredFAQs.length} result{filteredFAQs.length !== 1 ? 's' : ''}
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSearchQuery('')} className="text-muted-foreground">
                Clear Search
              </Button>
            </div>
            <Accordion type="single" collapsible className="space-y-3">
              {filteredFAQs.map(faq => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card dark:bg-white/5 rounded-2xl border border-border/50 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline text-left px-6 py-5 data-[state=open]:bg-muted/30 dark:data-[state=open]:bg-white/5">
                    <span className="font-sans font-semibold text-lg text-foreground pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-muted-foreground text-base leading-relaxed px-6 pb-6 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : activeCategory === null ? (
          // Default Mode: Grouped by category
          <div className="max-w-3xl mx-auto space-y-10">
            {groupedFAQs.map(category => (
              <div key={category.id}>
                <h2 className="font-serif text-2xl font-bold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  {category.label}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.faqs.map(faq => (
                    <AccordionItem
                      key={faq.id}
                      value={faq.id}
                      className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-3"
                    >
                      <AccordionTrigger className="hover:no-underline text-left px-6 py-5 data-[state=open]:bg-muted/30">
                        <span className="font-sans font-semibold text-lg text-foreground pr-4">
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="font-sans text-muted-foreground text-base leading-relaxed px-6 pb-6 pt-2">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          // Show flat list for filtered
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFAQs.map(faq => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden mb-3"
                >
                  <AccordionTrigger className="hover:no-underline text-left px-6 py-5 data-[state=open]:bg-muted/30">
                    <span className="font-sans font-semibold text-lg text-foreground pr-4">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-muted-foreground text-base leading-relaxed px-6 pb-6 pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {/* Still have questions CTA */}
        <div className="mt-16 text-center bg-muted/50 dark:bg-white/5 rounded-2xl p-8 max-w-2xl mx-auto">
          <MessageCircle className="w-12 h-12 mx-auto text-sunset mb-4" />
          <h3 className="font-serif text-2xl font-bold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact">
              <Button variant="hero">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="https://wa.me/94112345678" target="_blank" rel="noopener noreferrer">
              <Button variant="outline">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
