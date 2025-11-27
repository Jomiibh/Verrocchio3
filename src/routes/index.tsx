import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { UserProvider, useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Check, MessageCircle, Palette, ShoppingBag, Send, Upload, ChevronLeft, ChevronRight,
  Mail, User, Lock, Eye, EyeOff, Twitter, Instagram, Globe, ExternalLink,
  Home, Grid3x3, Compass, Briefcase, UserCircle, Settings, Plus, X,
  Heart, FileImage, FileText, Edit3, Sparkles, Search, Image as ImageIcon, Crop, Bell, Trash2, Calendar,
  ArrowLeft, ArrowRight
} from "lucide-react";
import { UserRole, type UserModel } from "@/components/data/orm/orm_user";
import { type TimelinePostModel } from "@/components/data/orm/orm_timeline_post";
import { type ArtistProfileModel } from "@/components/data/orm/orm_artist_profile";
import { type CommissionRequestModel } from "@/components/data/orm/orm_commission_request";
import { useCreaoFileUpload } from "@/hooks/use-creao-file-upload";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  loginApi,
  registerApi,
  saveAuthToken,
  getProfile,
  updateProfile,
  getPosts,
  createPost,
  getArtists,
  getRequests,
  getMyRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
} from "@/lib/api";

export const Route = createFileRoute("/")({
  component: () => (
    <UserProvider>
      <App />
    </UserProvider>
  ),
});

type Page = "home" | "feed" | "discover" | "requests" | "my-requests" | "profile" | "settings" | "messages" | "notifications" | "slides";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: number;
}

interface Conversation {
  userId: string;
  userName: string;
  userAvatar: string | null;
  lastMessage: string;
  timestamp: number;
  unreadCount?: number;
  conversationId?: string;
}

interface Notification {
  id: string;
  type: "like" | "message" | "commission";
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string | null;
  message: string;
  timestamp: number;
  read: boolean;
  linkTo?: string;
}

interface ArtistSlidePost {
  id: string;
  artistId: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  tags?: string[];
  priceRange?: string;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedArtistForSlides, setSelectedArtistForSlides] = useState<{ artist: ArtistProfileModel; user: UserModel } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    setNotifications(prev => [
      {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen flex">
      <ParallaxBackground mousePosition={mousePosition} />
      <LeftSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        unreadNotifications={unreadCount}
      />
      <MainContent
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        notifications={notifications}
        markNotificationRead={markNotificationRead}
        markAllNotificationsRead={markAllNotificationsRead}
        addNotification={addNotification}
        selectedArtistForSlides={selectedArtistForSlides}
        setSelectedArtistForSlides={setSelectedArtistForSlides}
      />
      <FloatingActionButton />
    </div>
  );
}

function ParallaxBackground({ mousePosition }: { mousePosition: { x: number; y: number } }) {
  const parallaxX = (mousePosition.x / window.innerWidth - 0.5) * 20;
  const parallaxY = (mousePosition.y / window.innerHeight - 0.5) * 20;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background - VGen style */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(-45deg, #0c1020, #101528, #1a1f2e, #0c1020, #14182a)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 30s ease-in-out infinite alternate',
        }}
      />

      {/* Soft floating orbs/blobs - very subtle */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${parallaxX * 0.3}px, ${parallaxY * 0.3}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      >
        {/* Neon green glow */}
        <div
          className="absolute rounded-full"
          style={{
            top: '15%',
            left: '10%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(196, 252, 65, 0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'floatOrb1 35s ease-in-out infinite',
          }}
        />
        {/* Cyan glow */}
        <div
          className="absolute rounded-full"
          style={{
            top: '60%',
            right: '15%',
            width: '450px',
            height: '450px',
            background: 'radial-gradient(circle, rgba(53, 208, 255, 0.04) 0%, transparent 70%)',
            filter: 'blur(70px)',
            animation: 'floatOrb2 40s ease-in-out infinite',
          }}
        />
        {/* Soft magenta glow */}
        <div
          className="absolute rounded-full"
          style={{
            bottom: '10%',
            left: '50%',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(184, 107, 255, 0.03) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'floatOrb3 45s ease-in-out infinite',
          }}
        />
        {/* Additional accent orbs */}
        <div
          className="absolute rounded-full"
          style={{
            top: '40%',
            left: '70%',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(100, 200, 255, 0.04) 0%, transparent 70%)',
            filter: 'blur(65px)',
            animation: 'floatOrb4 38s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: '30%',
            right: '60%',
            width: '380px',
            height: '380px',
            background: 'radial-gradient(circle, rgba(196, 252, 65, 0.04) 0%, transparent 70%)',
            filter: 'blur(75px)',
            animation: 'floatOrb5 42s ease-in-out infinite',
          }}
        />
      </div>
    </div>
  );
}

function LeftSidebar({ currentPage, setCurrentPage, unreadNotifications }: { currentPage: Page; setCurrentPage: (page: Page) => void; unreadNotifications: number }) {
  const { currentUser, logout } = useUser();
  const [showAuth, setShowAuth] = useState(false);

  const navItems = [
    { id: "home" as Page, icon: Home, label: "Home" },
    { id: "feed" as Page, icon: Grid3x3, label: "Feed" },
    { id: "discover" as Page, icon: Compass, label: "Discover Artists" },
    { id: "requests" as Page, icon: Briefcase, label: currentUser?.role === UserRole.Artist ? "Commission Board" : "My Requests", hideFor: currentUser?.role === UserRole.Buyer ? "commission-board" : undefined },
    { id: "messages" as Page, icon: MessageCircle, label: "Messages" },
    { id: "notifications" as Page, icon: Bell, label: "Notifications", badge: unreadNotifications },
    { id: "profile" as Page, icon: UserCircle, label: "Profile" },
    { id: "settings" as Page, icon: Settings, label: "Settings" },
  ].filter(item => {
    // Hide "My Requests" / "Commission Board" when user is not logged in
    if (!currentUser && item.id === "requests") {
      return false;
    }
    // Hide Commission Board for buyers
    if (currentUser?.role === UserRole.Buyer && item.id === "requests") {
      return false;
    }
    return true;
  });

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-[280px] border-r border-[#2a3142] flex flex-col z-40"
      style={{
        backgroundColor: 'rgba(15, 18, 30, 0.85)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-[#2a3142]">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("home")}>
          <Palette className="size-8 text-[#c4fc41]" />
          <h1 className="text-xl font-bold text-white">Verrocchio</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-full text-left transition-all duration-150 relative
                ${isActive
                  ? 'bg-[#c4fc41]/10 text-white font-semibold border-l-4 border-[#c4fc41] pl-3'
                  : 'text-[#a0a8b8] hover:bg-[#2a3142] hover:text-white hover:scale-[1.02]'
                }
              `}
            >
              <Icon className="size-6 transition-all duration-150" />
              <span className="text-base flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold rounded-full size-5 flex items-center justify-center animate-pulse">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-[#2a3142]">
        {currentUser ? (
          <div className="flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={currentUser.avatar_url || undefined} />
              <AvatarFallback>{currentUser.display_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{currentUser.display_name}</p>
              <p className="text-xs text-[#a0a8b8] truncate">@{currentUser.username}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-[#a0a8b8] hover:text-white"
            >
              <ExternalLink className="size-4" />
            </Button>
          </div>
        ) : (
          <Dialog open={showAuth} onOpenChange={setShowAuth}>
            <DialogTrigger asChild>
              <Button className="w-full vgen-button-primary">Sign In / Sign Up</Button>
            </DialogTrigger>
            <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-md">
              <AuthDialog onClose={() => setShowAuth(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </aside>
  );
}

function MainContent({
  currentPage,
  setCurrentPage,
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  addNotification,
  selectedArtistForSlides,
  setSelectedArtistForSlides,
}: {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  selectedArtistForSlides: { artist: ArtistProfileModel; user: UserModel } | null;
  setSelectedArtistForSlides: (data: { artist: ArtistProfileModel; user: UserModel } | null) => void;
}) {
  return (
    <main className="ml-[280px] flex-1 relative z-10">
      {currentPage === "home" && <SwipePage setCurrentPage={setCurrentPage} addNotification={addNotification} setSelectedArtistForSlides={setSelectedArtistForSlides} />}
      {currentPage === "feed" && <FeedPage setCurrentPage={setCurrentPage} />}
      {currentPage === "discover" && <DiscoverPage setCurrentPage={setCurrentPage} setSelectedArtistForSlides={setSelectedArtistForSlides} />}
      {currentPage === "requests" && <RequestsPage />}
      {currentPage === "my-requests" && <MyRequestsPage />}
      {currentPage === "messages" && <MessagesPage />}
      {currentPage === "notifications" && <NotificationsPage notifications={notifications} markNotificationRead={markNotificationRead} markAllNotificationsRead={markAllNotificationsRead} setCurrentPage={setCurrentPage} />}
      {currentPage === "profile" && <ProfilePage setCurrentPage={setCurrentPage} addNotification={addNotification} />}
      {currentPage === "settings" && <SettingsPage />}
      {currentPage === "slides" && selectedArtistForSlides && <SlidesDetailPage artistData={selectedArtistForSlides} setCurrentPage={setCurrentPage} />}
    </main>
  );
}

function SwipePage({
  setCurrentPage,
  addNotification,
  setSelectedArtistForSlides
}: {
  setCurrentPage: (page: Page) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  setSelectedArtistForSlides: (data: { artist: ArtistProfileModel; user: UserModel } | null) => void;
}) {
  const { currentUser } = useUser();
  const { data: artists = [] } = useQuery({
    queryKey: ['all-artists-with-users'],
    queryFn: async () => {
      const res = await getArtists();
      return (res.artists || []) as { artist: ArtistProfileModel; user: UserModel }[];
    },
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likedArtists, setLikedArtists] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const filteredArtists = artists.filter((a) => (a.artist.portfolio_image_urls || []).length > 0);
  const currentArtistData = filteredArtists[currentIndex];
  const previousArtistData = currentIndex > 0 ? filteredArtists[currentIndex - 1] : null;
  const nextArtistData = currentIndex < filteredArtists.length - 1 ? filteredArtists[currentIndex + 1] : null;
  const currentArtistImages = currentArtistData?.artist.portfolio_image_urls || [];

  const handleNext = () => {
    if (currentIndex >= filteredArtists.length - 1 || isAnimating) return;

    setDirection('right');
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(filteredArtists.length - 1, prev + 1));
      setCurrentImageIndex(0); // Reset to first image for next artist
      setIsAnimating(false);
    }, 250);
  };

  const handlePrevious = () => {
    if (currentIndex <= 0 || isAnimating) return;

    setDirection('left');
    setIsAnimating(true);

    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
      setCurrentImageIndex(0); // Reset to first image for previous artist
      setIsAnimating(false);
    }, 250);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Ignore if a modal is open (check for dialog elements)
      if (document.querySelector('[role="dialog"]')) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, artists.length]); // Re-attach when currentIndex changes

  const handlePreviousImage = () => {
    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(Math.min(currentArtistImages.length - 1, currentImageIndex + 1));
  };

  const handleMessage = async () => {
    if (!currentArtistData || !currentUser) return;

    // Defer conversation creation to Messages page; store pending target
    try {
      sessionStorage.setItem("pending_conversation_user_id", currentArtistData.user.id);
    } catch {
      // ignore storage errors
    }
    setCurrentPage('messages');

    // Add notification
    const avatarUrl: string | null = currentArtistData.user.avatar_url ?? null;
    addNotification({
      type: "message",
      fromUserId: currentArtistData.user.id,
      fromUserName: currentArtistData.user.display_name,
      fromUserAvatar: avatarUrl,
      message: `Started a conversation with ${currentArtistData.user.display_name}`,
      linkTo: "messages",
    });

    // Navigate to messages with this conversation selected
    setCurrentPage('messages');
  };

  const handleAvatarClick = () => {
    if (!currentArtistData) return;
    setSelectedArtistForSlides(currentArtistData);
    setCurrentPage('slides');
  };

  if (!currentArtistData) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-24">
        <div className="text-center">
          <Sparkles className="size-16 text-[#c4fc41] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">You've seen everyone!</h2>
          <p className="text-[#a0a8b8]">Check back later for more artists</p>
        </div>
      </div>
    );
  }

  const { artist, user } = currentArtistData;
  const isLiked = likedArtists.has(artist.id);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div
        className="max-w-2xl mx-auto mb-8 p-6 rounded-2xl"
        style={{
          background: 'rgba(18, 22, 34, 0.75)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-2 text-center">Quick Commissions</h1>
        <p className="text-[#a0a8b8] text-center">Swipe or tap to find your perfect creative match</p>
      </div>

      {/* 3-card carousel layout */}
      <div className="relative mb-8 flex items-center justify-center gap-6 min-h-[800px]">
        {/* Left card - Previous (blurred) */}
        {previousArtistData && (
          <div className="w-[300px] opacity-40 scale-90 blur-sm pointer-events-none">
            <Card className="vgen-card p-0 overflow-hidden h-[700px]">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={previousArtistData.user.avatar_url || undefined} />
                    <AvatarFallback>{previousArtistData.user.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-white">{previousArtistData.user.display_name}</h3>
                  </div>
                </div>
              </div>
              {previousArtistData.artist.portfolio_image_urls && previousArtistData.artist.portfolio_image_urls[0] && (
                <div className="aspect-[2/3] overflow-hidden">
                  <img
                    src={previousArtistData.artist.portfolio_image_urls[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Center card - Current (focused) */}
        <Card
          key={currentArtistData?.artist.id || currentIndex}
          className={`w-[600px] vgen-card p-0 overflow-hidden ${
            direction === 'right' ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left'
          }`}
        >
          {/* Profile Block - Glassmorphism header */}
          <div
            className="p-6 space-y-4 rounded-t-2xl"
            style={{
              backgroundColor: 'rgba(10, 12, 20, 0.7)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            {/* Artist info */}
            <div className="flex items-start gap-4">
              <Avatar
                className="size-16 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
              >
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="text-xl">{user.display_name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{user.display_name}</h3>
                <p className="text-[#a0a8b8]">@{user.username}</p>
              </div>
            </div>

            {/* Tags */}
            {artist.art_style_tags && artist.art_style_tags.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {artist.art_style_tags.map((tag, idx) => (
                  <Badge key={idx} className="vgen-badge-open">{tag}</Badge>
                ))}
              </div>
            )}

            {/* Bio */}
            {artist.bio && (
              <p className="text-white leading-relaxed">{artist.bio}</p>
            )}

            {/* Social links */}
            {artist.social_links && (
              <div className="flex gap-3">
                {artist.social_links.twitter && (
                  <a
                    href={`https://twitter.com/${artist.social_links.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] transition-all duration-150 hover:scale-105"
                  >
                    <Twitter className="size-4 transition-transform duration-150 group-hover:rotate-12" />
                  </a>
                )}
                {artist.social_links.instagram && (
                  <a
                    href={`https://instagram.com/${artist.social_links.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] transition-all duration-150 hover:scale-105"
                  >
                    <Instagram className="size-4 transition-transform duration-150 group-hover:rotate-12" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Image carousel - NOW BELOW PROFILE */}
          {currentArtistImages.length > 0 && (
            <div className="relative aspect-[2/3] overflow-hidden">
              <img
                src={currentArtistImages[currentImageIndex]}
                alt={`Slide ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Image navigation */}
              {currentArtistImages.length > 1 && (
                <>
                  {/* Left arrow */}
                  {currentImageIndex > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviousImage();
                      }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                    >
                      <ChevronLeft className="size-6" />
                    </button>
                  )}

                  {/* Right arrow */}
                  {currentImageIndex < currentArtistImages.length - 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                    >
                      <ChevronRight className="size-6" />
                    </button>
                  )}

                  {/* Image counter badge */}
                  <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                    {currentImageIndex + 1} / {currentArtistImages.length}
                  </div>
                </>
              )}

              {isLiked && (
                <div className="absolute top-4 left-4 bg-[#c4fc41] text-[#1a1f2e] rounded-full p-2">
                  <Check className="size-6" />
                </div>
              )}
            </div>
          )}

          {/* Price range - BELOW IMAGES */}
          <div className="p-6 pt-4 border-t border-[#2a3142]">
            <p className="text-sm text-[#a0a8b8] mb-1">Price Range</p>
            <p className="text-white font-semibold">${artist.price_range_min} - ${artist.price_range_max}</p>
          </div>
        </Card>

        {/* Right card - Next (blurred) */}
        {nextArtistData && (
          <div className="w-[300px] opacity-40 scale-90 blur-sm pointer-events-none">
            <Card className="vgen-card p-0 overflow-hidden h-[700px]">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12">
                    <AvatarImage src={nextArtistData.user.avatar_url || undefined} />
                    <AvatarFallback>{nextArtistData.user.display_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-bold text-white">{nextArtistData.user.display_name}</h3>
                  </div>
                </div>
              </div>
              {nextArtistData.artist.portfolio_image_urls && nextArtistData.artist.portfolio_image_urls[0] && (
                <div className="aspect-[2/3] overflow-hidden">
                  <img
                    src={nextArtistData.artist.portfolio_image_urls[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            variant="outline"
            size="lg"
            className="rounded-full size-16 border-2 border-[#a0a8b8] bg-[#a0a8b8]/10 hover:bg-[#a0a8b8]/20 text-[#a0a8b8] hover:text-white transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="size-8" />
          </Button>
          <Button
            onClick={handleMessage}
            variant="outline"
            size="lg"
            className="rounded-full size-16 border-2 border-[#60a5fa] bg-[#60a5fa]/10 hover:bg-[#60a5fa]/20 text-[#60a5fa] hover:text-[#60a5fa] transition-all hover:scale-110"
          >
            <MessageCircle className="size-7" />
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentIndex >= filteredArtists.length - 1}
            size="lg"
            className="rounded-full size-16 border-2 border-[#a0a8b8] bg-[#a0a8b8]/10 hover:bg-[#a0a8b8]/20 text-[#a0a8b8] hover:text-white transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="size-8" />
          </Button>
        </div>

      {/* Counter */}
      <p className="text-center text-[#a0a8b8]">
        {currentIndex + 1} / {filteredArtists.length}
      </p>
    </div>
  );
}

type FeedPost = TimelinePostModel & { author?: any };

function FeedPage({ setCurrentPage }: { setCurrentPage: (page: Page) => void }) {
  const [selectedPost, setSelectedPost] = useState<TimelinePostModel | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery({
    queryKey: ['timeline-posts'],
    queryFn: async () => {
      const res = await getPosts();
      // Map to TimelinePostModel shape the UI expects
      return (res.posts || []).map((p: any) => ({
        id: p.id,
        author_id: p.authorId,
        body: p.body,
        image_urls: p.imageUrls || [],
        likes_count: p.likes || 0,
        create_time: p.createdAt ? `${new Date(p.createdAt).getTime()}` : `${Date.now()}`,
        author: p.author,
      })) as FeedPost[];
    },
  });

  const toggleLike = async (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);

    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }

    setLikedPosts(newLikedPosts);

    // Optimistic update only; backend like endpoint not implemented
    queryClient.invalidateQueries({ queryKey: ['timeline-posts'] });
  };

  return (
    <div className="px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Feed</h1>

      {/* Masonry-like grid (simple columns) */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {posts.map((post: FeedPost) => (
          <div key={post.id} className="break-inside-avoid">
            <FeedTile
              post={post}
              onClick={() => setSelectedPost(post)}
              onLike={() => toggleLike(post.id)}
              isLiked={likedPosts.has(post.id)}
              setCurrentPage={setCurrentPage}
            />
          </div>
        ))}
      </div>

      {/* Post detail modal */}
      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          relatedPosts={posts.filter((p: TimelinePostModel) => p.id !== selectedPost.id).slice(0, 6)}
          onLike={() => toggleLike(selectedPost.id)}
          isLiked={likedPosts.has(selectedPost.id)}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}

function FeedTile({ post, onClick, onLike, isLiked, setCurrentPage }: { post: FeedPost; onClick: () => void; onLike: () => void; isLiked: boolean; setCurrentPage: (page: Page) => void }) {
  const [height, setHeight] = useState(20);
  const author = post.author || null;

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentPage("profile");
  };

  const hasImages = post.image_urls && post.image_urls.length > 0;
  const imageUrl = hasImages ? post.image_urls![0] : null;

  // Calculate grid row span based on content
  useEffect(() => {
    const calculatedHeight = hasImages ? 30 : 15;
    setHeight(calculatedHeight);
  }, [hasImages]);

  const authorDisplay = author?.display_name || "User";
  const authorAvatar = author?.avatar_url || undefined;

  return (
    <div
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={{ gridRowEnd: `span ${height}` }}
    >
      {imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div
                className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80"
                onClick={handleProfileClick}
              >
                <Avatar className="size-6">
                  <AvatarImage src={authorAvatar} />
                  <AvatarFallback className="text-xs">{authorDisplay[0] || "?"}</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-semibold">{authorDisplay}</span>
              </div>
              <p className="text-white text-sm line-clamp-2 mb-2">{post.body}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLike();
                }}
                className="flex items-center gap-1 text-white hover:text-[#c4fc41] transition"
              >
                <Heart className={`size-4 ${isLiked ? 'fill-[#c4fc41] text-[#c4fc41]' : ''}`} />
                <span className="text-xs">{post.likes_count}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1e2433] p-4 h-full border border-[#2a3142] hover:border-[#c4fc41] transition-colors">
          <div
            className="flex items-center gap-2 mb-2 cursor-pointer hover:opacity-80"
            onClick={handleProfileClick}
          >
            <Avatar className="size-6">
              <AvatarImage src={authorAvatar} />
              <AvatarFallback className="text-xs">{authorDisplay[0] || "?"}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm font-semibold">{authorDisplay}</span>
          </div>
          <p className="text-white text-sm line-clamp-4 mb-2">{post.body}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center gap-1 text-[#a0a8b8] hover:text-[#c4fc41] transition"
          >
            <Heart className={`size-4 ${isLiked ? 'fill-[#c4fc41] text-[#c4fc41]' : ''}`} />
            <span className="text-xs">{post.likes_count}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function PostDetailModal({
  post,
  onClose,
  relatedPosts,
  onLike,
  isLiked,
  setCurrentPage
}: {
  post: TimelinePostModel;
  onClose: () => void;
  relatedPosts: TimelinePostModel[];
  onLike: () => void;
  isLiked: boolean;
  setCurrentPage: (page: Page) => void;
}) {
  const author = (post as any).author || null;
  if (!author) return null;

  const handleProfileClick = () => {
    // Navigate to profile page - in this case it's the author's profile
    // For now we're showing the logged-in user's profile, but you could extend this
    // to show other artists' profiles
    setCurrentPage("profile");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-3 gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card className="vgen-card p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
                onClick={handleProfileClick}
              >
                <Avatar className="size-12">
                  <AvatarImage src={author.avatar_url || undefined} />
                  <AvatarFallback>{author.display_name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold text-white">{author.display_name}</h4>
                  <p className="text-sm text-[#a0a8b8]">
                    {new Date(parseInt(post.create_time) * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="size-5" />
              </Button>
            </div>

            {post.image_urls && post.image_urls.length > 0 && (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {post.image_urls.map((url, idx) => (
                  <img key={idx} src={url} alt="" className="w-full rounded-lg" />
                ))}
              </div>
            )}

            <p className="text-white text-lg mb-4">{post.body}</p>

            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-6">
                {post.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-[#a0a8b8]">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 text-[#a0a8b8] pt-6 border-t border-[#2a3142]">
              <button onClick={onLike} className={`flex items-center gap-2 transition ${isLiked ? 'text-[#c4fc41]' : 'hover:text-[#c4fc41]'}`}>
                <Heart className={`size-5 ${isLiked ? 'fill-[#c4fc41]' : ''}`} />
                <span className="text-sm">{post.likes_count}</span>
              </button>
              <button className="flex items-center gap-2 hover:text-[#c4fc41] transition">
                <MessageCircle className="size-5" />
                <span className="text-sm">Reply</span>
              </button>
            </div>
          </Card>
        </div>

        {/* Related posts */}
        <div className="lg:col-span-1">
          <Card className="vgen-card p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4">Related Posts</h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedPosts.map((relatedPost) => (
                <div
                  key={relatedPost.id}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                >
                  {relatedPost.image_urls && relatedPost.image_urls[0] ? (
                    <img
                      src={relatedPost.image_urls[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#242b3d] flex items-center justify-center">
                      <FileText className="size-8 text-[#a0a8b8]" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FloatingActionButton() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'swipe' | 'feed' | 'request' | 'profile' | null>(null);

  const menuItems = [
    { id: 'swipe' as const, icon: ImageIcon, label: 'Add to Slides', color: '#c4fc41' },
    { id: 'feed' as const, icon: FileImage, label: 'Create Feed Post', color: '#a78bfa' },
    { id: 'request' as const, icon: Briefcase, label: 'Post Commission Request', color: '#60a5fa' },
    { id: 'profile' as const, icon: Edit3, label: 'Update Profile', color: '#f472b6' },
  ];

  return (
    <>
      <div className="fixed bottom-8 right-8 z-50">
        {/* Radial menu */}
        {menuOpen && (
          <div className="absolute bottom-20 right-0 space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 animate-in slide-in-from-bottom"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-sm text-white bg-[#1e2433] px-3 py-2 rounded-lg whitespace-nowrap">
                    {item.label}
                  </span>
                  <button
                    onClick={() => {
                      setActiveDialog(item.id);
                      setMenuOpen(false);
                    }}
                    className="size-12 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="size-6 text-[#1a1f2e]" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main FAB */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`
            size-16 rounded-full bg-[#c4fc41] text-[#1a1f2e]
            shadow-lg hover:shadow-xl hover:scale-110 transition-all
            flex items-center justify-center
            ${menuOpen ? 'rotate-45' : ''}
          `}
        >
          <Plus className="size-8" />
        </button>
      </div>

      {/* Dialogs */}
      {activeDialog === 'swipe' && (
        <AddToSlidesDialog onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'feed' && (
        <CreateFeedPostDialog onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'request' && (
        <CreateRequestDialog onClose={() => setActiveDialog(null)} />
      )}
      {activeDialog === 'profile' && (
        <EditProfileDialog onClose={() => setActiveDialog(null)} />
      )}
    </>
  );
}

function AddToSlidesDialog({ onClose }: { onClose: () => void }) {
  const { currentUser } = useUser();
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const uploadFile = useCreaoFileUpload();
  const queryClient = useQueryClient();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile.mutateAsync({ file: files[i] });
        urls.push(result.fileUrl);
      }
      setImages([...images, ...urls]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async () => {
    if (!currentUser || images.length === 0) return;

    await updateProfile({
      // append slides to current slides; backend will overwrite, so send slides list
      slides: images.map((url) => ({ imageUrl: url, title: title || "", tags })),
      artStyles: tags,
    });

    queryClient.invalidateQueries({ queryKey: ['artists'] });
    queryClient.invalidateQueries({ queryKey: ['all-artists-with-users'] });
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Add Images to Slides</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Title / Caption</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Fantasy Character Commission"
              className="bg-[#242b3d] border-[#2a3142] text-white"
            />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="e.g., NSFW, furry, fantasy"
                className="flex-1 bg-[#242b3d] border-[#2a3142] text-white"
              />
              <Button onClick={addTag} className="vgen-button-secondary px-4">Add</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, idx) => (
                <Badge key={idx} className="vgen-badge-open cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Price Range (Optional)</label>
            <Input
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              placeholder="e.g., $50-$200"
              className="bg-[#242b3d] border-[#2a3142] text-white"
            />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Upload Images</label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2 w-full justify-center">
                <Upload className="size-4" />
                {images.length === 0 ? 'Upload Images' : 'Add More Images'}
              </div>
            </label>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={images.length === 0}
            className="w-full vgen-button-primary h-11"
          >
            Add to Slides
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateFeedPostDialog({ onClose }: { onClose: () => void }) {
  const { currentUser } = useUser();
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const uploadFile = useCreaoFileUpload();
  const queryClient = useQueryClient();

  const createPostMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) return;
      await createPost({
        body,
        imageUrls: images,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeline-posts'] });
      queryClient.invalidateQueries({ queryKey: ['user-posts'] });
      onClose();
      setBody("");
      setImages([]);
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile.mutateAsync({ file: files[i] });
        urls.push(result.fileUrl);
      }
      setImages([...images, ...urls]);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Create Feed Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your latest work or inspiration..."
            className="bg-[#242b3d] border-[#2a3142] text-white min-h-32"
          />
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {images.map((url, idx) => (
                <img key={idx} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <label className="cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2">
                <Upload className="size-4" />
                Add Images
              </div>
            </label>
            <Button
              onClick={() => createPostMutation.mutate()}
              disabled={!body || createPostMutation.isPending}
              className="vgen-button-primary px-6"
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateRequestDialog({ onClose }: { onClose: () => void }) {
  const { currentUser } = useUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const uploadFile = useCreaoFileUpload();
  const queryClient = useQueryClient();

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) return;
      await createRequest({
        title,
        description,
        budget_min: parseInt(budgetMin) || 0,
        budget_max: parseInt(budgetMax) || (parseInt(budgetMin) * 2) || 1000,
        status: "open",
        tags: tags.length > 0 ? tags : undefined,
        sample_image_urls: images.length > 0 ? images : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-requests'] });
      queryClient.invalidateQueries({ queryKey: ['my-commission-requests'] });
      onClose();
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile.mutateAsync({ file: files[i] });
        urls.push(result.fileUrl);
      }
      setImages([...images, ...urls]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Post Commission Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Fantasy character portrait" className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what you're looking for..." className="bg-[#242b3d] border-[#2a3142] text-white min-h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#a0a8b8] block mb-2">Min Budget ($)</label>
              <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="50" className="bg-[#242b3d] border-[#2a3142] text-white" />
            </div>
            <div>
              <label className="text-sm text-[#a0a8b8] block mb-2">Max Budget ($)</label>
              <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="200" className="bg-[#242b3d] border-[#2a3142] text-white" />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Preferred Timeframe</label>
            <Input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="e.g., Within 2 weeks, By March 15th" className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Tags (Optional)</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags..."
                className="flex-1 bg-[#242b3d] border-[#2a3142] text-white"
              />
              <Button onClick={addTag} className="vgen-button-secondary px-4">Add</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, idx) => (
                <Badge key={idx} className="vgen-badge-open cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Reference Images (Optional)</label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2 w-full justify-center">
                <Upload className="size-4" />
                {images.length === 0 ? 'Upload Reference Images' : 'Add More Images'}
              </div>
            </label>
          </div>

          <Button onClick={() => createRequestMutation.mutate()} disabled={!title || !description || createRequestMutation.isPending} className="w-full vgen-button-primary h-11">
            {createRequestMutation.isPending ? "Posting..." : "Post Request"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditProfileDialog({ onClose }: { onClose: () => void }) {
  const { currentUser, setCurrentUser } = useUser();
  const [displayName, setDisplayName] = useState(currentUser?.display_name || "");
  const [bio, setBio] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [instagramHandle, setInstagramHandle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar_url || "");
  const [bannerUrl, setBannerUrl] = useState("");
  const uploadFile = useCreaoFileUpload();
  const queryClient = useQueryClient();

  // Load current profile data from backend
  useQuery({
    queryKey: ['current-profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;
      const res = await getProfile();
      const profile = res.user;
      setBio(profile.bio || "");
      setBannerUrl(profile.banner_url || "");
      setAvatarUrl(profile.avatar_url || "");
      if (profile.social_links) {
        setTwitterHandle(profile.social_links.twitter || "");
        setInstagramHandle(profile.social_links.instagram || "");
      }
      return profile;
    },
    enabled: !!currentUser,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) return;
      const res = await updateProfile({
        display_name: displayName,
        bio,
        avatar_url: avatarUrl || null,
        banner_url: bannerUrl || null,
        social_links: {
          twitter: twitterHandle || "",
          instagram: instagramHandle || "",
        },
      });
      const updated = res.user;
      const mapped: UserModel = {
        id: updated.id,
        display_name: updated.display_name,
        avatar_url: updated.avatar_url || null,
        role: updated.role ?? currentUser.role,
        email: updated.email,
        username: updated.username,
        password_hash: "",
        data_creator: "",
        data_updater: "",
        create_time: "",
        update_time: "",
      };
      setCurrentUser(mapped, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['current-profile'] });
      onClose();
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadFile.mutateAsync({ file });
      setAvatarUrl(result.fileUrl);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadFile.mutateAsync({ file });
      setBannerUrl(result.fileUrl);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {currentUser?.role === UserRole.Artist && (
            <div>
              <label className="text-sm text-[#a0a8b8] block mb-2">Profile Banner (1500 × 500px, 3:1 ratio)</label>
              {bannerUrl && (
                <div className="relative w-full aspect-[3/1] mb-3 rounded-lg overflow-hidden border-2 border-[#c4fc41]/30">
                  <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
                  {/* Safe area overlay */}
                  <div className="absolute inset-0 border-[20px] border-[#c4fc41]/10 pointer-events-none" />
                  <p className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">Safe area shown</p>
                </div>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2 w-full justify-center">
                  <Crop className="size-4" />
                  {bannerUrl ? 'Change Banner' : 'Upload Banner'}
                </div>
              </label>
              <p className="text-xs text-[#a0a8b8] mt-2">Recommended: 1500 × 500px. Keep important content within the safe area.</p>
            </div>
          )}

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Avatar</label>
            <div className="flex items-center gap-4">
              {avatarUrl && (
                <Avatar className="size-16">
                  <AvatarImage src={avatarUrl} />
                </Avatar>
              )}
              <label className="cursor-pointer">
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2">
                  <Upload className="size-4" />
                  Upload Avatar
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Display Name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Bio</label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          {currentUser?.role === UserRole.Artist && (
            <>
              <div>
                <label className="text-sm text-[#a0a8b8] block mb-2">Twitter Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b8]">@</span>
                  <Input
                    value={twitterHandle}
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    placeholder="username"
                    className="bg-[#242b3d] border-[#2a3142] text-white pl-7"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-[#a0a8b8] block mb-2">Instagram Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a8b8]">@</span>
                  <Input
                    value={instagramHandle}
                    onChange={(e) => setInstagramHandle(e.target.value)}
                    placeholder="username"
                    className="bg-[#242b3d] border-[#2a3142] text-white pl-7"
                  />
                </div>
              </div>
            </>
          )}

          <Button
            onClick={() => updateProfileMutation.mutate()}
            disabled={!displayName || updateProfileMutation.isPending}
            className="w-full vgen-button-primary h-11"
          >
            {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AuthDialog({ onClose }: { onClose: () => void }) {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-2xl text-white">{authMode === "login" ? "Sign In" : "Create Account"}</DialogTitle>
      </DialogHeader>
      <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as "login" | "signup")} className="w-full">
        <TabsList className="w-full bg-[#242b3d]">
          <TabsTrigger value="login" className="flex-1">Sign In</TabsTrigger>
          <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm onClose={onClose} />
        </TabsContent>
        <TabsContent value="signup">
          <SignupForm onClose={onClose} />
        </TabsContent>
      </Tabs>
    </>
  );
}

function LoginForm({ onClose }: { onClose: () => void }) {
  const { setCurrentUser, setAuthToken } = useUser();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const result = await loginApi(emailOrUsername, password);
      return result;
    },
    onSuccess: (res) => {
      const user: UserModel = {
        id: res.user.id,
        display_name: res.user.display_name || res.user.username,
        avatar_url: res.user.avatar_url || null,
        role: res.user.role ?? 0,
        email: res.user.email,
        username: res.user.username,
        password_hash: "",
        data_creator: "",
        data_updater: "",
        create_time: "",
        update_time: "",
      };
      if (rememberMe) {
        saveAuthToken(res.token);
      }
      setAuthToken(res.token);
      setCurrentUser(user, rememberMe);
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  return (
    <div className="space-y-4 pt-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Email or Username</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a0a8b8]" />
          <Input
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            placeholder="email@example.com or username"
            className="bg-[#242b3d] border-[#2a3142] text-white pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a0a8b8]" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-[#242b3d] border-[#2a3142] text-white pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a8b8] hover:text-white"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label htmlFor="remember" className="text-sm text-[#a0a8b8] cursor-pointer">
          Remember me
        </label>
      </div>

      <Button
        onClick={() => loginMutation.mutate()}
        disabled={!emailOrUsername || !password || loginMutation.isPending}
        className="w-full vgen-button-primary h-11"
      >
        {loginMutation.isPending ? "Signing in..." : "Sign In"}
      </Button>
    </div>
  );
}

function SignupForm({ onClose }: { onClose: () => void }) {
  const { setCurrentUser, setAuthToken } = useUser();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.Buyer);
  const uploadFile = useCreaoFileUpload();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async () => {
      const result = await registerApi({
        email,
        username,
        password,
        display_name: displayName,
        role: role === UserRole.Artist ? "artist" : "buyer",
        avatar_url: avatarUrl || null,
      });
      return result;
    },
    onSuccess: async (res) => {
      const user: UserModel = {
        id: res.user.id,
        display_name: res.user.display_name || res.user.username,
        avatar_url: res.user.avatar_url || null,
        role: res.user.role ?? 0,
        email: res.user.email,
        username: res.user.username,
        password_hash: "",
        data_creator: "",
        data_updater: "",
        create_time: "",
        update_time: "",
      };
      if (rememberMe) {
        saveAuthToken(res.token);
      }
      setAuthToken(res.token);
      setCurrentUser(user, rememberMe);
      queryClient.invalidateQueries({ queryKey: ['timeline-posts'] });
      onClose();
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadFile.mutateAsync({ file });
      setAvatarUrl(result.fileUrl);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a0a8b8]" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            className="bg-[#242b3d] border-[#2a3142] text-white pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a0a8b8]" />
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            className="bg-[#242b3d] border-[#2a3142] text-white pl-10"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#a0a8b8]" />
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="bg-[#242b3d] border-[#2a3142] text-white pl-10 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a0a8b8] hover:text-white"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Display Name</label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your name"
          className="bg-[#242b3d] border-[#2a3142] text-white"
        />
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">I want to...</label>
        <Tabs value={role === UserRole.Artist ? "artist" : "buyer"} onValueChange={(v) => setRole(v === "artist" ? UserRole.Artist : UserRole.Buyer)}>
          <TabsList className="w-full bg-[#242b3d]">
            <TabsTrigger value="buyer" className="flex-1">Buy Art</TabsTrigger>
            <TabsTrigger value="artist" className="flex-1">Sell Art</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div>
        <label className="text-sm text-[#a0a8b8] block mb-2">Avatar (Optional)</label>
        <div className="flex items-center gap-4">
          {avatarUrl && (
            <Avatar className="size-16">
              <AvatarImage src={avatarUrl} />
            </Avatar>
          )}
          <label className="cursor-pointer">
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2">
              <Upload className="size-4" />
              Upload Avatar
            </div>
          </label>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember-signup"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
        />
        <label htmlFor="remember-signup" className="text-sm text-[#a0a8b8] cursor-pointer">
          Remember me
        </label>
      </div>

      <Button
        onClick={() => createUserMutation.mutate()}
        disabled={!email || !username || !password || !displayName || createUserMutation.isPending}
        className="w-full vgen-button-primary h-11"
      >
        {createUserMutation.isPending ? "Creating..." : "Create Account"}
      </Button>
    </div>
  );
}

function ArtworkDetailModal({
  artwork,
  onClose,
  setCurrentPage,
  setSelectedArtistForSlides
}: {
  artwork: { artist: ArtistProfileModel; user: UserModel; imageIndex: number };
  onClose: () => void;
  setCurrentPage: (page: Page) => void;
  setSelectedArtistForSlides: (data: { artist: ArtistProfileModel; user: UserModel } | null) => void;
}) {
  const { currentUser } = useUser();
  const [currentImageIndex, setCurrentImageIndex] = useState(artwork.imageIndex);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { artist, user } = artwork;
  const images = artist.portfolio_image_urls || [];

  const handlePreviousImage = () => {
    setCurrentImageIndex(Math.max(0, currentImageIndex - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex(Math.min(images.length - 1, currentImageIndex + 1));
  };

  const handleAvatarClick = () => {
    setSelectedArtistForSlides({ artist, user });
    setCurrentPage("slides");
    onClose();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const handleMessage = async () => {
    if (!currentUser) return;

    try {
      sessionStorage.setItem("pending_conversation_user_id", user.id);
    } catch {
      // ignore
    }
    setCurrentPage('messages');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="max-w-7xl w-full h-[90vh] grid grid-cols-1 lg:grid-cols-2 gap-0 bg-[#1e2433] rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Large media */}
        <div className="relative bg-[#1a1f2e] flex items-center justify-center">
          <img
            src={images[currentImageIndex]}
            alt="Artwork"
            className="w-full h-full object-contain"
          />

          {/* Image navigation */}
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={handlePreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}

              {/* Thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/60 p-2 rounded-lg max-w-[90%] overflow-x-auto">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition ${
                      idx === currentImageIndex ? 'border-[#c4fc41]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Right side - Info panel */}
        <div className="flex flex-col bg-[#1e2433] overflow-y-auto">
          <div className="p-6 space-y-4 flex-1">
            {/* Artist info */}
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
              onClick={handleAvatarClick}
            >
              <Avatar className="size-12">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback>{user.display_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-white">{user.display_name}</h3>
                <p className="text-sm text-[#a0a8b8]">@{user.username}</p>
              </div>
            </div>

            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Commission Sample</h2>
              <p className="text-[#a0a8b8] text-sm">
                Image {currentImageIndex + 1} of {images.length}
              </p>
            </div>

            {/* Description/Bio */}
            {artist.bio && (
              <div>
                <h4 className="text-white font-semibold mb-2">About this Artist</h4>
                <p className="text-[#a0a8b8] leading-relaxed">{artist.bio}</p>
              </div>
            )}

            {/* Tags */}
            {artist.art_style_tags && artist.art_style_tags.length > 0 && (
              <div>
                <h4 className="text-white font-semibold mb-2">Art Styles</h4>
                <div className="flex gap-2 flex-wrap">
                  {artist.art_style_tags.map((tag, idx) => (
                    <Badge key={idx} className="vgen-badge-open">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price range */}
            <div className="pt-4 border-t border-[#2a3142]">
              <h4 className="text-white font-semibold mb-2">Price Range</h4>
              <p className="text-[#c4fc41] text-xl font-bold">
                ${artist.price_range_min} - ${artist.price_range_max}
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[#2a3142] space-y-3">
              {/* Like button */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 transition ${
                  isLiked ? 'text-[#c4fc41]' : 'text-[#a0a8b8] hover:text-[#c4fc41]'
                }`}
              >
                <Heart className={`size-5 ${isLiked ? 'fill-[#c4fc41]' : ''}`} />
                <span className="text-sm font-semibold">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
              </button>

              {/* CTA */}
              <div className="bg-[#242b3d] p-4 rounded-lg">
                <p className="text-white text-sm mb-3">
                  Want something similar? Commission {user.display_name} for custom artwork!
                </p>
                <Button
                  onClick={handleMessage}
                  className="w-full vgen-button-primary"
                >
                  <MessageCircle className="size-4 mr-2" />
                  Commission This Artist
                </Button>
              </div>
            </div>

            {/* Social links */}
            {artist.social_links && (artist.social_links.twitter || artist.social_links.instagram) && (
              <div className="pt-4 border-t border-[#2a3142]">
                <h4 className="text-white font-semibold mb-2">Follow</h4>
                <div className="flex gap-2">
                  {artist.social_links.twitter && (
                    <a
                      href={`https://twitter.com/${artist.social_links.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] hover:bg-[#2a3142] transition"
                    >
                      <Twitter className="size-4" />
                      <span className="text-sm">Twitter</span>
                    </a>
                  )}
                  {artist.social_links.instagram && (
                    <a
                      href={`https://instagram.com/${artist.social_links.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] hover:bg-[#2a3142] transition"
                    >
                      <Instagram className="size-4" />
                      <span className="text-sm">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscoverPage({
  setCurrentPage,
  setSelectedArtistForSlides
}: {
  setCurrentPage: (page: Page) => void;
  setSelectedArtistForSlides: (data: { artist: ArtistProfileModel; user: UserModel } | null) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState<{ artist: ArtistProfileModel; user: UserModel; imageIndex: number } | null>(null);

  const { data: artists = [] } = useQuery({
    queryKey: ['artists', searchQuery],
    queryFn: async () => {
      const res = await getArtists(searchQuery.trim() || undefined);
      return (res.artists || []) as { artist: ArtistProfileModel; user: UserModel }[];
    },
  });

  const filteredArtists = artists.filter(({ artist, user }) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    const matchesName = user.display_name.toLowerCase().includes(query);
    const matchesUsername = user.username.toLowerCase().includes(query);
    const matchesTags = artist.art_style_tags?.some(tag => tag.toLowerCase().includes(query));

    return matchesName || matchesUsername || matchesTags;
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Discover Artists</h1>

      {/* Search bar */}
      <div className="max-w-[600px] mx-auto mb-8">
        <div
          className="relative p-1 rounded-full"
          style={{
            background: 'rgba(18, 22, 34, 0.75)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[#a0a8b8] z-10" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, or tags..."
            className="pl-12 h-12 bg-transparent border-0 text-white rounded-full focus:border-0 focus:ring-0"
          />
        </div>
      </div>

      {/* Artist grid */}
      {filteredArtists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map(({ artist, user }) => (
            <Card key={artist.id} className="vgen-card p-6 hover:scale-105 transition-all">
              <div className="flex items-start gap-4 mb-4">
                <Avatar
                  className="size-16 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedArtistForSlides({ artist, user });
                    setCurrentPage("slides");
                  }}
                >
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback className="text-xl">{user.display_name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{user.display_name}</h3>
                  <p className="text-[#a0a8b8] text-sm truncate">@{user.username}</p>
                </div>
              </div>

              {artist.bio && (
                <p className="text-white text-sm mb-4 line-clamp-3">{artist.bio}</p>
              )}

              {artist.art_style_tags && artist.art_style_tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-4">
                  {artist.art_style_tags.slice(0, 3).map((tag, idx) => (
                    <Badge key={idx} className="vgen-badge-open text-xs">{tag}</Badge>
                  ))}
                  {artist.art_style_tags.length > 3 && (
                    <Badge className="vgen-badge-open text-xs">+{artist.art_style_tags.length - 3}</Badge>
                  )}
                </div>
              )}

              {/* Artwork preview strip */}
              {artist.portfolio_image_urls && artist.portfolio_image_urls.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {artist.portfolio_image_urls.slice(0, 4).map((url, idx) => (
                      <div
                        key={idx}
                        className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                        onClick={() => {
                          setSelectedArtwork({ artist, user, imageIndex: idx });
                        }}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        {idx === 3 && artist.portfolio_image_urls!.length > 4 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">+{artist.portfolio_image_urls!.length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#2a3142] space-y-3">
                <div>
                  <p className="text-xs text-[#a0a8b8] mb-1">Price Range</p>
                  <p className="text-white font-semibold">${artist.price_range_min} - ${artist.price_range_max}</p>
                </div>
                {artist.portfolio_image_urls && artist.portfolio_image_urls.length > 0 && (
                  <Button
                    onClick={() => {
                      setSelectedArtistForSlides({ artist, user });
                      setCurrentPage("slides");
                    }}
                    className="w-full vgen-button-secondary text-sm"
                  >
                    <ImageIcon className="size-4 mr-2" />
                    View All Slides ({artist.portfolio_image_urls.length})
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Search className="size-16 text-[#a0a8b8] mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">No artists found</h3>
          <p className="text-[#a0a8b8]">Try adjusting your search query</p>
        </div>
      )}

      {/* VGen-style artwork detail modal */}
      {selectedArtwork && (
        <ArtworkDetailModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          setCurrentPage={setCurrentPage}
          setSelectedArtistForSlides={setSelectedArtistForSlides}
        />
      )}
    </div>
  );
}

function RequestsPage() {
  const { currentUser } = useUser();

  const { data: requests = [] } = useQuery({
    queryKey: ['commission-requests'],
    queryFn: async () => {
      const res = await getRequests();
      return res.requests || [];
    },
  });

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Commission Board</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request: CommissionRequestModel) => (
          <Card key={request.id} className="vgen-card p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-bold text-white">{request.title}</h3>
                <Badge className="vgen-badge-open">{request.status}</Badge>
              </div>
              <p className="text-[#a0a8b8] text-sm line-clamp-3">{request.description}</p>
              <div className="flex items-center justify-between pt-4 border-t border-[#2a3142]">
                <div>
                  <p className="text-xs text-[#a0a8b8]">Budget</p>
                  <p className="text-white font-semibold">${request.budget_min} - ${request.budget_max}</p>
                </div>
                <Button className="vgen-button-secondary px-4 text-sm">I'm Interested</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ setCurrentPage, addNotification }: { setCurrentPage?: (page: Page) => void; addNotification?: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void }) {
  const { currentUser } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleMessageClick = async () => {
    if (!currentUser || !setCurrentPage || !addNotification) return;

    // Create or find conversation with this user (for demo, we'll show the message page)
    // In a real app, you'd create a conversation with the viewed profile user
    // For now, just navigate to messages with a notification
    const avatarUrl: string | null = currentUser.avatar_url ?? null;
    addNotification({
      type: "message",
      fromUserId: currentUser.id,
      fromUserName: currentUser.display_name,
      fromUserAvatar: avatarUrl,
      message: `Opening messages...`,
      linkTo: "messages",
    });

    setCurrentPage('messages');
  };

  useQuery({
    queryKey: ['user-profile', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;
      const res = await getProfile();
      setProfile(res.user);
      return res.user;
    },
    enabled: !!currentUser,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const { data: userPosts = [] } = useQuery({
    queryKey: ['user-posts', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const res = await getPosts();
      return (res.posts || [])
        .filter((p: any) => p.authorId === currentUser.id)
        .map((p: any) => ({
          id: p.id,
          author_id: p.authorId,
          body: p.body,
          image_urls: p.imageUrls || [],
          likes_count: p.likes || 0,
          create_time: p.createdAt ? `${new Date(p.createdAt).getTime()}` : `${Date.now()}`,
        }))
        .sort((a: any, b: any) => parseInt(b.create_time) - parseInt(a.create_time));
    },
    enabled: !!currentUser,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  if (!currentUser) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <p className="text-[#a0a8b8] text-center">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12">
      <Card className="vgen-card p-8 mb-6">
        <div className="flex items-start gap-6 mb-6">
          <Avatar className="size-24">
            <AvatarImage src={currentUser.avatar_url || undefined} />
            <AvatarFallback className="text-2xl">{currentUser.display_name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{currentUser.display_name}</h1>
                <p className="text-[#a0a8b8] mb-3">@{currentUser.username}</p>
                <Badge className={currentUser.role === UserRole.Artist ? "vgen-badge-new" : "vgen-badge-open"}>
                  {currentUser.role === UserRole.Artist ? "Artist" : "Buyer"}
                </Badge>
              </div>
              <div className="flex gap-2">
                {setCurrentPage && addNotification && (
                  <Button
                    onClick={handleMessageClick}
                    className="vgen-button-primary"
                  >
                    <MessageCircle className="size-4 mr-2" />
                    Message
                  </Button>
                )}
                <Button
                  onClick={() => setShowEditDialog(true)}
                  className="vgen-button-secondary"
                >
                  <Edit3 className="size-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {profile?.bio && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-2">Bio</h3>
            <p className="text-[#a0a8b8]">{profile.bio}</p>
          </div>
        )}

        {currentUser.role === UserRole.Artist && profile?.social_links && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Social Links</h3>
            <div className="flex gap-3 flex-wrap">
              {profile.social_links.twitter && (
                <a
                  href={`https://twitter.com/${profile.social_links.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] hover:bg-[#2a3142] transition"
                >
                  <Twitter className="size-4" />
                  <span>Twitter</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
              {profile.social_links.instagram && (
                <a
                  href={`https://instagram.com/${profile.social_links.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] hover:bg-[#2a3142] transition"
                >
                  <Instagram className="size-4" />
                  <span>Instagram</span>
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {currentUser.role === UserRole.Artist && profile?.art_style_tags && profile.art_style_tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white font-semibold mb-3">Art Styles</h3>
            <div className="flex gap-2 flex-wrap">
              {profile.art_style_tags.map((tag: string, idx: number) => (
                <Badge key={idx} className="vgen-badge-open">{tag}</Badge>
              ))}
            </div>
          </div>
        )}

        {currentUser.role === UserRole.Artist && profile?.portfolio_image_urls && profile.portfolio_image_urls.length > 0 && (
          <div>
            <h3 className="text-white font-semibold mb-3">Portfolio</h3>
            <div className="grid grid-cols-3 gap-3">
              {profile.portfolio_image_urls.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="" className="w-full h-48 object-cover rounded-lg" />
              ))}
            </div>
          </div>
        )}
      </Card>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Your Posts</h2>
        {userPosts.length > 0 ? (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
            {userPosts.map((post: TimelinePostModel) => (
              <Card key={post.id} className="vgen-card p-4">
                {post.image_urls && post.image_urls[0] && (
                  <img src={post.image_urls[0]} alt="" className="w-full h-48 object-cover rounded-lg mb-3" />
                )}
                <p className="text-white text-sm line-clamp-3">{post.body}</p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="vgen-card p-8">
            <p className="text-[#a0a8b8] text-center">You haven't posted anything yet</p>
          </Card>
        )}
      </div>

      {showEditDialog && (
        <EditProfileDialog onClose={() => setShowEditDialog(false)} />
      )}
    </div>
  );
}

function SettingsPage() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">Settings</h1>
      <Card className="vgen-card p-8">
        <p className="text-[#a0a8b8]">Settings page - coming soon</p>
      </Card>
    </div>
  );
}

function MessagesPage() {
  const { currentUser } = useUser();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const queryClient = useQueryClient();

  const SAVED_CONV_KEY = "selected_conversation_id";
  const SAVED_USER_KEY = "selected_conversation_user";

  const selectConversation = (conv: Conversation) => {
    const convId = conv.conversationId || conv.userId;
    setSelectedConversation(convId);
    setSelectedUser(conv);
    try {
      sessionStorage.setItem(SAVED_CONV_KEY, convId);
      sessionStorage.setItem(SAVED_USER_KEY, JSON.stringify(conv));
    } catch {
      // ignore storage errors
    }
  };

  // Restore saved conversation on mount
  useEffect(() => {
    try {
      const savedId = sessionStorage.getItem(SAVED_CONV_KEY);
      const savedUserRaw = sessionStorage.getItem(SAVED_USER_KEY);
      if (savedId) setSelectedConversation(savedId);
      if (savedUserRaw) setSelectedUser(JSON.parse(savedUserRaw));
    } catch {
      // ignore
    }
  }, []);

  // If navigation set a pending participant, ensure a conversation exists and select it
  useEffect(() => {
    if (!currentUser) return;
    const pending = sessionStorage.getItem("pending_conversation_user_id");
    if (!pending) return;
    (async () => {
      try {
        const res = await createConversation(pending);
        const conv = res.conversation;
        sessionStorage.removeItem("pending_conversation_user_id");
        await queryClient.invalidateQueries({ queryKey: ['conversations', currentUser.id] });
        if (conv) {
          setSelectedConversation(conv.id);
          setSelectedUser({
            userId: conv.other_user?.id || pending,
            userName: conv.other_user?.display_name || "User",
            userAvatar: conv.other_user?.avatar_url || null,
            lastMessage: conv.last_message || "Start a conversation",
            timestamp: conv.last_message_time ? new Date(conv.last_message_time).getTime() : Date.now(),
            conversationId: conv.id,
          });
        } else {
          setSelectedConversation(pending);
        }
      } catch (err) {
        console.error("Failed to open pending conversation", err);
      }
    })();
  }, [currentUser, queryClient]);

  // Load conversations from backend
  const { data: conversations = [] as Conversation[] } = useQuery<Conversation[]>({
    queryKey: ['conversations', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const res = await getConversations();
      return (res.conversations || []).map((conv: any) => ({
        userId: conv.other_user?.id || "",
        userName: conv.other_user?.display_name || "User",
        userAvatar: conv.other_user?.avatar_url || null,
        lastMessage: conv.last_message || "Start a conversation",
        timestamp: conv.last_message_time ? new Date(conv.last_message_time).getTime() : Date.now(),
        conversationId: conv.id,
      })) as Conversation[];
    },
    enabled: !!currentUser,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!conversations || conversations.length === 0) return;
    if (!selectedConversation) {
      selectConversation(conversations[0]);
      return;
    }
    const match = conversations.find((c: Conversation) => c.conversationId === selectedConversation);
    if (match) selectConversation(match);
  }, [conversations, selectedConversation]);

  // Load messages for selected conversation
  const { data: messages = [] as Message[] } = useQuery<Message[]>({
    queryKey: ['messages', selectedConversation],
    queryFn: async () => {
      if (!selectedConversation) return [];
      const res = await getMessages(selectedConversation);
      return (res.messages || []).map((m: any) => ({
        id: m.id,
        senderId: m.senderId,
        recipientId: m.recipientId,
        content: m.content,
        timestamp: new Date(m.createdAt || Date.now()).getTime(),
      })) as Message[];
    },
    enabled: !!selectedConversation,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUser || !selectedConversation || !selectedUser) return;
    const content = messageInput.trim();
    await sendMessage(selectedConversation, content);
    setMessageInput("");
    queryClient.invalidateQueries({ queryKey: ['messages', selectedConversation] });
    queryClient.invalidateQueries({ queryKey: ['conversations', currentUser.id] });
  };

  if (!currentUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-[#a0a8b8]">Please sign in to view messages</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex">
      {/* Conversations list */}
      <div className="w-80 border-r border-[#2a3142] bg-[#151827] flex flex-col">
        <div className="p-4 border-b border-[#2a3142]">
          <h2 className="text-xl font-bold text-white">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv: Conversation) => (
            <button
              key={conv.conversationId || conv.userId}
              onClick={() => {
                selectConversation(conv);
              }}
              className={`
                w-full p-4 flex items-center gap-3 border-b border-[#2a3142] transition-colors
                ${selectedConversation === (conv.conversationId || conv.userId) ? 'bg-[#1e2433]' : 'hover:bg-[#1a1f2e]'}
              `}
            >
              <Avatar className="size-12">
                <AvatarImage src={conv.userAvatar || undefined} />
                <AvatarFallback>{conv.userName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-white font-semibold">{conv.userName}</p>
                <p className="text-sm text-[#a0a8b8] truncate">{conv.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active chat */}
      <div className="flex-1 flex flex-col bg-[#1a1f2e]">
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-[#2a3142] bg-[#151827]">
              <div className="flex items-center gap-3">
                <Avatar className="size-10">
                  <AvatarImage src={selectedUser?.userAvatar || undefined} />
                  <AvatarFallback>{selectedUser?.userName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-semibold">{selectedUser?.userName}</p>
                  <p className="text-xs text-[#a0a8b8]">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages
                .map((message: Message) => {
                  const isSent = message.senderId === currentUser.id;
                  return (
                    <div key={message.id} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-md flex gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="size-8">
                          <AvatarImage src={isSent ? currentUser.avatar_url || undefined : undefined} />
                          <AvatarFallback className="text-xs">
                            {isSent ? currentUser.display_name[0] : selectedUser?.userName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`px-4 py-2 rounded-2xl ${isSent ? 'bg-[#c4fc41] text-[#1a1f2e]' : 'bg-[#1e2433] text-white'}`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-[#2a3142] bg-[#151827]">
              <div className="flex items-center gap-2">
                <Input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-[#1e2433] border-[#2a3142] text-white rounded-full"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  size="icon"
                  className="rounded-full vgen-button-primary"
                >
                  <Send className="size-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="size-16 text-[#a0a8b8] mx-auto mb-4" />
              <p className="text-[#a0a8b8]">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationsPage({
  notifications,
  markNotificationRead,
  markAllNotificationsRead,
  setCurrentPage
}: {
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  setCurrentPage: (page: Page) => void;
}) {
  const { currentUser } = useUser();

  if (!currentUser) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <p className="text-[#a0a8b8] text-center">Please sign in to view notifications</p>
      </div>
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <Button
            onClick={markAllNotificationsRead}
            variant="outline"
            size="sm"
            className="text-[#c4fc41] border-[#c4fc41] hover:bg-[#c4fc41]/10"
          >
            Mark all as read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="vgen-card p-12">
          <div className="text-center">
            <Bell className="size-16 text-[#a0a8b8] mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No notifications yet</h3>
            <p className="text-[#a0a8b8]">When you get notifications, they'll show up here</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`vgen-card p-4 cursor-pointer transition-all ${
                !notification.read ? 'border-l-4 border-[#c4fc41]' : ''
              }`}
              onClick={() => {
                markNotificationRead(notification.id);
                if (notification.linkTo) {
                  setCurrentPage(notification.linkTo as Page);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <Avatar className="size-12">
                  <AvatarImage src={notification.fromUserAvatar || undefined} />
                  <AvatarFallback>{notification.fromUserName[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className={`text-white mb-1 ${!notification.read ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>
                  <p className="text-sm text-[#a0a8b8]">
                    {new Date(notification.timestamp).toLocaleString()}
                  </p>
                </div>
                {!notification.read && (
                  <div className="size-2 rounded-full bg-[#c4fc41] mt-2" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MyRequestsPage() {
  const { currentUser } = useUser();
  const queryClient = useQueryClient();
  const [editingRequest, setEditingRequest] = useState<CommissionRequestModel | null>(null);

  const { data: requests = [] } = useQuery({
    queryKey: ['my-commission-requests', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];
      const res = await getMyRequests();
      return res.requests || [];
    },
    enabled: !!currentUser,
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (requestId: string) => {
      await deleteRequest(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-commission-requests'] });
      queryClient.invalidateQueries({ queryKey: ['commission-requests'] });
    },
  });

  if (!currentUser) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <p className="text-[#a0a8b8] text-center">Please sign in to view your requests</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-white mb-8">My Commission Requests</h1>

      {requests.length === 0 ? (
        <Card className="vgen-card p-12">
          <div className="text-center">
            <Briefcase className="size-16 text-[#a0a8b8] mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No requests yet</h3>
            <p className="text-[#a0a8b8]">Use the + button to post your first commission request</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request: CommissionRequestModel) => (
            <Card key={request.id} className="vgen-card p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white flex-1">{request.title}</h3>
                  <Badge className="vgen-badge-open">{request.status}</Badge>
                </div>

                {request.sample_image_urls && request.sample_image_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {request.sample_image_urls.slice(0, 2).map((url: string, idx: number) => (
                      <img key={idx} src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                    ))}
                  </div>
                )}

                <p className="text-[#a0a8b8] text-sm line-clamp-3">{request.description}</p>

                {request.tags && request.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {request.tags.slice(0, 3).map((tag: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs text-[#a0a8b8]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-[#2a3142]">
                  <p className="text-xs text-[#a0a8b8]">Budget</p>
                  <p className="text-white font-semibold">${request.budget_min} - ${request.budget_max}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => setEditingRequest(request)}
                    className="flex-1 vgen-button-secondary text-sm"
                  >
                    <Edit3 className="size-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this request?')) {
                        deleteRequestMutation.mutate(request.id);
                      }
                    }}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {editingRequest && (
        <EditRequestDialog
          request={editingRequest}
          onClose={() => setEditingRequest(null)}
        />
      )}
    </div>
  );
}

function SlidesDetailPage({
  artistData,
  setCurrentPage
}: {
  artistData: { artist: ArtistProfileModel; user: UserModel };
  setCurrentPage: (page: Page) => void;
}) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const { artist, user } = artistData;
  const slides = artist.portfolio_image_urls || [];

  if (slides.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-24">
        <div className="text-center">
          <ImageIcon className="size-16 text-[#a0a8b8] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No slides available</h2>
          <p className="text-[#a0a8b8] mb-6">This artist hasn't uploaded any slides yet</p>
          <Button onClick={() => setCurrentPage("discover")} className="vgen-button-primary">
            Back to Discover
          </Button>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  const handlePreviousSlide = () => {
    setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1));
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-12">
      <Button
        onClick={() => setCurrentPage("discover")}
        variant="ghost"
        className="mb-6 text-[#a0a8b8] hover:text-white"
      >
        <ChevronLeft className="size-4 mr-2" />
        Back to Discover
      </Button>

      <Card className="vgen-card p-0 overflow-hidden mb-6">
        {/* Artist profile header - AT TOP */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="text-xl">{user.display_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.display_name}</h2>
              <p className="text-[#a0a8b8]">@{user.username}</p>
            </div>
          </div>

          {artist.art_style_tags && artist.art_style_tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {artist.art_style_tags.map((tag, idx) => (
                <Badge key={idx} className="vgen-badge-open">{tag}</Badge>
              ))}
            </div>
          )}

          {artist.bio && (
            <p className="text-white leading-relaxed">{artist.bio}</p>
          )}

          {artist.social_links && (
            <div className="flex gap-3">
              {artist.social_links.twitter && (
                <a
                  href={`https://twitter.com/${artist.social_links.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] transition"
                >
                  <Twitter className="size-4" />
                </a>
              )}
              {artist.social_links.instagram && (
                <a
                  href={`https://instagram.com/${artist.social_links.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#242b3d] rounded-lg text-[#a0a8b8] hover:text-[#c4fc41] transition"
                >
                  <Instagram className="size-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Large portrait-oriented slide viewer - BELOW PROFILE */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#1a1f2e]">
          <img
            src={currentSlide}
            alt={`Slide ${currentSlideIndex + 1}`}
            className="w-full h-full object-cover"
          />

          {/* Left arrow */}
          {currentSlideIndex > 0 && (
            <button
              onClick={handlePreviousSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Right arrow */}
          {currentSlideIndex < slides.length - 1 && (
            <button
              onClick={handleNextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full p-3 transition-all hover:scale-110"
            >
              <ChevronRight className="size-6" />
            </button>
          )}

          {/* Image counter badge */}
          <div className="absolute top-4 right-4 bg-black/70 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Price range - BELOW IMAGE */}
        <div className="p-6 pt-4 border-t border-[#2a3142]">
          <p className="text-sm text-[#a0a8b8] mb-1">Price Range</p>
          <p className="text-white font-semibold">${artist.price_range_min} - ${artist.price_range_max}</p>
        </div>
      </Card>
    </div>
  );
}

function EditRequestDialog({ request, onClose }: { request: CommissionRequestModel; onClose: () => void }) {
  const { currentUser } = useUser();
  const [title, setTitle] = useState(request.title);
  const [description, setDescription] = useState(request.description);
  const [budgetMin, setBudgetMin] = useState(request.budget_min.toString());
  const [budgetMax, setBudgetMax] = useState(request.budget_max.toString());
  const [tags, setTags] = useState<string[]>(request.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>(request.sample_image_urls || []);
  const [timeframe, setTimeframe] = useState("");
  const uploadFile = useCreaoFileUpload();
  const queryClient = useQueryClient();

  const updateRequestMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser) return;
      await updateRequest(request.id, {
        title,
        description,
        budget_min: parseInt(budgetMin) || 0,
        budget_max: parseInt(budgetMax) || 1000,
        tags: tags.length > 0 ? tags : undefined,
        sample_image_urls: images.length > 0 ? images : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-commission-requests'] });
      queryClient.invalidateQueries({ queryKey: ['commission-requests'] });
      onClose();
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile.mutateAsync({ file: files[i] });
        urls.push(result.fileUrl);
      }
      setImages([...images, ...urls]);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="bg-[#1e2433] border-[#2a3142] max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Edit Commission Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Description</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="bg-[#242b3d] border-[#2a3142] text-white min-h-24" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[#a0a8b8] block mb-2">Min Budget ($)</label>
              <Input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} className="bg-[#242b3d] border-[#2a3142] text-white" />
            </div>
            <div>
              <label className="text-sm text-[#a0a8b8] block mb-2">Max Budget ($)</label>
              <Input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} className="bg-[#242b3d] border-[#2a3142] text-white" />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Preferred Timeframe</label>
            <Input value={timeframe} onChange={(e) => setTimeframe(e.target.value)} placeholder="e.g., Within 2 weeks, By March 15th" className="bg-[#242b3d] border-[#2a3142] text-white" />
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tags..."
                className="flex-1 bg-[#242b3d] border-[#2a3142] text-white"
              />
              <Button onClick={addTag} className="vgen-button-secondary px-4">Add</Button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag, idx) => (
                <Badge key={idx} className="vgen-badge-open cursor-pointer" onClick={() => setTags(tags.filter(t => t !== tag))}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-[#a0a8b8] block mb-2">Reference Images</label>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt="" className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full size-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="cursor-pointer">
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              <div className="vgen-button-secondary px-4 py-2 text-sm inline-flex items-center gap-2 w-full justify-center">
                <Upload className="size-4" />
                {images.length === 0 ? 'Upload Images' : 'Add More Images'}
              </div>
            </label>
          </div>

          <Button
            onClick={() => updateRequestMutation.mutate()}
            disabled={!title || !description || updateRequestMutation.isPending}
            className="w-full vgen-button-primary h-11"
          >
            {updateRequestMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
