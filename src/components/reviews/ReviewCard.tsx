import { Star, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: {
    id: string;
    reviewer_name: string;
    reviewer_country?: string | null;
    rating: number;
    title?: string | null;
    content?: string | null;
    travel_date?: string | null;
    is_verified?: boolean | null;
    admin_response?: string | null;
    created_at: string;
  };
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-ocean/10 flex items-center justify-center text-ocean font-semibold text-lg">
            {review.reviewer_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-card-foreground">
                {review.reviewer_name}
              </span>
              {review.is_verified && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {review.reviewer_country && (
                <span>{review.reviewer_country}</span>
              )}
              {review.travel_date && (
                <>
                  <span>•</span>
                  <span>Traveled {format(new Date(review.travel_date), 'MMMM yyyy')}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${
                i < review.rating 
                  ? 'text-sunset fill-sunset' 
                  : 'text-muted-foreground'
              }`} 
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {review.title && (
        <h4 className="font-semibold text-card-foreground mb-2">{review.title}</h4>
      )}
      {review.content && (
        <p className="text-muted-foreground leading-relaxed">{review.content}</p>
      )}

      {/* Admin Response */}
      {review.admin_response && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-ocean">
          <p className="text-sm font-medium text-ocean mb-1">Response from Dream Lanka Travels</p>
          <p className="text-sm text-muted-foreground">{review.admin_response}</p>
        </div>
      )}

      {/* Date */}
      <p className="text-xs text-muted-foreground mt-4">
        Posted {format(new Date(review.created_at), 'MMMM d, yyyy')}
      </p>
    </div>
  );
}
