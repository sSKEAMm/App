import React, { useState } from 'react';
import { Recipe, PantryItem, AppTab } from '../types';
import Modal from './Modal';
import Pill from './Pill';

interface RecipeCardProps {
  recipe: Recipe;
  onUpdateShoppingList: (list: PantryItem[]) => void;
  onToggleFavorite?: (recipeId: string) => void; 
  onDelete?: (recipeId: string) => void; 
  onSave?: () => void; // For saving a newly generated recipe
  isGenerated?: boolean; 
  setActiveTab: (tab: AppTab) => void;
  onUndislike?: (recipeId: string) => void; // New prop for un-disliking
  isDislikedView?: boolean; // To indicate card is shown in "Disliked Recipes" view
}

const RecipeCard: React.FC<RecipeCardProps> = ({ 
    recipe, 
    onUpdateShoppingList, 
    onToggleFavorite, 
    onDelete, 
    onSave,
    isGenerated,
    setActiveTab,
    onUndislike,
    isDislikedView
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getIngredientsForShoppingList = (): PantryItem[] => {
    return recipe.ingredients.map(ingredient => ({
      id: `${recipe.id}-${ingredient.name}`, 
      name: ingredient.name,
      quantity: `${ingredient.quantity} ${ingredient.unit}`,
      category: "Recipe Ingredient" 
    }));
  };

  const handleAddToShoppingList = () => {
    const itemsToBuy = getIngredientsForShoppingList();
    onUpdateShoppingList(itemsToBuy);
    setIsModalOpen(false); 
    setActiveTab(AppTab.SHOPPING_LIST); 
  };
  
  const handleDeleteRecipe = () => {
    if (onDelete && window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
        onDelete(recipe.id);
        setIsModalOpen(false);
    }
  };
  
  const handleSaveRecipe = () => {
    if (onSave) {
        onSave();
    }
  };

  const handleUndislikeRecipe = () => {
    if (onUndislike) {
        onUndislike(recipe.id);
        setIsModalOpen(false); // Close modal after un-disliking
    }
  };


  return (
    <>
      <div 
        className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col aspect-square"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-2/3">
          <img 
            src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id || recipe.name}/300/300`} 
            alt={recipe.name} 
            className="w-full h-full object-cover"
          />
          {!isGenerated && !isDislikedView && onToggleFavorite && (
             <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(recipe.id); }}
              className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors z-10 ${recipe.isFavorite ? 'bg-red-500 text-white' : 'bg-black bg-opacity-30 text-gray-200 hover:text-white'}`}
              aria-label={recipe.isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.218l-.022.012-.007.004-.004.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </button>
          )}
        </div>
        <div className="p-3 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-base font-semibold text-green-700 mb-1 truncate" title={recipe.name}>{recipe.name}</h3>
            <p className="text-xs text-gray-500 mb-1 truncate">{recipe.prepTime} Prep | {recipe.cookTime} Cook</p>
          </div>
          {isGenerated && onSave && ( // This button is for generated recipes in RecipeList swipe view before like/dislike
            <button
                onClick={(e) => { e.stopPropagation(); handleSaveRecipe(); }}
                className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-1.5 px-2 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
            >
                Save to My Recipes
            </button>
          )}
          {isDislikedView && onUndislike && (
             <button
                onClick={(e) => { e.stopPropagation(); handleUndislikeRecipe(); }}
                className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-white text-xs font-semibold py-1.5 px-2 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
            >
                Move Back (Un-dislike)
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={recipe.name}>
        <div className="space-y-4">
          <img src={recipe.imageUrl || `https://picsum.photos/seed/${recipe.id || recipe.name}/600/300`} alt={recipe.name} className="w-full h-48 object-cover rounded-lg mb-4"/>
          <p className="text-gray-700">{recipe.description}</p>
          
          <div className="grid grid-cols-3 gap-2 text-sm text-center">
            <div className="bg-green-50 p-2 rounded-lg">
                <p className="font-semibold text-green-700">Servings</p>
                <p className="text-gray-600">{recipe.servings}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
                <p className="font-semibold text-green-700">Prep Time</p>
                <p className="text-gray-600">{recipe.prepTime}</p>
            </div>
            <div className="bg-green-50 p-2 rounded-lg">
                <p className="font-semibold text-green-700">Cook Time</p>
                <p className="text-gray-600">{recipe.cookTime}</p>
            </div>
          </div>

          {recipe.cuisineType && <p className="text-sm text-gray-600"><strong>Cuisine:</strong> <Pill text={recipe.cuisineType} color="bg-blue-100 text-blue-700" /></p>}

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-1">Ingredients:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 pl-4">
              {recipe.ingredients.map((ing, index) => (
                <li key={index}>
                  {ing.quantity} {ing.unit} {ing.name}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold text-gray-800 mb-1">Instructions:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 pl-4">
              {recipe.instructions.map((step, index) => <li key={index}>{step}</li>)}
            </ol>
          </div>

          {recipe.notes && (
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-1">Notes:</h4>
              <p className="text-sm text-gray-600 italic">{recipe.notes}</p>
            </div>
          )}

          {recipe.equipmentNeeded && recipe.equipmentNeeded.length > 0 && (
             <div>
              <h4 className="text-md font-semibold text-gray-800 mb-1">Equipment Needed:</h4>
              <div className="flex flex-wrap gap-2">
                {recipe.equipmentNeeded.map(eq => <Pill key={eq} text={eq} color="bg-yellow-100 text-yellow-700" />)}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button
              onClick={handleAddToShoppingList}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
            >
              Add Ingredients to Shopping List
            </button>
            {!isGenerated && !isDislikedView && onDelete && ( // Standard delete for saved recipes
                 <button
                  onClick={handleDeleteRecipe}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
                >
                  Delete Recipe
                </button>
            )}
            {isGenerated && onSave && ( // For generated recipes in swipe view (RecipeList)
                 <button
                  onClick={handleSaveRecipe} // This save is part of the swipe view's like action typically
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
                >
                  Save to My Recipes
                </button>
            )}
            {isDislikedView && onUndislike && ( // For recipes in RecentlyDislikedScreen
                 <button
                  onClick={handleUndislikeRecipe}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150"
                >
                  Move Back (Un-dislike)
                </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RecipeCard;