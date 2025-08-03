import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartMonthlyTrendProps {
  monthlyTrend: any[]; // Replace 'any[]' with a more specific type if you have one
}

const ChartMonthlyTrend: React.FC<ChartMonthlyTrendProps> = ({ monthlyTrend }) => (
  <div className="w-full max-w-2xl bg-white shadow rounded-lg p-4 mt-6">
    <h2 className="text-xl font-semibold mb-2">Monthly Spending Trend</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyTrend}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey={"amount" in (monthlyTrend[0] || {}) ? "amount" : "debit amount"}
          stroke="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ChartMonthlyTrend;