export function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

// Parse date string in dd/MM/YY or dd/MM/YYYY format
export function parseDate(dateStr) {
  if (!dateStr) return null;
  // dd/MM/YY or dd/MM/YYYY
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    let [day, month, year] = parts;
    day = day.padStart(2, "0");
    month = month.padStart(2, "0");
    if (year.length === 2) {
      // Assume 20xx for years 00-99
      year = (parseInt(year, 10) < 50 ? "20" : "19") + year;
    }
    return new Date(`${year}-${month}-${day}`);
  }
  // fallback to native Date
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(dateStr) {
  const d = parseDate(dateStr);
  return d ? d.toLocaleDateString() : "";
}