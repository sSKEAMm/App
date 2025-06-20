import React from 'react';
import { Recipe, PantryItem, AppTab } from '../types';
import RecipeCard from './RecipeCard';

interface FavoriteRecipesScreenProps {
  recipes: Recipe[]; // Already filtered for favorites by App.tsx
  onUpdateShoppingList: (list: PantryItem[]) => void;
  onToggleFavorite: (recipeId: string) => void;
  onDelete: (recipeId: string) => void;
  setActiveTab: (tab: AppTab) => void;
}

const FavoriteRecipesScreen: React.FC<FavoriteRecipesScreenProps> = ({ 
    recipes, 
    onUpdateShoppingList, 
    onToggleFavorite, 
    onDelete,
    setActiveTab
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-green-600 text-center">My Favorite Recipes</h2>

      {recipes.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mt-2">You haven't favorited any recipes yet.</p>
          <p className="text-sm">Tap the heart icon on a recipe to add it here!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {recipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onUpdateShoppingList={onUpdateShoppingList}
              onToggleFavorite={onToggleFavorite}
              onDelete={onDelete}
              setActiveTab={setActiveTab}
              isGenerated={false} // Favorites are never "just generated" in this view
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteRecipesScreen;
