'use client';

import React, { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0 lg:ml-0 ml-12">
          <h1 className="text-xl sm:text-2xl font-bold text-white truncate">
            {title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 bg-gray-700 flex items-center justify-center">
                  {user?.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt="Profile"
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                      priority
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-300">
                      {user?.initials}
                    </span>
                  )}
                </div>
              </div>
              
              {/* User Info */}
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              
              {/* Dropdown Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer"
                aria-label="User menu"
              >
                <FiChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
