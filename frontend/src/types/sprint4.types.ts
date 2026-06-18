// Sprint 4 Types — Invoices & Payments

export type InvoiceStatus = 'CHUA_THANH_TOAN' | 'DA_THANH_TOAN' | 'DA_HUY';

export type PaymentMethod = 'TIEN_MAT' | 'CHUYEN_KHOAN' | 'THE';

export interface Invoice {
  id: number;
  order_id: number;
  invoice_code: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  order?: Order;
  payments?: Payment[];
}

export interface Payment {
  id: number;
  invoice_id: number;
  payment_method: PaymentMethod;
  amount: number;
  reference_no: string | null;
  notes: string | null;
  created_at: string;
  invoice?: Invoice;
}

export interface Order {
  id: number;
  table_id: number;
  order_code: string;
  status: string;
  note: string | null;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  deleted_at: string | null;
  table?: Table;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  note: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  deleted_at: string | null;
  menu_item?: MenuItem;
}

export interface Table {
  id: number;
  table_area_id: number;
  name: string;
  capacity: number;
  status: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  status: string;
}

export interface CreateInvoiceRequest {
  order_id: number;
  tax_rate?: number;
  discount?: number;
  notes?: string;
}

export interface PayInvoiceRequest {
  payment_method: PaymentMethod;
  amount: number;
  reference_no?: string;
  notes?: string;
}

export interface CancelInvoiceRequest {
  reason: string;
}

export interface PayInvoiceResponse {
  payment_id: number;
  invoice_status: InvoiceStatus;
  change: number;
}
