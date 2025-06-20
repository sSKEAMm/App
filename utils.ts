
import { PANTRY_CATEGORIES } from './constants';

// Basic keyword-based categorization for shopping list items
const categoryKeywords: Record<string, string[]> = {
  "Produce": ["apple", "banana", "orange", "lettuce", "tomato", "potato", "onion", "broccoli", "spinach", "carrot", "pepper", "grape", "strawberry", "berry", "melon", "salad", "vegetable", "fruit", "garlic", "ginger", "lemon", "lime", "cabbage", "celery", "cucumber", "avocado", "corn"],
  "Dairy & Eggs": ["milk", "cheese", "yogurt", "butter", "cream", "egg", "sour cream", "cottage cheese"],
  "Meat & Seafood": ["chicken", "beef", "pork", "turkey", "fish", "salmon", "tuna", "shrimp", "sausage", "bacon", "steak", "lamb", "ground meat", "deli meat"],
  "Bakery": ["bread", "bagel", "croissant", "muffin", "cake", "pie", "cookies", "pastry", "tortilla", "buns", "rolls"],
  "Pantry Staples": [
    "rice", "pasta", "flour", "sugar", "salt", "oil", "vinegar", "cereal", "oats", "beans", 
    "lentils", "soup", "canned tomatoes", "canned vegetables", "canned fruit", "broth", "stock", 
    "spice", "herb", "condiment", "sauce", "ketchup", "mustard", "mayonnaise", "mayo", "jam", 
    "jelly", "honey", "syrup", "coffee", "tea", "baking powder", "baking soda", "yeast", 
    "chocolate chips", "vanilla extract", "soy sauce", "hot sauce", "dressing"
  ],
  "Snacks": ["chips", "crackers", "pretzels", "popcorn", "nuts", "seeds", "trail mix", "granola bars", "fruit snacks", "candy"],
  "Frozen Foods": ["frozen vegetables", "frozen fruit", "ice cream", "frozen pizza", "frozen meal", "waffles", "fries", "frozen potatoes"],
  "Beverages": ["water", "juice", "soda", "pop", "beverage", "energy drink", "sports drink", "iced tea", "sparkling water"],
  "Household": ["detergent", "soap", "cleaner", "paper towel", "toilet paper", "trash bag", "dish soap", "sponge", "foil", "plastic wrap", "napkins"],
  "Personal Care": ["shampoo", "conditioner", "body wash", "toothpaste", "deodorant", "razor", "feminine hygiene"],
  "Baby": ["diapers", "wipes", "baby food", "formula"],
  "Pets": ["dog food", "cat food", "pet treats", "cat litter"],
};

export function getShoppingItemCategory(itemName: string): string {
  const lowerItemName = itemName.toLowerCase();

  // Check for multi-word keywords first for better accuracy
  for (const category of PANTRY_CATEGORIES) {
    if (categoryKeywords[category]) {
      for (const keyword of categoryKeywords[category]) {
        if (lowerItemName.includes(keyword) && keyword.includes(" ")) { // Prioritize multi-word
          if (new RegExp(`\\b${keyword}\\b`).test(lowerItemName)) { // Whole word match for multi-word
             return category;
          }
        }
      }
    }
  }
  
  // Then check single word keywords
  for (const category of PANTRY_CATEGORIES) {
    if (categoryKeywords[category]) {
      for (const keyword of categoryKeywords[category]) {
         if (!keyword.includes(" ")) { // Single word
            if (new RegExp(`\\b${keyword}\\b`).test(lowerItemName)) {
                return category;
            }
         }
      }
    }
  }

  // Fallback: if a general keyword from any category is found (less precise)
  for (const category of PANTRY_CATEGORIES) {
    if (categoryKeywords[category]) {
      if (categoryKeywords[category].some(keyword => lowerItemName.includes(keyword))) {
        return category;
      }
    }
  }

  return "Other"; // Default category
}
