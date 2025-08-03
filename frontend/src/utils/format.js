export function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}