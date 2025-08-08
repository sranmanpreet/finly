import React, { ChangeEvent } from "react";
import { Transaction, SortConfig } from "../types";

interface TransactionsTableProps {
  filteredTransactions: Transaction[];
  handleSort: (key: string) => void;
  page: number;
  total: number;
  limit: number;
  handlePrev: () => void;
  handleNext: () => void;
  handleLimitChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  sortConfig: SortConfig;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  filteredTransactions,
  handleSort,
  page,
  total,
  limit,
  handlePrev,
  handleNext,
  handleLimitChange,
  sortConfig,
}) => (
  <div className="w-full max-w-4xl mx-auto bg-white shadow rounded-lg p-4 mb-6">
    <h2 className="text-xl font-semibold mb-2">Transactions</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("date")}>
              Date {sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("description")}>
              Description {sortConfig.key === "description" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("credit")}>
              Credit {sortConfig.key === "credit" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("debit")}>
              Debit {sortConfig.key === "debit" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort("category")}>
              Category {sortConfig.key === "category" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((tx, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="px-4 py-2">{tx.date}</td>
              <td className="px-4 py-2">{tx.description ?? tx.narration}</td>
              <td className="px-4 py-2">{tx.credit ?? ""}</td>
              <td className="px-4 py-2">{tx.debit ?? ""}</td>
              <td className="px-4 py-2">{tx.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="flex items-center justify-between mt-4">
      <button
        disabled={page === 1}
        onClick={handlePrev}
        className="px-3 py-1 rounded bg-gray-200 mx-1 disabled:opacity-50"
      >
        Prev
      </button>
      <span>
        Page {page} of {Math.ceil(total / limit) || 1}
      </span>
      <button
        disabled={page * limit >= total}
        onClick={handleNext}
        className="px-3 py-1 rounded bg-gray-200 mx-1 disabled:opacity-50"
      >
        Next
      </button>
      <select
        value={limit}
        onChange={handleLimitChange}
        className="ml-4 border rounded px-2 py-1"
      >
        {[10, 20, 50, 100].map((l) => (
          <option key={l} value={l}>
            {l} / page
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default TransactionsTable;