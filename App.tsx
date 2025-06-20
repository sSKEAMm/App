
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, PantryItem, Recipe, AppTab, AppStage, AuthUser, AuthProvider, DietaryRequirement, Cuisine, SkillLevel, KitchenEquipment, ShoppingListCollection, ShoppingList } from './types';
import { DEFAULT_USER_PROFILE_NAME } from './constants';
import OnboardingForm from './components/OnboardingForm';
import RecipeList from './components/RecipeList'; 
import FavoriteRecipesScreen from './components/FavoriteRecipesScreen'; 
import ShoppingListDisplay from './components/ShoppingListDisplay';
import Navbar from './components/Navbar';
import AuthScreen from './components/AuthScreen';
import PostLoginChoiceScreen from './components/PostLoginChoiceScreen';
import JoinFamilyScreen from './components/JoinFamilyScreen';
import SideMenu from './components/SideMenu';
import SettingsScreen from './components/SettingsScreen';
import RecipeGenerationSetup from './components/RecipeGenerationSetup';
import RecentlyDislikedScreen from './components/RecentlyDislikedScreen';
import HomeScreen from './components/HomeScreen'; 
import WeeklyPicksScreen from './components/WeeklyPicksScreen';
import DessertRecipesScreen from './components/DessertRecipesScreen';
import { useLocalStorage } from './hooks/useLocalStorage';

// Hamburger Icon SVG
const HamburgerIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

// Shopping Cart Icon for FAB
const ShoppingCartIconFAB: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className ?? "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);


const App: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [recipes, setRecipes] = useLocalStorage<Recipe[]>('recipes', []);
  
  const [shoppingLists, setShoppingLists] = useLocalStorage<ShoppingListCollection>('shoppingLists', {});
  const [activeShoppingListId, setActiveShoppingListId] = useLocalStorage<string | null>('activeShoppingListId', null);
  
  const [currentStage, setCurrentStage] = useLocalStorage<AppStage>('appStage', AppStage.AUTH);
  const [activeTab, setActiveTab] = useLocalStorage<AppTab>('activeTab', AppTab.HOME); 
  
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    const envApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : null;
    if (envApiKey) setApiKey(envApiKey);
  }, []);

  // Initialize default shopping list if none exists
  useEffect(() => {
    if (Object.keys(shoppingLists).length === 0) {
      const defaultListId = `default-${Date.now()}`;
      const defaultList: ShoppingList = {
        id: defaultListId,
        name: "Home Grocery",
        items: [],
        createdAt: Date.now(),
        icon: "🏠"
      };
      setShoppingLists({ [defaultListId]: defaultList });
      setActiveShoppingListId(defaultListId);
    } else if (!activeShoppingListId || !shoppingLists[activeShoppingListId]) {
      // If active ID is invalid, set to the first available list
      const firstListId = Object.keys(shoppingLists)[0];
      if (firstListId) {
        setActiveShoppingListId(firstListId);
      }
    }
  }, [shoppingLists, setShoppingLists, activeShoppingListId, setActiveShoppingListId]);


  const handleLoginSuccess = useCallback((authUser: AuthUser) => {
    const existingProfile = userProfile; 
    if (existingProfile && existingProfile.authUid === authUser.uid) {
      setUserProfile(existingProfile); 
      setCurrentStage(existingProfile.setupComplete ? AppStage.MAIN_APP : (existingProfile.initialChoiceMade ? AppStage.ONBOARDING_PROFILE : AppStage.INITIAL_CHOICE));
      setActiveTab(AppTab.HOME); 
    } else {
      const newProfile: UserProfile = {
        name: authUser.displayName || DEFAULT_USER_PROFILE_NAME,
        email: authUser.email,
        authUid: authUser.uid,
        authProvider: authUser.provider,
        dietaryRequirements: [],
        allergies: [],
        cuisinePreferences: [],
        dislikedCuisines: [],
        skillLevel: SkillLevel.BEGINNER,
        kitchenEquipment: [],
        setupComplete: false,
        initialChoiceMade: false,
        dislikedRecipes: [],
        lastNumPeople: 2,
        lastBudget: '',
        weeklyPlanRecipeIds: [],
      };
      setUserProfile(newProfile);
      setCurrentStage(AppStage.INITIAL_CHOICE);
    }
    setIsSideMenuOpen(false);
  }, [setUserProfile, setCurrentStage, setActiveTab, userProfile]);

  const handlePostLoginChoice = useCallback((choice: 'create' | 'join') => {
    setUserProfile(prev => prev ? { ...prev, initialChoiceMade: true } : null);
    if (choice === 'create') setCurrentStage(AppStage.ONBOARDING_PROFILE);
    else setCurrentStage(AppStage.JOIN_FAMILY);
  }, [setUserProfile, setCurrentStage]);

  const handleFamilyJoined = useCallback((familyId: string, familyName: string) => {
    setUserProfile(prev => prev ? { ...prev, familyId, familyName, setupComplete: true } : null); 
    setCurrentStage(AppStage.MAIN_APP);
    setActiveTab(AppTab.HOME);
  }, [setUserProfile, setCurrentStage, setActiveTab]);

  const handleProfileSave = useCallback((profile: UserProfile) => {
    setUserProfile(prev => ({ ...(prev || {} as UserProfile), ...profile, setupComplete: true, initialChoiceMade: true }));
    setCurrentStage(AppStage.MAIN_APP);
    setActiveTab(AppTab.HOME);
    setIsSideMenuOpen(false);
  }, [setUserProfile, setCurrentStage, setActiveTab]);

  const handleLogout = useCallback(() => {
    setUserProfile(null); 
    setRecipes([]);
    setShoppingLists({}); // Clear all shopping lists
    setActiveShoppingListId(null);
    setCurrentStage(AppStage.AUTH);
    setActiveTab(AppTab.HOME); 
    setIsSideMenuOpen(false);
  }, [setUserProfile, setRecipes, setShoppingLists, setActiveShoppingListId, setCurrentStage, setActiveTab]);

  const handleSideMenuNavigate = (tab: AppTab) => {
    setActiveTab(tab);
    setIsSideMenuOpen(false);
  };
  
  const handleAddRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => {
      const existingIndex = prevRecipes.findIndex(r => r.id === recipe.id);
      if (existingIndex > -1) {
        const updatedRecipes = [...prevRecipes];
        updatedRecipes[existingIndex] = recipe;
        return updatedRecipes;
      }
      return [...prevRecipes, recipe];
    });
  };

  const handleToggleFavorite = (recipeId: string) => {
    setRecipes(prevRecipes => prevRecipes.map(r => r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r));
  };
  
  const handleDeleteRecipe = (recipeId: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
    setUserProfile(prev => {
        if (!prev) return null;
        return {
            ...prev,
            dislikedRecipes: prev.dislikedRecipes.filter(r => r.id !== recipeId),
            weeklyPlanRecipeIds: prev.weeklyPlanRecipeIds.filter(id => id !== recipeId)
        };
    });
  };

  const handleRecipePreferencesUpdate = (numPeople: number, budget: string) => {
      setUserProfile(prev => prev ? {...prev, lastNumPeople: numPeople, lastBudget: budget } : null);
  };
  
  const handleDislikeRecipe = (recipeToDislike: Recipe) => {
    setUserProfile(prev => {
        if (!prev || prev.dislikedRecipes.some(r => r.id === recipeToDislike.id)) return prev;
        return { ...prev, dislikedRecipes: [...prev.dislikedRecipes, recipeToDislike] };
    });
  };

  const handleUndislikeRecipe = (recipeIdToUndislike: string) => {
      setUserProfile(prev => {
          if (!prev) return null;
          return { ...prev, dislikedRecipes: prev.dislikedRecipes.filter(r => r.id !== recipeIdToUndislike) };
      });
  };

  const handleSetWeeklyPlan = useCallback((recipeIds: string[]) => {
    setUserProfile(prev => prev ? { ...prev, weeklyPlanRecipeIds: recipeIds } : null);
  }, [setUserProfile]);

  // Shopping List Management
  const handleSetActiveShoppingList = (listId: string) => {
    if (shoppingLists[listId]) {
      setActiveShoppingListId(listId);
    }
  };

  const handleCreateNewShoppingList = (name: string, icon?: string) => {
    const newListId = `list-${Date.now()}`;
    const newList: ShoppingList = {
      id: newListId,
      name: name.trim() || "Untitled List",
      items: [],
      createdAt: Date.now(),
      icon: icon || "🛒"
    };
    setShoppingLists(prev => ({ ...prev, [newListId]: newList }));
    setActiveShoppingListId(newListId); // Make the new list active
  };

  const handleUpdateShoppingListItems = (listId: string, updatedItems: PantryItem[]) => {
    setShoppingLists(prev => {
      if (!prev[listId]) return prev;
      return { ...prev, [listId]: { ...prev[listId], items: updatedItems } };
    });
  };
  
  // This function is for adding items from recipes to the *active* list
  const addItemsToActiveShoppingList = (newItems: PantryItem[]) => {
    if (!activeShoppingListId || !shoppingLists[activeShoppingListId]) {
        alert("No active shopping list selected. Please select or create one first.");
        // Optionally, navigate to shopping list tab or prompt to create/select
        // setActiveTab(AppTab.SHOPPING_LIST);
        return;
    }
    const currentList = shoppingLists[activeShoppingListId];
    const combined = [...currentList.items];
    newItems.forEach(newItem => {
        if (!combined.some(existingItem => existingItem.name.toLowerCase() === newItem.name.toLowerCase())) {
            combined.push({...newItem, id: newItem.id || Date.now().toString() });
        }
    });
    handleUpdateShoppingListItems(activeShoppingListId, combined);
  };


  const handleDeleteShoppingList = (listId: string) => {
    if (window.confirm(`Are you sure you want to delete the list "${shoppingLists[listId]?.name}"? This cannot be undone.`)) {
      setShoppingLists(prev => {
        const updatedLists = { ...prev };
        delete updatedLists[listId];
        return updatedLists;
      });
      // If the active list was deleted, set active to another list or null
      if (activeShoppingListId === listId) {
        const remainingListIds = Object.keys(shoppingLists).filter(id => id !== listId);
        setActiveShoppingListId(remainingListIds.length > 0 ? remainingListIds[0] : null);
      }
    }
  };

  const handleRenameShoppingList = (listId: string, newName: string) => {
     setShoppingLists(prev => {
      if (!prev[listId] || !newName.trim()) return prev;
      return { ...prev, [listId]: { ...prev[listId], name: newName.trim() } };
    });
  };


  const renderContent = () => {
    switch (currentStage) {
      case AppStage.AUTH:
        return <div className="h-screen flex justify-center items-center"><AuthScreen onLoginSuccess={handleLoginSuccess} /></div>;
      case AppStage.INITIAL_CHOICE:
        return <div className="h-screen flex justify-center items-center"><PostLoginChoiceScreen userName={userProfile?.name} onChoseCreateCookbook={() => handlePostLoginChoice('create')} onChoseJoinFamily={() => handlePostLoginChoice('join')} /></div>;
      case AppStage.JOIN_FAMILY:
        return <div className="h-screen flex justify-center items-center"><JoinFamilyScreen onFamilyJoined={handleFamilyJoined} onBack={() => setCurrentStage(AppStage.INITIAL_CHOICE)} /></div>;
      case AppStage.ONBOARDING_PROFILE:
        return <div className="h-screen flex justify-center items-center p-4"><OnboardingForm currentProfile={userProfile} onSave={handleProfileSave} /></div>;
      case AppStage.MAIN_APP:
        if (!userProfile || !userProfile.setupComplete) {
            setCurrentStage(AppStage.ONBOARDING_PROFILE);
            return <div className="h-screen flex justify-center items-center p-4"><OnboardingForm currentProfile={userProfile} onSave={handleProfileSave} /></div>;
        }
        return (
          <div className="flex flex-col min-h-screen"> 
            <button
              onClick={() => setIsSideMenuOpen(true)}
              className="fixed top-4 left-4 z-30 p-2.5 bg-white bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 text-gray-700 hover:text-green-600 rounded-full shadow-lg transition-all"
              aria-label="Open menu"
            >
              <HamburgerIcon className="h-6 w-6" />
            </button>
            
            <main className="flex-grow p-4 overflow-y-auto bg-transparent pb-24 pt-16"> 
              {renderMainAppContent()}
            </main>
            
            {activeTab !== AppTab.SHOPPING_LIST && (
                 <button
                    onClick={() => setActiveTab(AppTab.SHOPPING_LIST)}
                    className="fixed bottom-20 right-5 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-20 transition-transform transform hover:scale-110"
                    aria-label="Open Shopping List"
                >
                    <ShoppingCartIconFAB className="h-7 w-7" />
                </button>
            )}
            <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
            <SideMenu 
              isOpen={isSideMenuOpen} 
              onClose={() => setIsSideMenuOpen(false)} 
              onNavigate={handleSideMenuNavigate}
              onLogout={handleLogout}
              userProfile={userProfile}
            />
          </div>
        );
      default:
        return <p>Loading or unknown state...</p>;
    }
  };
  
  const renderMainAppContent = () => {
    if (!userProfile || !apiKey) return <div className="text-center p-10 bg-white/50 backdrop-blur-sm rounded-lg shadow-md">Loading configuration... Ensure API Key is set and profile is loaded.</div>;

    const activeList = activeShoppingListId ? shoppingLists[activeShoppingListId] : null;

    switch (activeTab) {
      case AppTab.HOME:
        return <HomeScreen onNavigate={setActiveTab} />;
      case AppTab.FIND_RECIPES: 
        return <RecipeList 
                    userProfile={userProfile} 
                    apiKey={apiKey} 
                    recipes={recipes} 
                    onAddRecipe={handleAddRecipe} 
                    onUpdateShoppingList={addItemsToActiveShoppingList} 
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteRecipe}
                    setActiveTab={setActiveTab}
                    onRecipePreferencesUpdate={handleRecipePreferencesUpdate}
                    onDislikeRecipe={handleDislikeRecipe}
                />;
      case AppTab.DESSERTS:
        return <DessertRecipesScreen
                    userProfile={userProfile}
                    apiKey={apiKey}
                    recipes={recipes} 
                    onAddRecipe={handleAddRecipe}
                    onUpdateShoppingList={addItemsToActiveShoppingList}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteRecipe}
                    setActiveTab={setActiveTab}
                    onRecipePreferencesUpdate={handleRecipePreferencesUpdate}
                    onDislikeRecipe={handleDislikeRecipe}
                />;
      case AppTab.SHOPPING_LIST:
        return <ShoppingListDisplay 
                    allLists={shoppingLists}
                    activeList={activeList}
                    onSetActiveList={handleSetActiveShoppingList}
                    onCreateNewList={handleCreateNewShoppingList}
                    onUpdateListItems={handleUpdateShoppingListItems}
                    onDeleteList={handleDeleteShoppingList}
                    onRenameList={handleRenameShoppingList}
                />;
      case AppTab.FAVORITES:
        return <FavoriteRecipesScreen 
                    recipes={recipes.filter(r => r.isFavorite)} 
                    onUpdateShoppingList={addItemsToActiveShoppingList} 
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDeleteRecipe}
                    setActiveTab={setActiveTab}
                />;
      case AppTab.PROFILE_SETTINGS:
        return <OnboardingForm currentProfile={userProfile} onSave={handleProfileSave} />;
      case AppTab.SETTINGS:
        return <SettingsScreen />;
      case AppTab.RECIPE_PREFERENCES:
        return <RecipeGenerationSetup 
                    currentNumPeople={userProfile.lastNumPeople}
                    currentBudget={userProfile.lastBudget}
                    onComplete={(num, budget) => {
                        handleRecipePreferencesUpdate(num, budget);
                        setActiveTab(AppTab.FIND_RECIPES); 
                    }}
                    submitButtonText="Save & Find Recipes"
                    formTitle="Set Your Recipe Preferences"
                />;
      case AppTab.RECENTLY_DISLIKED:
        return <RecentlyDislikedScreen
                    dislikedRecipes={userProfile.dislikedRecipes}
                    onUndislikeRecipe={handleUndislikeRecipe}
                    onUpdateShoppingList={addItemsToActiveShoppingList}
                    setActiveTab={setActiveTab}
                />;
      case AppTab.WEEKLY_PICKS:
        return <WeeklyPicksScreen 
                    userProfile={userProfile}
                    allSavedRecipes={recipes}
                    onSetWeeklyPlan={handleSetWeeklyPlan}
                    onUpdateShoppingList={addItemsToActiveShoppingList}
                    setActiveTab={setActiveTab}
                />;
      default:
        return <p className="bg-white/50 backdrop-blur-sm p-4 rounded-md">Page not found for tab: {activeTab}</p>;
    }
  };

  return <div className="antialiased text-gray-800">{renderContent()}</div>;
};

export default App;
