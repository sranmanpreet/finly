import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#fa8072",
];

interface ChartCategoryPieProps {
  categorySummary: any[];
}

const ChartCategoryPie: React.FC<ChartCategoryPieProps> = ({
  categorySummary,
}) => {
  if (!categorySummary || categorySummary.length === 0) return null;
  const dataKey =
    "amount" in (categorySummary[0] || {}) ? "amount" : "debit amount";
  const total = categorySummary.reduce(
    (sum, entry) => sum + Number(entry[dataKey]),
    0
  );
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow rounded p-2 mb-2">
      <h2 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">Category Summary</h2>
      <div className="text-xs text-gray-500 dark:text-gray-300 mb-2">
        Total: 9{total.toLocaleString()}
      </div>
      <div className="flex flex-row gap-4 items-center">
        <ResponsiveContainer width="60%" height={220}>
          <PieChart>
            <Pie
              data={categorySummary}
              dataKey={dataKey}
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {categorySummary.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `₹${Number(value).toLocaleString()} (${(
                  (Number(value) / total) * 100
                ).toFixed(1)}%)`,
                props.payload.category,
              ]}
              wrapperStyle={{ fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-col gap-2 w-2/5">
          {categorySummary.map((entry, idx) => {
            const val = Number(entry[dataKey]);
            const percent = total ? ((val / total) * 100).toFixed(1) : "0.0";
            return (
              <div
                key={entry.category}
                className="flex items-center gap-2 text-sm"
              >
                <span
                  className="inline-block w-3 h-3 rounded-full"
                  style={{ background: COLORS[idx % COLORS.length] }}
                ></span>
                <span className="font-medium text-gray-700 w-32 truncate">
                  {entry.category}
                </span>
                <span className="text-gray-500">
                  ₹{val.toLocaleString()} <span className="ml-1">({percent}%)</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChartCategoryPie;
