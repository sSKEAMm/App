import React from 'react';
import { AppTab, UserProfile } from '../types';

// Icons for side menu items
const HomeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

const ProfileIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const SettingsIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.93l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.93l.15-.893z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

const FavoriteIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const RecipePrefsIcon: React.FC<{className?: string}> = ({ className }) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75V15m0 0V12.75m0 2.25H14.25m-2.25 0H9.75M12 15V6.75" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 6.75C7.5 5.645 8.355 4.75 9.375 4.75H14.625c1.02 0 1.875.895 1.875 2V11.25c0 .995-.506 1.9-1.318 2.457l-.08.053a1.28 1.28 0 01-1.428 0l-.08-.053C12.006 13.15 11.5 12.245 11.5 11.25V6.75" />
</svg>
);

const DislikeIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.95a7.5 7.5 0 100 14.1M10.05 4.95v14.1m0-14.1H5.025m5.025 0h5.025M5.025 4.95c-1.32.733-2.25 2.09-2.25 3.55s.93 2.817 2.25 3.55m5.025 7s2.25-.267 2.25-2.333m0 0S14.55 15 12.3 15m0 0V7.333" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18" />
  </svg>
);

const DiscoverIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const WeeklyPicksIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 12.75h.008v.008H12v-.008zM12 9.75h.008v.008H12V9.75z" />
    </svg>
);

const ShoppingListIconSM: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

const DessertIconSM: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 15.062a3.375 3.375 0 01-3.375 3.375H6.375A3.375 3.375 0 013 15.062V11.25A3.375 3.375 0 016.375 7.875h11.25A3.375 3.375 0 0121 11.25v3.812z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 11.25C3.375 7.97 5.97 5.25 9.375 5.25c1.458 0 2.859.526 3.96 1.416M20.625 11.25c0-3.28-2.6-6-6-6-1.458 0-2.859.526-3.96 1.416" />
    </svg>
);


interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: AppTab) => void;
  onLogout: () => void;
  userProfile: UserProfile | null;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onNavigate, onLogout, userProfile }) => {
  const menuItems = [
    { label: 'Home', tab: AppTab.HOME, icon: <HomeIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Discover New Recipes', tab: AppTab.FIND_RECIPES, icon: <DiscoverIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Desserts', tab: AppTab.DESSERTS, icon: <DessertIconSM className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'My Profile', tab: AppTab.PROFILE_SETTINGS, icon: <ProfileIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Recipe Preferences', tab: AppTab.RECIPE_PREFERENCES, icon: <RecipePrefsIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Favorite Recipes', tab: AppTab.FAVORITES, icon: <FavoriteIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Recipes for the Week', tab: AppTab.WEEKLY_PICKS, icon: <WeeklyPicksIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Shopping List', tab: AppTab.SHOPPING_LIST, icon: <ShoppingListIconSM className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Recently Disliked', tab: AppTab.RECENTLY_DISLIKED, icon: <DislikeIcon className="w-5 h-5 mr-3 text-gray-500" /> },
    { label: 'Settings', tab: AppTab.SETTINGS, icon: <SettingsIcon className="w-5 h-5 mr-3 text-gray-500" /> },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidemenu-title"
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-gray-200">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <h2 id="sidemenu-title" className="text-xl font-semibold text-green-600">Menu</h2>
            {userProfile && (
              <div className="mt-2 text-sm">
                <p className="font-medium text-gray-700">{userProfile.name}</p>
                {userProfile.email && <p className="text-gray-500">{userProfile.email}</p>}
              </div>
            )}
          </div>

          <nav className="flex-grow p-3 space-y-1 overflow-y-auto">
            {menuItems.map(item => (
              <button
                key={item.tab}
                onClick={() => onNavigate(item.tab)}
                className="w-full flex items-center px-3 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition-colors duration-150 text-left focus:outline-none focus:bg-green-100"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-gray-200">
            <button
              onClick={onLogout}
              className="w-full flex items-center px-3 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors duration-150 text-left focus:outline-none focus:bg-red-100"
            >
              <LogoutIcon className="w-5 h-5 mr-3 text-red-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;