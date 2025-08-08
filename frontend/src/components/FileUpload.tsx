import React, { ChangeEvent, RefObject } from "react";

interface FileUploadProps {
  file: File | null;
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement | null>; // <-- Fix here
  handleDrag: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  handleBrowseClick: () => void;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
  loading: boolean;
  error: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  dragActive,
  inputRef,
  handleDrag,
  handleDrop,
  handleBrowseClick,
  handleFileChange,
  handleUpload,
  loading,
  error,
}) => (
  <div
    className={`bg-white shadow-md rounded-lg p-6 w-full max-w-xl mx-auto mb-6 border-2 transition-colors duration-200 ${
      dragActive ? "border-blue-500" : "border-transparent"
    }`}
    onDragEnter={handleDrag}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
  >
    <h1 className="text-2xl font-bold mb-4 text-center">Transaction Categorizer</h1>
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 mb-4 cursor-pointer ${
        dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onClick={handleBrowseClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-4xl mb-2 text-blue-400">📂</span>
      <p className="text-gray-700 mb-1">
        Drag & drop your CSV file here, or{" "}
        <span className="text-blue-600 underline cursor-pointer">browse</span>
      </p>
      {file && <p className="text-green-600 mt-2">Selected: {file.name}</p>}
    </div>
    <button
      onClick={handleUpload}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      disabled={loading}
    >
      {loading ? "Uploading..." : "Upload"}
    </button>
    {error && <div className="text-red-500 mt-2">{error}</div>}
  </div>
);

export default FileUpload;