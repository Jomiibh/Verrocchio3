import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, MessageCircle, Star } from 'lucide-react';

const artistCards = [
  {
    id: 1,
    username: 'demobot3',
    handle: '@demobot',
    artwork: 'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Anime/Manga',
    tags: ['Character Design', 'Illustration'],
  },
  {
    id: 2,
    username: 'artlover_99',
    handle: '@artlover99',
    artwork: 'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Manga',
    tags: ['Portrait', 'Color Art'],
  },
  {
    id: 3,
    username: 'digital_dreamer',
    handle: '@digitaldreamer',
    artwork: 'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Digital Art',
    tags: ['3D', 'Portrait'],
  },
  {
    id: 4,
    username: 'sketch_master',
    handle: '@sketchmaster',
    artwork: 'https://images.unsplash.com/photo-1665762389848-8a6acfe934c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGRyYXdpbmd8ZW58MXx8fHwxNzY0MzAyMTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Anime',
    tags: ['Character', 'Sketch'],
  },
  {
    id: 5,
    username: 'color_wizard',
    handle: '@colorwizard',
    artwork: 'https://images.unsplash.com/photo-1700605295478-2478ac29d2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2NDMwMjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    style: 'Illustration',
    tags: ['Portrait', 'Vibrant'],
  },
];

export function QuickCommissions() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < artistCards.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentCard = artistCards[currentIndex];
  const prevCard = currentIndex > 0 ? artistCards[currentIndex - 1] : null;
  const nextCard = currentIndex < artistCards.length - 1 ? artistCards[currentIndex + 1] : null;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl blob-animate" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl blob-animate" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-7xl">
        {/* Carousel Container */}
        <div className="relative flex items-center justify-center gap-8">
          {/* Previous Card (Blurred) */}
          <div className="hidden lg:block w-64 opacity-30 blur-sm">
            {prevCard && (
              <div className="rounded-2xl overflow-hidden bg-card border border-primary/20">
                <div className="aspect-[3/4]">
                  <img
                    src={prevCard.artwork}
                    alt={prevCard.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Current Card */}
          <div className="flex-1 max-w-md">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="rounded-2xl overflow-hidden bg-card border-2 border-primary/30 shadow-2xl glow-effect"
              >
                {/* Artwork */}
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img
                    src={currentCard.artwork}
                    alt={currentCard.username}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                  
                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
                    <h3 className="text-2xl">{currentCard.username}</h3>
                    <p className="text-sm text-muted-foreground">{currentCard.handle}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/30 to-secondary/30 backdrop-blur-sm text-sm border border-primary/40">
                        {currentCard.style}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Counter */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              {currentIndex + 1} / {artistCards.length}
            </div>
          </div>

          {/* Next Card (Blurred) */}
          <div className="hidden lg:block w-64 opacity-30 blur-sm">
            {nextCard && (
              <div className="rounded-2xl overflow-hidden bg-card border border-primary/20">
                <div className="aspect-[3/4]">
                  <img
                    src={nextCard.artwork}
                    alt={nextCard.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-6 mt-8">
          {/* Left Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentIndex === 0
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card border-2 border-primary/40 hover:border-primary/60 glow-hover'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Message Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full gradient-purple-blue flex items-center justify-center shadow-lg hover:shadow-primary/50 transition-shadow"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.button>

          {/* Right Arrow */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            disabled={currentIndex === artistCards.length - 1}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
              currentIndex === artistCards.length - 1
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-card border-2 border-primary/40 hover:border-primary/60 glow-hover'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
