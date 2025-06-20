
import React from 'react';

const SettingsScreen: React.FC = () => {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">App Settings</h2>
      
      <div className="space-y-8">
        {/* Notification Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="mealReminders" className="text-gray-600">Meal Reminders</label>
              <input type="checkbox" id="mealReminders" className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="shoppingAlerts" className="text-gray-600">Shopping List Alerts</label>
              <input type="checkbox" id="shoppingAlerts" className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500" />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="expirationWarnings" className="text-gray-600">Expiration Warnings (Future)</label>
              <input type="checkbox" id="expirationWarnings" className="form-checkbox h-5 w-5 text-green-600 rounded focus:ring-green-500" disabled />
            </div>
          </div>
        </section>

        {/* Theme Settings */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Appearance</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select 
                id="theme" 
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                defaultValue="system"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode (Future)</option>
                <option value="system">System Default (Future)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Data Management</h3>
          <div className="space-y-3">
            <button className="w-full text-left text-blue-600 hover:text-blue-800 py-2">Export My Data (Future)</button>
            <button className="w-full text-left text-red-600 hover:text-red-800 py-2">Delete My Account (Future)</button>
          </div>
        </section>

        {/* About Section */}
         <section>
          <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">About</h3>
            <p className="text-sm text-gray-500">AI Meal Planner Pro v1.0.0</p>
            <p className="text-sm text-gray-500">© 2024 Your Company Name</p>
        </section>

      </div>
       <p className="text-center text-gray-400 mt-8 text-sm">More settings coming soon!</p>
    </div>
  );
};

export default SettingsScreen;