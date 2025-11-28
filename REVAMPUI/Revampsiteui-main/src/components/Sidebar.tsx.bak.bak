import { Home, Rss, Search, ClipboardList, MessageCircle, Bell, User, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'feed', icon: Rss, label: 'Feed' },
    { id: 'discover', icon: Search, label: 'Discover Artists' },
    { id: 'board', icon: ClipboardList, label: 'Commission Board' },
    { id: 'messages', icon: MessageCircle, label: 'Messages' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 flex flex-col">
      {/* Logo */}
      <div className="mb-8 px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-purple-blue flex items-center justify-center glow-effect">
            <span className="text-white">V</span>
          </div>
          <h1 className="text-xl tracking-wide bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Verrocchio
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground glow-hover border border-primary/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className={isActive ? 'text-foreground' : ''}>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-card to-sidebar-accent border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full gradient-purple-blue flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">demobot3</p>
            <p className="text-xs text-muted-foreground">@demobot</p>
          </div>
        </div>
      </div>

      {/* Decorative blob */}
      <div className="absolute top-20 left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl blob-animate pointer-events-none" />
    </aside>
  );
}
