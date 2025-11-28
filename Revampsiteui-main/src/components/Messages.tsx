import { useState } from 'react';
import { Search, Send, Paperclip, Smile } from 'lucide-react';

const conversations = [
  {
    id: 1,
    user: 'artlover_99',
    lastMessage: 'Hey! I saw your commission request...',
    timestamp: '2m ago',
    unread: 2,
    online: true,
  },
  {
    id: 2,
    user: 'digital_dreamer',
    lastMessage: 'The sketch is ready for review!',
    timestamp: '1h ago',
    unread: 0,
    online: false,
  },
  {
    id: 3,
    user: 'sketch_master',
    lastMessage: 'Thanks! When do you need it by?',
    timestamp: '3h ago',
    unread: 1,
    online: true,
  },
];

const messages = [
  {
    id: 1,
    sender: 'artlover_99',
    content: 'Hey! I saw your commission request and I think I can help!',
    timestamp: '10:30 AM',
    isOwn: false,
  },
  {
    id: 2,
    sender: 'You',
    content: 'That\'s great! Can you show me some of your previous work?',
    timestamp: '10:32 AM',
    isOwn: true,
  },
  {
    id: 3,
    sender: 'artlover_99',
    content: 'Of course! Let me send you my portfolio link',
    timestamp: '10:33 AM',
    isOwn: false,
  },
];

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message
      setMessageInput('');
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-primary/20 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-primary/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-card border border-primary/20 focus:border-primary/50 focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`w-full p-4 flex items-center gap-3 hover:bg-primary/5 transition-colors border-b border-primary/10 ${
                selectedConversation.id === conv.id ? 'bg-primary/10' : ''
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full gradient-purple-blue" />
                {conv.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                )}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm truncate">{conv.user}</p>
                  <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs text-white">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-primary/20 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-purple-blue" />
            {selectedConversation.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="">{selectedConversation.user}</h3>
            <p className="text-xs text-muted-foreground">
              {selectedConversation.online ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl ${
                  message.isOwn
                    ? 'gradient-purple-blue text-white rounded-br-sm'
                    : 'bg-card border border-primary/20 rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isOwn ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-primary/20">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <Paperclip className="w-5 h-5 text-muted-foreground" />
            </button>
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-primary/20 focus:border-primary/50 focus:outline-none"
            />
            <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={handleSendMessage}
              className="p-2.5 rounded-xl gradient-purple-blue hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
