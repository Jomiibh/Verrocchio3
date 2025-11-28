import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { motion } from 'motion/react';
import Masonry from 'react-responsive-masonry';

const feedPosts = [
  {
    id: 1,
    artist: 'demobot3',
    handle: '@demobot',
    artwork: 'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'New commission work! Character design for a client ✨',
    likes: 234,
    comments: 12,
    timestamp: '2h ago',
    height: 'tall',
  },
  {
    id: 2,
    artist: 'artlover_99',
    handle: '@artlover99',
    artwork: 'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Working on some vibrant manga art! Open for commissions 🎨',
    likes: 456,
    comments: 28,
    timestamp: '4h ago',
    height: 'medium',
  },
  {
    id: 3,
    artist: 'digital_dreamer',
    handle: '@digitaldreamer',
    artwork: 'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Portrait study from today 💜',
    likes: 189,
    comments: 15,
    timestamp: '6h ago',
    height: 'short',
  },
  {
    id: 4,
    artist: 'sketch_master',
    handle: '@sketchmaster',
    artwork: 'https://images.unsplash.com/photo-1665762389848-8a6acfe934c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGRyYXdpbmd8ZW58MXx8fHwxNzY0MzAyMTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Character sketch 🖊️',
    likes: 312,
    comments: 24,
    timestamp: '8h ago',
    height: 'tall',
  },
  {
    id: 5,
    artist: 'color_wizard',
    handle: '@colorwizard',
    artwork: 'https://images.unsplash.com/photo-1700605295478-2478ac29d2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2NDMwMjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Experimenting with colors and lighting',
    likes: 521,
    comments: 42,
    timestamp: '10h ago',
    height: 'medium',
  },
  {
    id: 6,
    artist: 'manga_master',
    handle: '@mangamaster',
    artwork: 'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Latest manga panel',
    likes: 678,
    comments: 56,
    timestamp: '12h ago',
    height: 'short',
  },
  {
    id: 7,
    artist: 'pixel_artist',
    handle: '@pixelartist',
    artwork: 'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Pixel perfect ✨',
    likes: 445,
    comments: 31,
    timestamp: '14h ago',
    height: 'tall',
  },
  {
    id: 8,
    artist: 'anime_dreams',
    handle: '@animedreams',
    artwork: 'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Dream sequence art 🌙',
    likes: 298,
    comments: 19,
    timestamp: '16h ago',
    height: 'medium',
  },
];

export function Feed() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Feed
          </h2>
        </div>

        {/* Masonry Grid */}
        <Masonry columnsCount={3} gutter="16px">
          {feedPosts.map((post, index) => (
            <MasonryCard key={post.id} post={post} index={index} />
          ))}
        </Masonry>
      </div>
    </div>
  );
}

interface MasonryCardProps {
  post: typeof feedPosts[0];
  index: number;
}

function MasonryCard({ post, index }: MasonryCardProps) {
  const heightClasses = {
    short: 'aspect-[3/4]',
    medium: 'aspect-square',
    tall: 'aspect-[3/5]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden bg-card border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02] group"
    >
      {/* Artwork */}
      <div className={`relative overflow-hidden ${heightClasses[post.height as keyof typeof heightClasses]}`}>
        <img
          src={post.artwork}
          alt={post.caption}
          className="w-full h-full object-cover"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
            {/* Artist Info */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-purple-blue" />
              <div>
                <p className="text-sm">{post.artist}</p>
                <p className="text-xs text-muted-foreground">{post.handle}</p>
              </div>
            </div>

            {/* Caption */}
            <p className="text-sm line-clamp-2">{post.caption}</p>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors group/btn">
                <Heart className="w-4 h-4 group-hover/btn:fill-pink-500" />
                <span className="text-xs">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-secondary transition-colors ml-auto">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
