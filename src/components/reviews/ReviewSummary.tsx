import { Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ReviewSummaryProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { [key: number]: number };
}

export function ReviewSummary({ 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: ReviewSummaryProps) {
  const getRatingPercentage = (rating: number) => {
    if (totalReviews === 0) return 0;
    return ((ratingDistribution[rating] || 0) / totalReviews) * 100;
  };

  return (
    <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Overall Rating */}
        <div className="text-center sm:border-r sm:border-border sm:pr-8">
          <div className="font-serif text-5xl font-bold text-card-foreground mb-2">
            {averageRating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-5 h-5 ${
                  i < Math.round(averageRating) 
                    ? 'text-sunset fill-sunset' 
                    : 'text-muted-foreground'
                }`} 
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">
            Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-16">
                <span className="text-sm text-muted-foreground">{rating}</span>
                <Star className="w-4 h-4 text-sunset fill-sunset" />
              </div>
              <Progress 
                value={getRatingPercentage(rating)} 
                className="h-2 flex-1" 
              />
              <span className="text-sm text-muted-foreground w-12 text-right">
                {ratingDistribution[rating] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
