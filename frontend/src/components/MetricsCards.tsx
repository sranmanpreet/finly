import React from "react";

interface Metrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  numTransactions: number;
  avgMonthly: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-3 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Income</div>
      <div className="text-lg font-bold text-green-700 dark:text-green-400">
        ₹{metrics.totalIncome.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 rounded p-3 text-center">
      <div className="text-xs text-gray-500">Expenses</div>
      <div className="text-lg font-bold text-red-700">
        ₹{metrics.totalExpenses.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 rounded p-3 text-center">
      <div className="text-xs text-gray-500">Net Savings</div>
      <div
        className={`text-lg font-bold ${
          metrics.netSavings >= 0 ? "text-green-700" : "text-red-700"
        }`}
      >
        ₹{metrics.netSavings.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 rounded p-3 text-center">
      <div className="text-xs text-gray-500">Transactions</div>
      <div className="text-lg font-bold">{metrics.numTransactions}</div>
    </div>
    <div className="bg-blue-50 rounded p-3 text-center">
      <div className="text-xs text-gray-500">Avg Monthly</div>
      <div className="text-lg font-bold">
        ₹{metrics.avgMonthly.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
  </div>
);

export default MetricsCards;