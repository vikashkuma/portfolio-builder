'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = '' }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-background text-foreground shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                Portfolio Builder
              </h1>
            </div>
            <nav className="flex space-x-4">
              <a
                href="#"
                className="hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </a>
              <a
                href="#"
                className="hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Templates
              </a>
              <a
                href="#"
                className="hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Help
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ${className} bg-background text-foreground`}
        >
          {children}
        </motion.div>
      </main>

      <footer className="bg-background text-foreground border-t border-border">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs">
            © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}; 