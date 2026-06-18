// Sprint 7 Types — Báo cáo doanh thu

export interface RevenueSummary {
  period: {
    fromDate: string;
    toDate: string;
  };
  total_revenue: number;
  total_invoices: number;
  total_orders: number;
  average_invoice: number;
}

export interface DailyRevenue {
  date: string;
  invoices: number;
  revenue: number;
}

export interface DailyRevenueResponse {
  period: {
    fromDate: string;
    toDate: string;
  };
  daily: DailyRevenue[];
}

export interface TopItem {
  item_id: number;
  item_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface TopItemsResponse {
  period: {
    fromDate: string;
    toDate: string;
  };
  items: TopItem[];
}

export interface PaymentMethod {
  payment_method: string;
  transaction_count: number;
  total_amount: number;
}

export interface PaymentMethodsResponse {
  period: {
    fromDate: string;
    toDate: string;
  };
  methods: PaymentMethod[];
}
