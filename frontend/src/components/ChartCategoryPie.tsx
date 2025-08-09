import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"
];

interface ChartCategoryPieProps {
  categorySummary: any[];
}

const ChartCategoryPie: React.FC<ChartCategoryPieProps> = ({ categorySummary }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded p-2 mb-2">
    <h2 className="text-base font-semibold mb-1">Category Summary</h2>
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={categorySummary}
          dataKey={"amount" in (categorySummary[0] || {}) ? "amount" : "debit amount"}
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label
        >
          {categorySummary.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ChartCategoryPie;