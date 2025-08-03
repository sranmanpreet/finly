import { useState, useEffect } from "react";
import { formatDate } from "../utils/format";
import { Transaction, FiltersType } from "../App";

interface Metrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  numTransactions: number;
  avgMonthly: number;
}

interface UseTransactionsResult {
  transactions: Transaction[];
  categorySummary: any[];
  monthlyTrend: any[];
  monthlyCategory: any[];
  topMerchants: any[];
  incomeVsExpense: any[];
  total: number;
  loading: boolean;
  error: string;
  filteredTransactions: Transaction[];
  metrics: Metrics;
}

export default function useTransactions(
  file: File | null,
  page: number,
  limit: number,
  filters: FiltersType
): UseTransactionsResult {
  const [transactions, setTransactions] = useState([]);
  const [categorySummary, setCategorySummary] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [monthlyCategory, setMonthlyCategory] = useState([]);
  const [topMerchants, setTopMerchants] = useState([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch transactions and analytics
  useEffect(() => {
    if (!file) return;
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        const offset = (page - 1) * limit;

        // Transactions
        const res = await fetch(
          `http://localhost:8000/upload?limit=${limit}&offset=${offset}`,
          { method: "POST", body: formData }
        );
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        setTransactions(data.transactions);
        setCategorySummary(data.category_summary);
        setTotal(data.total);

        // Monthly Trend
        const trendRes = await fetch("http://localhost:8000/monthly_trend", {
          method: "POST", body: formData
        });
        if (trendRes.ok) setMonthlyTrend(await trendRes.json());

        // Monthly Category
        const catRes = await fetch("http://localhost:8000/monthly_category_breakdown", {
          method: "POST", body: formData
        });
        if (catRes.ok) setMonthlyCategory(await catRes.json());

        // Top Merchants
        const merchRes = await fetch("http://localhost:8000/top_merchants", {
          method: "POST", body: formData
        });
        if (merchRes.ok) setTopMerchants(await merchRes.json());

        // Income vs Expense
        const incExpRes = await fetch("http://localhost:8000/income_vs_expense", {
          method: "POST", body: formData
        });
        if (incExpRes.ok) setIncomeVsExpense(await incExpRes.json());
      } catch (err) {
        setError("Failed to upload or process file.");
      }
      setLoading(false);
    };
    fetchAll();
  }, [file, page, limit]);

  // Filtering and metrics
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netSavings: 0,
    numTransactions: 0,
    avgMonthly: 0,
  });

  useEffect(() => {
    let txs = (transactions as Transaction[]).filter(tx => tx.date); // <-- let instead of const
    const { startDate, endDate, categoryFilter, search } = filters || {};

    // Date filter
    if (startDate)
      txs = txs.filter(tx => tx.date && tx.date >= startDate);
    if (endDate)
      txs = txs.filter(tx => tx.date && tx.date <= endDate);

    // Category filter
    if (categoryFilter)
      txs = txs.filter(tx => tx.category === categoryFilter);

    // Search filter
    if (search)
      txs = txs.filter(
        tx =>
          (tx.description ?? tx.narration ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
      );

    setFilteredTransactions(txs);

    // Metrics
    const amountCol = "amount" in (txs[0] || {}) ? "amount" : "debit amount";
    let totalIncome = 0, totalExpenses = 0, months = new Set();
    txs.forEach(tx => {
      const amt = Number(tx[amountCol]) || 0;
      if (amt > 0) totalIncome += amt;
      else totalExpenses += amt;
      if (tx.date) months.add(tx.date.slice(0, 7));
    });
    const netSavings = totalIncome + totalExpenses;
    const avgMonthly = months.size ? (totalIncome + totalExpenses) / months.size : 0;
    setMetrics({
      totalIncome,
      totalExpenses: Math.abs(totalExpenses),
      netSavings,
      numTransactions: txs.length,
      avgMonthly,
    });
  }, [transactions, filters]);

  return {
    transactions,
    categorySummary,
    monthlyTrend,
    monthlyCategory,
    topMerchants,
    incomeVsExpense,
    total,
    loading,
    error,
    filteredTransactions,
    metrics,
  };
}