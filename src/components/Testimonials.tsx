// src/components/Testimonials.tsx
import { motion } from "framer-motion";
import { FaQuoteRight, FaStar } from "react-icons/fa";

interface Review {
  id: number;
  name: string;
  role: string;
  text: string;
  rating: number;
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        whileHover={{ animationPlayState: "paused" }}
      >
        {duplicatedReviews.map((review, index) => (
          <div
            key={`${review.id}-${index}`}
            className="flex-shrink-0 w-[320px] sm:w-[380px] p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-elegant transition-all flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="text-primary text-2xl opacity-50">
                  <FaQuoteRight />
                </div>
                <div className="flex text-primary-glow gap-1 text-xs">
                  {[...Array(5)].map((_, j) => <FaStar key={j} />)}
                </div>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed italic line-clamp-5">
                "{review.text}"
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-blue-600 grid place-items-center text-white font-bold text-lg shadow-md">
                {review.name[0]}
              </div>
              <div>
                <div className="font-bold text-navy text-sm">{review.name}</div>
                <div className="text-xs text-primary font-medium">{review.role}</div>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}