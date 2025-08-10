import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartTopMerchantsProps {
  topMerchants: any[];
}

const ChartTopMerchants: React.FC<ChartTopMerchantsProps> = ({ topMerchants }) => (
  <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-900 shadow rounded p-2 mb-2">
  <h2 className="text-base font-semibold mb-1 text-gray-800 dark:text-gray-100">Top Merchants/Vendors (₹)</h2>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={topMerchants}>
        <XAxis
          dataKey={"merchant" in (topMerchants[0] || {}) ? "merchant" : ("description" in (topMerchants[0] || {}) ? "description" : "narration")}
          fontSize={12}
        />
        <YAxis fontSize={12} />
        <Tooltip wrapperStyle={{ fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar
          dataKey={"amount" in (topMerchants[0] || {}) ? "amount" : "debit amount"}
          fill="#8884d8"
          barSize={18}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default ChartTopMerchants;