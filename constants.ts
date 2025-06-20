
import { DietaryRequirement, Cuisine, KitchenEquipment, SkillLevel } from './types';

export const DIETARY_REQUIREMENTS_OPTIONS: DietaryRequirement[] = Object.values(DietaryRequirement).filter(value => value !== DietaryRequirement.NONE);
export const CUISINE_OPTIONS: Cuisine[] = Object.values(Cuisine);
export const KITCHEN_EQUIPMENT_OPTIONS: KitchenEquipment[] = Object.values(KitchenEquipment);
export const SKILL_LEVEL_OPTIONS: SkillLevel[] = Object.values(SkillLevel);

export const DEFAULT_USER_PROFILE_NAME = "Foodie";

// Updated for better shopping list categorization
export const PANTRY_CATEGORIES = [
  "Produce", 
  "Dairy & Eggs", 
  "Meat & Seafood", 
  "Bakery", 
  "Pantry Staples", // (e.g., rice, pasta, canned goods, sauces, spices, baking)
  "Snacks",
  "Frozen Foods", 
  "Beverages", 
  "Household", 
  "Personal Care",
  "Baby",
  "Pets",
  "Other" 
];

export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17";

export const NAV_ICON_SIZE = "h-6 w-6";
export const ACTIVE_NAV_ICON_COLOR = "text-green-500";
export const INACTIVE_NAV_ICON_COLOR = "text-gray-500";