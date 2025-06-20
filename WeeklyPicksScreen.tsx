import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Recipe, AppTab, PantryItem } from '../types';
import RecipeCard from './RecipeCard'; // Use existing RecipeCard for selection UI
import Pill from './Pill';

interface WeeklyPicksScreenProps {
  userProfile: UserProfile;
  allSavedRecipes: Recipe[];
  onSetWeeklyPlan: (recipeIds: string[]) => void;
  onUpdateShoppingList: (list: PantryItem[]) => void;
  setActiveTab: (tab: AppTab) => void;
}

const WeeklyPicksScreen: React.FC<WeeklyPicksScreenProps> = ({
  userProfile,
  allSavedRecipes,
  onSetWeeklyPlan,
  onUpdateShoppingList,
  setActiveTab
}) => {
  const [editingPlan, setEditingPlan] = useState(true);
  const [currentSelectedIds, setCurrentSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    if (userProfile.weeklyPlanRecipeIds && userProfile.weeklyPlanRecipeIds.length > 0) {
      setCurrentSelectedIds([...userProfile.weeklyPlanRecipeIds]);
      setEditingPlan(false);
    } else {
      setEditingPlan(true);
      setCurrentSelectedIds([]);
    }
  }, [userProfile.weeklyPlanRecipeIds]);

  const plannedRecipes = useMemo(() => {
    return currentSelectedIds
      .map(id => allSavedRecipes.find(recipe => recipe.id === id))
      .filter(Boolean) as Recipe[];
  }, [currentSelectedIds, allSavedRecipes]);

  const favoriteRecipesForSelection = useMemo(() => {
    return allSavedRecipes.filter(r => r.isFavorite);
  }, [allSavedRecipes]);

  const toggleRecipeInPlan = (recipeId: string) => {
    setCurrentSelectedIds(prevIds =>
      prevIds.includes(recipeId)
        ? prevIds.filter(id => id !== recipeId)
        : [...prevIds, recipeId]
    );
  };

  const handleSavePlan = () => {
    onSetWeeklyPlan([...currentSelectedIds]);
    setEditingPlan(false);
  };

  const handleEditPlan = () => {
    setCurrentSelectedIds([...userProfile.weeklyPlanRecipeIds]);
    setEditingPlan(true);
  };

  const handleClearPlan = () => {
    if (window.confirm("Are you sure you want to clear your weekly plan?")) {
        onSetWeeklyPlan([]);
        setCurrentSelectedIds([]);
        setEditingPlan(true);
    }
  };
  
  const handleAddAllToShoppingList = () => {
    const itemsToAdd: PantryItem[] = [];
    plannedRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => {
            itemsToAdd.push({
                id: `${recipe.id}-${ing.name}-${Date.now()}`,
                name: ing.name,
                quantity: `${ing.quantity} ${ing.unit}`,
                category: recipe.name, // Group by recipe name in shopping list
            });
        });
    });
    if (itemsToAdd.length > 0) {
        onUpdateShoppingList(itemsToAdd);
        setActiveTab(AppTab.SHOPPING_LIST);
        alert(`${itemsToAdd.length} ingredients from your weekly plan added to the shopping list!`);
    } else {
        alert("No ingredients to add from the current weekly plan.");
    }
  };


  if (editingPlan) {
    return (
      <div className="p-4 md:p-6 bg-white shadow rounded-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">Plan Your Week's Recipes</h2>
        
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Select from Your Favorites:</h3>
            {favoriteRecipesForSelection.length === 0 ? (
                <p className="text-gray-500 text-sm">You have no favorite recipes to add. Go discover and like some recipes first!</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto custom-scrollbar p-2 border rounded-md">
                    {favoriteRecipesForSelection.map(recipe => (
                    <div key={recipe.id} className={`p-3 rounded-lg border cursor-pointer transition-all ${currentSelectedIds.includes(recipe.id) ? 'bg-green-100 border-green-400 shadow-md' : 'bg-gray-50 hover:bg-gray-100 border-gray-200'}`} onClick={() => toggleRecipeInPlan(recipe.id)}>
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-800">{recipe.name}</span>
                            <input
                                type="checkbox"
                                checked={currentSelectedIds.includes(recipe.id)}
                                onChange={() => toggleRecipeInPlan(recipe.id)}
                                className="form-checkbox h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{recipe.prepTime} Prep | {recipe.cookTime} Cook</p>
                    </div>
                    ))}
                </div>
            )}
        </div>

        {currentSelectedIds.length > 0 && (
            <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-700 mb-2">Currently Selected for the Week ({currentSelectedIds.length}):</h3>
                <div className="flex flex-wrap gap-2">
                    {plannedRecipes.map(r => <Pill key={r.id} text={r.name} color="bg-blue-100 text-blue-700" />)}
                </div>
            </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={handleSavePlan}
            disabled={currentSelectedIds.length === 0}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow-md disabled:bg-gray-300 transition-colors"
          >
            Save Weekly Plan ({currentSelectedIds.length} Recipe{currentSelectedIds.length === 1 ? '' : 's'})
          </button>
          {userProfile.weeklyPlanRecipeIds && userProfile.weeklyPlanRecipeIds.length > 0 && (
            <button
              onClick={() => setEditingPlan(false)}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-md shadow-md transition-colors"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </div>
    );
  }

  // Viewing Mode
  const finalPlannedRecipes = useMemo(() => {
    return (userProfile.weeklyPlanRecipeIds || [])
      .map(id => allSavedRecipes.find(recipe => recipe.id === id))
      .filter(Boolean) as Recipe[];
  }, [userProfile.weeklyPlanRecipeIds, allSavedRecipes]);


  return (
    <div className="p-4 md:p-6 bg-white shadow rounded-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-green-600 text-center sm:text-left mb-3 sm:mb-0">Your Recipes for the Week</h2>
        <div className="flex gap-2">
            <button
                onClick={handleEditPlan}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md shadow"
            >
                Edit Plan
            </button>
            <button
                onClick={handleClearPlan}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-md shadow"
            >
                Clear Plan
            </button>
        </div>
      </div>

      {finalPlannedRecipes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No recipes planned for the week yet.</p>
          <button onClick={handleEditPlan} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Start Planning Now
          </button>
        </div>
      ) : (
        <div className="space-y-8">
           <button 
                onClick={handleAddAllToShoppingList}
                className="mb-6 w-full sm:w-auto px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-md shadow-md transition-colors"
            >
                Add All Ingredients to Shopping List
            </button>
          {finalPlannedRecipes.map(recipe => (
            <div key={recipe.id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-green-700 mb-3">{recipe.name}</h3>
              {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-48 object-cover rounded-md mb-3" />}
              <p className="text-sm text-gray-600 mb-3">{recipe.description}</p>
              
              <div className="grid grid-cols-3 gap-2 text-xs text-center mb-4">
                <Pill text={`Serves: ${recipe.servings}`} color="bg-gray-100 text-gray-700"/>
                <Pill text={`Prep: ${recipe.prepTime}`} color="bg-gray-100 text-gray-700"/>
                <Pill text={`Cook: ${recipe.cookTime}`} color="bg-gray-100 text-gray-700"/>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-1">Ingredients:</h4>
                <ul className="list-disc list-inside space-y-0.5 text-sm text-gray-600 pl-4">
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index}>
                      {ing.quantity} {ing.unit} {ing.name}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-1">Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 pl-4">
                  {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
                </ol>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm font-medium text-blue-700 text-center">How-to Video (Coming Soon!)</p>
                {/* Placeholder for video, e.g., <div className="aspect-video bg-gray-300 rounded mt-2"></div> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyPicksScreen;