'use client';

import { ChevronDown, LucideIcon } from 'lucide-react';
import { useState } from 'react';

interface FilterDropdownProps {
  label?: string; // e.g. "All Types" (default label when val is 'all')
  value: string;
  options: { value: string; label: string }[] | string[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
  width?: string;
  showDefaultOption?: boolean;
}

export function FilterDropdown({
  label = 'All',
  value,
  options,
  onChange,
  icon: Icon,
  width = 'md:w-[180px]', // Default width
  showDefaultOption = true,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to get display label
  const getDisplayLabel = () => {
    if (value === 'all' && showDefaultOption) return label;
    // Handle both string array and object array
    const selectedOption = options.find((opt) =>
      typeof opt === 'string' ? opt === value : opt.value === value
    );

    if (!selectedOption) return value;
    return typeof selectedOption === 'string'
      ? selectedOption
      : selectedOption.label;
  };

  return (
    <div className={`relative flex-1 ${width}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border rounded-lg px-4 py-2 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition shadow-sm h-[40px]"
      >
        <div className="flex items-center gap-2 truncate">
          {Icon && <Icon className="w-4 h-4 text-gray-400 shrink-0" />}
          <span className="truncate">{getDisplayLabel()}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 w-full md:w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
            {showDefaultOption && (
              <button
                type="button"
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                  value === 'all'
                    ? 'bg-amber-50 text-amber-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            )}
            {options.map((option) => {
              const optValue =
                typeof option === 'string' ? option : option.value;
              const optLabel =
                typeof option === 'string' ? option : option.label;

              return (
                <button
                  key={optValue}
                  onClick={() => {
                    onChange(optValue);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                    value === optValue
                      ? 'bg-amber-50 text-amber-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {optLabel}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
