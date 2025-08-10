// Map fine categories to coarse categories
function getCoarseCategory(fine: string): string {
  const lower = (fine || "").toLowerCase();
  if (lower === "salary" || lower === "income") return "Income";
  if (
    [
      "grocery",
      "essentials",
      "insurance",
      "child education",
      "education",
      "society maintenance",
      "house maintenance",
      "rent",
      "utility",
      "atm",
      "cash withdrawal",
    ].some((c) => lower.includes(c))
  )
    return "Essentials";
  if (
    [
      "eat out",
      "entertainment",
      "clothing",
      "parking",
      "transport",
      "self care",
      "internet/subscriptions",
      "learning & development",
      "gift",
      "book",
      "bookmyshow",
      "travel",
      "shopping",
    ].some((c) => lower.includes(c))
  )
    return "Discretionary";
  if (
    ["investments", "investment", "ppf", "fd", "savings"].some((c) =>
      lower.includes(c)
    )
  )
    return "Investments/Savings";
  if (
    ["fund transfer", "transfer", "reimbursement"].some((c) =>
      lower.includes(c)
    )
  )
    return "Transfers";
  return "Other";
}
import { useState, useEffect } from "react";
import { parseDate } from "../utils/format";
import Papa, { ParseResult } from "papaparse";
import { Transaction, FiltersType } from "../types";

// --- Categorization logic from backend ---
function categorize(
  description: string,
  debitAmount?: number,
  existingCategory?: string
): string {
  const desc = description?.toLowerCase() || "";

  // Regex-based rules (order matters)
  if (/stonewain.*pay|pay.*stonewain/.test(desc)) return "Salary";
  if (/stonewain.*park|park.*stonewain|parking/.test(desc)) return "Parking";
  if (
    /fuel|car|harpreet bhar|irctc|cm auto|cab|cycle|train|alto|fronx|toll|transport/.test(
      desc
    )
  )
    return "Transport";
  if (
    /dinner|lunch|icecream|pizza|cake|haldiram|zomato|swiggy|tea|fries|kheer|dosa|royal sweet|snack|jamun|kulcha|chaat|gappe|gappa|momo|food|juice|shake|donut|soup|restaurant/.test(
      desc
    )
  )
    return "Eat out";
  if (/manavmangalsmartscho/.test(desc)) return "Child Education";
  if (/fiffin/.test(desc)) return "Essentials";
  if (
    /paytmiccl|indianesign|indian clearing corp|ppf|fd through mobile|investment/.test(
      desc
    )
  )
    return "Investments";
  if (/sewerage|jtpl|resident welfare/.test(desc)) return "Society Maintenance";
  if (/insurance/.test(desc)) return "Insurance";
  if (
    /grocery|smart bazaar|blinkit|vegetable|sweet|fruit|mandeep kumar|sunscreen|rakhi|indane|veg|onion|egg|fish|chicken|curd|boondi|paneer|mirch|pepper|bread|apple|banana|orange|anaar|grape|oil|flour|aata|atta|milk|jaggery|all out|chawal|dal/.test(
      desc
    )
  )
    return "Grocery";
  if (/shoe|cloth|towel|jean|shirt|flipflop|myntra|crocs/.test(desc))
    return "Clothing";
  if (/atm|atw/.test(desc)) return "Cash Withdrawal";
  if (/transfer/.test(desc)) return "Fund Transfer";
  if (/medicine|lab tests|tabs/.test(desc)) return "Medicals";
  if (/hair cut|salon|beard|gym/.test(desc)) return "Self Care";
  if (/airtel|jio|internet|air fiber/.test(desc))
    return "Internet/Subscriptions";
  if (
    /door|pot|mirror|table|repair|urbancompany|ac service|inverter|bath|lamp|pspcl|water tank|wire|pure it|paint|racks|wash basin|gutter|capacitor|grass|appliance/.test(
      desc
    )
  )
    return "House Maintenance";
  if (/ib billpay dr-hdfc92|si-tad/.test(desc)) return "Credit Card";
  if (/book/.test(desc)) return "Learning & Development";
  if (/bookmyshow|gadget|toy|ride|cracker|travel/.test(desc))
    return "Entertainment";
  if (/birthday|gift/.test(desc)) return "Gifts";
  if (/reimbursement/.test(desc)) return "Reimbursement";

  // Special rule: Small debits with no assigned category
  if (
    debitAmount !== undefined &&
    debitAmount < 200 &&
    debitAmount > 0 &&
    (!existingCategory ||
      existingCategory === "Uncategorized" ||
      existingCategory === "Unclassified")
  ) {
    return "Grocery";
  }

  // Default: Unclassified
  return "Unclassified";
}

// --- Apply categorization and cleaning ---
function processTransactions(raw: any[]): Transaction[] {
  return raw.map((tx: any) => {
    let narration = tx.narration || tx.description || "";
    narration = narration
      .replace(/\d+/g, "")
      .replace(/[^a-z\s]/gi, " ")
      .replace(/upi|okicici|gpay/gi, "")
      .trim();
    let category = tx.category || categorize(narration);

    // Normalize credit and debit fields
    const credit =
      tx.credit ??
      tx.Credit ??
      tx["Credit Amount"] ??
      tx["credit amount"] ??
      tx["CreditAmount"] ??
      tx["credit"] ??
      0;

    const debit =
      tx.debit ??
      tx.Debit ??
      tx["Debit Amount"] ??
      tx["debit amount"] ??
      tx["DebitAmount"] ??
      tx["debit"] ??
      0;

    return {
      ...tx,
      narration,
      category: category || "Unclassified",
      credit: credit,
      debit: debit,
    };
  });
}

interface Metrics {
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
  numTransactions: number;
  avgCredit: number;
  avgDebit: number;
}

interface UseTransactionsResult {
  transactions: Transaction[];
  categorySummary: any[];
  monthlyTrend: any[];
  monthlyCategory: any[];
  topMerchants: any[];
  incomeVsExpense: any[];
  coarseCategorySummary: { category: string; amount: number }[];
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categorySummary, setCategorySummary] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [monthlyCategory, setMonthlyCategory] = useState<any[]>([]);
  const [topMerchants, setTopMerchants] = useState<any[]>([]);
  const [incomeVsExpense, setIncomeVsExpense] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // Parse CSV and process transactions
  useEffect(() => {
    if (!file) return;
    setLoading(true);
    setError("");
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: ParseResult<any>) => {
        try {
          const processed = processTransactions(results.data);
          setTransactions(processed);
          setTotal(processed.length);
        } catch (err) {
          setError("Failed to process file.");
        }
        setLoading(false);
      },
      error: () => {
        setError("Failed to parse CSV.");
        setLoading(false);
      },
    });
  }, [file]);

  // Filtering and metrics
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalCredit: 0,
    totalDebit: 0,
    netBalance: 0,
    numTransactions: 0,
    avgCredit: 0,
    avgDebit: 0,
  });

  useEffect(() => {
    let txs = [...transactions];
    const { startDate, endDate, categoryFilter, search } = filters || {};

    // Date filter
    if (startDate)
      txs = txs.filter((tx) => {
        if (!tx.date) return false;
        // Parse both dates to Date objects
        const txDate = parseDate(tx.date);
        const start = parseDate(startDate);
        if (!txDate || !start) return false;
        return txDate.getTime() >= start.getTime();
      });

    if (endDate)
      txs = txs.filter((tx) => {
        if (!tx.date) return false;
        const txDate = parseDate(tx.date);
        const end = parseDate(endDate);
        if (!txDate || !end) return false;
        return txDate.getTime() <= end.getTime();
      });

    // Category filter
    if (categoryFilter)
      txs = txs.filter((tx) => tx.category === categoryFilter);

    // Search filter
    if (search)
      txs = txs.filter((tx) =>
        (tx.description ?? tx.narration ?? "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );

    setFilteredTransactions(txs);

    // Metrics
    const amountCol = "amount" in (txs[0] || {}) ? "amount" : "debit amount";
    let totalCredit = 0,
      totalDebit = 0;
    const monthsSet = new Set<string>();
    txs.forEach((tx) => {
      const credit = Number(tx.credit) || 0;
      const debit = Number(tx.debit) || 0;
      totalCredit += credit;
      totalDebit += debit;
      if (tx.date) {
        const d = parseDate(tx.date);
        if (d && !isNaN(d.getTime())) {
          const monthStr = `${d.getFullYear()}-${String(
            d.getMonth() + 1
          ).padStart(2, "0")}`;
          monthsSet.add(monthStr);
        }
      }
    });
    const months = monthsSet.size;
    const netBalance = totalCredit - totalDebit;
    const avgCredit = months ? totalCredit / months : 0;
    const avgDebit = months ? totalDebit / months : 0;
    setMetrics({
      totalCredit,
      totalDebit,
      netBalance,
      numTransactions: txs.length,
      avgCredit,
      avgDebit,
    });

    // Aggregations for widgets
    // Category summary
    if (txs.length) {
      const summary: Record<string, number> = {};
      txs.forEach((tx) => {
        const cat = tx.category || "Unclassified";
        summary[cat] = (summary[cat] || 0) + (Number(tx[amountCol]) || 0);
      });
      setCategorySummary(
        Object.entries(summary).map(([category, amount]) => ({
          category,
          amount,
        }))
      );
    } else {
      setCategorySummary([]);
    }

    // Monthly trend
    if (txs.length) {
      const monthly: Record<string, number> = {};
      txs.forEach((tx) => {
        if (tx.date) {
          const d = parseDate(tx.date);
          if (d && !isNaN(d.getTime())) {
            const month = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}`;
            monthly[month] =
              (monthly[month] || 0) + (Number(tx[amountCol]) || 0);
          }
        }
      });
      setMonthlyTrend(
        Object.entries(monthly).map(([month, amount]) => ({ month, amount }))
      );
    } else {
      setMonthlyTrend([]);
    }

    // Monthly category breakdown
    if (txs.length) {
      const breakdown: Record<string, Record<string, number>> = {};
      txs.forEach((tx) => {
        if (tx.date) {
          const d = parseDate(tx.date);
          if (d && !isNaN(d.getTime())) {
            const month = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}`;
            breakdown[month] = breakdown[month] || {};
            const cat = tx.category || "Unclassified";
            breakdown[month][cat] =
              (breakdown[month][cat] || 0) + (Number(tx[amountCol]) || 0);
          }
        }
      });
      setMonthlyCategory(
        Object.entries(breakdown).map(([month, categories]) => ({
          month,
          ...categories,
        }))
      );
    } else {
      setMonthlyCategory([]);
    }

    // Top merchants
    if (txs.length) {
      const merchantTotals: Record<string, number> = {};
      txs.forEach((tx) => {
        const merchant = tx.description || tx.narration || "";
        merchantTotals[merchant] =
          (merchantTotals[merchant] || 0) +
          Math.abs(Number(tx[amountCol]) || 0);
      });
      const sorted = Object.entries(merchantTotals)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([merchant, amount]) => ({ merchant, amount }));
      setTopMerchants(sorted);
    } else {
      setTopMerchants([]);
    }

    // Credit vs Debit over time
    if (txs.length) {
      const monthly: Record<string, { credit: number; debit: number }> = {};
      txs.forEach((tx) => {
        if (tx.date) {
          const d = parseDate(tx.date);
          if (d && !isNaN(d.getTime())) {
            const month = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}`;
            monthly[month] = monthly[month] || { credit: 0, debit: 0 };
            monthly[month].credit += Number(tx.credit) || 0;
            monthly[month].debit += Number(tx.debit) || 0;
          }
        }
      });
      setIncomeVsExpense(
        Object.entries(monthly).map(([month, { credit, debit }]) => ({
          month,
          credit,
          debit,
        }))
      );
    } else {
      setIncomeVsExpense([]);
    }
  }, [transactions, filters]);

  // Coarse Category Breakdown (use filteredTransactions to respect filters)
  let coarseCategorySummary: { category: string; amount: number }[] = [];
  if (filteredTransactions.length) {
    const coarseSummary: Record<string, number> = {};
    filteredTransactions.forEach((tx) => {
      const coarse = getCoarseCategory(tx.category || "");
      coarseSummary[coarse] =
        (coarseSummary[coarse] || 0) +
        (Number(tx.amount || tx["debit amount"]) || 0);
    });
    coarseCategorySummary = Object.entries(coarseSummary).map(
      ([category, amount]) => ({ category, amount })
    );
  }

  return {
    transactions,
    categorySummary,
    monthlyTrend,
    monthlyCategory,
    topMerchants,
    incomeVsExpense,
    coarseCategorySummary,
    total: transactions.length,
    loading,
    error,
    filteredTransactions,
    metrics,
  };
}
