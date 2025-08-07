import React, { useState, useRef, useMemo, ChangeEvent } from "react";
import FileUpload from "../components/FileUpload";
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

  // Determine if any filter is active
  const isFilterActive = !!(startDate || endDate || categoryFilter || search);

  // Use all transactions if no filter, else use filteredTransactions
  const displayTransactions = isFilterActive ? filteredTransactions : transactions;

  // Sorting
  const sortedTransactions = useMemo(() => {
    if (!displayTransactions) return [];
    const txs = [...displayTransactions];
    if (!sortConfig.key) return txs;
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
    <div className="max-w-3xl mx-auto py-16 px-4">
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

      {displayTransactions.length > 0 && <MetricsCards metrics={metrics} />}

      {displayTransactions.length > 0 && (
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
      )}

      {!loading && displayTransactions.length === 0 && <EmptyState />}

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

      {categorySummary.length > 0 && (
        <ChartCategoryPie categorySummary={categorySummary} />
      )}
      {monthlyTrend.length > 0 && <ChartMonthlyTrend monthlyTrend={monthlyTrend} />}
      {monthlyCategory.length > 0 && (
        <ChartMonthlyCategory monthlyCategory={monthlyCategory} />
      )}
      {topMerchants.length > 0 && <ChartTopMerchants topMerchants={topMerchants} />}
      {incomeVsExpense.length > 0 && (
        <ChartIncomeVsExpense incomeVsExpense={incomeVsExpense} />
      )}

      {displayTransactions.length > 0 && (
        <button
          onClick={() => exportToCSV(displayTransactions)}
          className="mb-2 px-3 py-1 bg-blue-100 rounded hover:bg-blue-200"
        >
          Export CSV
        </button>
      )}
    </div>
  );
};

export default Categorizer;