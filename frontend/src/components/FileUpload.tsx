import React, { ChangeEvent, RefObject } from "react";

interface FileUploadProps {
  file: File | null;
  dragActive: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
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
    className={`bg-white dark:bg-gray-900 shadow rounded p-2 w-full max-w-2xl mx-auto mb-2 border transition-colors duration-200 ${
      dragActive ? "border-blue-500 dark:border-blue-400" : "border-gray-200 dark:border-gray-700"
    }`}
    onDragEnter={handleDrag}
    onDragOver={handleDrag}
    onDragLeave={handleDrag}
    onDrop={handleDrop}
  >
  <h1 className="text-base font-semibold mb-2 text-center text-gray-800 dark:text-gray-100">Transaction Categorizer</h1>
    <div
      className={`flex flex-col items-center justify-center border border-dashed rounded p-2 mb-2 cursor-pointer ${
        dragActive ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-700"
      }`}
      onClick={handleBrowseClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        onChange={handleFileChange}
        className="hidden"
      />
      <span className="text-2xl mb-1 text-blue-400">📂</span>
  <p className="text-gray-700 dark:text-gray-200 mb-0.5 text-sm">
        Drag & drop your <b>CSV or Excel</b> file here, or{" "}
        <span className="text-blue-600 underline cursor-pointer">browse</span> to select.
      </p>
  {file && <p className="text-green-600 dark:text-green-400 mt-1 text-xs">Selected: {file.name}</p>}
    </div>
  {error && <div className="text-red-500 dark:text-red-400 mt-1 text-sm">{error}</div>}
  </div>
);

export default FileUpload;