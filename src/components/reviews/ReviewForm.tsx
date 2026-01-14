import { useState } from 'react';
import { Star } from 'lucide-react';
import { format, parse } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
// import { useAuth } from '@/contexts/AuthContext'; // Removed

interface ReviewFormProps {
  tourId: string;
  onSuccess?: () => void;
}

export function ReviewForm({ tourId, onSuccess }: ReviewFormProps) {
  // const { user } = useAuth(); // Removed
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    title: '',
    content: '',
    travel_date: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: 'Rating required',
        description: 'Please select a star rating.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('reviews').insert({
        tour_id: tourId,
        user_id: null,
        reviewer_name: formData.name,
        reviewer_email: formData.email || null,
        reviewer_country: formData.country || null,
        rating,
        title: formData.title || null,
        content: formData.content || null,
        travel_date: formData.travel_date || null,
        is_approved: false, // Reviews need admin approval
      });

      if (error) throw error;

      toast({
        title: 'Review submitted!',
        description: 'Thank you for your feedback. Your review is pending approval.',
      });

      // Reset form
      setRating(0);
      setFormData({
        name: '',
        email: '',
        country: '',
        title: '',
        content: '',
        travel_date: '',
      });

      onSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <h3 className="font-serif text-xl font-bold text-card-foreground mb-6">
        Write a Review
      </h3>

      {/* Star Rating */}
      <div className="mb-6">
        <Label className="mb-2 block">Your Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
              className="focus:outline-none transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${star <= (hoveredRating || rating)
                  ? 'text-sunset fill-sunset'
                  : 'text-muted-foreground'
                  }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <Label htmlFor="name">Your Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="John Doe"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="john@example.com"
          />
        </div>

        {/* Country */}
        <div>
          <Label htmlFor="country">Country (optional)</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            placeholder="United Kingdom"
          />
        </div>

        {/* Travel Date */}
        <div>
          <Label htmlFor="travel_date" className="block mb-2">Travel Date (optional)</Label>
          <DatePicker
            date={formData.travel_date ? parse(formData.travel_date, 'yyyy-MM-dd', new Date()) : undefined}
            setDate={(date) => setFormData(prev => ({ ...prev, travel_date: date ? format(date, 'yyyy-MM-dd') : '' }))}
            placeholder="Select date"
            maxDate={new Date()} // Can't review future travel
          />
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <Label htmlFor="title">Review Title (optional)</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="An unforgettable experience!"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <Label htmlFor="content">Your Review (optional)</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          placeholder="Tell others about your experience..."
          rows={4}
        />
      </div>

      <Button type="submit" variant="ocean" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
}
