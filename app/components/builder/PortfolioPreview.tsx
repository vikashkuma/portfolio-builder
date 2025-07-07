'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { BriefcaseIcon, UserIcon, AcademicCapIcon, StarIcon, ChatBubbleLeftRightIcon, PhoneIcon, SparklesIcon } from '@heroicons/react/24/outline';

// Device icons as SVGs
const DeviceIcon = ({ type, selected, onClick }: { type: 'desktop' | 'tablet' | 'mobile'; selected: boolean; onClick: () => void }) => {
  const base = 'cursor-pointer p-2 rounded-md transition-all';
  const active = selected ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700';
  let icon = null;
  if (type === 'desktop') {
    icon = (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 19h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
    );
  } else if (type === 'tablet') {
    icon = (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="17" r="1" fill="currentColor"/></svg>
    );
  } else {
    icon = (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="18" r="1" fill="currentColor"/></svg>
    );
  }
  return (
    <button className={`${base} ${active}`} onClick={onClick} aria-label={type.charAt(0).toUpperCase() + type.slice(1)}>{icon}</button>
  );
};

type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface PortfolioPreviewProps {
  portfolioData: any;
  theme: string;
  device?: DeviceType;
}

export const PortfolioPreview = ({ portfolioData, theme, device: deviceProp }: PortfolioPreviewProps) => {
  const [device, setDevice] = useState<DeviceType>(deviceProp || 'desktop');

  const deviceClasses = {
    desktop: 'w-full max-w-4xl p-10',
    tablet: 'w-[768px] p-8',
    mobile: 'w-[375px] p-4',
  };

  // Responsive classes for preview content
  const contentClasses = {
    desktop: 'text-base p-10',
    tablet: 'text-[15px] p-6',
    mobile: 'text-sm p-3',
  };

  return (
    <div className="flex justify-center items-center min-h-[500px] bg-foreground/5 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative mx-auto border-4 border-border rounded-3xl shadow-2xl bg-background flex flex-col ${deviceClasses[device]}`}
        style={{ minHeight: device === 'mobile' ? 600 : device === 'tablet' ? 700 : 800 }}
      >
        {/* Device selector as part of the device frame */}
        <div className="flex justify-end gap-2 px-4 pt-3 pb-2 rounded-t-2xl bg-background border-b border-border absolute left-0 top-0 w-full z-10">
          <DeviceIcon type="desktop" selected={device === 'desktop'} onClick={() => setDevice('desktop')} />
          <DeviceIcon type="tablet" selected={device === 'tablet'} onClick={() => setDevice('tablet')} />
          <DeviceIcon type="mobile" selected={device === 'mobile'} onClick={() => setDevice('mobile')} />
        </div>
        {/* Main preview content */}
        <div className="pt-16">
          <div className={`bg-background text-foreground rounded-2xl ${contentClasses[device]}`}>
            {/* About Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <UserIcon className="w-6 h-6 text-blue-500" />
                <h1 className="text-3xl font-bold">{portfolioData.name || 'Your Name'}</h1>
              </div>
              <p className={device === 'mobile' ? 'text-base mb-2' : device === 'tablet' ? 'text-lg mb-2' : 'text-xl mb-2'}>{portfolioData.role || 'Your Role'}</p>
              <p className={device === 'mobile' ? 'mb-2' : 'mb-2'}>{portfolioData.bio || 'Your bio will appear here'}</p>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <BriefcaseIcon className="w-6 h-6 text-purple-500" />
                <h2 className="text-2xl font-semibold text-purple-700">Experience</h2>
              </div>
              {portfolioData.experiences && portfolioData.experiences.length > 0 ? (
                portfolioData.experiences.map((exp: any, index: number) => {
                  // Format dates for display
                  const formatDate = (dateString: string) => {
                    if (!dateString) return '';
                    if (dateString === 'Present') return 'Present';
                    try {
                      const date = new Date(dateString);
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                    } catch {
                      return dateString;
                    }
                  };
                  
                  const startDate = formatDate(exp.startDate);
                  const endDate = formatDate(exp.endDate);
                  const period = startDate && endDate ? `${startDate} - ${endDate}` : startDate || endDate;
                  
                  return (
                    <div key={exp.id || index} className="mb-4 ml-8">
                      <h3 className="font-medium">{exp.title}</h3>
                      <p>{exp.company}</p>
                      {period && <p className="text-sm">{period}</p>}
                      <p className="text-sm text-foreground/70">{exp.description}</p>
                    </div>
                  );
                })
              ) : (
                <p className="ml-8 text-foreground/50 italic">No experience added yet.</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <SparklesIcon className="w-6 h-6 text-green-500" />
                <h2 className="text-2xl font-semibold text-green-700">Skills</h2>
              </div>
              {portfolioData.skills && portfolioData.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2 ml-8">
                  {portfolioData.skills.map((skill: { name: string; level: string }) => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="ml-8 text-foreground/50 italic">No skills added yet.</p>
              )}
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <AcademicCapIcon className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-semibold text-blue-700">Education</h2>
              </div>
              {portfolioData.education && portfolioData.education.length > 0 ? (
                portfolioData.education.map((edu: any) => (
                  <div key={edu.id} className="mb-4 ml-8">
                    {(edu.degree || edu.field) && (
                      <h3 className="font-medium">
                        {edu.degree && edu.degree !== 'Other' ? edu.degree : edu.otherDegreeText || ''}
                        {((edu.degree && edu.field && edu.degree !== 'Other' && edu.field !== 'Other') || (edu.degree === 'Other' && edu.otherDegreeText && edu.field === 'Other' && edu.otherFieldText) || (edu.degree === 'Other' && edu.otherDegreeText && edu.field !== 'Other') || (edu.degree !== 'Other' && edu.field === 'Other' && edu.otherFieldText)) ? ' in ' : ''}
                        {edu.field && edu.field !== 'Other' ? edu.field : edu.otherFieldText || ''}
                      </h3>
                    )}
                    {edu.school && <p>{edu.school}</p>}
                    {edu.period && <p className="text-sm">{edu.period}</p>}
                    {edu.description && <p className="text-sm text-foreground/70">{edu.description}</p>}
                  </div>
                ))
              ) : (
                <p className="ml-8 text-foreground/50 italic">No education added yet.</p>
              )}
            </div>

            {/* Awards Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="w-6 h-6 text-yellow-500" />
                <h2 className="text-2xl font-semibold text-yellow-700">Awards</h2>
              </div>
              {portfolioData.awards && portfolioData.awards.length > 0 ? (
                portfolioData.awards.map((award: any, index: number) => {
                  // Format date for display
                  const formatDate = (date: Date | string | null) => {
                    if (!date) return '';
                    if (date instanceof Date) {
                      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                    }
                    if (typeof date === 'string') {
                      try {
                        const dateObj = new Date(date);
                        return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
                      } catch {
                        return date;
                      }
                    }
                    return '';
                  };
                  
                  return (
                    <div key={award.id || index} className="mb-4 ml-8">
                      {award.name && <h3 className="font-medium">{award.name}</h3>}
                      {award.date && <p className="text-sm">{formatDate(award.date)}</p>}
                      {award.description && <p className="text-sm text-foreground/70">{award.description}</p>}
                    </div>
                  );
                })
              ) : (
                <p className="ml-8 text-foreground/50 italic">No awards added yet.</p>
              )}
            </div>

            {/* Testimonials Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-pink-500" />
                <h2 className="text-2xl font-semibold text-pink-700">Testimonials</h2>
              </div>
              {portfolioData.testimonials && portfolioData.testimonials.length > 0 ? (
                portfolioData.testimonials.map((testimonial: any, index: number) => (
                  <div key={testimonial.id || index} className="mb-4 ml-8">
                    {testimonial.content && (
                      <blockquote className="italic">{testimonial.content}</blockquote>
                    )}
                    {(testimonial.name || testimonial.role) && (
                      <p className="text-sm mt-2">
                        {testimonial.name ? `- ${testimonial.name}` : ''}
                        {testimonial.role ? `, ${testimonial.role}` : ''}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="ml-8 text-foreground/50 italic">No testimonials added yet.</p>
              )}
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <PhoneIcon className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-cyan-700">Contact</h2>
              </div>
              {(() => {
                console.log('PortfolioPreview contact data:', portfolioData.contact);
                return (portfolioData.contact && (
                  portfolioData.contact.email ||
                  portfolioData.contact.phone ||
                  portfolioData.contact.linkedin ||
                  portfolioData.contact.website ||
                  portfolioData.contact.github ||
                  portfolioData.contact.twitter ||
                  portfolioData.contact.address
                ));
              })() ? (
                <div className="ml-8 space-y-1">
                  {portfolioData.contact.email && <p>Email: {portfolioData.contact.email}</p>}
                  {portfolioData.contact.phone && <p>Phone: {portfolioData.contact.phone}</p>}
                  {portfolioData.contact.linkedin && <p>LinkedIn: {portfolioData.contact.linkedin}</p>}
                  {portfolioData.contact.website && <p>Website: {portfolioData.contact.website}</p>}
                  {portfolioData.contact.github && <p>GitHub: {portfolioData.contact.github}</p>}
                  {portfolioData.contact.twitter && <p>Twitter: {portfolioData.contact.twitter}</p>}
                  {portfolioData.contact.address && <p>Address: {portfolioData.contact.address}</p>}
                </div>
              ) : (
                <p className="ml-8 text-foreground/50 italic">No contact information added yet.</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}; 