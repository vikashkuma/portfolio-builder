'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import { Listbox } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { FaRobot, FaPlus, FaTrash } from 'react-icons/fa';
import { Education as PortfolioEducation } from '../../../types/portfolio';

const DEGREE_OPTIONS = [
  'Metric',
  'Higher Secondary Exam',
  'Senior Secondary',
  'Intermediate',
  'B.Sc.',
  'B.A.',
  'B.Tech',
  'B.Com',
  'M.Sc.',
  'M.A.',
  'MBA',
  'M.Tech',
  'PhD',
  'Other',
];
const FIELD_OPTIONS = [
  'Computer Science', 'Business', 'Engineering', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Psychology', 'Other'
];

interface Education {
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

interface EducationSectionProps {
  onUpdate: (data: { education: Education[] }) => void;
  initialData?: { education: Education[] };
}

export const EducationSection = ({ onUpdate, initialData }: EducationSectionProps) => {
  const [educations, setEducations] = useState<Education[]>(initialData?.education || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiGenerated, setAiGenerated] = useState('');
  const [aiLoading, setAiLoading] = useState<{ [id: string]: { degree: boolean; field: boolean; period: boolean; description: boolean } }>({});
  const [errors, setErrors] = useState<Record<string, { [key: string]: string | null }>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Effect to initialize touched and errors state for all education entries on load/change
  useEffect(() => {
    const initialTouched: Record<string, boolean> = {};
    const initialErrors: Record<string, { [key: string]: string | null }> = {};

    educations.forEach(edu => {
      initialTouched[`${edu.id}-school`] = false;
      initialTouched[`${edu.id}-degree`] = false;
      initialTouched[`${edu.id}-field`] = false;
      initialTouched[`${edu.id}-startDate`] = false;
      initialTouched[`${edu.id}-endDate`] = false;
      initialTouched[`${edu.id}-description`] = false;
      initialTouched[`${edu.id}-otherDegreeText`] = false;
      initialTouched[`${edu.id}-otherFieldText`] = false;
      initialErrors[edu.id] = {}; // Clear errors for all entries initially
    });

    setTouched(initialTouched);
    setErrors(initialErrors);
    console.log('useEffect [educations]: Initialized touched and errors', { initialTouched, initialErrors });
  }, [educations]); // Run when educations array itself changes (add/remove, or initialData)

  const validateEducationEntryPure = useCallback((edu: Education) => {
    const newErrors: { [key: string]: string | null } = {};

    if (!edu.school.trim()) {
      newErrors.school = 'School is required.';
    } else if (edu.school.length < 2) {
      newErrors.school = 'School name must be at least 2 characters long.';
    } else if (edu.school.length > 100) {
      newErrors.school = 'School name must not exceed 100 characters.';
    }

    // Validate degree based on whether 'Other' is selected
    if (edu.degree === 'Other') {
      if (!edu.otherDegreeText || !edu.otherDegreeText.trim()) {
        newErrors.degree = 'Please specify your degree.';
      } else if (edu.otherDegreeText.length < 2) {
        newErrors.degree = 'Specified degree must be at least 2 characters long.';
      } else if (edu.otherDegreeText.length > 100) {
        newErrors.degree = 'Specified degree must not exceed 100 characters.';
      }
    } else if (!edu.degree.trim()) {
      newErrors.degree = 'Degree is required.';
    } else if (edu.degree.length < 2) {
      newErrors.degree = 'Degree must be at least 2 characters long.';
    } else if (edu.degree.length > 100) {
      newErrors.degree = 'Degree must not exceed 100 characters.';
    }

    // Validate field based on whether 'Other' is selected
    if (edu.field === 'Other') {
      if (!edu.otherFieldText || !edu.otherFieldText.trim()) {
        newErrors.field = 'Please specify your field of study.';
      } else if (edu.otherFieldText.length < 2) {
        newErrors.field = 'Specified field must be at least 2 characters long.';
      } else if (edu.otherFieldText.length > 100) {
        newErrors.field = 'Specified field must not exceed 100 characters.';
      }
    } else if (!edu.field.trim()) {
      newErrors.field = 'Field of Study is required.';
    } else if (edu.field.length < 2) {
      newErrors.field = 'Field of Study must be at least 2 characters long.';
    } else if (edu.field.length > 100) {
      newErrors.field = 'Field of Study must not exceed 100 characters.';
    }

    if (!edu.startDate) {
      newErrors.startDate = 'Start Date is required.';
    } else if (!(edu.startDate instanceof Date) || isNaN(edu.startDate.getTime())) { // Check for invalid date objects
      newErrors.startDate = 'Invalid Start Date format.';
    }
    
    if (!edu.endDate) {
      newErrors.endDate = 'End Date is required.';
    } else if (edu.endDate.toString().toLowerCase() !== 'present' && (!(edu.endDate instanceof Date) || isNaN(edu.endDate.getTime()))) { // Check for invalid date objects unless 'present'
      newErrors.endDate = 'Invalid End Date format.';
    } else if (edu.startDate && edu.endDate && edu.endDate.toString().toLowerCase() !== 'present' && edu.startDate instanceof Date && edu.endDate instanceof Date && edu.startDate > edu.endDate) {
      newErrors.endDate = 'End Date cannot be before Start Date.';
    }

    if (!edu.description || !edu.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (edu.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters long.';
    } else if (edu.description.length > 1000) {
      newErrors.description = 'Description must not exceed 1000 characters.';
    }

    return newErrors;
  }, []);

  const validateAllEducationEntries = useCallback((entries: typeof educations) => {
    const allErrors: Record<string, { [key: string]: string | null }> = {};
    entries.forEach(edu => {
      const entryErrors = validateEducationEntryPure(edu);
      if (Object.keys(entryErrors).length > 0) {
        allErrors[edu.id] = entryErrors;
      }
    });
    return allErrors;
  }, [validateEducationEntryPure]);

  // Effect to re-validate whenever education entries change or touched state changes
  useEffect(() => {
    const newErrors: Record<string, { [key: string]: string | null }> = {};
    educations.forEach(edu => {
      const entryErrors = validateEducationEntryPure(edu);
      const touchedEntryErrors: { [key: string]: string | null } = {};
      Object.keys(entryErrors).forEach(field => {
        // Only include error if the field is touched
        if (touched[`${edu.id}-${field}` as keyof typeof touched]) {
          touchedEntryErrors[field] = entryErrors[field];
        }
      });
      if (Object.keys(touchedEntryErrors).length > 0) {
        newErrors[edu.id] = touchedEntryErrors;
      }
    });
    setErrors(newErrors);
    console.log('useEffect [educations, touched]: Re-validated. Current errors:', newErrors);
  }, [educations, touched, validateEducationEntryPure]);

  // Helper to format dates into a period string
  const formatPeriod = useCallback((startDate: Date | null | undefined, endDate: Date | null | undefined): string => {
    if (!startDate || !(startDate instanceof Date)) return '';

    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1; // getMonth() is 0-indexed
    const startFormatted = `${startYear}-${String(startMonth).padStart(2, '0')}`;

    if (!endDate) {
      return startFormatted;
    } else if (endDate.toString().toLowerCase() === 'present') {
      return `${startFormatted} - Present`;
    } else if (endDate instanceof Date) {
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth() + 1;
      const endFormatted = `${endYear}-${String(endMonth).padStart(2, '0')}`;
      return `${startFormatted} - ${endFormatted}`;
    }
    return startFormatted;
  }, []);

  // Effect to convert string dates to Date objects if initialData contains string dates
  useEffect(() => {
    if (initialData?.education) {
      const convertedEducations = initialData.education.map((edu: any) => ({
        ...edu,
        startDate: typeof edu.startDate === 'string' && edu.startDate ? new Date(edu.startDate) : edu.startDate,
        endDate: typeof edu.endDate === 'string' && edu.endDate && edu.endDate.toLowerCase() !== 'present' ? new Date(edu.endDate) : edu.endDate
      }));
      setEducations(convertedEducations);
    }
  }, [initialData]);

  // Ensure at least one education form is open by default without causing re-renders
  useEffect(() => {
    if (!initialData?.education || initialData.education.length === 0) {
      const newId = Date.now().toString();
      setEducations([{
        id: newId,
        school: '',
        degree: '',
        field: '',
        period: '',
        description: '',
        startDate: null,
        endDate: null,
        otherDegreeText: '',
        otherFieldText: '',
      }]);
      // Explicitly clear errors for new entry on initial load
      setErrors(prev => ({ ...prev, [newId]: {} }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]); // Only depends on initialData to create the first entry

  const handleAddEducation = (showToast: boolean = true) => {
    const newId = Date.now().toString();
    const newEducation: Education = {
      id: newId,
      school: '',
      degree: '',
      field: '',
      period: '',
      description: '',
      startDate: null,
      endDate: null,
      otherDegreeText: '',
      otherFieldText: '',
    };
    setEducations((prevEducations) => {
      const updatedEducations = [...prevEducations, newEducation];
      onUpdate({ education: updatedEducations });
      return updatedEducations;
    });
    // Explicitly clear errors for new entry when added via button
    setErrors(prev => ({ ...prev, [newId]: {} }));
    if (showToast) toast.success('New education entry added.');
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    setEducations((prevEducations) => {
      const updatedEducationsInternal = prevEducations.map(edu => {
        if (edu.id === id) {
          const newEdu = { ...edu, [field]: value };

          // Handle formatting of period string when dates are updated
          if (field === 'startDate' || field === 'endDate') {
            const newStartDate = field === 'startDate' ? value : newEdu.startDate;
            const newEndDate = field === 'endDate' ? value : newEdu.endDate;
            newEdu.period = formatPeriod(newStartDate, newEndDate);
          }

          // Special handling for 'Other' fields for internal component state
          if (field === 'degree') {
            if (value !== 'Other') {
              newEdu.otherDegreeText = ''; // Clear custom text if not 'Other'
            }
          } else if (field === 'field') {
            if (value !== 'Other') {
              newEdu.otherFieldText = ''; // Clear custom text if not 'Other'
            }
          }
          // No need to change `newEdu.degree` or `newEdu.field` when `otherDegreeText` or `otherFieldText` are typed
          // as these are directly bound to the dropdown. Their values should remain 'Other' for the input to show.

          console.log('handleUpdateEducation: Internal education state update', { id, field, value, newEdu });
          return newEdu;
        }
        return edu;
      });

      // Prepare data for onUpdate, potentially replacing 'Other' with custom text
      const dataForOnUpdate = updatedEducationsInternal.map(edu => {
        const finalEdu = { ...edu };
        if (finalEdu.degree === 'Other') {
          finalEdu.degree = finalEdu.otherDegreeText || ''; // Use empty string if custom text is empty
        }
        if (finalEdu.field === 'Other') {
          finalEdu.field = finalEdu.otherFieldText || ''; // Use empty string if custom text is empty
        }
        // Ensure period is always up-to-date in data sent to parent
        finalEdu.period = formatPeriod(finalEdu.startDate, finalEdu.endDate);
        return finalEdu;
      });

      onUpdate({ education: dataForOnUpdate }); // Pass the transformed data to onUpdate
      console.log('handleUpdateEducation: Data sent to onUpdate', dataForOnUpdate);

      return updatedEducationsInternal; // Update component's internal state with non-transformed data
    });
  };

  const handleBlur = (id: string, field: keyof Education) => {
    setTouched(prev => {
      const newState = { ...prev, [`${id}-${field}`]: true };
      console.log('handleBlur: Set touched for', { field: `${id}-${field}`, newState });
      return newState;
    });
  };

  const handleRemoveEducation = (id: string) => {
    if (educations.length === 1 && educations[0].id === id) {
      toast.error('You must have at least one education entry.');
      return;
    }
    setEducations((prevEducations) => {
      const updatedEducations = prevEducations.filter(edu => edu.id !== id);
      onUpdate({ education: updatedEducations });
      console.log('handleRemoveEducation: Removed education', updatedEducations);
      return updatedEducations;
    });

    // Clear touched state for the removed entry
    setTouched(prev => {
      const newTouched = { ...prev };
      Object.keys(newTouched).forEach(key => {
        if (key.startsWith(`${id}-`)) {
          delete newTouched[key];
        }
      });
      console.log('handleRemoveEducation: Cleared touched for removed entry', { id, newTouched });
      return newTouched;
    });
    toast.success('Education entry removed.');
  };

  // Helper to check if an education entry is valid based on current errors state
  const isEducationEntryValid = useCallback((eduId: string) => {
    const currentEntryErrors = errors[eduId];
    return !currentEntryErrors || Object.keys(currentEntryErrors).every(key => currentEntryErrors[key] === null);
  }, [errors]);

  const handleGenerateAI = async (id: string) => {
    const education = educations.find(edu => edu.id === id);
    if (!education) return;

    const entryErrors = validateEducationEntryPure(education);
    if (Object.keys(entryErrors).length > 0) {
      setErrors((prev) => ({ ...prev, [id]: entryErrors }));
      Object.keys(education).forEach(key => {
        if (key !== 'id' && key !== 'period') { // Exclude 'id' and 'period' from being touched directly for validation display
          setTouched(prev => ({ ...prev, [`${id}-${key}`]: true }));
        }
      });
      toast.error('Please fill in all required fields before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI description...');
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], description: true } }));
    try {
      const input = `School: ${education.school}\nDegree: ${education.degree}\nField: ${education.field}\nPeriod: ${education.period}\nDescription: ${education.description}`;
      const generated = await generateContent('education', input);
      const meaningfulContent = extractMeaningfulContent(generated);
      handleUpdateEducation(id, 'description', meaningfulContent);
      setAiGenerated(meaningfulContent);
      toast.success('AI description generated successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
      setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], description: false } }));
    }
  };

  // AI Suggestion Handlers
  const handleAISuggestDegree = async (id: string) => {
    const education = educations.find(edu => edu.id === id);
    if (!education) return;

    if (!education.school.trim()) {
      setErrors((prev) => ({ ...prev, [id]: { ...prev[id], school: 'School is required for degree suggestion.' } }));
      setTouched(prev => ({ ...prev, [`${id}-school`]: true }));
      toast.error('Please enter the School name to get degree suggestions.');
      return;
    }

    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], degree: true } }));
    const toastId = toast.loading('Suggesting degree...');
    try {
      const prompt = `Suggest the most likely degree for a student at ${education.school}. Only return the degree name as plain text.`;
      const aiResult = await generateContent('education', prompt);
      const suggestion = aiResult.split('\n')[0].trim();
      if (suggestion) {
        handleUpdateEducation(id, 'degree', suggestion);
        toast.success('Degree suggested!', { id: toastId });
      } else {
        toast.error('Could not suggest a degree. Try refining school name.', { id: toastId });
      }
    } catch (e) {
      console.error('Error suggesting degree:', e);
      toast.error('Failed to suggest degree. Please try again.', { id: toastId });
    }
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], degree: false } }));
  };

  const handleAISuggestField = async (id: string) => {
    const education = educations.find(edu => edu.id === id);
    if (!education) return;

    if (!education.school.trim() || !education.degree.trim()) {
      setErrors((prev) => ({ ...prev, [id]: { ...prev[id], school: 'School and Degree are required for field suggestion.', degree: 'School and Degree are required for field suggestion.' } }));
      setTouched(prev => ({ ...prev, [`${id}-school`]: true, [`${id}-degree`]: true }));
      toast.error('Please enter School and Degree to get field suggestions.');
      return;
    }

    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], field: true } }));
    const toastId = toast.loading('Suggesting field of study...');
    try {
      const prompt = `Suggest the most likely field of study for a student with degree ${education.degree} at ${education.school}. Only return the field name as plain text.`;
      const aiResult = await generateContent('education', prompt);
      const suggestion = aiResult.split('\n')[0].trim();
      if (suggestion) {
        handleUpdateEducation(id, 'field', suggestion);
        toast.success('Field of study suggested!', { id: toastId });
      } else {
        toast.error('Could not suggest a field. Try refining school/degree.', { id: toastId });
      }
    } catch (e) {
      console.error('Error suggesting field:', e);
      toast.error('Failed to suggest field. Please try again.', { id: toastId });
    }
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], field: false } }));
  };

  const handleAISuggestPeriod = async (id: string) => {
    const education = educations.find(edu => edu.id === id);
    if (!education) return;

    if (!education.school.trim() || !education.degree.trim() || !education.field.trim()) {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          school: 'School, Degree, and Field are required for period suggestion.',
          degree: 'School, Degree, and Field are required for period suggestion.',
          field: 'School, Degree, and Field are required for period suggestion.',
        },
      }));
      setTouched(prev => ({ ...prev, [`${id}-school`]: true, [`${id}-degree`]: true, [`${id}-field`]: true }));
      toast.error('Please enter School, Degree, and Field to get period suggestions.');
      return;
    }

    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], period: true } }));
    const toastId = toast.loading('Suggesting period...');
    try {
      const prompt = `Suggest a plausible start and end year (YYYY-YYYY format) for a student pursuing ${education.degree} in ${education.field} at ${education.school}. Only return the period in YYYY-YYYY format.`;
      const aiResult = await generateContent('education', prompt);
      const [startDateStr, endDateStr] = aiResult.split('-').map(s => s.trim());
      if (startDateStr && endDateStr) {
        handleUpdateEducation(id, 'startDate', new Date(`${startDateStr}-01-01`));
        handleUpdateEducation(id, 'endDate', new Date(`${endDateStr}-12-31`));
        toast.success('Period suggested!', { id: toastId });
      } else {
        toast.error('Could not suggest a period. Try refining school/degree/field.', { id: toastId });
      }
    } catch (e) {
      console.error('Error suggesting period:', e);
      toast.error('Failed to suggest period. Please try again.', { id: toastId });
    }
    setAiLoading((prev) => ({ ...prev, [id]: { ...prev[id], period: false } }));
  };

  const extractMeaningfulContent = (aiContent: string) => {
    let content = aiContent.replace(/<think>[\s\S]*?<\/think>/g, '');
    return content.trim();
  };

  const hasErrors = Object.values(errors).some(entryErrors => Object.values(entryErrors).some(error => error !== null));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Education</h2>
        <Button onClick={() => handleAddEducation()}>Add Education</Button>
      </div>

      {educations.map((education) => {
        const id = education.id;
        const currentErrors = errors[id] || {};
        return (
          <div key={id} className="space-y-4 p-4 border border-border rounded-lg">
            <div>
              <label htmlFor={`school-${id}`} className="block text-sm font-medium text-foreground">
                School
              </label>
              <input
                type="text"
                id={`school-${id}`}
                value={education.school}
                onChange={(e) => handleUpdateEducation(id, 'school', e.target.value)}
                onBlur={() => handleBlur(id, 'school')}
                placeholder="e.g., Stanford University"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`${id}-school`] && currentErrors.school ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`${id}-school`] && currentErrors.school && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.school}</p>
              )}
            </div>

            <div>
              <label htmlFor={`degree-${id}`} className="block text-sm font-medium text-foreground">
                Degree
              </label>
              <Listbox
                value={education.degree}
                onChange={(value) => {
                  handleUpdateEducation(id, 'degree', value);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className={`relative w-full cursor-default rounded-md border shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 pl-3 pr-10 text-left
                      ${touched[`${id}-degree`] && currentErrors.degree ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                    `}
                    onBlur={() => handleBlur(id, 'degree')}
                  >
                    <span className="block truncate">{education.degree || 'Select a degree'}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg className="h-5 w-5 text-foreground/60" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {DEGREE_OPTIONS.map((degreeOption) => (
                      <Listbox.Option
                        key={degreeOption}
                        value={degreeOption}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-blue-100 text-blue-900' : 'text-foreground'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {degreeOption}
                            </span>
                            {selected && (
                              <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-blue-900' : 'text-blue-600'}`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {touched[`${id}-degree`] && currentErrors.degree && <p className="text-red-500 text-sm mt-1">{currentErrors.degree}</p>}

              {education.degree === 'Other' && (
                <input
                  type="text"
                  id={`degree-other-${id}`}
                  value={education.otherDegreeText}
                  onChange={(e) => handleUpdateEducation(id, 'otherDegreeText', e.target.value)}
                  onBlur={() => handleBlur(id, 'otherDegreeText')}
                  placeholder="Specify your degree"
                  className={`mt-2 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${touched[`${id}-otherDegreeText`] && currentErrors.degree ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                  `}
                />
              )}
            </div>

            <div>
              <label htmlFor={`field-${id}`} className="block text-sm font-medium text-foreground flex items-center gap-2">
                Field of Study
                <Button size="sm" variant="outline" className="ml-2 flex items-center gap-1" onClick={() => handleAISuggestField(education.id)} disabled={aiLoading[education.id]?.field || !education.school.trim() || !(education.degree === 'Other' ? education.otherDegreeText?.trim() : education.degree.trim())}>
                  {aiLoading[education.id]?.field ? (
                    <><FaRobot className="animate-spin" /> Loading...</>
                  ) : 'Generate with AI'}
                </Button>
              </label>
              <Listbox
                value={education.field}
                onChange={(value) => {
                  handleUpdateEducation(id, 'field', value);
                }}
              >
                <div className="relative mt-1">
                  <Listbox.Button
                    className={`relative w-full cursor-default rounded-md border shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 py-2 pl-3 pr-10 text-left
                      ${touched[`${id}-field`] && currentErrors.field ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                    `}
                    onBlur={() => handleBlur(id, 'field')}
                  >
                    <span className="block truncate">{education.field || 'Select a field'}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <svg className="h-5 w-5 text-foreground/60" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-background py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {FIELD_OPTIONS.map((fieldOption) => (
                      <Listbox.Option
                        key={fieldOption}
                        value={fieldOption}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-3 pr-9 ${
                            active ? 'bg-blue-100 text-blue-900' : 'text-foreground'
                          }`
                        }
                      >
                        {({ selected, active }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {fieldOption}
                            </span>
                            {selected && (
                              <span className={`absolute inset-y-0 right-0 flex items-center pr-4 ${active ? 'text-blue-900' : 'text-blue-600'}`}>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
              {touched[`${id}-field`] && currentErrors.field && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.field}</p>
              )}

              {education.field === 'Other' && (
                <input
                  type="text"
                  id={`field-other-${id}`}
                  value={education.otherFieldText}
                  onChange={(e) => handleUpdateEducation(id, 'otherFieldText', e.target.value)}
                  onBlur={() => handleBlur(id, 'otherFieldText')}
                  placeholder="Specify your field of study"
                  className={`mt-2 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                    ${touched[`${id}-otherFieldText`] && currentErrors.field ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                  `}
                />
              )}
            </div>

            <div>
              <label htmlFor={`startDate-${id}`} className="block text-sm font-medium text-foreground">
                Start Date
              </label>
              <DatePicker
                selected={education.startDate}
                onChange={(date) => handleUpdateEducation(id, 'startDate', date)}
                onBlur={() => handleBlur(id, 'startDate')}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="YYYY-MM-DD"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`${id}-startDate`] && currentErrors.startDate ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`${id}-startDate`] && currentErrors.startDate && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.startDate}</p>
              )}
            </div>

            <div>
              <label htmlFor={`endDate-${id}`} className="block text-sm font-medium text-foreground">
                End Date
              </label>
              <DatePicker
                selected={education.endDate}
                onChange={(date) => handleUpdateEducation(id, 'endDate', date)}
                onBlur={() => handleBlur(id, 'endDate')}
                dateFormat="yyyy-MM-dd"
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                placeholderText="YYYY-MM-DD or Present"
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`${id}-endDate`] && currentErrors.endDate ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`${id}-endDate`] && currentErrors.endDate && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.endDate}</p>
              )}
            </div>

            <div>
              <label htmlFor={`description-${id}`} className="block text-sm font-medium text-foreground">
                Description
                <span className="text-sm text-foreground/60 ml-2">
                  ({education.description.length}/1000 characters)
                </span>
                <Button size="sm" variant="outline" className="ml-2 flex items-center gap-1" onClick={() => handleGenerateAI(education.id)} disabled={isGenerating || !education.school.trim() || !(education.degree === 'Other' ? education.otherDegreeText?.trim() : education.degree.trim()) || !(education.field === 'Other' ? education.otherFieldText?.trim() : education.field.trim())}>
                  {isGenerating ? (
                    <><FaRobot className="animate-spin" /> Loading...</>
                  ) : 'Generate with AI'}
                </Button>
              </label>
              <textarea
                id={`description-${id}`}
                value={education.description}
                onChange={(e) => handleUpdateEducation(id, 'description', e.target.value)}
                onBlur={() => handleBlur(id, 'description')}
                rows={4}
                maxLength={1000}
                className={`mt-1 block w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`${id}-description`] && currentErrors.description ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`${id}-description`] && currentErrors.description && (
                <p className="text-red-500 text-sm mt-1">{currentErrors.description}</p>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveEducation(id)}
                disabled={educations.length === 1}
              >
                <FaTrash className="h-4 w-4 mr-2" />
                Remove Education
              </Button>
            </div>
          </div>
        );
      })}

      <div className="flex justify-between mt-8">
        <Button
          onClick={() => handleAddEducation()}
          variant="outline"
          size="sm"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>
    </motion.div>
  );
}; 