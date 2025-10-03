'use client';

import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className={`block w-full pl-9 sm:pl-10 pr-3 py-2.5 border border-gray-600 rounded-md leading-5 bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-coral-500 focus:border-coral-500 text-sm text-white h-10 ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
