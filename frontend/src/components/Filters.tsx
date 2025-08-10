import React, { useState, useEffect } from "react";
import { Transaction } from "../types";

interface FiltersProps {
  startDate: string;
  endDate: string;
  categoryFilter: string;
  search: string;
  transactions: Transaction[];
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setCategoryFilter: (cat: string) => void;
  setSearch: (s: string) => void;
  onReset: () => void;
}

const quickRanges = [
  { label: "All", value: "all" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Last Week", value: "lastWeek" },
  { label: "Last Two Weeks", value: "lastTwoWeeks" },
  { label: "Last Month", value: "lastMonth" },
  { label: "Last Three Months", value: "lastThreeMonths" },
  { label: "Last Six Months", value: "lastSixMonths" },
  { label: "Last Year", value: "lastYear" },
  { label: "Last Two Years", value: "lastTwoYears" },
  { label: "Last Three Years", value: "lastThreeYears" },
  { label: "Last Five Years", value: "lastFiveYears" },
];

function getRangeDates(range: string): { start: string; end: string } {
  const today = new Date();
  let start = "";
  let end = today.toISOString().slice(0, 10);

  switch (range) {
    case "today":
      start = end;
      break;
    case "yesterday":
      const yest = new Date(today);
      yest.setDate(today.getDate() - 1);
      start = yest.toISOString().slice(0, 10);
      end = start;
      break;
    case "lastWeek":
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 7);
      start = lastWeek.toISOString().slice(0, 10);
      break;
    case "lastTwoWeeks":
      const lastTwoWeeks = new Date(today);
      lastTwoWeeks.setDate(today.getDate() - 14);
      start = lastTwoWeeks.toISOString().slice(0, 10);
      break;
    case "lastMonth":
      const lastMonth = new Date(today);
      lastMonth.setMonth(today.getMonth() - 1);
      start = lastMonth.toISOString().slice(0, 10);
      break;
    case "lastThreeMonths":
      const lastThreeMonths = new Date(today);
      lastThreeMonths.setMonth(today.getMonth() - 3);
      start = lastThreeMonths.toISOString().slice(0, 10);
      break;
    case "lastSixMonths":
      const lastSixMonths = new Date(today);
      lastSixMonths.setMonth(today.getMonth() - 6);
      start = lastSixMonths.toISOString().slice(0, 10);
      break;
    case "lastYear":
      const lastYear = new Date(today);
      lastYear.setFullYear(today.getFullYear() - 1);
      start = lastYear.toISOString().slice(0, 10);
      break;
    case "lastTwoYears": {
      const lastTwoYears = new Date(today);
      lastTwoYears.setFullYear(today.getFullYear() - 2);
      start = lastTwoYears.toISOString().slice(0, 10);
      break;
    }
    case "lastThreeYears": {
      const lastThreeYears = new Date(today);
      lastThreeYears.setFullYear(today.getFullYear() - 3);
      start = lastThreeYears.toISOString().slice(0, 10);
      break;
    }
    case "lastFiveYears": {
      const lastFiveYears = new Date(today);
      lastFiveYears.setFullYear(today.getFullYear() - 5);
      start = lastFiveYears.toISOString().slice(0, 10);
      break;
    }
    case "all":
    default:
      start = "";
      end = "";
      break;
  }
  return { start, end };
}

const Filters: React.FC<FiltersProps> = ({
  startDate,
  endDate,
  categoryFilter,
  search,
  transactions,
  setStartDate,
  setEndDate,
  setCategoryFilter,
  setSearch,
  onReset,
}) => {
  // Track selected quick range
  const [selectedQuickRange, setSelectedQuickRange] = useState<string>("all");

  // When quick filter changes, update dates
  const handleQuickRangeChange = (value: string) => {
    setSelectedQuickRange(value);
    const { start, end } = getRangeDates(value);
    setStartDate(start);
    setEndDate(end);
  };

  // When dates are changed manually, reset quick filter to "all"
  useEffect(() => {
    // If dates don't match any quick range, reset quick filter
    const match = quickRanges.find(r => {
      const { start, end } = getRangeDates(r.value);
      return startDate === start && endDate === end;
    });
    if (!match) setSelectedQuickRange("all");
  }, [startDate, endDate]);

  return (
  <div className="w-full max-w-4xl flex flex-wrap items-end gap-2 mb-2">
      {/* Quick Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Quick Filter</label>
        <select
          className="border border-gray-300 dark:border-gray-700 rounded px-1 py-1 text-sm dark:bg-gray-800 dark:text-gray-100"
          onChange={e => handleQuickRangeChange(e.target.value)}
          value={selectedQuickRange}
        >
          {quickRanges.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => {
            setStartDate(e.target.value);
            setSelectedQuickRange("all");
          }}
          className="border border-gray-300 dark:border-gray-700 rounded px-1 py-1 text-sm dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => {
            setEndDate(e.target.value);
            setSelectedQuickRange("all");
          }}
          className="border border-gray-300 dark:border-gray-700 rounded px-1 py-1 text-sm dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Category</label>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 rounded px-1 py-1 text-sm dark:bg-gray-800 dark:text-gray-100"
        >
          <option value="">All</option>
          {[...new Set(transactions.map(tx => tx.category).filter(Boolean))].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Search</label>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search description..."
          className="border border-gray-300 dark:border-gray-700 rounded px-1 py-1 text-sm w-full dark:bg-gray-800 dark:text-gray-100"
        />
      </div>
      <button
        onClick={onReset}
        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        Reset
      </button>
    </div>
  );
};

export default Filters;