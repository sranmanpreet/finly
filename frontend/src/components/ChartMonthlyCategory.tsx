import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"
];

interface ChartMonthlyCategoryProps {
  monthlyCategory: any[];
}

const ChartMonthlyCategory: React.FC<ChartMonthlyCategoryProps> = ({ monthlyCategory }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded p-2 mb-2">
    <h2 className="text-base font-semibold mb-1">Monthly Category Breakdown</h2>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={monthlyCategory}>
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {Object.keys(monthlyCategory[0] || {})
          .filter(k => k !== "month")
          .map((cat, idx) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[idx % COLORS.length]} barSize={18} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartMonthlyCategory;