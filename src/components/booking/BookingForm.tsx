import { useState } from 'react';
import { format } from 'date-fns';
import { Users, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { FAQPreview } from '@/components/faq/FAQPreview';
import { cn } from '@/lib/utils';

interface BookingFormProps {
  tour: {
    id: string;
    name: string;
    price: number | null;
    duration: string | null;
    group_size_max: number | null;
  };
  onSuccess?: (bookingRef: string) => void;
}

export function BookingForm({ tour, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [travelDate, setTravelDate] = useState<Date>();
  const [travelers, setTravelers] = useState(2);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    specialRequests: '',
  });

  const totalPrice = (tour.price || 0) * travelers;
  const depositAmount = totalPrice * 0.3; // 30% deposit

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!travelDate) {
      toast({
        title: 'Travel date required',
        description: 'Please select your preferred travel date.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Use raw SQL insert since types may not be updated yet
      const bookingData = {
        tour_id: tour.id,
        user_id: user?.id || null,
        guest_name: formData.name,
        guest_email: formData.email,
        guest_phone: formData.phone || null,
        guest_country: formData.country || null,
        travel_date: format(travelDate, 'yyyy-MM-dd'),
        travelers,
        special_requests: formData.specialRequests || null,
        total_price: totalPrice,
        deposit_amount: depositAmount,
        currency: 'USD',
        status: 'pending',
        payment_status: 'unpaid',
      };

      const { data, error } = await supabase
        .from('bookings' as any)
        .insert(bookingData as any)
        .select('booking_reference')
        .single();

      if (error) throw error;

      const bookingRef = (data as any)?.booking_reference || 'VL-PENDING';

      toast({
        title: 'Booking submitted!',
        description: `Your booking reference is ${bookingRef}. We'll contact you shortly to confirm.`,
      });

      onSuccess?.(bookingRef);
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit booking. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow-lg border border-border">
      <h3 className="font-serif text-2xl font-bold text-card-foreground mb-2">
        Book This Tour
      </h3>
      <p className="text-muted-foreground text-sm mb-6">
        Complete the form below and we'll get back to you within 24 hours.
      </p>

      {/* Price Summary */}
      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Price per person</span>
          <span className="font-semibold">${tour.price?.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted-foreground">Number of travelers</span>
          <span className="font-semibold">{travelers}</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-card-foreground">Total</span>
            <span className="font-serif text-2xl font-bold text-sunset">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Deposit (30%)</span>
            <span className="text-muted-foreground">${depositAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Travel Date */}
      <div className="mb-4">
        <Label>Travel Date *</Label>
        <DatePicker
          date={travelDate}
          setDate={setTravelDate}
          placeholder="Select date"
          minDate={new Date()}
          className="w-full"
        />
      </div>

      {/* Travelers */}
      <div className="mb-4">
        <Label>Number of Travelers *</Label>
        <Select
          value={travelers.toString()}
          onValueChange={(v) => setTravelers(parseInt(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...Array(tour.group_size_max || 10)].map((_, i) => (
              <SelectItem key={i + 1} value={(i + 1).toString()}>
                {i + 1} {i === 0 ? 'Person' : 'People'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <Label htmlFor="booking-name">Full Name *</Label>
          <Input
            id="booking-name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="booking-email">Email *</Label>
          <Input
            id="booking-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
            placeholder="john@example.com"
          />
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="booking-phone">Phone</Label>
          <Input
            id="booking-phone"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="+1 234 567 8900"
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="booking-country">Country</Label>
          <Input
            id="booking-country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            placeholder="United States"
          />
        </div>
      </div>

      {/* Special Requests */}
      <div className="mb-6">
        <Label htmlFor="booking-requests">Special Requests</Label>
        <Textarea
          id="booking-requests"
          value={formData.specialRequests}
          onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
          placeholder="Any dietary requirements, accessibility needs, or special occasions..."
          rows={3}
        />
      </div>

      {/* Payment Notice */}
      <Alert className="mb-6">
        <CreditCard className="h-4 w-4" />
        <AlertDescription>
          <strong>Payment:</strong> After submitting, our team will contact you with payment instructions.
          A 30% deposit secures your booking.
        </AlertDescription>
      </Alert>

      <Button
        type="submit"
        variant="hero"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Request Booking'}
      </Button>

      <p className="text-xs text-muted-foreground text-center mt-4">
        No payment required now. We'll confirm availability and send you a quote.
      </p>

      <FAQPreview className="mt-4 text-center" />
    </form>
  );
}
