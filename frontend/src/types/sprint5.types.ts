// Sprint 5 Types — Kitchen Display System (KDS)

export type KitchenItemStatus = 'CHO_CHE_BIEN' | 'DANG_CHE_BIEN' | 'HOAN_THANH';

export interface KitchenItem {
  id: number;
  order_id: number;
  order_code: string;
  table_name: string;
  table_id: number;
  menu_item_name: string;
  quantity: number;
  note: string | null;
  status: KitchenItemStatus;
  created_at: string;
}

export interface UpdateKitchenItemStatusRequest {
  status: KitchenItemStatus;
}
