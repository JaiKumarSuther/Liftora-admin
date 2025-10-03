'use client';

import React, { useState } from 'react';
import { 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX,
  FiDollarSign,
  FiMessageSquare,
  FiActivity,
  FiGift,
  FiBookOpen
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { NavigationItem } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { MdSpaceDashboard } from 'react-icons/md';

interface SidebarProps {
  activeNav: string;
  onNavChange: (navId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: MdSpaceDashboard, path: '/dashboard' },
    { id: 'user-management', label: 'User Management', icon: FiUsers, path: '/dashboard/user-management' },
    { id: 'motivational-quotes', label: 'Motivational Quotes', icon: FiBookOpen, path: '/dashboard/motivational-quotes' },
    { id: 'rewards-management', label: 'Rewards Management', icon: FiGift, path: '/dashboard/rewards-management' },
    { id: 'ai-interactions', label: 'AI Interactions', icon: FiMessageSquare, path: '/dashboard/ai-interactions' },
    { id: 'billing-analytics', label: 'Billing & Analytics', icon: FiDollarSign, path: '/dashboard/billing-analytics' },
    { id: 'streaks-routines', label: 'Streaks & Routines', icon: FiActivity, path: '/dashboard/streaks-routines' },
    { id: 'subscription-management', label: 'Subscription Management', icon: FiSettings, path: '/dashboard/subscription-management' }
  ];

  const bottomNavItems: NavigationItem[] = [
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
    { id: 'logout', label: 'Logout', icon: FiLogOut }
  ];

  const handleNavClick = async (navId: string) => {
    if (navId === 'logout') {
      logout();
      router.push('/');
    } else {
      const navItem = [...navigationItems, ...bottomNavItems].find(item => item.id === navId);
      if (navItem?.path) {
        setIsNavigating(true);
        setNavigatingTo(navItem.path);
        onNavChange(navId);
        router.push(navItem.path);
        
        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          setNavigatingTo(null);
        }, 1000);
      }
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const getNavButtonClasses = (itemId: string) => {
    const baseClasses = 'group relative w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-500/40';
    const isActive = activeNav === itemId;
    const isNavigatingToThis = navigatingTo === [...navigationItems, ...bottomNavItems].find(item => item.id === itemId)?.path;
    
    return `${baseClasses} ${
      isActive
        ? 'text-white bg-coral-500 shadow-sm'
        : isNavigatingToThis
        ? 'text-gray-300 bg-gray-700'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`;
  };

  const getActiveStyle = (itemId: string) => {
    return activeNav === itemId ? { backgroundColor: '#2D2D2D', color: '#FFFFFF' } : {};
  };

  const SidebarContent = () => (
    <div className='bg-gray-900 min-h-screen'>
      {/* Logo */}
      <div className="mb-8 p-6 border-b border-gray-700">
        <Image
          src="/assets/logo.png"
          alt="Liftora Logo"
          width={140}
          height={40}
          className="mx-auto w-24"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-2 px-4">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={getNavButtonClasses(item.id)}
            style={getActiveStyle(item.id)}
            aria-label={item.label}
            aria-current={activeNav === item.id ? 'page' : undefined}
            disabled={isNavigating}
          >
            <span
              className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 rounded-r transition-[width] duration-200 ${
                activeNav === item.id ? 'w-1 bg-white' : 'w-0 bg-coral-500 group-hover:w-1'
              }`}
            />
            {isNavigating && navigatingTo === item.path ? (
              <LoadingSpinner size="sm" className="mr-3" />
            ) : (
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-4 right-4">
        <nav className="space-y-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={getNavButtonClasses(item.id)}
              style={getActiveStyle(item.id)}
              aria-label={item.label}
              aria-current={activeNav === item.id ? 'page' : undefined}
              disabled={isNavigating}
            >
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-8 rounded-r transition-[width] duration-200 ${
                  activeNav === item.id ? 'w-1 bg-white' : 'w-0 bg-coral-500 group-hover:w-1'
                }`}
              />
              {isNavigating && navigatingTo === item.path ? (
                <LoadingSpinner size="sm" className="mr-3" />
              ) : (
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className='bg-gray-900'>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700 cursor-pointer"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6 text-white" />
          ) : (
            <FiMenu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/75 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out shadow-xl border-r border-gray-700 bg-gray-900
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative h-full overflow-y-auto">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col w-64 relative lg:sticky lg:top-0 lg:h-screen border-r border-gray-700 overflow-y-auto bg-gray-900">
        <SidebarContent />
      </div>
    </div>
  );
};

export default Sidebar;
