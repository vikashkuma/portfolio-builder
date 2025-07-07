import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import React from 'react';
import ThemeProvider from './components/ThemeProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Portfolio Builder',
  description: 'Create your professional portfolio with AI',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
};

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('portfolio-builder-theme') || 'light';
                document.documentElement.className = theme;
                document.documentElement.classList.add('bg-background');
                document.documentElement.classList.add('text-foreground');
                document.documentElement.classList.add('min-h-screen');
                document.documentElement.classList.add('flex');
                document.documentElement.classList.add('flex-col');
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <Toaster />
          {/* Header */}
          <header className="sticky top-0 z-50 bg-background text-foreground border-b border-border shadow-sm h-16 flex items-center px-8">
            <a href="/" className="font-bold text-xl text-blue-700 hover:underline focus:outline-none">Portfolio Builder</a>
            <nav className="ml-auto flex gap-6">
              <a href="/features" className="hover:underline">Features</a>
              <a href="/themes" className="hover:underline">Themes</a>
              <a href="/builder/ai-models" className="hover:underline">AI Models</a>
              <a href="/contact" className="hover:underline">Contact</a>
            </nav>
          </header>
          {/* Main Content */}
          <main className="flex-1 flex flex-col items-center justify-start w-full px-4 py-8 bg-background text-foreground">
            {children}
          </main>
          {/* Footer */}
          <footer className="w-full text-center text-xs text-foreground py-4 border-t border-border mt-8 bg-background text-foreground">
            © {new Date().getFullYear()} Portfolio Builder. All rights reserved.
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
} 