// Sprint 3 Types — Orders & Order Items

export type OrderStatus = 'DANG_CHUAN_BI' | 'DANG_PHUC_VU' | 'HOAN_THANH' | 'DA_HUY';

export type OrderItemStatus = 'CHO_CHE_BIEN' | 'DANG_CHE_BIEN' | 'HOAN_THANH' | 'DA_PHUC_VU' | 'DA_HUY';

export interface Order {
  id: number;
  table_id: number;
  order_code: string;
  status: OrderStatus;
  note: string | null;
  created_by_user_id: number | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
  deleted_at: string | null;
  table?: Table;
  items?: OrderItem[];
  created_by?: User;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  note: string | null;
  status: OrderItemStatus;
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

export interface User {
  id: number;
  username: string;
}

export interface CreateOrderRequest {
  table_id: number;
  note?: string;
}

export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  note?: string;
}

export interface AddOrderItemRequest {
  menu_item_id: number;
  quantity: number;
  note?: string;
}

export interface UpdateOrderItemRequest {
  quantity?: number;
  note?: string;
}

export interface UpdateOrderItemStatusRequest {
  status: OrderItemStatus;
}
