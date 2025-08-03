import { Transaction } from "../App";

export function exportToCSV(transactions: Transaction[], filename = "transactions.csv") {
  const headers = ["date", "description", "amount", "category"];
  const rows = transactions.map(tx =>
    headers.map(h => `"${(tx[h] ?? tx["narration"] ?? "").toString().replace(/"/g, '""')}"`).join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}