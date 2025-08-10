import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartIncomeVsExpenseProps {
  incomeVsExpense: any[];
}

const ChartIncomeVsExpense: React.FC<ChartIncomeVsExpenseProps> = ({
  incomeVsExpense,
}) => (
  <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow rounded p-2 mb-2">
  <h2 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">Credit vs Debit Over Time (₹)</h2>
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={incomeVsExpense}>
        <XAxis dataKey="month" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line
          type="monotone"
          dataKey="credit"
          stroke="#4ade80"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="debit"
          stroke="#f87171"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ChartIncomeVsExpense;
