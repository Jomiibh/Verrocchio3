import { Camera, MapPin, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

const portfolioItems = [
  'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1695671548955-74a180b8777d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW5nYSUyMGFydHdvcmslMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1704078541927-7a0da547f730?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwYXJ0JTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY0MTgwNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1665762389848-8a6acfe934c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGNoYXJhY3RlciUyMGRyYXdpbmd8ZW58MXx8fHwxNzY0MzAyMTczfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1700605295478-2478ac29d2ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpc3RpYyUyMHBvcnRyYWl0JTIwaWxsdXN0cmF0aW9ufGVufDF8fHx8MTc2NDMwMjE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1763732397864-5b860bb298b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmltZSUyMGFydCUyMGlsbHVzdHJhdGlvbnxlbnwxfHx8fDE3NjQzMDIxNzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
];

export function Profile() {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Cover Image */}
      <div className="relative h-64 bg-gradient-to-br from-primary via-secondary to-accent">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] bg-repeat" />
        <button className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/30 hover:bg-background transition-colors">
          <Camera className="w-4 h-4 inline mr-2" />
          Change Cover
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-8">
        {/* Profile Header */}
        <div className="relative -mt-20 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
            {/* Avatar */}
            <div className="relative">
              <div className="w-40 h-40 rounded-2xl gradient-purple-blue border-4 border-background shadow-2xl glow-effect" />
              <button className="absolute bottom-2 right-2 p-2 rounded-lg bg-background border border-primary/30 hover:bg-primary/10 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 pb-4">
              <h2 className="text-3xl mb-1">demobot3</h2>
              <p className="text-muted-foreground mb-4">@demobot</p>
              
              <p className="mb-4 max-w-2xl">
                Digital artist specializing in anime and manga art styles. 
                Open for commissions! Creating vibrant characters and illustrations.
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Tokyo, Japan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Joined November 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <span className="text-accent">4.9 Rating</span>
                </div>
              </div>

              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-2xl">2.3K</p>
                  <p className="text-sm text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-2xl">842</p>
                  <p className="text-sm text-muted-foreground">Following</p>
                </div>
                <div>
                  <p className="text-2xl">156</p>
                  <p className="text-sm text-muted-foreground">Commissions</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="px-6 py-2 rounded-xl gradient-purple-blue text-white hover:scale-[1.02] transition-transform">
                  Edit Profile
                </button>
                <button className="px-6 py-2 rounded-xl bg-card border border-primary/30 hover:bg-primary/10 transition-colors">
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-8">
          <h3 className="text-xl mb-4">Specialties</h3>
          <div className="flex flex-wrap gap-3">
            {['Anime', 'Manga', 'Character Design', 'Portrait', 'Illustration', 'Digital Art'].map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        <div className="pb-8">
          <h3 className="text-xl mb-4">Portfolio</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {portfolioItems.map((img, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="aspect-square rounded-xl overflow-hidden border border-primary/20 hover:border-primary/40 transition-all shadow-lg hover:shadow-primary/20 hover:scale-[1.02] group"
              >
                <img
                  src={img}
                  alt={`Portfolio ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
