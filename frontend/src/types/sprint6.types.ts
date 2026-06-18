// Sprint 6 Types: Đặt bàn trước

export interface Reservation {
  id: number;
  reservation_code: string;
  table_id: number;
  customer_name: string;
  customer_phone: string;
  guest_count: number;
  reservation_time: string;
  status: ReservationStatus;
  note: string | null;
  created_by_user_id: number | null;
  confirmed_at: string | null;
  seated_at: string | null;
  cancelled_at: string | null;
  no_show_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  // Relations
  table?: {
    id: number;
    name: string;
    capacity: number;
    status: string;
  };
  created_by?: {
    id: number;
    username: string;
  };
}

export type ReservationStatus =
  | 'CHO_XAC_NHAN'
  | 'DA_XAC_NHAN'
  | 'DA_NHAN_BAN'
  | 'HOAN_THANH'
  | 'KHONG_DEN'
  | 'DA_HUY';

export interface CreateReservationRequest {
  table_id: number;
  customer_name: string;
  customer_phone: string;
  guest_count: number;
  reservation_time: string;
  note?: string;
}

export interface UpdateReservationRequest {
  table_id?: number;
  customer_name?: string;
  customer_phone?: string;
  guest_count?: number;
  reservation_time?: string;
  note?: string;
}

export interface UpdateReservationStatusRequest {
  status: ReservationStatus;
}

export const RESERVATION_STATUS_CONFIG: Record<
  ReservationStatus,
  { label: string; color: string }
> = {
  CHO_XAC_NHAN: { label: 'Chờ xác nhận', color: 'warning' },
  DA_XAC_NHAN: { label: 'Đã xác nhận', color: 'processing' },
  DA_NHAN_BAN: { label: 'Đã nhận bàn', color: 'success' },
  HOAN_THANH: { label: 'Hoàn thành', color: 'default' },
  KHONG_DEN: { label: 'Khách không đến', color: 'error' },
  DA_HUY: { label: 'Đã hủy', color: 'error' },
};
