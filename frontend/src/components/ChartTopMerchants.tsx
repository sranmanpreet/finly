import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ChartTopMerchantsProps {
  topMerchants: any[]; // Replace 'any[]' with a more specific type if you have one
}

const ChartTopMerchants: React.FC<ChartTopMerchantsProps> = ({ topMerchants }) => (
  <div className="w-full max-w-2xl mx-auto bg-white shadow rounded-lg p-4 mt-6">
    <h2 className="text-xl font-semibold mb-2">Top Merchants/Vendors</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topMerchants}>
        <XAxis dataKey={"description" in (topMerchants[0] || {}) ? "description" : "narration"} />
        <YAxis />
        <Tooltip />
        <Bar dataKey={"amount" in (topMerchants[0] || {}) ? "amount" : "debit amount"} fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartTopMerchants;