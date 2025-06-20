# AI Meal Planner Pro

A comprehensive recipe and meal planning mobile-first web application that generates personalized, budget-friendly recipes based on user preferences, dietary requirements, and available ingredients using the Google Gemini AI.

## ✨ Features

*   **User Authentication (Simulated):** Simple login flow with Google/Apple options.
*   **Onboarding & Profile Setup:**
    *   Multi-step, paginated form for a modern UX.
    *   Collects dietary requirements (vegetarian, vegan, keto, etc.).
    *   Identifies food allergies and intolerances.
    *   Captures cuisine preferences and dislikes.
    *   Determines cooking skill level.
    *   Inventories available kitchen equipment.
*   **AI-Powered Recipe Generation:**
    *   Generates 7 recipes at a time (for meals and desserts).
    *   Considers user profile (diet, allergies, preferences, skill, equipment).
    *   Allows users to specify the number of people eating and a budget constraint.
    *   Learns from user feedback (disliked recipes are avoided in future suggestions).
    *   Dedicated "Desserts" generation mode.
*   **Interactive Recipe Discovery:**
    *   "Tinder-style" swipe interface (Like/Dislike buttons) for newly generated recipes.
    *   Liked recipes are saved and can be favorited.
    *   Disliked recipes are tracked to improve AI suggestions.
*   **Recipe Management:**
    *   "My Favorite Recipes" page to view all favorited meals.
    *   "Recently Disliked Recipes" page to review and "un-dislike" items.
    *   Detailed recipe view with ingredients, instructions, prep/cook times, and image.
*   **Shopping List Management:**
    *   Multiple Shopping Lists: Users can create and manage different lists (e.g., "Home Grocery", "Office", "Party").
    *   Automatic Item Categorization: Items added to the shopping list are automatically categorized based on keywords (e.g., "Produce", "Dairy").
    *   Add ingredients from recipes to the active shopping list.
    *   Modern UI inspired by user-provided design, with clear category groupings and easy item management.
    *   Checkbox for items, clear checked items, clear all items.
    *   Modal for adding new items.
*   **Weekly Meal Planning:**
    *   Select favorite recipes to plan for the week.
    *   View planned recipes with step-by-step instructions and placeholders for how-to videos.
    *   Add all ingredients from the weekly plan to the shopping list.
*   **Navigation & UI:**
    *   Home screen dashboard with quick access buttons to major features.
    *   Side menu (hamburger menu) for navigation to Profile, Settings, Favorites, etc., and Logout.
    *   Floating Action Button (FAB) for quick access to the Shopping List.
    *   Clean, modern, mobile-first design with a subtle gradient background.
    *   Responsive elements and modal dialogs for various actions.
*   **Settings Page:** Placeholder for future app settings (notifications, theme, data management).

## ቴክ Tech Stack

*   **Frontend:** React (using ES Modules and import maps), TypeScript
*   **Styling:** Tailwind CSS
*   **AI:** Google Gemini API (`@google/genai`) for recipe generation.
*   **Local Storage:** Used for persisting user profiles, recipes, shopping lists, and application state.

## 🚀 Setup and Running the Application

This project is set up to run directly in a browser that supports ES Modules and import maps, without a traditional Node.js build step for dependencies like React or `@google/genai`.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   A text editor (e.g., VS Code).
*   A way to serve `index.html` locally (e.g., VS Code Live Server extension, Python's `http.server`, or any simple web server).

### 1. API Key Setup

This application requires a Google Gemini API key to generate recipes.

*   **Obtain an API Key:** Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   **Environment Variable:** The application attempts to read the API key from an environment variable `API_KEY`.
    *   In a typical Node.js/bundler setup, you would use a `.env` file:
        ```
        API_KEY=YOUR_GEMINI_API_KEY_HERE
        ```
    *   **For pure client-side testing without a build process:** Since `process.env` is not directly available in the browser in this setup, you have a few options for local development:
        1.  **Temporary Hardcoding (Not Recommended for Production):** For quick local testing, you *could* temporarily modify `App.tsx` around line 33:
            ```typescript
            // const envApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : null;
            const envApiKey = "YOUR_GEMINI_API_KEY_HERE"; // Replace with your actual key for testing
            if (envApiKey) setApiKey(envApiKey);
            ```
            **Remember to remove this before sharing or deploying your code.**
        2.  **Using a Local Server with Environment Injection:** If you use a more advanced local server, it might have mechanisms to inject environment variables into your `index.html` or a linked JavaScript file.
        3.  **Create `config.js` (Recommended for Client-Side if no build):**
            *   Create a `config.js` file in the root directory (same level as `index.html`):
                ```javascript
                // config.js
                window.APP_CONFIG = {
                  API_KEY: "YOUR_GEMINI_API_KEY_HERE"
                };
                ```
            *   Add this script tag to `index.html` **before** `index.tsx` is loaded:
                ```html
                <script src="/config.js"></script>
                ```
            *   Modify `App.tsx` to read from `window.APP_CONFIG`:
                ```typescript
                useEffect(() => {
                  // const envApiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY ? process.env.API_KEY : null;
                  const envApiKey = (window as any).APP_CONFIG?.API_KEY || null;
                  if (envApiKey) setApiKey(envApiKey);
                  else console.warn("API Key not found. Please ensure it's configured in config.js or via process.env.");
                }, []);
                ```
            *   Add `config.js` to your `.gitignore` file to avoid committing your API key.

### 2. Running the Application

1.  **Clone the Repository (if applicable):**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
    If you received the files directly, just place them in a folder.

2.  **Serve `index.html`:**
    *   **Using VS Code Live Server:**
        *   Install the "Live Server" extension in VS Code.
        *   Open the project folder in VS Code.
        *   Right-click on `index.html` in the Explorer panel and select "Open with Live Server".
    *   **Using Python Simple HTTP Server (Python 3):**
        *   Open your terminal or command prompt.
        *   Navigate to the project's root directory (where `index.html` is located).
        *   Run the command: `python -m http.server`
        *   Open your browser and go to `http://localhost:8000`.
    *   Other simple web servers will also work.

3.  **Open in Browser:** The application should now be accessible in your web browser.

## 📁 Project Structure

*   `index.html`: The main HTML file, includes Tailwind CSS CDN and the import map for dependencies.
*   `index.tsx`: The entry point for the React application.
*   `App.tsx`: The main application component, handling state, navigation, and rendering of different screens.
*   `metadata.json`: Contains application metadata like name and requested permissions.
*   `types.ts`: Defines global TypeScript types and enums.
*   `constants.ts`: Contains global constants like form options and API model names.
*   `utils.ts`: Utility functions (e.g., auto-categorizing shopping list items).
*   `hooks/`: Custom React hooks (e.g., `useLocalStorage.ts`).
*   `components/`: Contains all React components for different UI elements and screens.
    *   `AuthScreen.tsx`, `PostLoginChoiceScreen.tsx`, `JoinFamilyScreen.tsx`: User authentication and initial choice flow.
    *   `OnboardingForm.tsx`: Multi-step user profile setup.
    *   `HomeScreen.tsx`: Main dashboard with navigation buttons.
    *   `RecipeList.tsx`: Handles meal recipe generation and interaction.
    *   `DessertRecipesScreen.tsx`: Handles dessert recipe generation and interaction.
    *   `RecipeCard.tsx`: Displays individual recipe cards.
    *   `FavoriteRecipesScreen.tsx`: Displays favorited recipes.
    *   `RecentlyDislikedScreen.tsx`: Displays recently disliked recipes.
    *   `WeeklyPicksScreen.tsx`: For planning weekly meals.
    *   `ShoppingListDisplay.tsx`: Manages and displays multiple shopping lists.
    *   `SideMenu.tsx`: Slide-out navigation menu.
    *   `Navbar.tsx`: Bottom navigation bar.
    *   `SettingsScreen.tsx`: Application settings page.
    *   `RecipeGenerationSetup.tsx`: Form for setting recipe generation preferences.
    *   `Modal.tsx`, `Pill.tsx`, `SelectablePill.tsx`, `LoadingSpinner.tsx`: Reusable UI components.
*   `services/`:
    *   `geminiService.ts`: Handles communication with the Google Gemini API for recipe generation.

## 📝 Notes

*   **API Key Security:** The `API_KEY` should be treated as a secret. Never commit it directly into your version control system if hardcoding for testing. The `.env` file or `config.js` (if gitignored) approach is safer for local development. For production, the API key should be managed securely, typically by making API calls through a backend proxy.
*   **Simulated Features:** Some features like actual OAuth with Google/Apple, family group backend logic, and QR code scanning libraries are currently simulated or placeholders due to the complexity of full implementation without a backend.
*   **Camera Permission:** The `metadata.json` requests camera permission for the "Join Family" QR code scanning feature, even though the scanning itself is currently simulated.

## 🔮 Future Enhancements (Conceptual)

*   Full OAuth integration for Google & Apple sign-in.
*   Backend for family group management and real-time collaboration.
*   Integration of a QR code scanning library.
*   Voice input for shopping list and recipe interaction.
*   Dark mode and theme customization.
*   Advanced nutritional tracking.
*   Pantry item expiration warnings.

This README should provide a good starting point for understanding and setting up your AI Meal Planner application!
