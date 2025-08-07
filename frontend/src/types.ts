export interface Transaction {
  date: string;
  description?: string;
  narration?: string;
  amount?: number;
  category?: string;
  [key: string]: any;
}

export interface FiltersType {
  startDate: string;
  endDate: string;
  categoryFilter: string;
  search: string;
}

export interface SortConfig {
  key: string;
  direction: "asc" | "desc";
}