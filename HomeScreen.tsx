import React from 'react';
import { AppTab } from '../types';

// Re-using some icons from SideMenu or defining new simple ones for Home
const DiscoverIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const FavoriteIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const WeeklyPicksIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 12.75h.008v.008H12v-.008zM12 9.75h.008v.008H12V9.75z" />
    </svg>
);

const RecipePrefsIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
 </svg>
);

const ShoppingListIconHome: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const DessertIcon: React.FC<{className?: string}> = ({className}) => ( // Simple cake icon for desserts
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.062a3.375 3.375 0 01-3.375 3.375H6.375A3.375 3.375 0 013 15.062V11.25A3.375 3.375 0 016.375 7.875h11.25A3.375 3.375 0 0121 11.25v3.812z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 11.25C3.375 7.97 5.97 5.25 9.375 5.25c1.458 0 2.859.526 3.96 1.416M20.625 11.25c0-3.28-2.6-6-6-6-1.458 0-2.859.526-3.96 1.416" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5.25V7.875" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.438V15.063" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 18.438h6" />
    </svg>
);

interface HomeScreenProps {
  onNavigate: (tab: AppTab) => void;
}

const HomeButton: React.FC<{
  label: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string; // e.g., 'bg-green-500'
}> = ({ label, description, icon, onClick, color }) => (
  <button
    onClick={onClick}
    className={`p-4 md:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${color} text-white flex flex-col items-center justify-center text-center aspect-square`}
    aria-label={label}
  >
    <div className="mb-2 md:mb-3 text-3xl md:text-4xl">{icon}</div>
    <h3 className="text-sm md:text-base font-semibold">{label}</h3>
    <p className="text-xs md:text-sm opacity-80 mt-1">{description}</p>
  </button>
);

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  const homeButtons = [
    { 
      label: "Discover Recipes", 
      description: "Find new meal ideas",
      icon: <DiscoverIcon className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.FIND_RECIPES,
      color: "bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:ring-green-500"
    },
    { 
      label: "Delicious Desserts", 
      description: "Find sweet treats",
      icon: <DessertIcon className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.DESSERTS,
      color: "bg-gradient-to-br from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 focus:ring-pink-500"
    },
    { 
      label: "Favorite Recipes", 
      description: "Your saved meals",
      icon: <FavoriteIcon className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.FAVORITES,
      color: "bg-gradient-to-br from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 focus:ring-red-500" // Adjusted color
    },
    { 
      label: "Weekly Picks", 
      description: "Curated meals for you",
      icon: <WeeklyPicksIcon className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.WEEKLY_PICKS,
      color: "bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500"
    },
     { 
      label: "Shopping List", 
      description: "Manage your groceries",
      icon: <ShoppingListIconHome className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.SHOPPING_LIST,
      color: "bg-gradient-to-br from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 focus:ring-yellow-500"
    },
    { 
      label: "Recipe Preferences", 
      description: "Adjust generation settings",
      icon: <RecipePrefsIcon className="w-8 h-8 md:w-10 md:h-10" />, 
      tab: AppTab.RECIPE_PREFERENCES,
      color: "bg-gradient-to-br from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700 focus:ring-purple-500"
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-700 mb-2 text-center">Welcome Home, Foodie!</h2>
      <p className="text-center text-gray-600 mb-6">What would you like to do today?</p>
      
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {homeButtons.map(button => (
          <HomeButton
            key={button.tab}
            label={button.label}
            description={button.description}
            icon={button.icon}
            onClick={() => onNavigate(button.tab)}
            color={button.color}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;