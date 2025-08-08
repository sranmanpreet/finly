import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ChartIncomeVsExpenseProps {
  incomeVsExpense: any[]; // Replace 'any[]' with a more specific type if you have one
}

const ChartIncomeVsExpense: React.FC<ChartIncomeVsExpenseProps> = ({ incomeVsExpense }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded-lg p-4 mt-6">
    <h2 className="text-xl font-semibold mb-2">Income vs Expense Over Time</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={incomeVsExpense}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="income" stroke="#4ade80" />
        <Line type="monotone" dataKey="expense" stroke="#f87171" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default ChartIncomeVsExpense;