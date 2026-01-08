"use client";

import { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
    {
        question: "Do I need a visa for Sri Lanka?",
        answer: "Yes, most visitors need a visa. You can easily apply for an ETA (Electronic Travel Authorization) online before your trip. It's valid for 30 days and usually approved within 24 hours."
    },
    {
        question: "What is the best time to visit?",
        answer: "Sri Lanka is a year-round destination. The west and south coasts (Colombo, Galle, Mirissa) are best from December to April. The east coast (Trincomalee, Arugam Bay) is best from May to September."
    },
    {
        question: "Are your tours customizable?",
        answer: "Absolutely! All our tour packages are 100% customizable. You can adjust the duration, accommodation standard, and activities to suit your budget and interests."
    },
    {
        question: "Is it safe to travel in Sri Lanka?",
        answer: "Sri Lanka is generally very safe for tourists. We provide 24/7 support ensuring a hassle-free experience. Our drivers and guides are vigorous professionals who prioritize your safety."
    },
    {
        question: "What items should I pack?",
        answer: "Light cotton clothing is best for the warm weather. Bring comfortable walking shoes, swimwear, sunscreen, insect repellent, and modest clothing (covering shoulders and knees) for temple visits."
    }
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default

    return (
        <section className="py-12 bg-background relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-sunset/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <span className="text-sunset font-medium tracking-widest uppercase text-sm mb-3 block">
                        Travel Essentials
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Everything you need to know before your journey to paradise.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`rounded-2xl transition-all duration-300 overflow-hidden ${openIndex === index
                                ? 'bg-white dark:bg-white/5 shadow-lg border border-primary/20 dark:border-white/10 scale-[1.02]'
                                : 'bg-white/50 dark:bg-white/[0.02] border border-transparent hover:bg-white dark:hover:bg-white/5 hover:border-primary/5 dark:hover:border-white/5 hover:shadow-soft'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left focus:outline-none"
                            >
                                <span className={`text-lg font-medium pr-8 transition-colors ${openIndex === index ? 'text-primary' : 'text-foreground/80'
                                    }`}>
                                    {faq.question}
                                </span>
                                <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index
                                    ? 'bg-primary text-white rotate-180'
                                    : 'bg-primary/5 text-primary'
                                    }`}>
                                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openIndex === index ? '' : 'rotate-0'}`} />
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                                            <div className="w-full h-px bg-border/40 mb-4" />
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


