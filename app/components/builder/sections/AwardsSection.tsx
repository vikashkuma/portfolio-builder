'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaRobot } from 'react-icons/fa';

interface AwardsSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const AwardsSection = ({ onUpdate, initialData }: AwardsSectionProps) => {
  const [awards, setAwards] = useState<Array<{
    name: string;
    date: Date | null;
    description: string;
  }>>(initialData?.awards || [{ name: '', date: null, description: '' }]);

  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedAwards, setSuggestedAwards] = useState<string[]>([]);

  // Pure validation function
  const validateAwardsPure = useCallback((awardsList: typeof awards) => {
    const newErrors: { [key: string]: string | null } = {};

    awardsList.forEach((award, index) => {
      if (!award.name.trim()) {
        newErrors[`award-${index}-name`] = 'Award name is required.';
      } else if (award.name.length < 3) {
        newErrors[`award-${index}-name`] = 'Award name must be at least 3 characters long.';
      } else if (award.name.length > 100) {
        newErrors[`award-${index}-name`] = 'Award name must not exceed 100 characters.';
      }

      if (!award.date) {
        newErrors[`award-${index}-date`] = 'Date is required.';
      } else if (!(award.date instanceof Date) || isNaN(award.date.getTime())) {
        newErrors[`award-${index}-date`] = 'Invalid date format.';
      }

      if (!award.description || !award.description.trim()) {
        newErrors[`award-${index}-description`] = 'Description is required.';
      } else if (award.description.length < 10) {
        newErrors[`award-${index}-description`] = 'Description must be at least 10 characters long.';
      } else if (award.description.length > 500) {
        newErrors[`award-${index}-description`] = 'Description must not exceed 500 characters.';
      }
    });

    return newErrors;
  }, []);

  // Effect to convert string dates to Date objects if initialData contains string dates
  useEffect(() => {
    if (initialData?.awards) {
      const convertedAwards = initialData.awards.map((award: any) => ({
        ...award,
        date: typeof award.date === 'string' && award.date ? new Date(award.date) : award.date
      }));
      setAwards(convertedAwards);
    }
  }, [initialData]);

  // Effect to re-validate whenever awards change
  useEffect(() => {
    const newErrors = validateAwardsPure(awards);
    setErrors(newErrors);
  }, [awards, validateAwardsPure]);

  const handleAwardChange = (index: number, field: 'name' | 'date' | 'description', value: string | Date | null) => {
    const newAwards = [...awards];
    newAwards[index] = { ...newAwards[index], [field]: value };
    setAwards(newAwards);
    setTouched(prev => ({ ...prev, [`award-${index}-${field}`]: true }));
    onUpdate({ awards: newAwards });
  };

  const handleAddAward = () => {
    const newAwards = [...awards, { name: '', date: null, description: '' }];
    setAwards(newAwards);
    onUpdate({ awards: newAwards });
  };

  const handleRemoveAward = (index: number) => {
    const newAwards = awards.filter((_, i) => i !== index);
    setAwards(newAwards);
    onUpdate({ awards: newAwards });

    const newTouched = { ...touched };
    Object.keys(newTouched).forEach(key => {
      if (key.startsWith(`award-${index}-`)) {
        delete newTouched[key];
      }
    });
    setTouched(newTouched);
  };

  const handleGenerateAI = async () => {
    const newErrors = validateAwardsPure(awards);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      awards.forEach((_, index) => {
        setTouched(prev => ({
          ...prev,
          [`award-${index}-name`]: true,
          [`award-${index}-date`]: true,
          [`award-${index}-description`]: true,
        }));
      });
      toast.error('Please fix the errors before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const input = `Current awards: ${awards.map(a => a.name).join(', ')}`;
      const generated = await generateContent('awards', input);
      const awardsList = generated.split('\n').map(a => a.trim()).filter(a => a);
      setSuggestedAwards(awardsList);
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
        {awards.map((award, index) => (
          <div key={index} className="space-y-4 p-4 border border-border rounded-lg">
            <div>
              <label htmlFor={`award-${index}-name`} className="block text-sm font-medium text-foreground">
                Award Name
              </label>
              <input
                type="text"
                id={`award-${index}-name`}
                value={award.name}
                onChange={(e) => handleAwardChange(index, 'name', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, [`award-${index}-name`]: true }))}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`award-${index}-name`] && errors[`award-${index}-name`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`award-${index}-name`] && errors[`award-${index}-name`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`award-${index}-name`]}</p>
              )}
            </div>

            <div>
              <label htmlFor={`award-${index}-date`} className="block text-sm font-medium text-foreground">
                Date
              </label>
              <DatePicker
                selected={award.date}
                onChange={(date: Date | null) => handleAwardChange(index, 'date', date)}
                onBlur={() => setTouched(prev => ({ ...prev, [`award-${index}-date`]: true }))}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="Select date"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`award-${index}-date`] && errors[`award-${index}-date`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`award-${index}-date`] && errors[`award-${index}-date`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`award-${index}-date`]}</p>
              )}
            </div>

            <div>
              <label htmlFor={`award-${index}-description`} className="block text-sm font-medium text-foreground">
                Description
                <span className="text-sm text-foreground/60 ml-2">
                  ({(award.description || '').length}/500 characters)
                </span>
              </label>
              <textarea
                id={`award-${index}-description`}
                value={award.description}
                onChange={(e) => handleAwardChange(index, 'description', e.target.value)}
                onBlur={() => setTouched(prev => ({ ...prev, [`award-${index}-description`]: true }))}
                rows={3}
                maxLength={500}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`award-${index}-description`] && errors[`award-${index}-description`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`award-${index}-description`] && errors[`award-${index}-description`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`award-${index}-description`]}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveAward(index)}
                disabled={awards.length === 1}
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Remove Award
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleAddAward}
          variant="outline"
          size="sm"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Award
        </Button>
        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating}
        >
          <FaRobot className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Suggest with AI'}
        </Button>
      </div>

      {suggestedAwards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
        >
          <h4 className="text-sm font-medium text-foreground mb-2">AI Suggested Awards</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestedAwards.map((award, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200 transition-colors"
                onClick={() => {
                  handleAddAward();
                  handleAwardChange(awards.length, 'name', award);
                  toast.success(`Added \'${award}\' from suggestions!`);
                }}
              >
                {award} <FaPlus className="ml-2 h-3 w-3" />
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 