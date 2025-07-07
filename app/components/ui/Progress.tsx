import { motion } from 'framer-motion';

interface ProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const Progress = ({ steps, currentStep, className = '' }: ProgressProps) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className={`w-full ${className} bg-background`}>
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-foreground/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-background justify-center bg-blue-500"
          />
        </div>
      </div>
      <div className="flex justify-between mt-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex flex-col items-center ${
              index <= currentStep ? 'text-blue-600' : 'text-foreground/50'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-blue-600 text-background'
                  : 'bg-foreground/10 text-foreground/50'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Progress; 