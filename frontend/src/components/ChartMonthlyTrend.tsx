import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartMonthlyTrendProps {
  monthlyTrend: any[];
}

const ChartMonthlyTrend: React.FC<ChartMonthlyTrendProps> = ({ monthlyTrend }) => (
  <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow rounded p-2 mb-2">
  <h2 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">Monthly Spending Trend (₹)</h2>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={monthlyTrend}>
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey={"amount" in (monthlyTrend[0] || {}) ? "amount" : "debit amount"}
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ChartMonthlyTrend;