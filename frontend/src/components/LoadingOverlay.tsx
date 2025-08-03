import React from "react";

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow flex items-center space-x-2">
      <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span>Loading...</span>
    </div>
  </div>
);

export default LoadingOverlay;