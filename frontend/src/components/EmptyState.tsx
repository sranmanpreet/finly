import React from "react";

interface EmptyStateProps {
  fileUploaded?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ fileUploaded }) => (
  <div className="text-gray-400 text-center mt-12">
    <span className="text-6xl block mb-2">📄</span>
    {fileUploaded ? (
      <p>No transactions match your filter criteria. Try adjusting your filters.</p>
    ) : (
      <p>No transactions to display. Please upload a CSV file.</p>
    )}
  </div>
);

export default EmptyState;