"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePortfolioStore } from "./store/portfolioStore";

export default function Home() {
  const router = useRouter();
  const { clearStorage, portfolio } = usePortfolioStore();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleStartBuilder = () => {
    router.push('/builder/about');
  };

  const handleClearData = () => {
    clearStorage();
    setShowClearConfirm(false);
    // Optionally redirect to refresh the page
    window.location.reload();
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[80vh] bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center mt-12 mb-4">Create a Professional Portfolio with AI</h1>
      <p className="text-lg text-center mb-8 max-w-2xl">
        Build a stunning portfolio in minutes with our AI-powered builder. Perfect for developers, designers, and professionals.
      </p>
      
      <div className="flex gap-4 mb-12">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
          onClick={handleStartBuilder}
        >
          Create My Portfolio
        </button>
        
        {portfolio && (
          <button
            className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold text-sm shadow hover:bg-red-700 transition"
            onClick={() => setShowClearConfirm(true)}
          >
            Clear Saved Data
          </button>
        )}
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Clear Saved Data?</h3>
            <p className="text-gray-600 mb-6">
              This will permanently delete all your saved portfolio data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleClearData}
              >
                Yes, Clear Data
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">AI-Powered Content</h3>
          <p className="text-center">Let our AI help you write compelling content for your portfolio sections.</p>
        </div>
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Beautiful Templates</h3>
          <p className="text-center">Choose from a variety of professionally designed templates that showcase your work.</p>
        </div>
        <div className="rounded-lg shadow p-6 flex flex-col items-center bg-background text-foreground border border-gray-200">
          <h3 className="font-semibold text-lg mb-2">Easy Export</h3>
          <p className="text-center">Export your portfolio as a static site or deploy directly to your preferred platform.</p>
        </div>
      </section>
    </div>
  );
} 