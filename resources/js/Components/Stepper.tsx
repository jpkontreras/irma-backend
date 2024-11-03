import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { __ } from 'laravel-translator';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface Step {
  id: number;
  name: string;
  isActive: boolean;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

export function Stepper({ steps, currentStep, onStepChange }: StepperProps) {
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepsRef.current) {
      const activeStep = stepsRef.current.querySelector('[data-active="true"]');
      if (activeStep) {
        activeStep.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [currentStep]);

  const handlePrevious = () => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      onStepChange(currentStep + 1);
    }
  };

  return (
    <Card className="relative mb-6 flex items-center gap-2 p-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={handlePrevious}
        disabled={currentStep === 0}
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">{__('messages.previous_menu')}</span>
      </Button>

      <div
        ref={stepsRef}
        className="scrollbar-none flex-1 space-x-1 overflow-x-auto scroll-smooth whitespace-nowrap px-2"
      >
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => onStepChange(index)}
            data-active={currentStep === index}
            className={cn(
              'inline-flex h-8 items-center rounded-full px-4 text-sm font-medium transition-colors',
              currentStep === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted-foreground/10',
            )}
          >
            {step.name}
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleNext}
        disabled={currentStep === steps.length - 1}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">{__('messages.next_menu')}</span>
      </Button>
    </Card>
  );
}
