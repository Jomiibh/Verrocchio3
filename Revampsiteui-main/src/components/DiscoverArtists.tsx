import { useState } from 'react';
import { Search, Star, Users } from 'lucide-react';
import { motion } from 'motion/react';

const artists = [
  {
    id: 1,
    name: 'demobot3',
    handle: '@demobot',
    bio: 'Anime & Manga artist | Open for commissions',
    followers: '2.3K',
    rating: 4.9,
    portfolio: [
      'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=400',
    ],
    tags: ['Anime', 'Manga', 'Character Design'],
  },
  {
    id: 2,
    name: 'artlover_99',
    handle: '@artlover99',
    bio: 'Digital illustrator specializing in vibrant colors',
    followers: '5.1K',
    rating: 5.0,
    portfolio: [
      'https://images.unsplash.com/photo-1665762389848-8a6acfe934c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGRyYXdpbmd8ZW58MXx8fHwxNzY0MzAyMTczfDA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1700605295478-2478ac29d2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2NDMwMjE3M3ww&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=400',
    ],
    tags: ['Portrait', 'Illustration', 'Color Art'],
  },
  {
    id: 3,
    name: 'digital_dreamer',
    handle: '@digitaldreamer',
    bio: '3D & Digital art enthusiast | Quick turnaround',
    followers: '3.7K',
    rating: 4.8,
    portfolio: [
      'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=400',
      'https://images.unsplash.com/photo-1665762389848-8a6acfe934c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGRyYXdpbmd8ZW58MXx8fHwxNzY0MzAyMTczfDA&ixlib=rb-4.1.0&q=80&w=400',
    ],
    tags: ['3D Art', 'Digital', 'Fantasy'],
  },
];

export function DiscoverArtists() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Discover Artists
          </h2>
          <p className="text-muted-foreground">Find and connect with talented creators</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search artists, styles, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-card border border-primary/20 focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl overflow-hidden bg-card border border-primary/20 shadow-lg hover:shadow-primary/20 transition-all hover:scale-[1.02]"
            >
              {/* Portfolio Grid */}
              <div className="grid grid-cols-3 gap-1 p-1">
                {artist.portfolio.map((img, idx) => (
                  <div key={idx} className="aspect-square overflow-hidden rounded-lg">
                    <img
                      src={img}
                      alt={`Portfolio ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>

              {/* Artist Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg">{artist.name}</h3>
                    <p className="text-sm text-muted-foreground">{artist.handle}</p>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-accent/20 border border-accent/30">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-sm text-accent">{artist.rating}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{artist.bio}</p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{artist.followers} followers</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {artist.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-xs border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2.5 rounded-xl gradient-purple-blue text-white hover:scale-[1.02] transition-transform">
                  View Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
