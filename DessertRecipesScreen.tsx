import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Recipe, PantryItem, Cuisine, AppTab, UserProfile } from '../types';
import RecipeCard from './RecipeCard';
import RecipeGenerationSetup from './RecipeGenerationSetup';
import { CUISINE_OPTIONS } from '../constants';
import { generateRecipesWithGemini } from '../services/geminiService';
import SelectablePill from './SelectablePill';
import LoadingSpinner from './LoadingSpinner';

// Heart Icon
const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
);

// X (Dislike) Icon
const XMarkIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);


interface DessertRecipesScreenProps {
  userProfile: UserProfile;
  apiKey: string;
  recipes: Recipe[]; // All saved recipes, liked desserts will go here
  onAddRecipe: (recipe: Recipe) => void; 
  onUpdateShoppingList: (list: PantryItem[]) => void;
  onToggleFavorite: (recipeId: string) => void; 
  onDelete: (recipeId: string) => void; 
  setActiveTab: (tab: AppTab) => void;
  onRecipePreferencesUpdate: (numPeople: number, budget: string) => void;
  onDislikeRecipe: (recipe: Recipe) => void;
}

const DessertRecipesScreen: React.FC<DessertRecipesScreenProps> = ({
  userProfile,
  apiKey,
  // recipes prop is for all saved recipes, not directly used for display here, but for context
  onAddRecipe,
  onUpdateShoppingList,
  onToggleFavorite,
  // onDelete prop might not be used here if we don't show a list of saved desserts on this screen
  setActiveTab,
  onRecipePreferencesUpdate,
  onDislikeRecipe,
}) => {
  const [currentNumPeople, setCurrentNumPeople] = useState<number>(userProfile.lastNumPeople || 2); // For servings
  const [currentBudget, setCurrentBudget] = useState<string>(userProfile.lastBudget || ''); // For budget/occasion

  const [showSetupForm, setShowSetupForm] = useState<boolean>(true); // Start with setup
  const [generatedDesserts, setGeneratedDesserts] = useState<Recipe[]>([]);
  const [currentGeneratedDessertIndex, setCurrentGeneratedDessertIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentNumPeople(userProfile.lastNumPeople || 2);
    setCurrentBudget(userProfile.lastBudget || '');
    // No automatic form showing based on lastNumPeople like in RecipeList
    // This screen always starts with the intent to generate new desserts
  }, [userProfile.lastNumPeople, userProfile.lastBudget]);


  const handleGenerationSetupComplete = useCallback(async (numPeople: number, budget: string) => {
    setCurrentNumPeople(numPeople);
    setCurrentBudget(budget);
    onRecipePreferencesUpdate(numPeople, budget); // Save general prefs too

    if (!apiKey) {
      setError("API Key is not configured. Cannot generate desserts.");
      setIsLoading(false);
      setShowSetupForm(true);
      return;
    }
    if (!userProfile) {
        setError("User profile is not available.");
        setIsLoading(false);
        setShowSetupForm(true);
        return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedDesserts([]);
    setCurrentGeneratedDessertIndex(0);

    try {
      const currentProfileSnapshot = {...userProfile, lastNumPeople: numPeople, lastBudget: budget};
      const dessertsFromAI = await generateRecipesWithGemini(currentProfileSnapshot, numPeople, budget, 7, apiKey, 'Dessert'); // Specify 'Dessert' focus
      if (dessertsFromAI && dessertsFromAI.length > 0) {
        setGeneratedDesserts(dessertsFromAI.map(r => ({...r, imageUrl: `https://picsum.photos/seed/${r.id || r.name}/600/400` })));
        setShowSetupForm(false);
      } else {
        setError("No dessert recipes could be generated. Try adjusting your criteria or try again later.");
        setGeneratedDesserts([]); 
        setShowSetupForm(true);
      }
    } catch (err) {
      console.error("Error generating dessert recipes:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during dessert generation.");
      setGeneratedDesserts([]);
      setShowSetupForm(true);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, apiKey, onRecipePreferencesUpdate]);

  const handleLikeGeneratedDessert = () => {
    if (generatedDesserts.length === 0 || currentGeneratedDessertIndex >= generatedDesserts.length) return;
    const likedDessert = generatedDesserts[currentGeneratedDessertIndex];
    onAddRecipe({ ...likedDessert, isFavorite: true }); 
    
    if (currentGeneratedDessertIndex < generatedDesserts.length - 1) {
      setCurrentGeneratedDessertIndex(prev => prev + 1);
    } else {
      setGeneratedDesserts([]); 
      setCurrentGeneratedDessertIndex(0);
      // Maybe show a message or redirect to favorites/home
    }
  };

  const handleDislikeGeneratedDessert = () => {
    if (generatedDesserts.length === 0 || currentGeneratedDessertIndex >= generatedDesserts.length) return;
    const dislikedDessert = generatedDesserts[currentGeneratedDessertIndex];
    onDislikeRecipe(dislikedDessert); 
    
     if (currentGeneratedDessertIndex < generatedDesserts.length - 1) {
      setCurrentGeneratedDessertIndex(prev => prev + 1);
    } else {
      setGeneratedDesserts([]); 
      setCurrentGeneratedDessertIndex(0);
    }
  };
  
  const currentGeneratedDessert = (generatedDesserts.length > 0 && currentGeneratedDessertIndex < generatedDesserts.length) ? generatedDesserts[currentGeneratedDessertIndex] : null;

  if (!userProfile) {
    return (
        <div className="p-4 text-center">
            <p className="text-red-500">User profile not loaded. Please complete onboarding.</p>
            <button 
                onClick={() => setActiveTab(AppTab.PROFILE_SETTINGS)} 
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Go to Profile Setup
            </button>
        </div>
    );
  }
  
  if (showSetupForm || (isLoading && generatedDesserts.length === 0 && !currentGeneratedDessert)) {
    return (
        <div>
            <RecipeGenerationSetup
                currentNumPeople={currentNumPeople}
                currentBudget={currentBudget}
                onComplete={handleGenerationSetupComplete}
                submitButtonText={isLoading ? "Baking..." : "🍰 Find Desserts"}
                formTitle="What kind of dessert are you craving?"
            />
            {isLoading && <div className="text-center p-10"><LoadingSpinner size="lg" color="text-pink-500" /> <p className="mt-2 text-gray-600">Whipping up some dessert ideas...</p></div>}
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md mt-4 text-center">{error}</p>}
        </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-pink-600">
          New Dessert Suggestions
        </h2>
        <button
            onClick={() => { setGeneratedDesserts([]); setCurrentGeneratedDessertIndex(0); setShowSetupForm(true); }}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md"
        >
            New Dessert Search
        </button>
      </div>
      
      {isLoading && !currentGeneratedDessert && (
         <div className="flex-grow flex flex-col items-center justify-center p-10">
            <LoadingSpinner size="lg" color="text-pink-500" />
            <p className="mt-2 text-gray-600">Searching for delicious desserts...</p>
        </div>
      )}

      {/* Generated Desserts Swipe/Card View */}
      {currentGeneratedDessert && !isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-2">
          <div className="w-full max-w-sm">
             <RecipeCard
                key={currentGeneratedDessert.id || currentGeneratedDessert.name}
                recipe={currentGeneratedDessert}
                onUpdateShoppingList={onUpdateShoppingList}
                setActiveTab={setActiveTab}
                isGenerated={true}
             />
          </div>
          <div className="flex justify-around w-full max-w-xs mt-4">
            <button
              onClick={handleDislikeGeneratedDessert}
              className="p-4 bg-red-100 rounded-full shadow-md hover:bg-red-200 transition-colors"
              aria-label="Dislike Dessert"
            >
              <XMarkIcon className="h-8 w-8 text-red-500" />
            </button>
            <button
              onClick={handleLikeGeneratedDessert}
              className="p-4 bg-green-100 rounded-full shadow-md hover:bg-green-200 transition-colors"
              aria-label="Like Dessert"
            >
              <HeartIcon className="h-8 w-8 text-green-500" />
            </button>
          </div>
           <p className="text-sm text-gray-500">
            Suggestion {currentGeneratedDessertIndex + 1} of {generatedDesserts.length}
          </p>
        </div>
      )}
      
      {!currentGeneratedDessert && !isLoading && generatedDesserts.length > 0 && currentGeneratedDessertIndex >= generatedDesserts.length && (
         <div className="text-center p-6 flex-grow flex flex-col justify-center items-center">
            <p className="text-lg text-gray-700 mb-2">All dessert suggestions reviewed!</p>
            <p className="text-sm text-gray-500 mb-4">You've gone through all the new sweet treats.</p>
            <button
                onClick={() => { setGeneratedDesserts([]); setCurrentGeneratedDessertIndex(0); setShowSetupForm(true); }}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md"
            >
                Find More Desserts
            </button>
        </div>
      )}
      
      {/* Fallback if no desserts were generated and not loading/erroring */}
      {!currentGeneratedDessert && !isLoading && generatedDesserts.length === 0 && !showSetupForm && !error && (
         <div className="text-center p-6 flex-grow flex flex-col justify-center items-center">
            <p className="text-lg text-gray-700 mb-2">No desserts found with current settings.</p>
            <button
                onClick={() => { setShowSetupForm(true); }}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-md"
            >
                Try a New Dessert Search
            </button>
        </div>
      )}

    </div>
  );
};

export default DessertRecipesScreen;