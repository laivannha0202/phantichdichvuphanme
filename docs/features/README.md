# Tài liệu Đặc tả Tính năng (Feature Specifications)

## Mục lục

| STT | File | Tên tính năng | Sprint | Trạng thái |
|-----|------|---------------|--------|------------|
| 00 | [FEAT_00_TONG_QUAN_IMPLEMENT.md](./FEAT_00_TONG_QUAN_IMPLEMENT.md) | Tổng quan Implement & Quy trình Fix Bug | — | Tham chiếu |
| 01 | [FEAT_01_AUTH_ROLE_USER.md](./FEAT_01_AUTH_ROLE_USER.md) | Đăng nhập / phân quyền / Quản lý tài khoản nhân viên | Sprint 1 | ✅ Hoàn thành |
| 02 | [FEAT_02_QUAN_LY_BAN_KHU_VUC.md](./FEAT_02_QUAN_LY_BAN_KHU_VUC.md) | Quản lý Khu vực & Bàn | Sprint 2 | Chờ thực thi |
| 03 | [FEAT_03_QUAN_LY_THUC_DON.md](./FEAT_03_QUAN_LY_THUC_DON.md) | Quản lý Thực đơn | Sprint 2 | Chờ thực thi |
| 04 | [FEAT_04_GOI_MON_PHUC_VU.md](./FEAT_04_GOI_MON_PHUC_VU.md) | Gọi món / Phục vụ | Sprint 3 | Chờ thực thi |
| 05 | [FEAT_05_BEP_XU_LY_MON.md](./FEAT_05_BEP_XU_LY_MON.md) | Bếp xử lý món | Sprint 4 | Chờ thực thi |
| 06 | [FEAT_06_THANH_TOAN_HOA_DON.md](./FEAT_06_THANH_TOAN_HOA_DON.md) | Thanh toán / Hoá đơn | Sprint 4/5 | Chờ thực thi |
| 07 | [FEAT_07_DAT_BAN_TRUOC.md](./FEAT_07_DAT_BAN_TRUOC.md) | Đặt bàn trước | Sprint 5 | Chờ thực thi |
| 08 | [FEAT_08_BAO_CAO_DOANH_THU.md](./FEAT_08_BAO_CAO_DOANH_THU.md) | Báo cáo Doanh thu | Sprint 5 | Chờ thực thi |
| 09 | [FEAT_09_KHO_NGUYEN_LIEU.md](./FEAT_09_KHO_NGUYEN_LIEU.md) | Kho Nguyên liệu | Sprint 6 | Chờ thực thi |
| 10 | [FEAT_10_NHAN_VIEN_TAI_KHOAN.md](./FEAT_10_NHAN_VIEN_TAI_KHOAN.md) | Nhân viên / Tài khoản | Sprint 6 | Chờ thực thi |
| 11 | [FEAT_11_AUDIT_LOG.md](./FEAT_11_AUDIT_LOG.md) | Audit Log & Log theo dõi | Cross-sprint | Chờ thực thi |
| 12 | [FEAT_12_ERROR_HANDLING_SECURITY.md](./FEAT_12_ERROR_HANDLING_SECURITY.md) | Xử lý lỗi & Bảo mật | Cross-sprint | Chờ thực thi |
| 13 | [FEAT_13_CHECKLIST_VERIFY_FULLSTACK.md](./FEAT_13_CHECKLIST_VERIFY_FULLSTACK.md) | Checklist Verify Toàn bộ Hệ thống | Sau Sprint 6 | Chờ thực thi |

### Tài liệu bổ sung

| File | Nội dung | Dùng khi nào |
|------|----------|-------------|
| `SPRINT_2_IMPLEMENT_PLAN.md` | Kế hoạch implement chi tiết Sprint 2 | Trước khi code Sprint 2 |
| `TEST_VERIFY_SPRINT_2.md` | Test plan & verify checklist Sprint 2 | Sau khi code Sprint 2 |
| `FULL_SYSTEM_VERIFY.md` | Verify toàn hệ thống — Sprint 12 | Final release |
| `DEMO_GUIDE.md` | Hướng dẫn demo hệ thống — Sprint 12 | Demo / bảo vệ |
| `FINAL_RELEASE_REPORT.md` | Báo cáo final release — Sprint 12 | Nộp đồ án |

## Sơ đồ Sprint

```
Sprint 1 ── FEAT_01 (Auth/Role/User) ──────────────── ✅
Sprint 2 ── FEAT_02 (Bàn/Khu vực) + FEAT_03 (Thực đơn) ── Chờ
Sprint 3 ── FEAT_04 (Gọi món) ──────────────────────── Chờ
Sprint 4 ── FEAT_05 (Bếp) + FEAT_06 (Thanh toán) ──── Chờ
Sprint 5 ── FEAT_07 (Đặt bàn) + FEAT_08 (Báo cáo) ── Chờ
Sprint 6 ── FEAT_09 (Kho) + FEAT_10 (Nhân viên) ───── Chờ
Cross ──── FEAT_11 (Audit Log) + FEAT_12 (Error/Security) ── Chờ
Verify ── FEAT_13 (Checklist toàn hệ thống) ────────── Chờ
```

## Quy tắc sử dụng

1. **Đọc FEAT_00 trước** — hiểu quy trình fix bug & sprint strategy
2. **Mỗi file FEAT_* self-sufficient** — dev/AI có thể implement BE + FE + test từ 1 file
3. **Mã codes (UC/BR/AC/TC/US)** tham chiếu từ `docs/nghiepvu/`
4. **Trạng thái Sprint 1** đã ghi ✅ — không cần implement lại
5. **Cross-sprint features** (FEAT_11, FEAT_12) được implement cùng mỗi sprint liên quan
