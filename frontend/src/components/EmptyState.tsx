import React from "react";

interface EmptyStateProps {
  fileUploaded?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ fileUploaded }) => (
  <div className="bg-white shadow rounded p-2 w-full max-w-2xl mx-auto mb-2 text-gray-400 text-center">
    <span className="text-3xl block mb-1">📄</span>
    {fileUploaded ? (
      <p className="text-sm text-gray-500">
        No transactions match your filter criteria.
        <br />
        <span className="text-blue-600">Try adjusting your filters.</span>
      </p>
    ) : (
      <p className="text-sm text-gray-500">
        No transactions to display.
        <br />
        <span className="text-blue-600">Please upload a CSV file.</span>
      </p>
    )}
  </div>
);

export default EmptyState;