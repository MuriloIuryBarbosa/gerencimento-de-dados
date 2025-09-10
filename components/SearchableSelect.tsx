"use client";

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  id: number | string;
  label: string;
  value: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  disabled = false,
  loading = false,
  className
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div
        className={cn(
          "relative w-full cursor-pointer",
          "border border-gray-300 rounded-md bg-white",
          "focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && "ring-2 ring-blue-200 border-blue-500"
        )}
        onClick={!disabled ? handleInputFocus : undefined}
      >
        <div className="flex items-center justify-between p-3">
          <div className="flex-1">
            {selectedOption ? (
              <span className="text-gray-900">{selectedOption.label}</span>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-gray-400 transition-transform",
              isOpen && "transform rotate-180"
            )}
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>

            <div className="py-1">
              {loading ? (
                <div className="px-3 py-2 text-center text-gray-500">
                  Carregando...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-center text-gray-500">
                  Nenhum resultado encontrado
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.id}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-100",
                      selectedOption?.id === option.id && "bg-blue-50"
                    )}
                    onClick={() => handleSelect(option)}
                  >
                    <span className="text-gray-900">{option.label}</span>
                    {selectedOption?.id === option.id && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}