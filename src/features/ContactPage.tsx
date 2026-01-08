"use client";

import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MetaTags } from '@/components/seo/MetaTags';
import { PageHeroStrip } from '@/components/layout/PageHeroStrip';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email').max(255),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+94 76 1818048', '+94 76 1818048'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['info@voyageslanka.com', 'bookings@voyageslanka.com'],
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['123 Temple Road', 'Colombo 03, Sri Lanka'],
  },
  {
    icon: Clock,
    title: 'Office Hours',
    details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 9:00 AM - 1:00 PM'],
  },
];

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log('Contact form:', data);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitted(true);
    reset();
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen pt-20">
      <MetaTags
        title="Contact Us"
        description="Get in touch with Dream Lanka Travels. We're here to help plan your perfect Sri Lankan adventure. Call, email, or visit our Colombo office."
      />

      {/* Hero Strip */}
      <PageHeroStrip
        accentLabel="Get in Touch"
        title="Contact Us"
        subtitle="Have questions or ready to start planning? We're here to help make your Sri Lankan adventure unforgettable."
      />

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mb-6 sm:mb-8">
                Contact Information
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-sunset/20 flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 sm:w-6 sm:h-6 text-sunset" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base">{info.title}</h3>
                      {info.details.map((detail) => (
                        <p key={detail} className="text-muted-foreground text-xs sm:text-sm truncate">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-card p-5 sm:p-8 rounded-xl sm:rounded-2xl shadow-card">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-card-foreground mb-6">
                  Send us a Message
                </h2>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-palm/20 text-palm rounded-lg text-sm sm:text-base">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        {...register('name')}
                        className={errors.name ? 'border-destructive' : ''}
                      />
                      {errors.name && (
                        <p className="text-destructive text-sm">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        {...register('email')}
                        className={errors.email ? 'border-destructive' : ''}
                      />
                      {errors.email && (
                        <p className="text-destructive text-sm">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      {...register('subject')}
                      className={errors.subject ? 'border-destructive' : ''}
                    />
                    {errors.subject && (
                      <p className="text-destructive text-sm">{errors.subject.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your inquiry..."
                      rows={5}
                      {...register('message')}
                      className={`resize-none ${errors.message ? 'border-destructive' : ''}`}
                    />
                    {errors.message && (
                      <p className="text-destructive text-sm">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    variant="ocean"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl overflow-hidden shadow-card h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Interactive map would be displayed here
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
