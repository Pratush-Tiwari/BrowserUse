// src/ui/src/App.tsx
import React, { useState } from 'react';
import useAuth from './hooks/useAuth';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ProfileManagement from './components/Profile/ProfileManagement'; // Import ProfileManagement
import { auth } from './firebase'; // Direct import for signOut
import { signOut } from 'firebase/auth';

// Placeholder for Shadcn UI Button
// import { Button } from "@/components/ui/button";

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [showLogin, setShowLogin] = useState(true); // Toggle between Login and SignUp forms

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      // Optionally, send a message to background or clear local state
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading authentication status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          {showLogin ? <Login /> : <SignUp />}
          <button
            onClick={() => setShowLogin(!showLogin)}
            className="mt-4 text-center w-full text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            {showLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    );
  }

  // User is logged in
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Blurmy Dashboard</h1>
        <button
          onClick={handleLogout}
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>
      <p className="mb-2">Welcome, {user.email}!</p>
      <p>This is where your profile management and other features will go.</p>
      {/* Placeholder for ProfileManagement component */}
      <ProfileManagement />
      {/* The API key input is now part of ProfileManagement.tsx */}
      {/*
      <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        <h3 className="text-lg font-medium mb-2">Profile Management Area (Placeholder)</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Profile creation and editing components will be displayed here.
        </p>
      </div>
       <div className="mt-4 p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md">
        <h3 className="text-lg font-medium mb-2">API Key Input (Placeholder)</h3>
         <label htmlFor="api-key-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your API Key</label>
        <input
            id="api-key-input"
            type="text"
            placeholder="Paste your API key here"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
      </div>
    </div>
  );
};

export default App;
