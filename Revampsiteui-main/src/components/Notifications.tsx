import { Heart, MessageCircle, UserPlus, DollarSign, Clock } from 'lucide-react';
import { motion } from 'motion/react';

const notifications = [
  {
    id: 1,
    type: 'like',
    user: 'artlover_99',
    action: 'liked your artwork',
    time: '5m ago',
    unread: true,
  },
  {
    id: 2,
    type: 'message',
    user: 'digital_dreamer',
    action: 'sent you a message',
    time: '1h ago',
    unread: true,
  },
  {
    id: 3,
    type: 'follow',
    user: 'sketch_master',
    action: 'started following you',
    time: '2h ago',
    unread: false,
  },
  {
    id: 4,
    type: 'commission',
    user: 'client_user1',
    action: 'accepted your commission offer',
    time: '3h ago',
    unread: false,
  },
  {
    id: 5,
    type: 'deadline',
    user: 'System',
    action: 'Deadline reminder: Commission due in 2 days',
    time: '5h ago',
    unread: false,
  },
  {
    id: 6,
    type: 'like',
    user: 'color_wizard',
    action: 'liked your artwork',
    time: '6h ago',
    unread: false,
  },
];

export function Notifications() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-accent" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-secondary" />;
      case 'commission':
        return <DollarSign className="w-5 h-5 text-green-500" />;
      case 'deadline':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
              Notifications
            </h2>
            <p className="text-muted-foreground">Stay updated with your activity</p>
          </div>
          <button className="px-4 py-2 rounded-xl bg-card border border-primary/20 hover:bg-primary/10 transition-colors text-sm">
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all hover:shadow-lg ${
                notification.unread
                  ? 'bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/30 glow-hover'
                  : 'bg-card border-primary/20'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div className="w-10 h-10 rounded-full bg-card border border-primary/20 flex items-center justify-center flex-shrink-0">
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="mb-1">
                    <span className="">{notification.user}</span>
                    <span className="text-muted-foreground ml-2">{notification.action}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>

                {/* Unread indicator */}
                {notification.unread && (
                  <div className="w-2 h-2 rounded-full bg-primary" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
