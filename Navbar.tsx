import React from 'react';
import { AppTab } from '../types';
import { NAV_ICON_SIZE, ACTIVE_NAV_ICON_COLOR, INACTIVE_NAV_ICON_COLOR } from '../constants';

interface NavbarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

// SVG Icons (Heroicons)
const ShoppingListIcon: React.FC<{className?: string}> = ({className}) => (
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);


const NavItem: React.FC<{
  label: AppTab;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 flex-1 rounded-lg transition-colors duration-150 ease-in-out
                ${isActive ? 'bg-green-100' : 'hover:bg-gray-100'}`}
    aria-label={`Navigate to ${label}`}
    role="tab"
    aria-selected={isActive}
  >
    {icon}
    <span className={`text-xs mt-1 ${isActive ? ACTIVE_NAV_ICON_COLOR : INACTIVE_NAV_ICON_COLOR }`}>{label}</span>
  </button>
);


const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    // AppTab.MY_RECIPES is removed.
    // The FAB provides primary access to Shopping List, this bottom nav item is now secondary or can be removed if desired.
    // For now, keeping it as per implicit state from previous turn.
    { label: AppTab.SHOPPING_LIST, icon: <ShoppingListIcon className={`${NAV_ICON_SIZE} ${activeTab === AppTab.SHOPPING_LIST ? ACTIVE_NAV_ICON_COLOR : INACTIVE_NAV_ICON_COLOR}`} /> },
  ];

  // If no items, can choose to render nothing or a placeholder.
  if (navItems.length === 0) {
    return null; 
  }

  return (
    <nav className="border-t border-gray-200 bg-white shadow-top p-2 fixed bottom-0 left-0 right-0 z-10" role="tablist">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(item => (
          <NavItem
            key={item.label}
            label={item.label}
            icon={item.icon}
            isActive={activeTab === item.label}
            onClick={() => onTabChange(item.label)}
          />
        ))}
      </div>
    </nav>
  );
};

export default Navbar;