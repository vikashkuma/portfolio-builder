'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../../ui/Button';
import { generateContent } from '../../../utils/ai';
import toast from 'react-hot-toast';
import { FaPlus, FaTrash, FaRobot, FaCheck } from 'react-icons/fa';

interface SkillsSectionProps {
  onUpdate: (data: any) => void;
  initialData?: any;
}

export const SkillsSection = ({ onUpdate, initialData }: SkillsSectionProps) => {
  const [skills, setSkills] = useState<Array<{ name: string; level: string }>>(
    initialData?.skills || [{ name: '', level: 'Beginner' }]
  );
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Pure validation function
  const validateSkillsPure = useCallback((skillsList: typeof skills) => {
    const newErrors: { [key: string]: string | null } = {};

    skillsList.forEach((skill, index) => {
      if (!skill.name.trim()) {
        newErrors[`skill-${index}`] = 'Skill name is required.';
      } else if (skill.name.length < 2) {
        newErrors[`skill-${index}`] = 'Skill name must be at least 2 characters long.';
      } else if (skill.name.length > 50) {
        newErrors[`skill-${index}`] = 'Skill name must not exceed 50 characters.';
      }
    });

    return newErrors;
  }, []);

  // Effect to re-validate whenever skills change
  useEffect(() => {
    const newErrors = validateSkillsPure(skills);
    setErrors(newErrors);
  }, [skills, validateSkillsPure]);

  const handleSkillChange = (index: number, field: 'name' | 'level', value: string) => {
    const newSkills = [...skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setSkills(newSkills);
    setTouched(prev => ({ ...prev, [`skill-${index}`]: true }));
    onUpdate({ skills: newSkills });
  };

  const handleAddSkill = () => {
    const newSkills = [...skills, { name: '', level: 'Beginner' }];
    setSkills(newSkills);
    onUpdate({ skills: newSkills });
  };

  const handleRemoveSkill = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
    onUpdate({ skills: newSkills });

    const newTouched = { ...touched };
    delete newTouched[`skill-${index}`];
    setTouched(newTouched);
  };

  const handleGenerateAI = async () => {
    const newErrors = validateSkillsPure(skills);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      skills.forEach((_, index) => setTouched(prev => ({ ...prev, [`skill-${index}`]: true })));
      toast.error('Please fix the errors before generating AI content.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Generating AI content...');
    try {
      const input = `Current skills: ${skills.map(s => `${s.name} (${s.level})`).join(', ')}`;
      const generated = await generateContent('skills', input);
      const skillsList = generated.split(',').map(s => s.trim());
      setSuggestedSkills(skillsList);
      toast.success('AI content generated successfully!', { id: toastId });
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate AI content. Please try again.', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddSelectedSkills = () => {
    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill to add.');
      return;
    }

    const newSkills = [
      ...skills,
      ...selectedSkills.map(skill => ({ name: skill, level: 'Beginner' }))
    ];
    setSkills(newSkills);
    onUpdate({ skills: newSkills });
    setSelectedSkills([]);
    setSuggestedSkills([]);
    toast.success('Selected skills added successfully!');
  };

  const handleSelectSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleBlur = (index: number, field: 'name' | 'level') => {
    setTouched(prev => ({ ...prev, [`skill-${index}`]: true }));
  };

  const hasErrors = Object.values(errors).some(error => error !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 bg-background text-foreground border border-border rounded-xl p-6"
    >
      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="text"
                value={skill.name}
                onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                onBlur={() => handleBlur(index, 'name')}
                placeholder="Skill name"
                className={`w-full rounded-md border shadow-sm focus:border-blue-500 focus:ring-blue-500
                  ${touched[`skill-${index}`] && errors[`skill-${index}`] ? 'border-red-500 bg-red-50/10 text-red-700' : 'border-border bg-background text-foreground'}
                `}
              />
              {touched[`skill-${index}`] && errors[`skill-${index}`] && (
                <p className="text-red-500 text-sm mt-1">{errors[`skill-${index}`]}</p>
              )}
            </div>
            <select
              value={skill.level}
              onChange={(e) => handleSkillChange(index, 'level', e.target.value)}
              onBlur={() => handleBlur(index, 'level')}
              className="rounded-md border border-border bg-background text-foreground shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleRemoveSkill(index)}
              disabled={skills.length === 1}
            >
              <FaTrash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button
          onClick={handleAddSkill}
          variant="outline"
          size="sm"
        >
          <FaPlus className="h-4 w-4 mr-2" />
          Add Skill
        </Button>
        <Button
          onClick={handleGenerateAI}
          disabled={isGenerating}
        >
          <FaRobot className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>

      {suggestedSkills.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-background text-foreground rounded-lg border border-border"
        >
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-foreground">Suggested Skills</h4>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(suggestedSkills.join(', '));
                toast.success('Suggested skills copied to clipboard!');
              }}
            >
              Copy All
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map((skill, index) => (
              <button
                key={index}
                onClick={() => handleSelectSkill(skill)}
                className={`px-3 py-1 rounded-full text-sm transition-colors
                  ${selectedSkills.includes(skill)
                    ? 'bg-blue-500 text-white'
                    : 'bg-background text-foreground border border-border hover:bg-foreground/5'
                  }
                `}
              >
                {skill}
                {selectedSkills.includes(skill) && (
                  <FaCheck className="inline-block ml-2 h-3 w-3" />
                )}
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={handleAddSelectedSkills}
              disabled={selectedSkills.length === 0}
              variant="secondary"
              size="sm"
            >
              Add Selected Skills
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}; 