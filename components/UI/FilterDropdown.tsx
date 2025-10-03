'use client';

import React, { useState } from 'react';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

interface FilterOption {
  value: string;
  label: string;
  type: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select Filter",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between w-full px-4 py-2.5 text-sm font-medium text-white bg-gray-800 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 focus-within:ring-2 focus-within:ring-coral-500 focus-within:border-coral-500 transition-colors h-10">
        <div className="flex items-center">
          <FiFilter className="w-4 h-4 mr-2 text-gray-400" />
          <span className={selectedOption ? "text-white" : "text-gray-400"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <div className="flex items-center">
          {value && (
            <button
              onClick={handleClear}
              className="mr-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Clear filter"
            >
              <FiX className="w-3 h-3 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center"
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <FiChevronDown 
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 z-20 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors ${
                  value === option.value 
                    ? 'bg-coral-500/20 text-coral-400 font-medium' 
                    : 'text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {value === option.value && (
                    <div className="w-2 h-2 bg-fuchsia-500 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;
