'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { StepTracker } from './StepTracker';
import { AboutSection } from './sections/AboutSection';
import { ExperienceSection } from './sections/ExperienceSection';
import { SkillsSection } from './sections/SkillsSection';
import { PortfolioPreview } from './PortfolioPreview';
import { EducationSection } from './sections/EducationSection';
import { AwardsSection } from './sections/AwardsSection';
import { TestimonialsSection } from './sections/TestimonialsSection';
import { ContactSection } from './sections/ContactSection';

import { downloadPortfolio } from '../../utils/portfolioExport';
import { Portfolio, Education as PortfolioEducation } from '../../types/portfolio';
import { toast } from 'react-hot-toast';

const steps = [
  { id: 1, title: 'About', description: 'Basic information' },
  { id: 2, title: 'Experience', description: 'Work history' },
  { id: 3, title: 'Education', description: 'Academic background' },
  { id: 4, title: 'Skills', description: 'Technical abilities' },
  { id: 5, title: 'Awards', description: 'Achievements' },
  { id: 6, title: 'Testimonials', description: 'Client feedback' },
  { id: 7, title: 'Contact', description: 'Contact information' },
];

interface ComponentEducation {
  id: string;
  school: string;
  degree: string;
  field: string;
  period: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  otherDegreeText?: string;
  otherFieldText?: string;
}

export default function BuilderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolioData, setPortfolioData] = useState<Portfolio>({
    id: crypto.randomUUID(),
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
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Lock scroll when modal is open (mobile)
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [modalOpen]);

  const handleUpdate = (sectionData: any) => {
    if (sectionData.education) {
      // Convert component's Education type to Portfolio's Education type
      const convertedEducation: PortfolioEducation[] = sectionData.education.map((edu: ComponentEducation) => ({
        institution: edu.school,
        degree: edu.degree === 'Other' ? edu.otherDegreeText || '' : edu.degree,
        field: edu.field === 'Other' ? edu.otherFieldText || '' : edu.field,
        startDate: edu.startDate?.toISOString() || '',
        endDate: edu.endDate?.toISOString() || '',
        description: edu.description || '',
      }));
      setPortfolioData(prev => ({
        ...prev,
        education: convertedEducation,
      }));
    } else if (sectionData.about) {
      setPortfolioData(prev => ({
        ...prev,
        about: sectionData.about,
      }));
    } else if (sectionData.experiences) {
      setPortfolioData(prev => ({
        ...prev,
        experiences: sectionData.experiences,
      }));
    } else if (sectionData.skills) {
      setPortfolioData(prev => ({
        ...prev,
        skills: sectionData.skills,
      }));
    } else if (sectionData.awards) {
      setPortfolioData(prev => ({
        ...prev,
        awards: sectionData.awards,
      }));
    } else if (sectionData.testimonials) {
      setPortfolioData(prev => ({
        ...prev,
        testimonials: sectionData.testimonials,
      }));
    } else if (sectionData.contact) {
      console.log('Updating contact data:', sectionData.contact);
      setPortfolioData(prev => ({
        ...prev,
        contact: sectionData.contact,
      }));
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSave = () => {
    if (portfolioData) {
      downloadPortfolio(portfolioData);
      toast.success('Portfolio downloaded successfully!');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <AboutSection onUpdate={handleUpdate} initialData={portfolioData} />;
      case 2:
        return <ExperienceSection onUpdate={handleUpdate} initialData={portfolioData} />;
      case 3:
        // Convert Portfolio's Education type to component's Education type
        const componentEducation = portfolioData.education.map(edu => ({
          id: crypto.randomUUID(),
          institution: edu.institution,
          degree: edu.degree,
          field: edu.field,
          description: edu.description,
          school: edu.institution,
          period: `${edu.startDate} - ${edu.endDate}`,
          startDate: new Date(edu.startDate),
          endDate: new Date(edu.endDate),
          otherDegreeText: '',
          otherFieldText: '',
        }));
        return <EducationSection onUpdate={handleUpdate} initialData={{ education: componentEducation }} />;
      case 4:
        return <SkillsSection onUpdate={handleUpdate} initialData={portfolioData} />;
      case 5:
        return <AwardsSection onUpdate={handleUpdate} initialData={portfolioData} />;
      case 6:
        return <TestimonialsSection onUpdate={handleUpdate} initialData={portfolioData} />;
      case 7:
        return <ContactSection onUpdate={handleUpdate} initialData={portfolioData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[90vw] lg:max-w-7xl mx-auto mt-12 mb-16 p-4 sm:p-8 bg-background text-foreground rounded-xl shadow-lg">
        <StepTracker steps={steps} currentStep={currentStep} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-start w-full">
          <div className="w-full min-h-[600px] flex flex-col justify-start">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              {renderStepContent()}
            </motion.div>
            <div className="mt-8 flex justify-between">
              <Button
                onClick={handleBack}
                disabled={currentStep === 1}
                variant="outline"
                className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400"
              >
                Back
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleSave} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">Save Portfolio</Button>
              ) : (
                <Button onClick={handleNext} className="transition-colors duration-150 focus:ring-2 focus:ring-blue-400">Next</Button>
              )}
            </div>
          </div>
          <div className="w-full min-h-[600px] flex flex-col justify-start space-y-6">
            <div className="w-full">
              <PortfolioPreview portfolioData={portfolioData} theme="light" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 