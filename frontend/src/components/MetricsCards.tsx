import React from "react";

interface Metrics {
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
  numTransactions: number;
  avgCredit: number;
  avgDebit: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => (
  <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-6 gap-2 mb-3">
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Credit</div>
      <div className="text-base font-semibold text-green-700 dark:text-green-400">
        ₹{metrics.totalCredit.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Debit</div>
      <div className="text-base font-semibold text-red-700 dark:text-red-400">
        ₹{metrics.totalDebit.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Net Balance</div>
      <div
        className={`text-base font-semibold ${
          metrics.netBalance >= 0 ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}
        }`}
      >
        ₹{metrics.netBalance.toLocaleString()}
      </div>
    </div>
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Transactions</div>
      <div className="text-base font-semibold dark:text-gray-100">{metrics.numTransactions}</div>
    </div>
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Avg Credit</div>
      <div className="text-base font-semibold dark:text-green-400">
        ₹{metrics.avgCredit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
    <div className="bg-blue-50 dark:bg-gray-800 rounded p-2 text-center">
      <div className="text-xs text-gray-500 dark:text-gray-400">Avg Debit</div>
      <div className="text-base font-semibold dark:text-red-400">
        ₹{metrics.avgDebit.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </div>
    </div>
  </div>
);

export default MetricsCards;