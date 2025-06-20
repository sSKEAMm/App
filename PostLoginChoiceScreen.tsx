
import React from 'react';

interface PostLoginChoiceScreenProps {
  userName?: string;
  onChoseCreateCookbook: () => void;
  onChoseJoinFamily: () => void;
}

const PostLoginChoiceScreen: React.FC<PostLoginChoiceScreenProps> = ({ userName, onChoseCreateCookbook, onChoseJoinFamily }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">
        Welcome, {userName || "Foodie"}!
      </h2>
      <p className="text-lg text-gray-700 mb-8">How would you like to get started?</p>

      <div className="space-y-4 w-full max-w-sm">
        <button
          onClick={onChoseCreateCookbook}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
          aria-label="Create New Cookbook and set up your profile"
        >
          <span className="text-xl">🍽️ Create New Cookbook</span>
          <span className="block text-sm opacity-90 mt-1">Personalize your culinary journey</span>
        </button>
        
        <button
          onClick={onChoseJoinFamily}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition duration-150 ease-in-out transform hover:scale-105"
          aria-label="Join an existing Family Group"
        >
           <span className="text-xl">👨‍👩‍👧‍👦 Join Family Group</span>
           <span className="block text-sm opacity-90 mt-1">Collaborate on meals and shopping</span>
        </button>
      </div>
       <p className="text-xs text-gray-500 mt-10">You can always change your preferences later.</p>
    </div>
  );
};

export default PostLoginChoiceScreen;
