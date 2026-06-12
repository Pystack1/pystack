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

// Color map based on first letter of name
const getAvatarColor = (name: string): string => {
  const colors: Record<string, string> = {
    'A': 'from-red-500 to-red-600',
    'B': 'from-blue-500 to-blue-600',
    'C': 'from-green-500 to-green-600',
    'D': 'from-purple-500 to-purple-600',
    'E': 'from-pink-500 to-pink-600',
    'F': 'from-indigo-500 to-indigo-600',
    'G': 'from-teal-500 to-teal-600',
    'H': 'from-orange-500 to-orange-600',
    'I': 'from-cyan-500 to-cyan-600',
    'J': 'from-rose-500 to-rose-600',
    'K': 'from-emerald-500 to-emerald-600',
    'L': 'from-yellow-500 to-yellow-600',
    'M': 'from-violet-500 to-violet-600',
    'N': 'from-amber-500 to-amber-600',
    'O': 'from-lime-500 to-lime-600',
    'P': 'from-sky-500 to-sky-600',
    'Q': 'from-fuchsia-500 to-fuchsia-600',
    'R': 'from-blue-600 to-blue-700',
    'S': 'from-green-600 to-green-700',
    'T': 'from-red-600 to-red-700',
    'U': 'from-purple-600 to-purple-700',
    'V': 'from-pink-600 to-pink-700',
    'W': 'from-indigo-600 to-indigo-700',
    'X': 'from-teal-600 to-teal-700',
    'Y': 'from-orange-600 to-orange-700',
    'Z': 'from-cyan-600 to-cyan-700',
  };
  
  const firstLetter = name.charAt(0).toUpperCase();
  return colors[firstLetter] || 'from-gray-500 to-gray-600';
};

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
        {duplicatedReviews.map((review, index) => {
          const avatarColor = getAvatarColor(review.name);
          const initial = review.name.charAt(0).toUpperCase();
          
          return (
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
                {/* Dynamic avatar with first letter and unique color */}
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${avatarColor} grid place-items-center text-white font-bold text-lg shadow-md`}>
                  {initial}
                </div>
                <div>
                  <div className="font-bold text-navy text-sm">{review.name}</div>
                  <div className="text-xs text-primary font-medium">{review.role}</div>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}