'use client';

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { usePortfolioStore } from '../../store/portfolioStore';
import { StepTracker } from '../../components/builder/StepTracker';
import { AboutSection } from '../../components/builder/sections/AboutSection';
import { ExperienceSection } from '../../components/builder/sections/ExperienceSection';
import { EducationSection } from '../../components/builder/sections/EducationSection';
import { SkillsSection } from '../../components/builder/sections/SkillsSection';
import { AwardsSection } from '../../components/builder/sections/AwardsSection';
import { TestimonialsSection } from '../../components/builder/sections/TestimonialsSection';
import { ContactSection } from '../../components/builder/sections/ContactSection';

import { PortfolioPreview } from '../../components/builder/PortfolioPreview';
import Button from '../../components/ui/Button';
import { downloadPortfolioAsPDFFile, downloadPortfolioAsHTML, downloadPortfolioAsJSON } from '../../utils/portfolioExport';
import { toast } from 'react-hot-toast';
import { FaFilePdf, FaFileCode, FaFileAlt } from 'react-icons/fa';

const steps = [
  { id: 1, key: 'about', title: 'About', description: 'Basic information' },
  { id: 2, key: 'experience', title: 'Experience', description: 'Work history' },
  { id: 3, key: 'education', title: 'Education', description: 'Academic background' },
  { id: 4, key: 'skills', title: 'Skills', description: 'Technical abilities' },
  { id: 5, key: 'awards', title: 'Awards', description: 'Achievements' },
  { id: 6, key: 'testimonials', title: 'Testimonials', description: 'Client feedback' },
  { id: 7, key: 'contact', title: 'Contact', description: 'Contact information' },
  { id: 8, key: 'preview', title: 'Preview', description: 'Preview your portfolio' },
];

const sectionComponents: Record<string, any> = {
  about: AboutSection,
  experience: ExperienceSection,
  education: EducationSection,
  skills: SkillsSection,
  awards: AwardsSection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
};

export default function BuilderSectionPage() {
  const router = useRouter();
  const params = useParams();
  const section = params?.section as string;
  const stepIndex = steps.findIndex((s) => s.key === section);
  const { portfolio, updatePortfolio } = usePortfolioStore();
  const theme = portfolio?.theme || 'light';
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showDeviceModal, setShowDeviceModal] = useState(false);

  useEffect(() => {
    if (!section || (!(section in sectionComponents) && section !== 'preview')) {
      router.replace('/builder/about');
    }
  }, [section, router]);

  const handleUpdate = (data: any) => {
    updatePortfolio(data);
  };

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      router.push(`/builder/${steps[stepIndex + 1].key}`);
    }
  };

  const handleDownloadPDF = async () => {
    if (portfolio) {
      try {
        toast.loading('Generating PDF...', { id: 'pdf-generation' });
        await downloadPortfolioAsPDFFile(portfolio);
        toast.success('Portfolio downloaded as PDF!', { id: 'pdf-generation' });
      } catch (error) {
        console.error('Error downloading PDF:', error);
        toast.error('Failed to download PDF. Please try again.', { id: 'pdf-generation' });
      }
    } else {
      toast.error('No portfolio data available to download.');
    }
  };

  const handleDownloadHTML = () => {
    if (portfolio) {
      try {
        downloadPortfolioAsHTML(portfolio);
        toast.success('Portfolio downloaded as HTML!');
      } catch (error) {
        console.error('Error downloading HTML:', error);
        toast.error('Failed to download HTML. Please try again.');
      }
    } else {
      toast.error('No portfolio data available to download.');
    }
  };

  const handleDownloadJSON = () => {
    if (portfolio) {
      try {
        downloadPortfolioAsJSON(portfolio);
        toast.success('Portfolio downloaded as JSON!');
      } catch (error) {
        console.error('Error downloading JSON:', error);
        toast.error('Failed to download JSON. Please try again.');
      }
    } else {
      toast.error('No portfolio data available to download.');
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      router.push(`/builder/${steps[stepIndex - 1].key}`);
    }
  };

  let SectionComponent = null;
  if (section in sectionComponents) {
    SectionComponent = sectionComponents[section];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Tracker always at the top */}
        <StepTracker steps={steps} currentStep={stepIndex + 1} />
        {/* Preview always below steps except in preview step */}
        {/* Section Form, Theme Selector, or Preview Tab */}
        <div className="bg-white rounded-lg shadow p-6">
          {section === 'preview' ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Preview Your Portfolio</h2>
                <Button onClick={() => setShowDeviceModal(true)} variant="outline">
                  Change Device View
                </Button>
              </div>
              
              {/* Device Selection Modal */}
              {showDeviceModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-auto p-6 relative">
                    <h3 className="text-lg font-semibold mb-4">Select Device View</h3>
                    <div className="flex gap-4 mb-6">
                      <Button
                        variant={device === 'desktop' ? 'primary' : 'outline'}
                        onClick={() => setDevice('desktop')}
                      >
                        Desktop
                      </Button>
                      <Button
                        variant={device === 'tablet' ? 'primary' : 'outline'}
                        onClick={() => setDevice('tablet')}
                      >
                        Tablet
                      </Button>
                      <Button
                        variant={device === 'mobile' ? 'primary' : 'outline'}
                        onClick={() => setDevice('mobile')}
                      >
                        Mobile
                      </Button>
                    </div>
                    <Button onClick={() => setShowDeviceModal(false)} className="w-full">Close</Button>
                  </div>
                </div>
              )}
              
              {/* Portfolio Preview */}
              <div className="mb-6">
                <PortfolioPreview portfolioData={portfolio || {}} theme={theme} device={device} />
              </div>
              
              {/* Download Section */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Download Your Portfolio</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Choose your preferred format to download your portfolio:
                </p>
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button onClick={handleDownloadPDF} variant="primary" leftIcon={<FaFilePdf />}>Download PDF</Button>
                  <Button onClick={handleDownloadHTML} variant="secondary" leftIcon={<FaFileCode />}>Download HTML</Button>
                  <Button onClick={handleDownloadJSON} variant="outline" leftIcon={<FaFileAlt />}>Download JSON</Button>
                </div>
                <div className="flex justify-between">
                  <Button onClick={handleBack} variant="outline">Back</Button>
                  <Button onClick={() => router.push('/builder/about')} variant="outline">Edit Portfolio</Button>
                </div>
              </div>
            </div>
          ) : SectionComponent ? (
            <>
              <SectionComponent onUpdate={handleUpdate} initialData={portfolio || {}} />
              <div className="mt-8 flex justify-between">
                <Button
                  onClick={handleBack}
                  disabled={stepIndex === 0}
                  variant="outline"
                  className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400"
                >
                  Back
                </Button>
                <Button onClick={handleNext} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">
                  Next
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
} 