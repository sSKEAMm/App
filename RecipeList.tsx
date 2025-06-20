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


interface RecipeListProps {
  userProfile: UserProfile;
  apiKey: string;
  recipes: Recipe[]; // Saved recipes
  onAddRecipe: (recipe: Recipe) => void; 
  onUpdateShoppingList: (list: PantryItem[]) => void;
  onToggleFavorite: (recipeId: string) => void; 
  onDelete: (recipeId: string) => void; 
  setActiveTab: (tab: AppTab) => void;
  onRecipePreferencesUpdate: (numPeople: number, budget: string) => void;
  onDislikeRecipe: (recipe: Recipe) => void; // Changed from onUpdateDislikedRecipeName
}

const RecipeList: React.FC<RecipeListProps> = ({
  userProfile,
  apiKey,
  recipes,
  onAddRecipe,
  onUpdateShoppingList,
  onToggleFavorite,
  onDelete,
  setActiveTab,
  onRecipePreferencesUpdate,
  onDislikeRecipe, // Changed
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<Cuisine[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [currentNumPeople, setCurrentNumPeople] = useState<number>(userProfile.lastNumPeople || 2);
  const [currentBudget, setCurrentBudget] = useState<string>(userProfile.lastBudget || '');

  const [showSetupForm, setShowSetupForm] = useState<boolean>(!userProfile.lastNumPeople);
  const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
  const [currentGeneratedRecipeIndex, setCurrentGeneratedRecipeIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    setCurrentNumPeople(userProfile.lastNumPeople || 2);
    setCurrentBudget(userProfile.lastBudget || '');
    if (typeof userProfile.lastNumPeople === 'undefined') {
        setShowSetupForm(true);
    }
  }, [userProfile.lastNumPeople, userProfile.lastBudget]);


  const handleGenerationSetupComplete = useCallback(async (numPeople: number, budget: string) => {
    setCurrentNumPeople(numPeople);
    setCurrentBudget(budget);
    onRecipePreferencesUpdate(numPeople, budget);

    if (!apiKey) {
      setError("API Key is not configured. Cannot generate recipes.");
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
    setGeneratedRecipes([]);
    setCurrentGeneratedRecipeIndex(0);

    try {
      // Pass the updated userProfile that might include newly set dislikedRecipes
      const currentProfileSnapshot = {...userProfile, lastNumPeople: numPeople, lastBudget: budget};
      const recipesFromAI = await generateRecipesWithGemini(currentProfileSnapshot, numPeople, budget, 7, apiKey);
      if (recipesFromAI && recipesFromAI.length > 0) {
        setGeneratedRecipes(recipesFromAI.map(r => ({...r, imageUrl: `https://picsum.photos/seed/${r.id || r.name}/600/400` })));
        setShowSetupForm(false);
      } else {
        setError("No recipes could be generated. Try adjusting your criteria or try again later.");
        setGeneratedRecipes([]); 
        setShowSetupForm(true);
      }
    } catch (err) {
      console.error("Error generating recipes:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during generation.");
      setGeneratedRecipes([]);
      setShowSetupForm(true);
    } finally {
      setIsLoading(false);
    }
  }, [userProfile, apiKey, onRecipePreferencesUpdate]);

  const handleLikeGeneratedRecipe = () => {
    if (generatedRecipes.length === 0 || currentGeneratedRecipeIndex >= generatedRecipes.length) return;
    const likedRecipe = generatedRecipes[currentGeneratedRecipeIndex];
    onAddRecipe({ ...likedRecipe, isFavorite: true }); 
    
    if (currentGeneratedRecipeIndex < generatedRecipes.length - 1) {
      setCurrentGeneratedRecipeIndex(prev => prev + 1);
    } else {
      setGeneratedRecipes([]); 
      setCurrentGeneratedRecipeIndex(0);
    }
  };

  const handleDislikeGeneratedRecipe = () => {
    if (generatedRecipes.length === 0 || currentGeneratedRecipeIndex >= generatedRecipes.length) return;
    const dislikedRecipe = generatedRecipes[currentGeneratedRecipeIndex];
    onDislikeRecipe(dislikedRecipe); // Pass full recipe object
    
     if (currentGeneratedRecipeIndex < generatedRecipes.length - 1) {
      setCurrentGeneratedRecipeIndex(prev => prev + 1);
    } else {
      setGeneratedRecipes([]); 
      setCurrentGeneratedRecipeIndex(0);
    }
  };

  const filteredSavedRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      const matchesSearchTerm = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCuisine = selectedCuisines.length === 0 || (recipe.cuisineType && selectedCuisines.includes(recipe.cuisineType));
      const matchesFavorites = !showFavoritesOnly || recipe.isFavorite;
      
      return matchesSearchTerm && matchesCuisine && matchesFavorites;
    }).sort((a,b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0) || a.name.localeCompare(b.name));
  }, [recipes, searchTerm, selectedCuisines, showFavoritesOnly]);

  const currentDisplayMode = generatedRecipes.length > 0 && currentGeneratedRecipeIndex < generatedRecipes.length ? 'generated_swipe' : 'saved';
  const currentGeneratedRecipe = (currentDisplayMode === 'generated_swipe') ? generatedRecipes[currentGeneratedRecipeIndex] : null;


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
  
  if (showSetupForm || (isLoading && generatedRecipes.length === 0 && currentDisplayMode !== 'generated_swipe')) {
    return (
        <div>
            <RecipeGenerationSetup
                currentNumPeople={currentNumPeople}
                currentBudget={currentBudget}
                onComplete={handleGenerationSetupComplete}
                submitButtonText={isLoading ? "Generating..." : "✨ Generate Recipes"}
                formTitle="Let's find some recipes!"
            />
            {isLoading && <div className="text-center p-10"><LoadingSpinner size="lg" color="text-green-500" /> <p className="mt-2 text-gray-600">Generating recipes...</p></div>}
            {error && <p className="text-red-500 text-sm bg-red-100 p-2 rounded-md mt-4 text-center">{error}</p>}
        </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-600">
          {currentDisplayMode === 'generated_swipe' ? 'New Recipe Suggestions' : 'My Saved Recipes'}
        </h2>
        <button
            onClick={() => { setGeneratedRecipes([]); setCurrentGeneratedRecipeIndex(0); setShowSetupForm(true); }}
            className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-3 rounded-md"
        >
            New Search / Settings
        </button>
      </div>
      
      {isLoading && currentDisplayMode === 'generated_swipe' && !currentGeneratedRecipe && (
         <div className="flex-grow flex flex-col items-center justify-center p-10">
            <LoadingSpinner size="lg" color="text-green-500" />
            <p className="mt-2 text-gray-600">Generating your personalized recipes...</p>
        </div>
      )}

      {/* Generated Recipes Swipe/Card View */}
      {currentDisplayMode === 'generated_swipe' && currentGeneratedRecipe && !isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-2">
          <div className="w-full max-w-sm">
             <RecipeCard
                key={currentGeneratedRecipe.id || currentGeneratedRecipe.name} // Use name as fallback if id is not yet stable for generated
                recipe={currentGeneratedRecipe}
                onUpdateShoppingList={onUpdateShoppingList}
                setActiveTab={setActiveTab}
                isGenerated={true}
             />
          </div>
          <div className="flex justify-around w-full max-w-xs mt-4">
            <button
              onClick={handleDislikeGeneratedRecipe}
              className="p-4 bg-red-100 rounded-full shadow-md hover:bg-red-200 transition-colors"
              aria-label="Dislike Recipe"
            >
              <XMarkIcon className="h-8 w-8 text-red-500" />
            </button>
            <button
              onClick={handleLikeGeneratedRecipe}
              className="p-4 bg-green-100 rounded-full shadow-md hover:bg-green-200 transition-colors"
              aria-label="Like Recipe"
            >
              <HeartIcon className="h-8 w-8 text-green-500" />
            </button>
          </div>
           <p className="text-sm text-gray-500">
            Suggestion {currentGeneratedRecipeIndex + 1} of {generatedRecipes.length}
          </p>
        </div>
      )}
      
      {currentDisplayMode === 'generated_swipe' && !currentGeneratedRecipe && !isLoading && generatedRecipes.length > 0 && (
         <div className="text-center p-6 flex-grow flex flex-col justify-center items-center">
            <p className="text-lg text-gray-700 mb-2">All suggestions reviewed!</p>
            <p className="text-sm text-gray-500 mb-4">You've gone through all the new recipes.</p>
            <button
                onClick={() => { setGeneratedRecipes([]); setCurrentGeneratedRecipeIndex(0); setShowSetupForm(true); }}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
            >
                Find More Recipes
            </button>
        </div>
      )}


      {/* Saved Recipes View */}
      {currentDisplayMode === 'saved' && (
        <>
          {recipes.length > 0 && (
            <div className="p-4 bg-white shadow rounded-lg space-y-3">
                <input
                type="text"
                placeholder="Search saved recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Filter by Cuisine:</h4>
                    <div className="flex flex-wrap gap-2">
                        {CUISINE_OPTIONS.map(cuisine => (
                            <SelectablePill 
                                key={cuisine}
                                label={cuisine}
                                isSelected={selectedCuisines.includes(cuisine)}
                                onSelect={() => setSelectedCuisines(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine])}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="favoritesOnlySaved"
                        checked={showFavoritesOnly}
                        onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="favoritesOnlySaved" className="ml-2 block text-sm text-gray-900">
                        Show Favorites Only
                    </label>
                </div>
            </div>
          )}

          {!isLoading && filteredSavedRecipes.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              {recipes.length === 0 ? "You haven't saved any recipes yet. Click 'New Search / Settings' to find some!" : "No saved recipes match your current filters."}
            </p>
          )}

          {!isLoading && filteredSavedRecipes.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {filteredSavedRecipes.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onUpdateShoppingList={onUpdateShoppingList}
                  onToggleFavorite={onToggleFavorite}
                  onDelete={onDelete}
                  setActiveTab={setActiveTab}
                  isGenerated={false}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipeList;