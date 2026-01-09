"use client";

import { Mail, Phone, MapPin, Clock, Send, Loader2, CheckCircle2, Star, Award } from 'lucide-react';
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
import { submitContactForm } from '@/app/actions/forms';

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

  // ... (keep existing imports)

  // ...

  const onSubmit = async (data: ContactFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("subject", data.subject);
    formData.append("message", data.message);

    try {
      const result = await submitContactForm(formData);

      if (result.error) {
        // Handle Zod flattened errors or string error
        const errorMsg = typeof result.error === 'string'
          ? result.error
          : "Please check your inputs";

        // If field errors, we could map them, but for now generic toast
        console.error(result.error);
        throw new Error(errorMsg);
      }

      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Contact submit error:", error);
      // Toast is not imported here?
      // Ah, I don't see useToast usage in the original code, it just sets isSubmitted.
      // Let's add simple alert or just console for now if no toast hook.
      // Wait, original imports show `useToast`? No.
      // Original code doesn't use toast. It just sets isSubmitted.
      // Use native alert or just rely on console for errors if no toast.
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-gray-50 via-gray-100 to-sage-50/30 dark:from-background dark:via-background dark:to-background">
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

      {/* Premium Contact Section */}
      <section className="py-16 lg:py-24 relative overflow-hidden">
        {/* Soft Ambient Background Glows */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-sage-100/40 dark:bg-emerald-900/10 rounded-full blur-[120px] -z-10 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100/40 dark:bg-sky-900/10 rounded-full blur-[120px] -z-10 -translate-x-1/3" />

        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

            {/* Left Zone: Contact Information Card */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 border border-white/50 dark:border-white/10 shadow-lg dark:shadow-glow lg:min-h-[700px] flex flex-col justify-between">

                {/* Header Section */}
                <div className="space-y-6 mb-12">
                  <h2 className="font-serif text-3xl md:text-5xl font-bold text-ocean-dark dark:text-white leading-tight">
                    Let's Plan Your <br /> Dream Journey
                  </h2>
                  <p className="text-muted-foreground dark:text-white/70 text-lg leading-relaxed max-w-md">
                    Reach out to our local experts. Whether it's a quick question or a fully custom itinerary, we're here to help.
                  </p>

                  {/* Trust Badges */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 rounded-full text-xs font-bold text-ocean-dark dark:text-white shadow-sm border border-ocean/5 dark:border-white/5">
                      <Star className="w-3.5 h-3.5 text-sunglow fill-sunglow" /> 5-Star Rated
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 rounded-full text-xs font-bold text-ocean-dark dark:text-white shadow-sm border border-ocean/5 dark:border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Local Experts
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/10 rounded-full text-xs font-bold text-ocean-dark dark:text-white shadow-sm border border-ocean/5 dark:border-white/5">
                      <Award className="w-3.5 h-3.5 text-sunset" /> 24/7 Support
                    </span>
                  </div>
                </div>

                {/* Contact Details Grid */}
                <div className="space-y-6">
                  {contactInfo.map((info) => (
                    <div
                      key={info.title}
                      className="group flex items-start gap-5 p-4 rounded-2xl hover:bg-white/50 dark:hover:bg-white/5 transition-all duration-300"
                    >
                      <div className="w-12 h-12 rounded-full bg-ocean/5 dark:bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-ocean group-hover:text-white dark:group-hover:bg-white/20 transition-all duration-300 text-ocean dark:text-white">
                        <info.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-ocean-dark dark:text-white text-lg">{info.title}</h3>
                        <div className="mt-1 space-y-1">
                          {info.details.map((detail) => (
                            <p key={detail} className="text-muted-foreground dark:text-white/60 text-base">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Zone: Contact Form Card */}
            <div className="relative">
              <div className="bg-white dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-xl dark:shadow-glow border border-black/5 dark:border-white/10">
                <div className="mb-10">
                  <span className="inline-block px-3 py-1 rounded-full bg-sunset/10 text-sunset text-xs font-bold uppercase tracking-wider mb-4">
                    Send Message
                  </span>
                  <h3 className="font-serif text-3xl font-bold text-ocean-dark dark:text-white">
                    Start Your Conversation
                  </h3>
                </div>

                {isSubmitted ? (
                  <div className="p-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 rounded-3xl text-center border border-emerald-100 dark:border-emerald-500/20">
                    <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                    <p className="opacity-80">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-ocean-dark dark:text-white font-medium pl-1">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          {...register('name')}
                          className={`bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-14 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-ocean/10 dark:focus:ring-white/10 transition-all text-base px-4 ${errors.name ? 'border-destructive ring-destructive/20' : ''}`}
                        />
                        {errors.name && <p className="text-destructive text-sm pl-1">{errors.name.message}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-ocean-dark dark:text-white font-medium pl-1">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          {...register('email')}
                          className={`bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-14 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-ocean/10 dark:focus:ring-white/10 transition-all text-base px-4 ${errors.email ? 'border-destructive ring-destructive/20' : ''}`}
                        />
                        {errors.email && <p className="text-destructive text-sm pl-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-ocean-dark dark:text-white font-medium pl-1">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="I'm planning a trip for..."
                        {...register('subject')}
                        className={`bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 h-14 rounded-2xl focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-ocean/10 dark:focus:ring-white/10 transition-all text-base px-4 ${errors.subject ? 'border-destructive ring-destructive/20' : ''}`}
                      />
                      {errors.subject && <p className="text-destructive text-sm pl-1">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-ocean-dark dark:text-white font-medium pl-1">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your travel dates, preferences, and any specific interests..."
                        rows={6}
                        {...register('message')}
                        className={`bg-gray-50/50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl resize-none focus:bg-white dark:focus:bg-white/10 focus:ring-2 focus:ring-ocean/10 dark:focus:ring-white/10 transition-all text-base p-4 ${errors.message ? 'border-destructive ring-destructive/20' : ''}`}
                      />
                      {errors.message && <p className="text-destructive text-sm pl-1">{errors.message.message}</p>}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 rounded-full text-lg font-bold bg-ocean-dark dark:bg-ocean text-white hover:bg-ocean dark:hover:bg-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Embedded Map Section */}
      <section className="h-[500px] w-full relative grayscale hover:grayscale-0 transition-all duration-700 border-t border-black/5 dark:border-white/5">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-50 dark:from-background to-transparent z-10" />
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.63229676664!2d79.81308800971032!3d6.921833446006764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full object-cover bg-gray-200 dark:bg-gray-900"
        />
      </section>
    </div>
  );
}
