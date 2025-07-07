'use client';

import { usePortfolioStore } from '../store/portfolioStore';
import { ThemeSelector } from '../components/builder/ThemeSelector';
import { PortfolioPreview } from '../components/builder/PortfolioPreview';

export default function ThemesPage() {
  const { portfolio, updatePortfolio } = usePortfolioStore();
  const theme = portfolio?.theme || 'light';

  return (
    <div className="max-w-5xl mx-auto py-16 px-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-4">Choose a Portfolio Theme</h1>
      <p className="text-lg mb-8">Browse and preview available portfolio themes. Select one to see a live preview below.</p>
      <ThemeSelector
        onSelect={(theme) => {
          updatePortfolio({ theme });
          // Set Tailwind's dark mode class for dark theme, otherwise remove it
          if (theme === 'dark') {
            document.documentElement.className = 'dark';
          } else {
            document.documentElement.className = '';
          }
          localStorage.setItem('portfolio-builder-theme', theme);
        }}
        selectedTheme={theme}
      />
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Live Preview</h2>
        <PortfolioPreview portfolioData={portfolio || {}} theme={theme} />
      </div>
    </div>
  );
} 