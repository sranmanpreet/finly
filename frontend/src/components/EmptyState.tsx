import React from "react";

const EmptyState = () => (
  <div className="text-gray-400 text-center mt-12">
    <span className="text-6xl block mb-2">📄</span>
    <p>No transactions to display. Please upload a CSV file.</p>
  </div>
);

export default EmptyState;