import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { QuickCommissions } from './components/QuickCommissions';
import { Feed } from './components/Feed';
import { DiscoverArtists } from './components/DiscoverArtists';
import { CommissionBoard } from './components/CommissionBoard';
import { Messages } from './components/Messages';
import { Notifications } from './components/Notifications';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <QuickCommissions />;
      case 'feed':
        return <Feed />;
      case 'discover':
        return <DiscoverArtists />;
      case 'board':
        return <CommissionBoard />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      case 'settings':
        return <Settings />;
      default:
        return <QuickCommissions />;
    }
  };

  return (
    <div className="size-full flex gradient-bg overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
}
