import React, { useState } from "react";
import * as XLSX from "xlsx";

const EXPECTED_COLUMNS = [
  "date",
  "description",
  "credit",
  "debit"
];

export interface FileEditorProps {
  file: File;
  onProcess: (data: any[], columnMap: Record<string, string>) => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onProcess }) => {
  const [sheetData, setSheetData] = useState<any[][]>([]);
  const [headerRowIdx, setHeaderRowIdx] = useState(0);
  const [columnMap, setColumnMap] = useState<Record<string, string>>({});
  const [editData, setEditData] = useState<any[][]>([]);

  React.useEffect(() => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      setSheetData(rows);
      setEditData(rows);
    };
    reader.readAsArrayBuffer(file);
  }, [file]);

  // When header row changes, update column map
  React.useEffect(() => {
    if (sheetData.length > headerRowIdx) {
      const headers = sheetData[headerRowIdx];
      const map: Record<string, string> = {};
      EXPECTED_COLUMNS.forEach((col) => {
        // Try to auto-map by name, only if header is a string
        const found = headers.find((h: any) => typeof h === "string" && h.toLowerCase().includes(col));
        map[col] = found || "";
      });
      setColumnMap(map);
    }
  }, [headerRowIdx, sheetData]);

  // Inline cell editing
  const handleCellEdit = (rowIdx: number, colIdx: number, value: string) => {
    setEditData((prev) => {
      const copy = prev.map((row) => [...row]);
      copy[rowIdx][colIdx] = value;
      return copy;
    });
  };

  // Process button handler
  const handleProcess = () => {
    const headers = editData[headerRowIdx];
    const dataRows = editData.slice(headerRowIdx + 1);
    const mapped = dataRows.map((row) => {
      const obj: any = {};
      // Map expected columns to values
      Object.entries(columnMap).forEach(([expected, actual]) => {
        const idx = headers.indexOf(actual);
        obj[expected] = idx !== -1 ? row[idx] : "";
      });
      // Preprocess narration/description for better categorization (matches backend)
      let narration = obj.narration || obj.description || "";
      narration = narration
        .replace(/\d+/g, "")
        .replace(/[^a-z\s]/gi, " ")
        .replace(/upi|okicici|gpay/gi, "")
        .trim();
      obj.narration = narration;
      obj.description = obj.description || narration;
      // Ensure compatibility with Transaction type
      // Map credit/debit to amount if only one is present
      if (obj.credit && !obj.debit) obj.amount = Number(obj.credit);
      else if (obj.debit && !obj.credit) obj.amount = Number(obj.debit);
      else if (obj.credit && obj.debit) obj.amount = Number(obj.credit) - Number(obj.debit);
      // Fallbacks for required keys
      obj.date = obj.date || "";
      obj.category = obj.category || "";
      return obj;
    });
    onProcess(mapped, columnMap);
  };

  // Check if all expected columns are mapped
  const allMapped = EXPECTED_COLUMNS.every((col) => columnMap[col] && columnMap[col] !== "");

  // Remove row handler
  const handleRemoveRow = (rowIdx: number) => {
    setEditData((prev) => prev.filter((_, idx) => idx !== rowIdx));
  };

  return (
  <div className="bg-white dark:bg-gray-900 shadow-xl rounded-lg p-2 sm:p-4 mb-4 w-full max-w-full overflow-x-auto border border-gray-200 dark:border-gray-700">
  <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100 border-b pb-2 border-gray-200 dark:border-gray-700">File Editor & Column Mapper</h2>
  <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-blue-900 dark:text-blue-100 text-xs">
        <b>Instructions:</b> Use this editor to preview, map, and clean your transaction data before processing.<br />
        <ul className="list-disc ml-5 mt-1">
          <li>Select the correct header row if your file has extra rows at the top.</li>
          <li>Map each required column to the correct header from your file.</li>
          <li>Edit any cell directly by clicking on it. Remove rows if needed.</li>
          <li>The <b>Process</b> button will be enabled once all required columns are mapped.</li>
        </ul>
      </div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Header row:</label>
          <select
            value={headerRowIdx}
            onChange={(e) => setHeaderRowIdx(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 max-w-full sm:max-w-xs"
          >
            {sheetData.map((row, idx) => (
              <option key={idx} value={idx}>
                Row {idx + 1}: {row.slice(0, 5).join(", ").length > 40 ? row.slice(0, 5).join(", ").slice(0, 40) + "..." : row.slice(0, 5).join(", ")}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <h3 className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">Column Mapping</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
            {EXPECTED_COLUMNS.map((col) => (
              <div key={col} className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
                <span className="w-28 text-gray-700 dark:text-gray-200 font-medium">{col}</span>
                <select
                  value={columnMap[col] || ""}
                  onChange={(e) => setColumnMap((prev) => ({ ...prev, [col]: e.target.value }))}
                  className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100 max-w-full sm:max-w-xs"
                >
                  <option value="">-- Not mapped --</option>
                  {sheetData[headerRowIdx]?.map((h: string, idx: number) => (
                    <option key={idx} value={h}>{typeof h === "string" && h.length > 30 ? h.slice(0, 30) + "..." : h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mb-2">
        <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
          <div style={{ minWidth: '100%', overflowX: 'auto' }}>
            <button
              className={`mb-3 px-3 sm:px-4 py-1 sm:py-1.5 font-semibold rounded transition-colors duration-150 ${allMapped ? "bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800" : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"}`}
              onClick={handleProcess}
              disabled={!allMapped}
            >
              Process
            </button>
          </div>
        </div>
        <div className="overflow-x-auto w-full" style={{ scrollbarWidth: 'thin' }}>
          <table className="min-w-max w-full border border-gray-300 dark:border-gray-700 text-xs sm:text-sm shadow-sm rounded-lg">
            <thead>
              <tr className="bg-blue-50 dark:bg-blue-950">
                {editData[headerRowIdx]?.map((h: string, idx: number) => (
                  <th key={idx} className="border border-gray-300 dark:border-gray-700 px-2 sm:px-3 py-2 font-semibold text-gray-700 dark:text-gray-100 text-left whitespace-nowrap">{h}</th>
                ))}
                <th className="border border-gray-300 dark:border-gray-700 px-2 sm:px-3 py-2 font-semibold text-gray-700 dark:text-gray-100 text-center whitespace-nowrap">Remove</th>
              </tr>
            </thead>
            <tbody>
              {editData.slice(headerRowIdx + 1).map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                  {row.map((cell: string, cIdx: number) => (
                    <td key={cIdx} className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-1">
                      <input
                        className="w-full border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-gray-100"
                        value={cell}
                        onChange={(e) => handleCellEdit(rIdx + headerRowIdx + 1, cIdx, e.target.value)}
                      />
                    </td>
                  ))}
                  <td className="border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-1 text-center">
                    <button
                      className="text-xs sm:text-sm text-red-600 dark:text-red-400 hover:underline font-semibold"
                      onClick={() => handleRemoveRow(rIdx + headerRowIdx + 1)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FileEditor;
