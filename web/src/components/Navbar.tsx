import React, { useState } from 'react';
import { 
  Search, 
  ShoppingBag, 
  Bookmark, 
  Bell, 
  Menu, 
  X, 
  Sparkles,
  BookOpen,
  LayoutDashboard,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, courseId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { 
    currentUser, 
    setCurrentUser, 
    cart, 
    wishlist, 
    notifications, 
    markNotificationRead,
    searchQuery, 
    setSearchQuery,
    setIsAiModalOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded-md bg-red-600 text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-sm transition-transform group-hover:scale-105">
                L
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-red-600 transition-colors">
                  Learnfy
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-gray-500 uppercase tracking-widest border-l border-gray-300 pl-2">
                  LearnSpring Engine
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => onNavigate('landing')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'landing' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('catalog')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'catalog' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Explore Courses
              </button>
              <button
                onClick={() => onNavigate('library')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'library' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                My Learning
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  currentView === 'dashboard' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>

          {/* Search Bar - Clean, Brutalist, Non-Neon */}
          <div className="flex-1 max-w-md hidden lg:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search architecture, React, systems, design..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-gray-200 text-sm rounded-lg pl-10 pr-20 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setIsAiModalOpen(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors"
                title="Open Smart Curriculum Assistant"
              >
                <Sparkles className="w-3 h-3 text-red-600" />
                <span>AI Prompt</span>
              </button>
            </form>
          </div>

          {/* Action Icons & User Account */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={() => setIsAiModalOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-gray-100 transition-colors"
              title="Smart AI Assistant"
            >
              <Sparkles className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
              title="Saved Wishlist"
            >
              <Bookmark className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative p-2 rounded-md transition-colors ${
                currentView === 'cart' ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full" />
                )}
              </button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Notifications</span>
                    <span className="text-[11px] text-gray-500">{unreadCount} unread</span>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                    {notifications.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => {
                          markNotificationRead(item.id);
                          if (item.actionUrl) onNavigate(item.actionUrl.replace('/', '') as any);
                          setNotificationsOpen(false);
                        }}
                        className={`p-3 text-left hover:bg-gray-50 cursor-pointer rounded-lg transition-colors ${!item.isRead ? 'bg-red-50/40' : ''}`}
                      >
                        <p className="text-xs font-semibold text-gray-900">{item.title}</p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{item.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{item.createdAt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('library');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-gray-400" /> My Learning Library
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" /> Student Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <span className="w-4 h-4 text-xs font-bold text-red-600 flex items-center justify-center">⚙</span> Instructor & CMS Ops
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-gray-200 text-sm rounded-lg pl-9 pr-3 py-2 text-gray-900"
            />
          </form>

          <div className="flex flex-col space-y-1 pt-2">
            <button
              onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-800"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('catalog'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-800"
            >
              Explore Courses
            </button>
            <button
              onClick={() => { onNavigate('library'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-800"
            >
              My Learning
            </button>
            <button
              onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-800"
            >
              Dashboard
            </button>
            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="text-left px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-red-600 font-semibold"
            >
              Instructor Studio & Admin CMS
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
