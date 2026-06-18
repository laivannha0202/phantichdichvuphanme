# Hướng dẫn sử dụng MCP trong OpenCode — Dự án Quản lý Nhà hàng

MCP (Model Context Protocol) giúp AI truy cập file, database, web browser, và các công cụ phát triển trực tiếp.
Tài liệu này hướng dẫn khi nào nên dùng và KHÔNG nên dùng từng MCP trong dự án quản lý nhà hàng.

---

## Danh sách MCP hiện có

| MCP | Mục đích chính | Khi nào nên dùng | Không dùng khi nào |
|-----|----------------|-------------------|---------------------|
| `filesystem` | Đọc/ghi/tìm file | Đọc docs, sửa code, tạo file, xem cấu trúc thư mục | Không dùng thay terminal để chạy `rm -rf`, `git reset` |
| `git` | Xem trạng thái repo | Xem `status`, `diff`, `log` trước khi sửa code lớn | Không tự `add`, `commit`, `push` nếu chưa được yêu cầu |
| `github` | GitHub API (read) | Xem branches, issues, list PRs | Không tự tạo PR, issue, release nếu chưa được yêu cầu rõ |
| `mysql` | Query MySQL (read-only) | Kiểm tra schema, seed data, SELECT dữ liệu | Không DROP/TRUNCATE/DELETE/UPDATE; không query password_hash, token |
| `playwright` | Web browser | Test UI, chụp screenshot, verify trang web | Không dùng khi chỉ cần đọc code — dùng filesystem/serena |
| `serena` | Code analysis | Tìm symbol, declaration, references, rename | Không dùng khi chỉ cần đọc file đơn giản — dùng filesystem |
| `context7` | Documentation | Query docs NestJS, React, TypeORM, etc. | Không dùng khi docs đã có trong `docs/nghiepvu/` hoặc `docs/thietke/` |
| `fetch` | Fetch URL | Lấy nội dung từ URL, kiểm tra API | Không dùng khi chỉ cần đọc file local — dùng filesystem |
| `gh_grep` | GitHub code search | Tìm pattern code production từ hàng triệu repos | Không dùng khi context7 đã có docs chính thức |

---

## Chi tiết từng MCP và ví dụ

### 1. filesystem

**Dùng khi:** Đọc, ghi, sửa file. Thay thế hoàn toàn `cat`, `echo`, `sed`, `find`.

```
filesystem_read_file → đọc file
filesystem_write_file → tạo/sửa file
filesystem_list_directory → xem thư mục
filesystem_search_files → tìm file theo pattern
filesystem_edit_file → sửa file theo line
```

**Ưu điểm:** An toàn hơn terminal vì có permission control. Không vô tình chạy `rm -rf`.

**Ví dụ dự án quản lý nhà hàng:**
```
User: "Đọc tài liệu nghiệp vụ"
→ filesystem_read_file(path: "docs/nghiepvu/README.md")

User: "Tạo entity Role"
→ filesystem_write_file(path: "backend/src/database/entities/role.entity.ts", content: "...")

User: "Tìm tất cả file .ts trong backend"
→ filesystem_search_files(path: "backend/src", pattern: "**/*.ts")
```

---

### 2. git

**Dùng khi:** Xem trạng thái repo. Git MCP chỉ dùng để xem `status`, `diff`, `log` nếu user chưa yêu cầu commit.

```
git_git_status → xem trạng thái working tree
git_git_diff → xem thay đổi
git_git_log → xem lịch sử commit
git_git_checkout → switch branch
git_git_branch → list branches
```

**Quy tắc SIẾT:**
- ✅ Dùng: `git_status`, `git_diff`, `git_log` — để kiểm tra trước khi làm việc
- ❌ Chỉ `git_add` / `git_commit` / `git_push` khi user yêu cầu rõ ràng
- ❌ Chỉ `git_create_branch` khi user yêu cầu rõ ràng
- ❌ Không `git_reset --hard`, `git push --force` trong bất kỳ trường hợp nào

---

### 3. github

**Dùng khi:** Xem thông tin từ GitHub. CHỈ dùng để đọc, KHÔNG tự tạo trừ khi user yêu cầu cụ thể.

```
github_list_branches(owner, repo) → xem branches
github_list_issues(owner, repo) → xem issues
github_list_pull_requests(owner, repo) → xem PRs
github_list_releases(owner, repo) → xem releases
```

**Chỉ dùng khi user yêu cầu rõ ràng:**
```
User: "Tạo PR mới" → github_create_pull_request(...)
User: "Tạo issue mới" → github_issue_write(...)
User: "Merge PR này" → github_merge_pull_request(...)
```

**KHÔNG tự tạo PR/issue/release nếu user chỉ nói "xem" hoặc "kiểm tra".**

---

### 4. mysql

**Dùng khi:** Đọc dữ liệu từ database. **READ-ONLY** — MCP này không thể ghi.

**Cấu hình MCP MySQL (đã set sẵn trong OpenCode):**
- MCP MySQL đã được cấu hình sẵn trong OpenCode, **không cần đọc `backend/.env`**.
- Host: `127.0.0.1` hoặc `localhost`
- Port: `3307` (Docker host port, map đến container port `3306`)
- Database: `quanlynhahang`
- Username/Password: đã cấu hình trong MCP settings, không ghi vào tài liệu, không in ra báo cáo.

**Giải thích port:**
- `3306` là port MySQL mặc định/internal bên trong container.
- `3307` là port host để MCP/OpenCode/backend trên máy truy cập.

```
mysql_mysql_query(sql: "SHOW TABLES")
mysql_mysql_query(sql: "DESCRIBE roles")
mysql_mysql_query(sql: "SELECT COUNT(*) as total FROM staff")
mysql_mysql_query(sql: "SELECT id, username, status FROM users LIMIT 10")
```

**Quy tắc SIẾT:**
- ✅ Dùng: `SELECT`, `SHOW`, `DESCRIBE`, `SHOW CREATE TABLE`
- ❌ KHÔNG: `DROP`, `TRUNCATE`, `DELETE`, `UPDATE`, `INSERT` — dù MCP không cho phép, không được gợi ý user chạy
- ❌ KHÔNG query cột: `password_hash`, `token`, `refresh_token`, `access_token`
- ❌ KHÔNG thao tác production database — chỉ dev/local
- ✅ Dùng `SELECT COUNT(*)` trước khi gợi ý DELETE/UPDATE trong code

**Ví dụ dự án:**
```
mysql_mysql_query(sql: "SELECT id, name FROM roles")
mysql_mysql_query(sql: "SHOW TABLES LIKE 'staff'")
mysql_mysql_query(sql: "SELECT COUNT(*) as total FROM users")
```

---

### 5. playwright

**Dùng khi:** Mở web browser, test UI, chụp screenshot, tương tác với trang web.

```
playwright_browser_navigate(url: "http://localhost:5173")   # Frontend
playwright_browser_navigate(url: "http://localhost:5011")   # Backend API
playwright_browser_take_screenshot(type: "png")
playwright_browser_click(target: "button[type=submit]")
playwright_browser_type(target: "input[type=text]", text: "admin")
playwright_browser_snapshot()
```

**Port dự án:**
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5011`

**Khi nào dùng playwright:**
- Test giao diện sau khi deploy
- Verify trang web hoạt động đúng
- Chụp screenshot làm evidence
- Test flow đăng nhập, đặt hàng, etc.

**Ví dụ dự án — kiểm tra trang login:**
```
→ playwright_browser_navigate(url: "http://localhost:5173/login")
→ playwright_browser_snapshot()
→ playwright_browser_fill_form(fields: [
    {target: "input[name=username]", value: "admin"},
    {target: "input[name=password]", value: "Admin@123"}
  ])
→ playwright_browser_click(target: "button[type=submit]")
→ playwright_browser_wait_for(text: "Dashboard")
→ playwright_browser_take_screenshot(type: "png")
```

---

### 6. serena

**Dùng khi:** Phân tích code sâu — tìm symbol, declaration, references, rename.

```
serena_find_symbol(name_path_pattern: "UserService")
serena_find_declaration(relative_path: "backend/src/user.service.ts", regex: "create")
serena_find_implementations(name_path: "UserService/create")
serena_find_referencing_symbols(name_path: "UserService/findAll")
serena_rename_symbol(name_path: "UserService/oldName", new_name: "newName", relative_path: "...")
serena_read_memory(memory_name: "project-info")
```

**Khi nào dùng serena:**
- Refactor code: rename, move functions
- Debug: tìm tất cả nơi gọi một hàm
- Hiểu cấu trúc code: overview symbols trong file
- Kiểm tra diagnostics (errors, warnings)

---

### 7. context7

**Dùng khi:** Cần docs NestJS, React, TypeORM, etc.

```
# Bước 1: Resolve library ID
context7_resolve-library-id(libraryName: "NestJS")

# Bước 2: Query docs
context7_query-docs(
  libraryId: "/nestjs/docs",
  query: "How to create a guard in NestJS"
)
```

**Lưu ý:** Dự án dùng **TypeORM**, không dùng Prisma. Khi query TypeORM docs:
```
context7_resolve-library-id(libraryName: "TypeORM")
context7_query-docs(libraryId: "/typeorm/docs", query: "How to create entity")
```

**Khi nào dùng:**
- Không sure cách dùng API của NestJS, React, TypeORM
- Cần best practice cho pattern cụ thể
- Khi error xảy ra và cần biết cách fix

---

### 8. fetch

**Dùng khi:** Lấy nội dung từ URL bất kỳ.

```
fetch_fetch(url: "https://api.github.com/repos/nha/Quanlynhahang")
```

**Khi nào dùng:**
- Kiểm tra API endpoint có hoạt động không
- Đọc docs online
- Download file/text từ web

---

### 9. gh_grep

**Dùng khi:** Tìm pattern code trong hàng triệu repos công khai trên GitHub.

```
gh_grep_searchGitHub(
  query: "@UseGuards",
  language: ["TypeScript"],
  repo: "nestjs/"
)

gh_grep_searchGitHub(
  query: "(?s)useEffect\\(.*return \\(",
  language: ["TypeScript", "TSX"],
  useRegexp: true
)
```

**Khi nào dùng:**
- Không biết cách implement pattern cụ thể
- Cần xem example thật từ production code
- So sánh cách các framework xử lý vấn đề tương tự

---

## MCP routing theo Sprint 1

| Việc cần làm | MCP nên dùng | Ghi chú |
|---------------|--------------|---------|
| Đọc docs trước khi code | `filesystem` | Đọc đúng `docs/nghiepvu/` và `docs/thietke/`, không tự suy |
| Setup Backend NestJS | `filesystem`, `serena`, `context7` | Sprint 1 chỉ Auth + Role + User |
| Tạo entity/migration | `filesystem`, `context7`, `mysql` | Sprint 1 chỉ roles, staff, users |
| Seed roles/admin | `filesystem`, `mysql` | Chỉ seed dev/local, KHÔNG seed production |
| Test API auth | `filesystem`, `mysql`, `git` | Test login/refresh/logout/me trên localhost:5011 |
| Setup Frontend sau khi BE ổn | `filesystem`, `serena`, `playwright`, `context7` | FE port 5173 |
| Kiểm tra diff cuối task | `git` | Chỉ xem, KHÔNG commit/push nếu chưa được yêu cầu |
| Kiểm tra secret | `git`, `gh_grep` | Không để `.env` thật, JWT secret thật trong code |

---

## Quy tắc an toàn bắt buộc

1. **Không đọc hoặc in secret thật.** JWT secret, database password, API key — không hiển thị trong output.
2. **Không in DB_PASSWORD.** Dù env var truyền qua bash hay .env, KHÔNG bao giờ in giá trị DB_PASSWORD ra terminal/report.
3. **Không in JWT_SECRET / ACCESS_TOKEN / REFRESH_TOKEN.** Khi test auth, chỉ ghi `token returned: yes/no`, KHÔNG in full token string.
4. **Không query password_hash.** MySQL query chỉ lấy `id, username, role_id, status` — không SELECT cột password_hash/token/refresh_token.
5. **Không sửa file ngoài phạm vi prompt.** Chỉ sửa file liên quan trực tiếp đến task.
6. **Không tạo API/module ngoài Sprint hiện tại.** Sprint 1 chỉ Auth + Role + User.
7. **Không tạo full 15 bảng MVP ở Sprint 1.** Tuân thủ Sprint plan đã chốt.
8. **Không thêm PHP/Adminer/phpMyAdmin.** Dự án dùng NestJS + React + MySQL, không PHP.
9. **Không dùng MCP để xóa dữ liệu.** MCP là read-only tool, không phải deletion tool.
10. **Không commit/push nếu chưa được yêu cầu.** Dù `permission: allow`, vẫn phải tuân thủ rule này.
11. **Không thêm công nghệ ngoài stack đã chốt** nếu chưa giải thích lý do và được approve.

---

## Checklist trước khi báo cáo

- [ ] Đã đọc đúng tài liệu cần thiết (docs/nghiepvu, docs/thietke)
- [ ] Đã dùng MCP phù hợp với task (filesystem, context7, serena, mysql...)
- [ ] Đã kiểm tra file ngoài phạm vi — không sửa file ngoài prompt
- [ ] Đã kiểm tra không có DB_PASSWORD trong output
- [ ] Đã kiểm tra không có JWT_SECRET / ACCESS_TOKEN / REFRESH_TOKEN trong output
- [ ] Đã kiểm tra không query cột password_hash/token/refresh_token
- [ ] Đã kiểm tra không có PHP/Adminer/phpMyAdmin
- [ ] Đã kiểm tra không commit/push
- [ ] Báo cáo rõ file đã tạo/sửa
- [ ] Báo cáo rõ lệnh đã chạy nếu có
- [ ] Báo cáo rõ lỗi còn lại nếu có

---

## Workflow mẫu khi kết hợp nhiều MCP

### Thêm tính năng mới (Sprint 1)
```
1. filesystem_read_file → đọc docs/nghiepvu và docs/thietke
2. context7_query-docs → đọc docs NestJS/TypeORM
3. serena_find_symbol → xem code hiện có
4. filesystem_write_file → tạo entity/service/controller
5. git_git_status + git_git_diff → kiểm tra thay đổi
6. playwright_browser_navigate → test API/UI trên đúng port
```

### Debug lỗi
```
1. mysql_mysql_query → kiểm tra data
2. serena_find_referencing_symbols → tìm ai gọi hàm lỗi
3. context7_query-docs → đọc docs lỗi thường gặp
4. filesystem_edit_file → fix code
5. playwright_browser_navigate → verify fix trên localhost:5173 hoặc :5011
```

### Review code
```
1. git_git_diff → xem thay đổi
2. serena_get_symbols_overview → hiểu cấu trúc
3. gh_grep_searchGitHub → so sánh best practice
```

---

## Lưu ý chung

1. **Ưu tiên MCP hơn terminal** — MCP an toàn hơn, có permission control
2. **Không dùng `cat`/`grep`/`find` terminal** — dùng filesystem/serena thay thế
3. **MySQL chỉ đọc** — muốn sửa data dùng TypeORM migration/seed hoặc service code
4. **Playwright cho test UI** — dùng đúng port: FE `:5173`, BE `:5011`
5. **Context7 trước khi hỏi** — docs framework đã có sẵn, không cần search web
6. **gh_grep khi cần example** — tìm code thật từ GitHub thay vì tự đoán
7. **Không dùng Prisma** — dự án dùng TypeORM
8. **Không tự commit/push** — luôn đợi user yêu cầu rõ ràng
