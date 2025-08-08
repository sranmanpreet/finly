import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#fa8072"
];

interface ChartMonthlyCategoryProps {
  monthlyCategory: any[]; // Replace 'any[]' with a more specific type if you have one
}

const ChartMonthlyCategory: React.FC<ChartMonthlyCategoryProps> = ({ monthlyCategory }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded-lg p-4 mt-6">
    <h2 className="text-xl font-semibold mb-2">Monthly Category Breakdown</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyCategory}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(monthlyCategory[0] || {})
          .filter(k => k !== "month")
          .map((cat, idx) => (
            <Bar key={cat} dataKey={cat} stackId="a" fill={COLORS[idx % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartMonthlyCategory;