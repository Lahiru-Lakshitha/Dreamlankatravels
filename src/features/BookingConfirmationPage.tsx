"use client";

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Calendar, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetaTags } from '@/components/seo/MetaTags';

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams();
  const bookingRef = searchParams.get('ref') || 'VL-PENDING';

  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <MetaTags
        title="Booking Confirmed"
        description="Your tour booking has been received. Our team will contact you within 24 hours."
      />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Booking Request Received!
          </h1>

          <p className="text-muted-foreground text-lg mb-8">
            Thank you for choosing Voyages Lanka. Our travel experts will review your request
            and contact you within 24 hours to confirm availability and finalize the details.
          </p>

          {/* Booking Reference */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8">
            <p className="text-sm text-muted-foreground mb-2">Your Booking Reference</p>
            <p className="font-mono text-2xl font-bold text-sunset">{bookingRef}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Please save this reference for future correspondence
            </p>
          </div>

          {/* What's Next */}
          <div className="bg-card p-6 rounded-xl shadow-sm border border-border mb-8 text-left">
            <h2 className="font-semibold text-lg mb-4">What Happens Next?</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sunset/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sunset">1</span>
                </div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation with your booking details shortly.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sunset/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sunset">2</span>
                </div>
                <div>
                  <p className="font-medium">Expert Review</p>
                  <p className="text-sm text-muted-foreground">
                    Our travel specialists will review your request and check availability.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-sunset/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sunset">3</span>
                </div>
                <div>
                  <p className="font-medium">Personal Contact</p>
                  <p className="text-sm text-muted-foreground">
                    We'll reach out within 24 hours to finalize your booking and payment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tours">
              <Button variant="outline" size="lg">
                Browse More Tours
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ocean" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Contact Info */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-muted-foreground">
              Questions? Contact us anytime:
            </p>
            <p className="font-semibold">
              +94 77 123 4567 | hello@voyageslanka.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
