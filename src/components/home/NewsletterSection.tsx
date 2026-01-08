import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function NewsletterSection() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert({ email, source: 'website' });

      if (error) {
        if (error.code === '23505') {
          // Duplicate email
          toast({
            title: 'Already subscribed',
            description: 'This email is already on our mailing list.',
          });
        } else {
          throw error;
        }
      } else {
        setIsSubscribed(true);
        toast({
          title: 'Subscribed!',
          description: 'Thank you for subscribing to our newsletter.',
        });
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="py-16 bg-ocean-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-sand mb-2">
              You're All Set!
            </h3>
            <p className="text-sand/80">
              Check your inbox for travel inspiration, exclusive offers, and Sri Lanka travel tips.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-ocean-dark dark:bg-black/40 border-t border-transparent dark:border-white/5">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-sand mb-4">
            Get Travel Inspiration
          </h3>
          <p className="text-sand/80 mb-8">
            Subscribe to our newsletter for exclusive deals, travel tips, and destination guides.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 bg-sand/10 border-sand/20 text-sand placeholder:text-sand/50 focus:border-sunset"
              required
            />
            <Button
              type="submit"
              variant="hero"
              disabled={isSubmitting}
              className="shrink-0"
            >
              {isSubmitting ? (
                'Subscribing...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-sand/60 mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
}
