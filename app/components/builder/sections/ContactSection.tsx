'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';
import { FaRobot } from 'react-icons/fa';

interface ContactSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const ContactSection = ({ onUpdate, initialData }: ContactSectionProps) => {
  const onUpdateRef = useRef(onUpdate);
  const initializedRef = useRef(false);
  onUpdateRef.current = onUpdate;

  const [formData, setFormData] = useState({
    email: initialData?.contact?.email || '',
    phone: initialData?.contact?.phone || '',
    linkedin: initialData?.contact?.linkedin || '',
    website: initialData?.contact?.website || '',
    github: initialData?.contact?.github || '',
    twitter: initialData?.contact?.twitter || '',
    address: initialData?.contact?.address || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Pure validation function
  const validateContactFormPure = useCallback((data: typeof formData) => {
    const newErrors: { [key: string]: string | null } = {};

    if (!data.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(data.email)) {
      newErrors.email = 'Invalid email format.';
    }

    if (data.phone.trim() && !/^\+?\d{10,15}$/.test(data.phone)) {
      newErrors.phone = 'Invalid phone number format (e.g., +12345678900).';
    }

    if (data.linkedin.trim() && !/^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/.test(data.linkedin)) {
      newErrors.linkedin = 'Invalid LinkedIn profile URL.';
    }

    if (data.website.trim() && !/^https?:\/\/[^\s/$.?#].[^\s]*$/.test(data.website)) {
      newErrors.website = 'Invalid website URL.';
    }

    if (data.github && data.github.trim() && !/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/?$/.test(data.github)) {
      newErrors.github = 'Invalid GitHub profile URL.';
    }

    if (data.twitter && data.twitter.trim() && !/^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+\/?$/.test(data.twitter)) {
      newErrors.twitter = 'Invalid Twitter profile URL.';
    }

    return newErrors;
  }, []);



  // Initialize form data when component mounts with initial data
  useEffect(() => {
    if (initializedRef.current) return;
    
    console.log('ContactSection initialData:', initialData);
    if (initialData?.contact) {
      const contactData = initialData.contact;
      console.log('ContactSection contactData:', contactData);
      const updatedFormData = {
        email: contactData.email || '',
        phone: contactData.phone || '',
        linkedin: contactData.linkedin || '',
        website: contactData.website || '',
        github: contactData.github || '',
        twitter: contactData.twitter || '',
        address: contactData.address || '',
      };
      console.log('ContactSection setting initial formData:', updatedFormData);
      setFormData(updatedFormData);
      // Only update if there's actual data to avoid overriding with empty values
      if (Object.values(updatedFormData).some(value => value)) {
        console.log('ContactSection calling onUpdate with initial data');
        onUpdateRef.current({ contact: updatedFormData });
      }
    }
    initializedRef.current = true;
  }, [initialData]);



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('ContactSection input change:', name, value, 'current formData:', formData);
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [name]: value };
      console.log('ContactSection updated formData:', updatedFormData);
      
      // Validate the updated form data
      const newErrors = validateContactFormPure(updatedFormData);
      setErrors(newErrors);
      
      // Call onUpdate with the updated data immediately
      onUpdateRef.current({ contact: updatedFormData });
      return updatedFormData;
    });
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateContactFormPure(formData);
    setErrors(newErrors);
    Object.keys(formData).forEach(key => setTouched(prev => ({ ...prev, [key]: true })));

    if (Object.keys(newErrors).length === 0) {
      toast.success('Contact information saved successfully!');
      // Proceed with saving or further actions
    } else {
      toast.error('Please fix the errors in the contact form.');
    }
  };

  const hasErrors = Object.values(errors).some(error => error !== null);

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const input = `Email: ${formData.email}\nPhone: ${formData.phone}\nLinkedIn: ${formData.linkedin}\nWebsite: ${formData.website}\nAddress: ${formData.address}`;
      const generated = await generateContent('contact', input);
      setAiGenerated(generated);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const extractMeaningfulContent = (aiContent: string) => {
    // Remove <think>...</think> blocks
    let content = aiContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    return content.trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.email && errors.email ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.email && errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-foreground">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.phone && errors.phone ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.phone && errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-foreground">
            LinkedIn Profile URL
          </label>
          <input
            type="url"
            name="linkedin"
            id="linkedin"
            value={formData.linkedin}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="https://www.linkedin.com/in/yourprofile"
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.linkedin && errors.linkedin ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.linkedin && errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-foreground">
            Personal Website URL
          </label>
          <input
            type="url"
            name="website"
            id="website"
            value={formData.website}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="https://www.yourwebsite.com"
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.website && errors.website ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.website && errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
        </div>

        <div>
          <label htmlFor="github" className="block text-sm font-medium text-foreground">
            GitHub Profile URL
          </label>
          <input
            type="url"
            name="github"
            id="github"
            value={formData.github}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="https://github.com/yourprofile"
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.github && errors.github ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.github && errors.github && <p className="text-red-500 text-sm mt-1">{errors.github}</p>}
        </div>

        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-foreground">
            Twitter Profile URL
          </label>
          <input
            type="url"
            name="twitter"
            id="twitter"
            value={formData.twitter}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="https://twitter.com/yourprofile"
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.twitter && errors.twitter ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.twitter && errors.twitter && <p className="text-red-500 text-sm mt-1">{errors.twitter}</p>}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-foreground">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${touched.address && errors.address ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
            `}
          />
          {touched.address && errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={hasErrors || isGenerating}
          >
            Save Contact Info
          </Button>
        </div>
      </form>

      <div className="flex justify-end">
        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating}
          className="ml-3"
        >
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
      {aiGenerated && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
        >
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-foreground">AI Generated Contact</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigator.clipboard.writeText(extractMeaningfulContent(aiGenerated))}
            >
              Copy
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-foreground/80 mb-2">{extractMeaningfulContent(aiGenerated)}</pre>
          <Button
            onClick={() => {
              // Save to section logic
              setAiGenerated('');
            }}
            variant="secondary"
            size="sm"
          >
            Save to Section
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}; 