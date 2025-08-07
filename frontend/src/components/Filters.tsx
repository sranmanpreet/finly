import React from "react";
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
}) => (
  <div className="w-full max-w-4xl flex flex-wrap items-end gap-4 mb-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={e => setStartDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={e => setEndDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Category</label>
      <select
        value={categoryFilter}
        onChange={e => setCategoryFilter(e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">All</option>
        {[...new Set(transactions.map(tx => tx.category).filter(Boolean))].map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-700">Search</label>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search description..."
        className="border rounded px-2 py-1 w-full"
      />
    </div>
    <button
      onClick={onReset}
      className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
    >
      Reset
    </button>
  </div>
);

export default Filters;