import React from "react";

const Home: React.FC = () => (
  <div className="max-w-3xl mx-auto py-16 px-4 text-center">
    <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to Finly</h1>
    <p className="text-lg mb-6 text-gray-700">
      <b>Finly</b> is your smart, privacy-first personal finance dashboard. Effortlessly categorize your transactions, visualize your spending, and gain actionable insights—all from your own device.
    </p>
    <ul className="text-left text-gray-600 mx-auto max-w-xl mb-8 list-disc list-inside">
      <li>Upload your bank statement CSVs securely—no data leaves your computer.</li>
      <li>Automatic and manual transaction categorization.</li>
      <li>Interactive charts for monthly trends, category breakdowns, and top merchants.</li>
      <li>Export your categorized data for further analysis.</li>
      <li>Open source and free to use.</li>
    </ul>
    <a
      href="/categorizer"
      className="inline-block bg-blue-600 text-white px-6 py-3 rounded shadow hover:bg-blue-700 transition"
    >
      Try the Transaction Categorizer
    </a>
  </div>
);

export default Home;