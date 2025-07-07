'use client';

import { motion } from 'framer-motion';

interface Step {
  id: number;
  title: string;
  description: string;
}

interface StepTrackerProps {
  steps: Step[];
  currentStep: number;
}

export const StepTracker = ({ steps, currentStep }: StepTrackerProps) => {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
        {steps.map((step) => (
          <li key={step.id} className="md:flex-1">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${
                step.id <= currentStep
                  ? 'border-blue-600'
                  : 'border-gray-200'
              }`}
            >
              <span className="text-sm font-medium text-blue-600">
                Step {step.id}
              </span>
              <span className="text-sm font-medium">{step.title}</span>
              <span className="text-sm text-gray-500">{step.description}</span>
            </motion.div>
          </li>
        ))}
      </ol>
    </nav>
  );
}; 