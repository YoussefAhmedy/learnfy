import React from 'react';
import { 
  Home, 
  Compass, 
  BookOpen, 
  ShoppingBag, 
  User as UserIcon 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileBottomNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentView, onNavigate }) => {
  const { cart, enrolledCourseIds } = useApp();

  const navItems = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'catalog', label: 'Explore', icon: Compass },
    { id: 'library', label: 'My Learning', icon: BookOpen, badge: enrolledCourseIds.length },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cart.length },
    { id: 'dashboard', label: 'Profile', icon: UserIcon },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-red-600 font-semibold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-red-600 text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
