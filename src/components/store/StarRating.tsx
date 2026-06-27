import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  size = 14,
  showValue = false,
  reviews,
  className,
}: {
  rating: number;
  size?: number;
  showValue?: boolean;
  reviews?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={
              i < Math.round(rating) ? "fill-gold text-gold" : "fill-muted text-muted-foreground/40"
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-muted-foreground">
          {rating.toFixed(1)}
          {reviews !== undefined && <span className="ml-1">({reviews})</span>}
        </span>
      )}
    </div>
  );
}
