import ChartCoarseCategoryPie from "../components/ChartCoarseCategoryPie";
import React, { useState, useRef, useMemo, ChangeEvent } from "react";
import FileUpload from "../components/FileUpload";
import FileEditor from "../components/FileEditor";
import MetricsCards from "../components/MetricsCards";
import Filters from "../components/Filters";
import TransactionsTable from "../components/TransactionsTable";
import ChartCategoryPie from "../components/ChartCategoryPie";
import ChartMonthlyTrend from "../components/ChartMonthlyTrend";
import ChartMonthlyCategory from "../components/ChartMonthlyCategory";
import ChartTopMerchants from "../components/ChartTopMerchants";
import ChartIncomeVsExpense from "../components/ChartIncomeVsExpense";
import useTransactions from "../hooks/useTransactions";
import { exportToCSV } from "../utils/csv";
import EmptyState from "../components/EmptyState";
import { FiltersType, SortConfig } from "../types";

const Categorizer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [columnMap, setColumnMap] = useState<Record<string, string> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);

  // Filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  // Memoize filters object to avoid unnecessary re-renders
  const filters: FiltersType = useMemo(
    () => ({ startDate, endDate, categoryFilter, search }),
    [startDate, endDate, categoryFilter, search]
  );

  // Drag-and-drop state
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sorting state for TransactionsTable
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "date",
    direction: "desc",
  });

  // useTransactions handles all data fetching and analytics
  // If rawData is set, use it for useTransactions instead of file
  const {
    transactions,
    categorySummary,
    monthlyTrend,
    monthlyCategory,
    topMerchants,
    incomeVsExpense,
    total,
    loading,
    error,
    filteredTransactions,
    metrics,
    coarseCategorySummary
  } = useTransactions(rawData || file, page, limit, filters);

  // File upload handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setRawData(null);
      setColumnMap(null);
      setPage(1);
    }
  };

  // Drag-and-drop handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setPage(1);
    }
  };

  const handleBrowseClick = () => {
    inputRef.current?.click();
  };

  // Pagination handlers
  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page * limit < total) setPage(page + 1);
  };

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = parseInt(e.target.value, 10);
    setLimit(newLimit);
    setPage(1);
  };

  // Sorting handler for TransactionsTable
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Determine if any filter is active
  const isFilterActive = !!(startDate || endDate || categoryFilter || search);

  // Use all transactions if no filter, else use filteredTransactions
  const displayTransactions = isFilterActive ? filteredTransactions : transactions;

  // Sorting
  const sortedTransactions = useMemo(() => {
    if (!displayTransactions) return [];
    const txs = [...displayTransactions];
    if (!sortConfig.key) return txs;
    if (sortConfig.key === "credit" || sortConfig.key === "debit") {
      return txs.sort((a, b) => {
        const aVal = Number(a[sortConfig.key]) || 0;
        const bVal = Number(b[sortConfig.key]) || 0;
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      });
    }
    return txs.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [displayTransactions, sortConfig]);

  // Pagination for table
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return sortedTransactions.slice(start, end);
  }, [sortedTransactions, page, limit]);

  return (
    <div className="max-w-4xl mx-auto py-4 px-2 w-full overflow-x-hidden">
      {!file && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded text-blue-900 dark:text-blue-100 text-sm">
          <strong className="text-gray-800 dark:text-gray-100">Welcome to the Transaction Categorizer!</strong><br />
          <ul className="list-disc ml-5 mt-1">
            <li>Start by uploading your transaction file (CSV or Excel). Supported formats: .csv, .xls, .xlsx.</li>
            <li>After upload, you can preview, map columns, and edit your data before processing.</li>
            <li>Click <b>Process</b> to categorize and analyze your transactions. Charts and metrics will appear after processing.</li>
            <li>Use <b>Change File</b> to upload a new file, or <b>Export Categorized Transactions</b> to download your results.</li>
          </ul>
          <span className="block mt-2 text-gray-700 dark:text-gray-200">For best results, ensure your file contains columns for date, description, credit, and debit.</span>
        </div>
      )}
      {/* Hidden file input for changing file */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {!file ? (
        <FileUpload
          file={file}
          dragActive={dragActive}
          inputRef={inputRef}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleBrowseClick={handleBrowseClick}
          handleFileChange={handleFileChange}
          handleUpload={() => {}}
          loading={loading}
          error={error}
        />
      ) : !rawData ? (
        <>
          <FileEditor
            file={file}
            onProcess={(data, map) => {
              setRawData(data);
              setColumnMap(map);
            }}
          />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3 bg-white dark:bg-gray-900 shadow rounded p-2 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📄</span>
              <span className="text-sm text-gray-700 dark:text-gray-100 font-medium truncate max-w-xs">
                {file.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  // Open file picker immediately
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                    fileInputRef.current.click();
                  }
                }}
                className="text-xs bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded border border-blue-200 dark:border-blue-700"
                title="Upload a new file to start over."
              >
                Change File
              </button>
              {displayTransactions.length > 0 && (
                <button
                  onClick={() => exportToCSV(displayTransactions)}
                  className="text-xs bg-green-500 dark:bg-green-700 hover:bg-green-600 dark:hover:bg-green-800 text-white px-2 py-1 rounded border border-green-600 dark:border-green-700"
                  title="Download the processed and categorized transactions as a CSV file."
                >
                  Export Categorized Transactions
                </button>
              )}
            </div>
          </div>

          {/* Only show dashboard widgets if rawData is set (i.e., after Process) */}
          {rawData && (
            <>
              <div className="w-full">
                <MetricsCards metrics={metrics} />
              </div>
              <div className="w-full">
                <Filters
                  startDate={startDate}
                  endDate={endDate}
                  categoryFilter={categoryFilter}
                  search={search}
                  transactions={displayTransactions}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setCategoryFilter={setCategoryFilter}
                  setSearch={setSearch}
                  onReset={() => {
                    setStartDate("");
                    setEndDate("");
                    setCategoryFilter("");
                    setSearch("");
                  }}
                />
              </div>
              {!loading && displayTransactions.length === 0 && (
                <EmptyState fileUploaded={!!file} />
              )}
              {displayTransactions.length > 0 && (
                <TransactionsTable
                  filteredTransactions={paginatedTransactions}
                  page={page}
                  total={displayTransactions.length}
                  limit={limit}
                  handlePrev={handlePrev}
                  handleNext={handleNext}
                  handleLimitChange={handleLimitChange}
                  sortConfig={sortConfig}
                  handleSort={handleSort}
                />
              )}
              <div className="flex flex-col gap-4 w-full">
                {categorySummary.length > 0 && (
                  <ChartCategoryPie categorySummary={categorySummary} />
                )}
                {coarseCategorySummary.length > 0 && (
                  <ChartCoarseCategoryPie data={coarseCategorySummary} />
                )}
              </div>
              <div className="flex flex-col gap-4 w-full">
                {monthlyTrend.length > 0 && <ChartMonthlyTrend monthlyTrend={monthlyTrend} />}
                {monthlyCategory.length > 0 && (
                  <ChartMonthlyCategory monthlyCategory={monthlyCategory} />
                )}
                {topMerchants.length > 0 && <ChartTopMerchants topMerchants={topMerchants} />}
                {incomeVsExpense.length > 0 && (
                  <ChartIncomeVsExpense incomeVsExpense={incomeVsExpense} />
                )}
              </div>
              {/* Export button moved above */}
            </>
          )}
        </>
      )}

  {/* All dashboard widgets are now only shown after Process (rawData) */}
    </div>
  );
};

export default Categorizer;