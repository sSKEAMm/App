
import React, { useState, useEffect } from 'react';
import { UserProfile, DietaryRequirement, Cuisine, KitchenEquipment, SkillLevel } from '../types';
import { DIETARY_REQUIREMENTS_OPTIONS, CUISINE_OPTIONS, KITCHEN_EQUIPMENT_OPTIONS, SKILL_LEVEL_OPTIONS, DEFAULT_USER_PROFILE_NAME } from '../constants';
import SelectablePill from './SelectablePill';

interface OnboardingFormProps {
  onSave: (profile: UserProfile) => void;
  currentProfile: UserProfile | null;
}

const TOTAL_STEPS = 7;

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

const OnboardingForm: React.FC<OnboardingFormProps> = ({ onSave, currentProfile }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [name, setName] = useState(currentProfile?.name || DEFAULT_USER_PROFILE_NAME);
  const [dietaryRequirements, setDietaryRequirements] = useState<DietaryRequirement[]>(currentProfile?.dietaryRequirements || []);
  const [allergies, setAllergies] = useState<string[]>(currentProfile?.allergies || []);
  const [currentAllergy, setCurrentAllergy] = useState('');
  const [cuisinePreferences, setCuisinePreferences] = useState<Cuisine[]>(currentProfile?.cuisinePreferences || []);
  const [dislikedCuisines, setDislikedCuisines] = useState<Cuisine[]>(currentProfile?.dislikedCuisines || []);
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(currentProfile?.skillLevel || SkillLevel.BEGINNER);
  const [kitchenEquipment, setKitchenEquipment] = useState<KitchenEquipment[]>(currentProfile?.kitchenEquipment || []);

  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || DEFAULT_USER_PROFILE_NAME);
      setDietaryRequirements(currentProfile.dietaryRequirements || []);
      setAllergies(currentProfile.allergies || []);
      setCuisinePreferences(currentProfile.cuisinePreferences || []);
      setDislikedCuisines(currentProfile.dislikedCuisines || []);
      setSkillLevel(currentProfile.skillLevel || SkillLevel.BEGINNER);
      setKitchenEquipment(currentProfile.kitchenEquipment || []);
    }
  }, [currentProfile]);

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
      // This is the final step, so submit
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      changeStep(currentStep - 1);
    }
  };
  
  const toggleSelection = <T,>(value: T, currentSelection: T[], setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter(
      currentSelection.includes(value)
        ? currentSelection.filter(item => item !== value)
        : [...currentSelection, value]
    );
  };

  const handleAddAllergy = () => {
    if (currentAllergy.trim() && !allergies.includes(currentAllergy.trim())) {
      setAllergies([...allergies, currentAllergy.trim()]);
      setCurrentAllergy('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove: string) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const handleSubmit = () => {
    const profileToSave: UserProfile = {
      ...(currentProfile || {} as UserProfile),
      name,
      dietaryRequirements,
      allergies,
      cuisinePreferences,
      dislikedCuisines,
      skillLevel,
      kitchenEquipment,
      setupComplete: true,
    };
    onSave(profileToSave);
  };
  
  const isEditing = currentProfile?.setupComplete;
  const mainTitle = isEditing ? "Update Your Profile" : "Tell Us About Yourself";

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Name
        return (
          <StepContainer title="What should we call you?">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-lg"
              placeholder={DEFAULT_USER_PROFILE_NAME}
              autoFocus
            />
          </StepContainer>
        );
      case 1: // Dietary Requirements
        return (
          <StepContainer title="Any dietary requirements?">
            <div className="flex flex-wrap justify-center gap-3">
              {DIETARY_REQUIREMENTS_OPTIONS.map(option => (
                <SelectablePill
                  key={option}
                  label={option}
                  isSelected={dietaryRequirements.includes(option)}
                  onSelect={() => toggleSelection(option, dietaryRequirements, setDietaryRequirements)}
                />
              ))}
            </div>
          </StepContainer>
        );
      case 2: // Allergies
        return (
          <StepContainer title="Allergies or intolerances?">
            <div className="flex items-center gap-2 mb-3">
              <input
                type="text"
                value={currentAllergy}
                onChange={(e) => setCurrentAllergy(e.target.value)}
                placeholder="e.g., Peanuts, Shellfish"
                className="flex-grow mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-base"
              />
              <button type="button" onClick={handleAddAllergy} className="px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-semibold">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {allergies.map(allergy => (
                <div key={allergy} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-sm flex items-center shadow-sm">
                  {allergy}
                  <button type="button" onClick={() => handleRemoveAllergy(allergy)} className="ml-2 text-red-500 hover:text-red-700 text-lg leading-none">&times;</button>
                </div>
              ))}
            </div>
          </StepContainer>
        );
      case 3: // Cuisine Preferences
        return (
          <StepContainer title="What are your favorite cuisines?">
            <div className="flex flex-wrap justify-center gap-3">
              {CUISINE_OPTIONS.map(option => (
                <SelectablePill
                  key={option}
                  label={option}
                  isSelected={cuisinePreferences.includes(option)}
                  onSelect={() => toggleSelection(option, cuisinePreferences, setCuisinePreferences)}
                />
              ))}
            </div>
          </StepContainer>
        );
      case 4: // Disliked Cuisines
        return (
          <StepContainer title="Any cuisines you'd rather avoid? (Optional)">
            <div className="flex flex-wrap justify-center gap-3">
              {CUISINE_OPTIONS.filter(opt => !cuisinePreferences.includes(opt)).map(option => (
                <SelectablePill
                  key={`dislike-${option}`}
                  label={option}
                  isSelected={dislikedCuisines.includes(option)}
                  onSelect={() => toggleSelection(option, dislikedCuisines, setDislikedCuisines)}
                  colorConfig={{selectedBg: 'bg-red-500', selectedText: 'text-white', defaultBg: 'bg-gray-200', defaultText: 'text-gray-700'}}
                />
              ))}
            </div>
          </StepContainer>
        );
      case 5: // Skill Level
        return (
          <StepContainer title="How would you rate your cooking skills?">
            <div className="flex flex-wrap justify-center gap-3">
              {SKILL_LEVEL_OPTIONS.map(option => (
                <SelectablePill
                  key={option}
                  label={option}
                  isSelected={skillLevel === option}
                  onSelect={() => setSkillLevel(option)}
                />
              ))}
            </div>
          </StepContainer>
        );
      case 6: // Kitchen Equipment
        return (
          <StepContainer title="What kitchen equipment do you have?">
            <div className="flex flex-wrap justify-center gap-3">
              {KITCHEN_EQUIPMENT_OPTIONS.map(option => (
                <SelectablePill
                  key={option}
                  label={option}
                  isSelected={kitchenEquipment.includes(option)}
                  onSelect={() => toggleSelection(option, kitchenEquipment, setKitchenEquipment)}
                />
              ))}
            </div>
          </StepContainer>
        );
      default:
        return null;
    }
  };

  const StepContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className={`transition-opacity duration-150 ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
      <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">{title}</h3>
      <div className="min-h-[150px] flex flex-col justify-center">
        {children}
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-white rounded-lg shadow-xl flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-green-600 mb-2 text-center">
          {mainTitle}
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
          {currentStep === TOTAL_STEPS - 1 ? (isEditing ? "Update Profile" : "Save & Start Cooking!") : "Next"} &rarr;
        </button>
      </div>
    </div>
  );
};

export default OnboardingForm;
