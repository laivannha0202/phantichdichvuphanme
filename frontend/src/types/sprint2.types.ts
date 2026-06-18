// ========== Table Areas ==========
export interface TableArea {
  id: number;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  tables?: Table[];
}

export interface CreateTableAreaRequest {
  name: string;
  sort_order?: number;
}

export interface UpdateTableAreaRequest {
  name?: string;
  sort_order?: number;
}

// ========== Tables ==========
export interface Table {
  id: number;
  table_area_id: number;
  name: string;
  capacity: number;
  status: TableStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  table_area?: TableArea;
}

export type TableStatus = 'TRONG' | 'DA_DAT' | 'CO_KHACH' | 'DANG_DON' | 'BAO_TRI';

export interface CreateTableRequest {
  table_area_id: number;
  name: string;
  capacity?: number;
  status?: TableStatus;
}

export interface UpdateTableRequest {
  table_area_id?: number;
  name?: string;
  capacity?: number;
}

export interface UpdateTableStatusRequest {
  status: TableStatus;
}

// ========== Menu Categories ==========
export interface MenuCategory {
  id: number;
  name: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  menu_items?: MenuItem[];
}

export interface CreateMenuCategoryRequest {
  name: string;
  sort_order?: number;
}

export interface UpdateMenuCategoryRequest {
  name?: string;
  sort_order?: number;
}

// ========== Menu Items ==========
export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  cost_price: number | null;
  image_url: string | null;
  status: MenuItemStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category?: MenuCategory;
}

export type MenuItemStatus = 'DANG_BAN' | 'HET_MON' | 'NGUNG_BAN';

export interface CreateMenuItemRequest {
  category_id: number;
  name: string;
  description?: string;
  price: number;
  cost_price?: number;
  image_url?: string;
  status?: MenuItemStatus;
}

export interface UpdateMenuItemRequest {
  category_id?: number;
  name?: string;
  description?: string;
  price?: number;
  cost_price?: number;
  image_url?: string;
  status?: MenuItemStatus;
}

export interface UpdateMenuItemStatusRequest {
  status: MenuItemStatus;
}
