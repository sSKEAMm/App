
export enum DietaryRequirement {
  NONE = "None",
  VEGETARIAN = "Vegetarian",
  VEGAN = "Vegan",
  KETO = "Keto",
  GLUTEN_FREE = "Gluten-Free",
  PALEO = "Paleo",
  PESCATARIAN = "Pescatarian",
}

export enum Cuisine {
  ITALIAN = "Italian",
  MEXICAN = "Mexican",
  INDIAN = "Indian",
  CHINESE = "Chinese",
  JAPANESE = "Japanese",
  THAI = "Thai",
  FRENCH = "French",
  SPANISH = "Spanish",
  GREEK = "Greek",
  AMERICAN = "American",
  MEDITERRANEAN = "Mediterranean",
}

export enum KitchenEquipment {
  OVEN = "Oven",
  STOVETOP = "Stovetop",
  MICROWAVE = "Microwave",
  AIR_FRYER = "Air Fryer",
  SLOW_COOKER = "Slow Cooker",
  INSTANT_POT = "Instant Pot",
  BLENDER = "Blender",
  FOOD_PROCESSOR = "Food Processor",
  STAND_MIXER = "Stand Mixer",
}

export enum SkillLevel {
  BEGINNER = "Beginner",
  INTERMEDIATE = "Intermediate",
  ADVANCED = "Advanced",
}

export type AuthProvider = 'google' | 'apple';

export interface AuthUser {
  uid: string;
  email?: string;
  displayName?: string;
  provider: AuthProvider;
}

export interface UserProfile {
  name: string;
  email?: string; 
  dietaryRequirements: DietaryRequirement[];
  allergies: string[];
  cuisinePreferences: Cuisine[];
  dislikedCuisines: Cuisine[];
  skillLevel: SkillLevel;
  kitchenEquipment: KitchenEquipment[];
  setupComplete: boolean; 
  authUid?: string;
  authProvider?: AuthProvider;
  initialChoiceMade?: boolean; 
  familyId?: string; 
  familyName?: string; 
  lastNumPeople?: number; 
  lastBudget?: string;  
  dislikedRecipes: Recipe[];
  weeklyPlanRecipeIds: string[];
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string; 
  category: string; 
}

export interface Ingredient {
  name: string;
  quantity: string; 
  unit: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  servings: number; 
  prepTime: string; 
  cookTime: string; 
  ingredients: Ingredient[];
  instructions: string[];
  notes?: string;
  equipmentNeeded: string[]; 
  cuisineType?: Cuisine; 
  isFavorite?: boolean;
  imageUrl?: string; 
}

export interface ShoppingList {
  id: string;
  name: string;
  items: PantryItem[];
  createdAt: number;
  icon?: string; // e.g., emoji or icon name
}

export type ShoppingListCollection = Record<string, ShoppingList>;


export enum AppTab {
  HOME = "Home", 
  PROFILE_SETTINGS = "Profile",
  FIND_RECIPES = "Discover Recipes", 
  SHOPPING_LIST = "Shopping",
  SETTINGS = "Settings",
  FAVORITES = "Favorites",
  RECIPE_PREFERENCES = "Recipe Prefs",
  RECENTLY_DISLIKED = "Disliked",
  WEEKLY_PICKS = "Weekly Picks", 
  DESSERTS = "Desserts",
}

export enum AppStage {
  AUTH = "Auth",
  INITIAL_CHOICE = "InitialChoice",
  JOIN_FAMILY = "JoinFamily",
  ONBOARDING_PROFILE = "OnboardingProfile", 
  MAIN_APP = "MainApp",
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
