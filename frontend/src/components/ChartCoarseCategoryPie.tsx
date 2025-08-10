import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COARSE_COLORS = [
  "#4ade80", // Income
  "#fbbf24", // Essentials
  "#60a5fa", // Discretionary
  "#a78bfa", // Investments/Savings
  "#f87171", // Transfers
  "#94a3b8", // Other
];

const COARSE_LABELS = [
  "Income",
  "Essentials",
  "Discretionary",
  "Investments/Savings",
  "Transfers",
  "Other",
];

interface CoarseCategoryData {
  category: string;
  amount: number;
}

interface ChartCoarseCategoryPieProps {
  data: CoarseCategoryData[];
}

const ChartCoarseCategoryPie: React.FC<ChartCoarseCategoryPieProps> = ({
  data,
}) => {
  if (!data || data.length === 0) return null;
  const total = data.reduce((sum, entry) => sum + Number(entry.amount), 0);
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow rounded p-2 mb-2">
      <h2 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">
        Coarse Category Breakdown
      </h2>
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
  Total: ₹{total.toLocaleString()}
      </div>
      <div className="flex flex-row gap-4 items-center">
        <ResponsiveContainer width="60%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {data.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COARSE_COLORS[idx % COARSE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `₹${Number(value).toLocaleString()} (${(
                  (Number(value) / total) *
                  100
                ).toFixed(1)}%)`,
                props.payload.category,
              ]}
              wrapperStyle={{ fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 w-2/5">
          {data.map((entry, idx) => {
            const val = Number(entry.amount);
            const percent = total ? ((val / total) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={entry.category}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{
                    background: COARSE_COLORS[idx % COARSE_COLORS.length],
                  }}
                ></span>
                <span className="font-medium text-gray-700 w-32 truncate">
                  {entry.category}
                </span>
                <span className="text-gray-500">
                  ₹{val.toLocaleString()} <span className="ml-1">({percent}%)</span>
                  <span className="ml-1">({percent}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartCoarseCategoryPie;
