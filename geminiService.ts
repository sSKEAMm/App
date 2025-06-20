
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { UserProfile, Recipe, Ingredient, Cuisine } from '../types';
import { GEMINI_MODEL_TEXT } from '../constants';

const parseGeminiResponse = (responseText: string): Recipe[] => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s; 
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr);
    if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'object' && item.name && item.ingredients && item.instructions)) {
      return parsedData.map((recipeData: any, index: number) => ({
        id: recipeData.id || `${Date.now()}-gen-${index}-${Math.random().toString(36).substr(2, 9)}`, // Ensure generated recipes get unique IDs
        name: recipeData.name || "Untitled Recipe",
        description: recipeData.description || "No description available.",
        servings: typeof recipeData.servings === 'number' && recipeData.servings > 0 ? recipeData.servings : 2,
        prepTime: recipeData.prepTime || "N/A",
        cookTime: recipeData.cookTime || "N/A",
        ingredients: Array.isArray(recipeData.ingredients) ? recipeData.ingredients.map((ing: any) => ({
          name: ing.name || "Unknown Ingredient",
          quantity: String(ing.quantity) || "1",
          unit: ing.unit || "",
        })) : [],
        instructions: Array.isArray(recipeData.instructions) ? recipeData.instructions.filter((instr: any) => typeof instr === 'string') : [],
        notes: recipeData.notes,
        equipmentNeeded: Array.isArray(recipeData.equipmentNeeded) ? recipeData.equipmentNeeded.filter((eq: any) => typeof eq === 'string') : [],
        cuisineType: recipeData.cuisineType as Cuisine || undefined,
        isFavorite: false,
        imageUrl: recipeData.imageUrl 
      }));
    }
    console.warn("Parsed data is not an array of recipes:", parsedData);
    return [];
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e);
    console.error("Original response text:", responseText);
    throw new Error(`Failed to parse recipes from AI response. Raw response: ${responseText.substring(0,1000)}`);
  }
};


export const generateRecipesWithGemini = async (
  userProfile: UserProfile,
  numPeople: number,
  budgetConstraint: string,
  numRecipesToGenerate: number,
  apiKey: string,
  recipeCategoryFocus?: 'Meal' | 'Dessert' // Added recipeCategoryFocus
): Promise<Recipe[]> => {
  if (!apiKey) {
    throw new Error("Gemini API key is not provided.");
  }
  const ai = new GoogleGenAI({ apiKey });

  const dislikedRecipeNamesString = userProfile.dislikedRecipes && userProfile.dislikedRecipes.length > 0 
    ? userProfile.dislikedRecipes.map(r => r.name).join(", ") 
    : "None specified";

  let specificFocusInstructions = "";
  if (recipeCategoryFocus === 'Dessert') {
    specificFocusInstructions = `
The user is specifically looking for DESSERT recipes. 
Focus on generating sweet treats such as cakes, cookies, pies, puddings, fruit desserts, or frozen desserts.
Ensure the recipes fit the dessert category and consider common dessert preparation times and ingredients.
`;
  } else {
    specificFocusInstructions = `
The user is looking for general MEAL recipes (e.g., breakfast, lunch, dinner).
`;
  }

  const prompt = `
You are an expert recipe generation assistant.
Your goal is to create ${numRecipesToGenerate} unique, budget-friendly, and delicious recipes tailored to the user's profile and the number of people eating.

${specificFocusInstructions}

User Profile:
- Name: ${userProfile.name}
- Number of people eating/servings desired: ${numPeople}
- Dietary Restrictions: ${userProfile.dietaryRequirements.join(", ") || "None"}
- Allergies: ${userProfile.allergies.join(", ") || "None specified"}
- Preferred Cuisines (for meals, can be less relevant for some desserts): ${userProfile.cuisinePreferences.join(", ") || "Any"}
- Disliked Cuisines (for meals): ${userProfile.dislikedCuisines.join(", ") || "None"}
- Previously Disliked Recipe Names (AVOID these or very similar ones): ${dislikedRecipeNamesString}
- Cooking Skill Level: ${userProfile.skillLevel}
- Available Kitchen Equipment: ${userProfile.kitchenEquipment.join(", ") || "Basic (Stovetop, Oven)"}
- Budget Constraint: ${budgetConstraint || "Not specified, but aim for general affordability."}

Task:
Generate ${numRecipesToGenerate} ${recipeCategoryFocus === 'Dessert' ? 'dessert' : 'meal'} recipe(s). 
Adjust ingredient quantities and serving sizes primarily based on the "Number of people eating/servings desired" (${numPeople}).
For each recipe, strictly follow this JSON format for the output. Do NOT include any text outside the JSON structure.
The entire response MUST be a single JSON array containing ${numRecipesToGenerate} recipe object(s).

JSON Schema for each recipe object:
{
  "id": "string (A unique identifier for the recipe, e.g., recipe-123. Make this unique for each recipe generated.)",
  "name": "string (Creative and appealing recipe title, appropriate for a ${recipeCategoryFocus === 'Dessert' ? 'dessert' : 'meal'})",
  "description": "string (A brief, enticing 1-2 sentence description of the dish)",
  "servings": "number (This should ideally match or be easily scalable from the '${numPeople}' specified above, e.g., if numPeople is 2, servings could be 2 or 4)",
  "prepTime": "string (e.g., '15 minutes', '1 hour')",
  "cookTime": "string (e.g., '30 minutes', '45 minutes', or 'No-bake' for some desserts)",
  "cuisineType": "string (e.g., 'Italian', 'American', 'French Pastry' etc. - choose ONE suitable for the ${recipeCategoryFocus === 'Dessert' ? 'dessert' : 'meal'})",
  "ingredients": [
    { "name": "string", "quantity": "string (e.g., '1/2', '1', '200')", "unit": "string (e.g., 'cup', 'tbsp', 'grams', 'cloves', 'medium', 'piece'. Prefer metric units like grams, ml, kg, ltr where appropriate, but also use common culinary units.)" }
  ],
  "instructions": [
    "string (Clear, step-by-step cooking instructions. Be concise yet thorough.)"
  ],
  "equipmentNeeded": ["string (List specific equipment from 'Available Kitchen Equipment' that are essential for this recipe, e.g. 'Oven', 'Blender', 'Stand Mixer')"],
  "notes": "string (Optional: suggestions for substitutions, tips for success, or how to make it more budget-friendly if applicable)",
  "imageUrl": "string (Optional: A placeholder image URL like 'https://source.unsplash.com/random/400x300/?{dish-name}' or a suggestion for one. If not confident, omit or use a generic food placeholder string.)"
}

Important Considerations:
1.  Servings: The "servings" field in each recipe object should be appropriate for the "${numPeople}" eating/servings desired.
2.  Focus: If generating desserts, ensure the recipes are clearly desserts. If meals, ensure they are appropriate meals.
3.  Budget: Ensure recipes are budget-friendly. If a specific budget constraint is provided, make a strong effort to meet it.
4.  Dietary Needs: Adhere strictly to dietary restrictions and allergies.
5.  Previously Disliked Recipes: CRITICAL - Do NOT generate recipes that are the same as or very similar to names in the "Previously Disliked Recipe Names" list: ${dislikedRecipeNamesString}.
6.  Skill Level: Match recipe complexity to the user's skill level.
7.  Equipment: Only list equipment from "Available Kitchen Equipment". Adapt if crucial equipment is missing.
8.  Variety: If generating multiple recipes, ensure they are distinct.
9.  Formatting: No markdown within JSON string values.
10. Units: Prefer metric units (grams, milliliters, kilograms, liters) where appropriate for ingredient quantities, but also use common culinary units (cups, tbsp, tsp, pieces, etc.) when they make more sense for an ingredient. Represent fractional quantities as strings (e.g., "1/2").
11. Image URL: If you can generate a relevant placeholder image URL (e.g., using Unsplash with keywords based on the dish name), include it. Otherwise, omit this field or use a generic one like "placeholder_food_image.jpg".
12. IDs: Ensure the "id" field for each recipe is unique within the generated set.

Output ONLY the JSON array.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8, 
      }
    });
    
    return parseGeminiResponse(response.text);

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid API Key. Please check your Gemini API key.");
    }
    if (error.toString().includes("RESOURCE_EXHAUSTED") || error.toString().includes("quota")) {
        throw new Error("Recipe generation quota likely exceeded. Please try again later.");
    }
    throw new Error(`Failed to generate recipes. ${error instanceof Error ? error.message : String(error)}`);
  }
};