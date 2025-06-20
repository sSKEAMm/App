import React, { useState, useEffect } from 'react';

interface RecipeGenerationSetupProps {
  currentNumPeople?: number;
  currentBudget?: string;
  onComplete: (numPeople: number, budget: string) => void;
  submitButtonText: string;
  formTitle: string;
}

const TOTAL_STEPS = 2;

const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
  <div className="flex justify-center space-x-2 mb-6">
    {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
      <div
        key={index}
        className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
          index === currentStep ? 'bg-green-500 scale-125' : 'bg-gray-300'
        } ${index < currentStep ? 'bg-green-400' : 'bg-gray-300'}`}
      ></div>
    ))}
  </div>
);

const RecipeGenerationSetup: React.FC<RecipeGenerationSetupProps> = ({
  currentNumPeople,
  currentBudget,
  onComplete,
  submitButtonText,
  formTitle,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [numPeople, setNumPeople] = useState<string>(currentNumPeople?.toString() || '2');
  const [budget, setBudget] = useState<string>(currentBudget || '');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setNumPeople(currentNumPeople?.toString() || '2');
    setBudget(currentBudget || '');
  }, [currentNumPeople, currentBudget]);

  const changeStep = (nextStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(nextStep);
      setIsAnimating(false);
    }, 150); // Matches animation duration
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      changeStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      changeStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const people = parseInt(numPeople);
    if (isNaN(people) || people <= 0) {
      // Basic validation, can be enhanced
      alert("Please enter a valid number of people.");
      return;
    }
    onComplete(people, budget);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Number of People
        return (
          <StepContainer title="How many people are eating?">
            <input
              type="number"
              id="numPeople"
              value={numPeople}
              onChange={(e) => setNumPeople(e.target.value)}
              min="1"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-lg"
              placeholder="e.g., 2"
              autoFocus
            />
          </StepContainer>
        );
      case 1: // Budget
        return (
          <StepContainer title="What's your budget? (Optional)">
            <input
              type="text"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-lg"
              placeholder="e.g., $5 per serving, $50 total"
            />
          </StepContainer>
        );
      default:
        return null;
    }
  };

  const StepContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className={`transition-opacity duration-150 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">{title}</h3>
      <div className="min-h-[100px] flex flex-col justify-center">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">
          {formTitle}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Step {currentStep + 1} of {TOTAL_STEPS}
        </p>
        <StepIndicator currentStep={currentStep} />
        <div className="mt-4">
          {renderStepContent()}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
        <button
          type="button"
          onClick={handlePrev}
          className={`px-6 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-200 transition-all duration-150
            ${currentStep === 0 ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
          disabled={currentStep === 0 || isAnimating}
        >
          &larr; Previous
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-8 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-150 transform hover:scale-105"
          disabled={isAnimating}
        >
          {currentStep === TOTAL_STEPS - 1 ? submitButtonText : "Next"} &rarr;
        </button>
      </div>
    </div>
  );
};

export default RecipeGenerationSetup;