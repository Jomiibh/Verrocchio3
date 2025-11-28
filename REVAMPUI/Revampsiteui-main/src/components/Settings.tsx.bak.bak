import { Bell, Lock, Palette, CreditCard, Globe, HelpCircle, LogOut } from 'lucide-react';

export function Settings() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
            Settings
          </h2>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="rounded-2xl bg-card border border-primary/20 overflow-hidden">
            <div className="p-6 border-b border-primary/20">
              <h3 className="text-xl">Account Settings</h3>
            </div>
            <div className="divide-y divide-primary/10">
              <SettingItem
                icon={<Bell className="w-5 h-5" />}
                title="Notifications"
                description="Manage your notification preferences"
              />
              <SettingItem
                icon={<Lock className="w-5 h-5" />}
                title="Privacy & Security"
                description="Control your privacy settings and security options"
              />
              <SettingItem
                icon={<Globe className="w-5 h-5" />}
                title="Language & Region"
                description="Set your language and regional preferences"
              />
            </div>
          </div>

          {/* Appearance */}
          <div className="rounded-2xl bg-card border border-primary/20 overflow-hidden">
            <div className="p-6 border-b border-primary/20">
              <h3 className="text-xl">Appearance</h3>
            </div>
            <div className="divide-y divide-primary/10">
              <SettingItem
                icon={<Palette className="w-5 h-5" />}
                title="Theme"
                description="Customize your app appearance"
              />
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-2xl bg-card border border-primary/20 overflow-hidden">
            <div className="p-6 border-b border-primary/20">
              <h3 className="text-xl">Billing & Payments</h3>
            </div>
            <div className="divide-y divide-primary/10">
              <SettingItem
                icon={<CreditCard className="w-5 h-5" />}
                title="Payment Methods"
                description="Manage your payment methods and transaction history"
              />
            </div>
          </div>

          {/* Support */}
          <div className="rounded-2xl bg-card border border-primary/20 overflow-hidden">
            <div className="p-6 border-b border-primary/20">
              <h3 className="text-xl">Support</h3>
            </div>
            <div className="divide-y divide-primary/10">
              <SettingItem
                icon={<HelpCircle className="w-5 h-5" />}
                title="Help Center"
                description="Get help and support"
              />
            </div>
          </div>

          {/* Logout */}
          <button className="w-full p-6 rounded-2xl bg-gradient-to-r from-red-500/10 to-pink-500/10 border border-red-500/30 hover:border-red-500/50 transition-colors flex items-center justify-center gap-3 text-red-400">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SettingItem({ icon, title, description }: SettingItemProps) {
  return (
    <button className="w-full p-6 hover:bg-primary/5 transition-colors flex items-center gap-4 text-left">
      <div className="w-10 h-10 rounded-lg gradient-purple-blue flex items-center justify-center text-white flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="text-muted-foreground">→</div>
    </button>
  );
}
