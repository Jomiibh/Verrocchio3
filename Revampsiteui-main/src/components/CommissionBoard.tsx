import { DollarSign, Clock, User } from 'lucide-react';
import { motion } from 'motion/react';

const commissions = [
  {
    id: 1,
    title: 'Anime Character Portrait',
    description: 'Looking for an artist to draw my OC in anime style with detailed shading',
    budget: '$50-$100',
    deadline: '2 weeks',
    client: 'client_user1',
    tags: ['Anime', 'Portrait', 'Character'],
    urgent: false,
  },
  {
    id: 2,
    title: 'Manga Cover Art',
    description: 'Need a professional manga-style cover for my upcoming webcomic series',
    budget: '$200-$300',
    deadline: '1 month',
    client: 'manga_lover',
    tags: ['Manga', 'Cover Art', 'Professional'],
    urgent: true,
  },
  {
    id: 3,
    title: 'Character Design Sheet',
    description: 'Multiple views and expressions of fantasy character for game development',
    budget: '$150-$250',
    deadline: '3 weeks',
    client: 'game_dev_pro',
    tags: ['Character Design', 'Fantasy', 'Multiple Views'],
    urgent: false,
  },
  {
    id: 4,
    title: 'Chibi Style Illustration',
    description: 'Cute chibi-style artwork of my D&D party (5 characters)',
    budget: '$80-$120',
    deadline: '2 weeks',
    client: 'dnd_player',
    tags: ['Chibi', 'Group Art', 'Cute'],
    urgent: false,
  },
  {
    id: 5,
    title: 'Digital Portrait Commission',
    description: 'Semi-realistic digital portrait with detailed background',
    budget: '$100-$150',
    deadline: '10 days',
    client: 'art_collector',
    tags: ['Digital Art', 'Portrait', 'Background'],
    urgent: true,
  },
];

export function CommissionBoard() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Commission Board
          </h2>
          <p className="text-muted-foreground">Browse available commission requests</p>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <button className="px-4 py-2 rounded-full gradient-purple-blue text-white whitespace-nowrap">
            All Commissions
          </button>
          <button className="px-4 py-2 rounded-full bg-card border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap">
            Urgent
          </button>
          <button className="px-4 py-2 rounded-full bg-card border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap">
            High Budget
          </button>
          <button className="px-4 py-2 rounded-full bg-card border border-primary/20 hover:bg-primary/10 transition-colors whitespace-nowrap">
            Quick Jobs
          </button>
        </div>

        {/* Commission Cards */}
        <div className="space-y-4">
          {commissions.map((commission, index) => (
            <motion.div
              key={commission.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-primary/20 hover:border-primary/40 transition-all shadow-lg hover:shadow-primary/20"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start gap-3">
                    <h3 className="text-xl flex-1">{commission.title}</h3>
                    {commission.urgent && (
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 text-sm border border-red-500/30 text-red-400">
                        Urgent
                      </span>
                    )}
                  </div>

                  <p className="text-muted-foreground">{commission.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {commission.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-sm border border-primary/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>Posted by {commission.client}</span>
                  </div>
                </div>

                {/* Side Info */}
                <div className="lg:w-64 space-y-4">
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Budget</p>
                        <p className="text-lg text-green-400">{commission.budget}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-cyan-500 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                        <p className="">{commission.deadline}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl gradient-purple-blue text-white hover:scale-[1.02] transition-transform">
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
