import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Portfolio, PortfolioStep } from '../types/portfolio';

interface PortfolioState {
  currentStep: PortfolioStep;
  portfolio: Portfolio | null;
  setCurrentStep: (step: PortfolioStep) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (data: Partial<Portfolio>) => void;
  resetPortfolio: () => void;
  clearStorage: () => void;
}

const initialPortfolio: Portfolio = {
  id: '',
  about: {
    name: '',
    role: '',
    bio: '',
  },
  experiences: [],
  education: [],
  skills: [],
  awards: [],
  testimonials: [],
  contact: {
    email: '',
  },
  theme: 'light',
  layout: 'single-page',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// To disable localStorage persistence, replace the persist wrapper with just create:
// export const usePortfolioStore = create<PortfolioState>()((set) => ({ ... }));

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      currentStep: 'about',
      portfolio: null,
      setCurrentStep: (step) => set({ currentStep: step }),
      setPortfolio: (portfolio) => set({ portfolio }),
      updatePortfolio: (data) =>
        set((state) => ({
          portfolio: state.portfolio
            ? { ...state.portfolio, ...data, updatedAt: new Date().toISOString() }
            : { ...initialPortfolio, ...data },
        })),
      resetPortfolio: () => set({ portfolio: null, currentStep: 'about' }),
      clearStorage: () => {
        localStorage.removeItem('portfolio-storage');
        set({ portfolio: null, currentStep: 'about' });
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
); 