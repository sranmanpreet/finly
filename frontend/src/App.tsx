import React, { useState, useRef, useMemo, ChangeEvent, RefObject } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import MetricsCards from "./components/MetricsCards";
import Filters from "./components/Filters";
import TransactionsTable from "./components/TransactionsTable";
import ChartCategoryPie from "./components/ChartCategoryPie";
import ChartMonthlyTrend from "./components/ChartMonthlyTrend";
import ChartMonthlyCategory from "./components/ChartMonthlyCategory";
import ChartTopMerchants from "./components/ChartTopMerchants";
import ChartIncomeVsExpense from "./components/ChartIncomeVsExpense";
import useTransactions from "./hooks/useTransactions";
import useDarkMode from "./hooks/useDarkMode";
import { exportToCSV } from "./utils/csv";
import EmptyState from "./components/EmptyState";

// --- Type Definitions ---
export interface Transaction {
  date: string;
  description?: string;
  narration?: string;
  amount?: number;
  category?: string;
  [key: string]: any;
}

export interface FiltersType {
  startDate: string;
  endDate: string;
  categoryFilter: string;
  search: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [darkMode, setDarkMode] = useDarkMode();

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "date", direction: "desc" });

  // useTransactions handles all data fetching and analytics
  const {
    transactions, categorySummary, monthlyTrend, monthlyCategory,
    topMerchants, incomeVsExpense, total, loading, error,
    filteredTransactions, metrics
  } = useTransactions(file, page, limit, filters);

  // File upload handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
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

  // Apply sorting to filteredTransactions
  const sortedTransactions = useMemo(() => {
    if (!filteredTransactions) return [];
    const txs = [...filteredTransactions];
    if (!sortConfig.key) return txs;
    return txs.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortConfig]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <FileUpload
          file={file}
          dragActive={dragActive}
          inputRef={inputRef}
          handleDrag={handleDrag}
          handleDrop={handleDrop}
          handleBrowseClick={handleBrowseClick}
          handleFileChange={handleFileChange}
          handleUpload={() => {}} // No-op, upload handled by useTransactions
          loading={loading}
          error={error}
        />

        {transactions.length > 0 && <MetricsCards metrics={metrics} />}

        {transactions.length > 0 && (
          <Filters
            startDate={startDate}
            endDate={endDate}
            categoryFilter={categoryFilter}
            search={search}
            transactions={transactions}
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
        )}

        {!loading && transactions.length === 0 && <EmptyState />}

        {transactions.length > 0 && (
          <TransactionsTable
            filteredTransactions={sortedTransactions}
            handleSort={handleSort}
            page={page}
            total={total}
            limit={limit}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleLimitChange={handleLimitChange}
            sortConfig={sortConfig}
          />
        )}

        {categorySummary.length > 0 && <ChartCategoryPie categorySummary={categorySummary} />}
        {monthlyTrend.length > 0 && <ChartMonthlyTrend monthlyTrend={monthlyTrend} />}
        {monthlyCategory.length > 0 && <ChartMonthlyCategory monthlyCategory={monthlyCategory} />}
        {topMerchants.length > 0 && <ChartTopMerchants topMerchants={topMerchants} />}
        {incomeVsExpense.length > 0 && <ChartIncomeVsExpense incomeVsExpense={incomeVsExpense} />}

        {transactions.length > 0 && (
          <button
            onClick={() => exportToCSV(sortedTransactions)}
            className="mb-2 px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
          >
            Export CSV
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
