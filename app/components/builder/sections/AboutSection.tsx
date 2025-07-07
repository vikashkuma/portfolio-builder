'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';

interface AboutSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const AboutSection = ({ onUpdate, initialData }: AboutSectionProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    bio: initialData?.bio || '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');

  // Pure validation function
  const validateAboutFormPure = useCallback((data: typeof formData) => {
    const newErrors: { [key: string]: string | null } = {};

    if (!data.name.trim()) {
      newErrors.name = 'Full Name is required.';
    } else if (data.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters long.';
    }

    if (!data.role.trim()) {
      newErrors.role = 'Professional Role is required.';
    } else if (data.role.length < 3) {
      newErrors.role = 'Role must be at least 3 characters long.';
    }

    if (!data.bio.trim()) {
      newErrors.bio = 'Short Bio is required.';
    } else if (data.bio.length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters long.';
    } else if (data.bio.length > 500) {
      newErrors.bio = 'Bio must not exceed 500 characters.';
    }

    return newErrors;
  }, []);

  // Effect to re-validate whenever form data changes
  useEffect(() => {
    const newErrors = validateAboutFormPure(formData);
    setErrors(newErrors);
  }, [formData, validateAboutFormPure]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    onUpdate({ ...formData, [name]: value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleGenerateAI = async () => {
    const newErrors = validateAboutFormPure(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      Object.keys(formData).forEach(key => setTouched(prev => ({ ...prev, [key]: true })));
      toast.error('Please fix the errors before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const input = `Name: ${formData.name}\nRole: ${formData.role}\nBio: ${formData.bio}`;
      const generated = await generateContent('about', input);
      setAiGenerated(generated);
      toast.success('AI content generated successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const hasErrors = Object.values(errors).some(error => error !== null);

  const extractMeaningfulContent = (aiContent: string) => {
    let content = aiContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    return content.trim();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={formData.name}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${touched.name && errors.name ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {touched.name && errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-foreground">
          Professional Role
        </label>
        <input
          type="text"
          name="role"
          id="role"
          value={formData.role}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${touched.role && errors.role ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {touched.role && errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-foreground">
          Short Bio
          <span className="text-sm text-foreground/60 ml-2">
            ({formData.bio.length}/500 characters)
          </span>
        </label>
        <textarea
          name="bio"
          id="bio"
          rows={4}
          value={formData.bio}
          onChange={handleInputChange}
          onBlur={handleBlur}
          maxLength={500}
          className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
            ${touched.bio && errors.bio ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
          `}
        />
        {touched.bio && errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
      </div>

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
            <h4 className="text-sm font-medium text-foreground">AI Generated Bio</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(extractMeaningfulContent(aiGenerated));
                toast.success('AI generated content copied to clipboard!');
              }}
            >
              Copy
            </Button>
          </div>
          <pre className="whitespace-pre-wrap text-foreground/80 mb-2">{extractMeaningfulContent(aiGenerated)}</pre>
          <Button
            onClick={() => {
              const contentToSave = extractMeaningfulContent(aiGenerated);
              setFormData(prev => ({ ...prev, bio: contentToSave }));
              onUpdate({ ...formData, bio: contentToSave });
              toast.success('AI generated bio saved to section!');
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