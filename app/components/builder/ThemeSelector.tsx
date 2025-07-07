'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Theme {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light',
    description: 'Clean and professional light theme',
    preview: 'bg-white text-gray-900',
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Modern dark theme with high contrast',
    preview: 'bg-gray-900 text-white',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with subtle gradients',
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-50 text-gray-900',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Simple and elegant minimal design',
    preview: 'bg-gray-50 text-gray-900',
  },
];

interface ThemeSelectorProps {
  onSelect: (theme: 'light' | 'dark' | 'modern' | 'minimal') => void;
  selectedTheme?: 'light' | 'dark' | 'modern' | 'minimal';
}

export const ThemeSelector = ({ onSelect, selectedTheme = 'light' }: ThemeSelectorProps) => {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 bg-background text-foreground">
      {themes.map((theme) => (
        <motion.div
          key={theme.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
            selectedTheme === theme.id
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-gray-200'
          } bg-background text-foreground`}
          onClick={() => onSelect(theme.id as 'light' | 'dark' | 'modern' | 'minimal')}
          onMouseEnter={() => setHoveredTheme(theme.id)}
          onMouseLeave={() => setHoveredTheme(null)}
        >
          <div className={`h-32 rounded-md mb-4 ${theme.preview}`} />
          <h3 className="text-lg font-medium">{theme.name}</h3>
          <p className="text-sm ">{theme.description}</p>
          
          {hoveredTheme === theme.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-blue-500 bg-opacity-10 rounded-lg"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}; 