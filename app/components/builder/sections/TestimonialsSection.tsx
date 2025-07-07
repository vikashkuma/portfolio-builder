'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaRobot } from 'react-icons/fa';

interface TestimonialsSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const TestimonialsSection = ({ onUpdate, initialData }: TestimonialsSectionProps) => {
  const [testimonials, setTestimonials] = useState<Array<{
    name: string;
    role: string;
    content: string;
  }>>(initialData?.testimonials || [{ name: '', role: '', content: '' }]);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedTestimonials, setSuggestedTestimonials] = useState<string[]>([]);

  // Pure validation function
  const validateTestimonialsPure = useCallback((testimonialsList: typeof testimonials) => {
    const newErrors: { [key: string]: string | null } = {};

    testimonialsList.forEach((testimonial, index) => {
      if (!testimonial.name.trim()) {
        newErrors[`testimonial-${index}-name`] = 'Name is required.';
      } else if (testimonial.name.length < 2) {
        newErrors[`testimonial-${index}-name`] = 'Name must be at least 2 characters long.';
      } else if (testimonial.name.length > 100) {
        newErrors[`testimonial-${index}-name`] = 'Name must not exceed 100 characters.';
      }

      if (!testimonial.role.trim()) {
        newErrors[`testimonial-${index}-role`] = 'Role is required.';
      } else if (testimonial.role.length < 3) {
        newErrors[`testimonial-${index}-role`] = 'Role must be at least 3 characters long.';
      } else if (testimonial.role.length > 100) {
        newErrors[`testimonial-${index}-role`] = 'Role must not exceed 100 characters.';
      }

      if (!testimonial.content.trim()) {
        newErrors[`testimonial-${index}-content`] = 'Testimonial content is required.';
      } else if (testimonial.content.length < 50) {
        newErrors[`testimonial-${index}-content`] = 'Testimonial must be at least 50 characters long.';
      } else if (testimonial.content.length > 500) {
        newErrors[`testimonial-${index}-content`] = 'Testimonial must not exceed 500 characters.';
      }
    });

    return newErrors;
  }, []);

  // Effect to re-validate whenever testimonials change
  useEffect(() => {
    const newErrors = validateTestimonialsPure(testimonials);
    const touchedErrors: { [key: string]: string | null } = {};
    
    // Only show errors for fields that have been touched
    Object.keys(newErrors).forEach(key => {
      if (touched[key]) {
        touchedErrors[key] = newErrors[key];
      }
    });
    
    setErrors(touchedErrors);
  }, [testimonials, touched, validateTestimonialsPure]);

  const handleTestimonialChange = (index: number, field: 'name' | 'role' | 'content', value: string) => {
    const newTestimonials = [...testimonials];
    newTestimonials[index] = { ...newTestimonials[index], [field]: value };
    setTestimonials(newTestimonials);
    setTouched(prev => ({ ...prev, [`testimonial-${index}-${field}`]: true }));
    onUpdate({ testimonials: newTestimonials });
  };

  const handleAddTestimonial = () => {
    const newTestimonials = [...testimonials, { name: '', role: '', content: '' }];
    setTestimonials(newTestimonials);
    onUpdate({ testimonials: newTestimonials });
  };

  const handleRemoveTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter((_, i) => i !== index);
    setTestimonials(newTestimonials);
    onUpdate({ testimonials: newTestimonials });

    // Clean up touched state for removed testimonial
    const newTouched = { ...touched };
    Object.keys(newTouched).forEach(key => {
      if (key.startsWith(`testimonial-${index}-`)) {
        delete newTouched[key];
      }
    });
    setTouched(newTouched);
  };

  const handleGenerateAI = async () => {
    const newErrors = validateTestimonialsPure(testimonials);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Mark all fields as touched to show errors
      const newTouched: { [key: string]: boolean } = {};
      testimonials.forEach((_, index) => {
        newTouched[`testimonial-${index}-name`] = true;
        newTouched[`testimonial-${index}-role`] = true;
        newTouched[`testimonial-${index}-content`] = true;
      });
      setTouched(prev => ({ ...prev, ...newTouched }));
      toast.error('Please fix the errors before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const input = `Current testimonials: ${testimonials.map(t => t.name).join(', ')}`;
      const generated = await generateContent('testimonials', input);
      const testimonialsList = generated.split('\n\n').map(t => t.trim()).filter(t => t);
      setSuggestedTestimonials(testimonialsList);
      toast.success('AI content generated successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <div className="space-y-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
            <div>
              <label htmlFor={`testimonial-${index}-name`} className="block text-sm font-medium text-foreground">
                Name
              </label>
              <input
                type="text"
                id={`testimonial-${index}-name`}
                value={testimonial.name}
                onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, [`testimonial-${index}-name`]: true }))}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`testimonial-${index}-name`] && errors[`testimonial-${index}-name`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`testimonial-${index}-name`] && errors[`testimonial-${index}-name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`testimonial-${index}-name`]}</p>
              )}
            </div>

            <div>
              <label htmlFor={`testimonial-${index}-role`} className="block text-sm font-medium text-foreground">
                Role
              </label>
              <input
                type="text"
                id={`testimonial-${index}-role`}
                value={testimonial.role}
                onChange={(e) => handleTestimonialChange(index, 'role', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, [`testimonial-${index}-role`]: true }))}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`testimonial-${index}-role`] && errors[`testimonial-${index}-role`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`testimonial-${index}-role`] && errors[`testimonial-${index}-role`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`testimonial-${index}-role`]}</p>
              )}
            </div>

            <div>
              <label htmlFor={`testimonial-${index}-content`} className="block text-sm font-medium text-foreground">
                Testimonial
                <span className="text-sm text-foreground/60 ml-2">
                  ({testimonial.content.length}/500 characters)
                </span>
              </label>
              <textarea
                id={`testimonial-${index}-content`}
                value={testimonial.content}
                onChange={(e) => handleTestimonialChange(index, 'content', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, [`testimonial-${index}-content`]: true }))}
                rows={4}
                maxLength={500}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`testimonial-${index}-content`] && errors[`testimonial-${index}-content`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`testimonial-${index}-content`] && errors[`testimonial-${index}-content`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`testimonial-${index}-content`]}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveTestimonial(index)}
                disabled={testimonials.length === 1}
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Remove Testimonial
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleAddTestimonial}
          variant="outline"
          size="sm"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Testimonial
        </Button>
        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating}
        >
          <FaRobot className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Suggest with AI'}
        </Button>
      </div>

      {suggestedTestimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
        >
          <h4 className="text-sm font-medium text-foreground mb-2">AI Suggested Testimonials</h4>
          <div className="space-y-2">
            {suggestedTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="p-2 rounded-md bg-background text-foreground border border-border hover:bg-foreground/5 cursor-pointer"
                onClick={() => {
                  handleAddTestimonial();
                  handleTestimonialChange(testimonials.length - 1, 'content', testimonial);
                  toast.success('Suggested testimonial added!');
                }}
              >
                <p className="text-sm text-foreground/80">{testimonial}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 