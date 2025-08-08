import React from "react";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"
];

interface ChartCategoryPieProps {
  categorySummary: any[];
}

const ChartCategoryPie: React.FC<ChartCategoryPieProps> = ({ categorySummary }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded-lg p-4">
    <h2 className="text-xl font-semibold mb-2">Category Summary</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={categorySummary}
          dataKey={"amount" in (categorySummary[0] || {}) ? "amount" : "debit amount"}
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {categorySummary.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ChartCategoryPie;