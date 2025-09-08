"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Plus, X } from 'lucide-react';

interface SearchableSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: any) => void;
  onAddNew?: () => void;
  placeholder: string;
  searchPlaceholder?: string;
  items: any[];
  displayField: string;
  valueField: string;
  addButtonText?: string;
  required?: boolean;
  className?: string;
}

export default function SearchableSelect({
  label,
  value,
  onChange,
  onSelect,
  onAddNew,
  placeholder,
  searchPlaceholder = "Digite para pesquisar...",
  items,
  displayField,
  valueField,
  addButtonText = "Adicionar Novo",
  required = false,
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = items.filter(item =>
      item[displayField]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item[valueField]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchTerm, items, displayField, valueField]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleItemSelect = (item: any) => {
    onSelect(item);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(value);
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-semibold text-blue-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder={placeholder}
          required={required}
          className="w-full px-4 py-3 pr-12 border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
        >
          <Search size={16} />
        </button>
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto"
        >
          {/* Campo de busca interno */}
          <div className="p-3 border-b border-gray-100">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Lista de itens */}
          <div className="max-h-48 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleItemSelect(item)}
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-50 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">
                    {item[displayField]}
                  </div>
                  {item[valueField] !== item[displayField] && (
                    <div className="text-sm text-gray-500">
                      {item[valueField]}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-center">
                Nenhum item encontrado
              </div>
            )}
          </div>

          {/* Botão para adicionar novo */}
          {onAddNew && (
            <div className="border-t border-gray-100 p-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  onAddNew();
                }}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200"
              >
                <Plus size={16} className="mr-2" />
                {addButtonText}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
