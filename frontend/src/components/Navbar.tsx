import React from "react";

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>; // <-- Fix here
}

const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode }) => (
  <nav className="bg-white dark:bg-gray-900 border-b shadow-sm px-6 py-3 flex items-center justify-between sticky top-0 z-20">
    <div className="flex items-center space-x-8">
      <span className="text-2xl font-bold tracking-tight text-blue-700 dark:text-blue-300 flex items-center">
        <span className="mr-2" role="img" aria-label="logo">💸</span>
        CatagoryBuilder
      </span>
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Dashboard</a>
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Reports</a>
      <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Settings</a>
    </div>
    <button
      onClick={() => setDarkMode((d) => !d)}
      className="ml-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      title="Toggle light/dark mode"
    >
      {darkMode ? "🌙 Dark" : "☀️ Light"}
    </button>
  </nav>
);

export default Navbar;