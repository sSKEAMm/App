import React from 'react';
import { Recipe, PantryItem, AppTab } from '../types';
import RecipeCard from './RecipeCard';

interface RecentlyDislikedScreenProps {
  dislikedRecipes: Recipe[];
  onUndislikeRecipe: (recipeId: string) => void;
  onUpdateShoppingList: (list: PantryItem[]) => void;
  setActiveTab: (tab: AppTab) => void;
}

const RecentlyDislikedScreen: React.FC<RecentlyDislikedScreenProps> = ({ 
    dislikedRecipes, 
    onUndislikeRecipe,
    onUpdateShoppingList,
    setActiveTab
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-600 text-center">Recently Disliked Recipes</h2>

      {dislikedRecipes.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.95a7.5 7.5 0 100 14.1M10.05 4.95v14.1m0-14.1H5.025m5.025 0h5.025M5.025 4.95c-1.32.733-2.25 2.09-2.25 3.55s.93 2.817 2.25 3.55m5.025 7s2.25-.267 2.25-2.333m0 0S14.55 15 12.3 15m0 0V7.333" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18" />
          </svg>
          <p className="mt-2">No recipes have been disliked recently.</p>
          <p className="text-sm">If you accidentally swipe away a suggestion, it will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {dislikedRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUpdateShoppingList={onUpdateShoppingList}
              setActiveTab={setActiveTab}
              onUndislike={onUndislikeRecipe}
              isDislikedView={true} // Indicate this is for the disliked view
              // No onToggleFavorite or onDelete directly here, as these are "disliked"
            />
          ))}
        </div>
      )}
       <p className="text-xs text-gray-400 text-center mt-4">
        Recipes here are temporarily stored. Un-dislike to move them back to your main recipes or for consideration.
      </p>
    </div>
  );
};

export default RecentlyDislikedScreen;