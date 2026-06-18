import {
  Injectable,
  Logger,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueryAuditLogDto } from './dto/query-audit-log.dto';

export interface AuditLogEntry {
  user_id: number | null;
  username: string | null;
  role_code: string | null;
  action: string;
  module: string;
  entity_type?: string | null;
  entity_id?: string | null;
  method?: string | null;
  path?: string | null;
  status_code?: number | null;
  ip_address?: string | null;
  user_agent?: string | null;
  description?: string | null;
  metadata?: Record<string, any> | null;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly dataSource: DataSource) {}

  /**
   * Ghi một bản ghi audit log (INSERT trực tiếp, không dùng Repository
   * để tránh circular dependency khi inject vào module khác).
   */
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.dataSource.query(
        `INSERT INTO audit_logs 
          (user_id, username, role_code, action, module, entity_type, entity_id, 
           method, path, status_code, ip_address, user_agent, description, metadata)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          entry.user_id,
          entry.username,
          entry.role_code,
          entry.action,
          entry.module,
          entry.entity_type ?? null,
          entry.entity_id ?? null,
          entry.method ?? null,
          entry.path ?? null,
          entry.status_code ?? null,
          entry.ip_address ?? null,
          entry.user_agent ?? null,
          entry.description ?? null,
          entry.metadata ? JSON.stringify(entry.metadata) : null,
        ],
      );
    } catch (error: any) {
      // Không throw — audit log fail không làm crash request chính
      this.logger.error(
        `Failed to write audit log: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Truy vấn audit logs với phân trang và bộ lọc.
   */
  async findAll(query: QueryAuditLogDto) {
    const { page, limit, username, role_code, action, module, entity_type, entity_id, from_date, to_date, sort } = query;
    const skip = ((page ?? 1) - 1) * (limit ?? 20);

    const conditions: string[] = [];
    const params: any[] = [];

    if (username) {
      conditions.push('al.username = ?');
      params.push(username);
    }
    if (role_code) {
      conditions.push('al.role_code = ?');
      params.push(role_code);
    }
    if (action) {
      conditions.push('al.action = ?');
      params.push(action);
    }
    if (module) {
      conditions.push('al.module = ?');
      params.push(module);
    }
    if (entity_type) {
      conditions.push('al.entity_type = ?');
      params.push(entity_type);
    }
    if (entity_id) {
      conditions.push('al.entity_id = ?');
      params.push(entity_id);
    }
    if (from_date) {
      conditions.push('al.created_at >= ?');
      params.push(from_date);
    }
    if (to_date) {
      conditions.push('al.created_at <= ?');
      params.push(to_date);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const orderDir = sort === 'asc' ? 'ASC' : 'DESC';

    // Count total
    const countResult = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM audit_logs al ${whereClause}`,
      params,
    );
    const total = Number(countResult[0]?.total ?? 0);

    // Fetch page
    const rows = await this.dataSource.query(
      `SELECT al.* FROM audit_logs al ${whereClause} ORDER BY al.created_at ${orderDir} LIMIT ? OFFSET ?`,
      [...params, limit ?? 20, skip],
    );

    return {
      data: rows.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        username: row.username,
        roleCode: row.role_code,
        action: row.action,
        module: row.module,
        entityType: row.entity_type,
        entityId: row.entity_id,
        method: row.method,
        path: row.path,
        statusCode: row.status_code,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        description: row.description,
        metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : null,
        createdAt: row.created_at,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / (limit ?? 20)),
      },
      message: 'Lấy danh sách nhật ký hoạt động thành công',
    };
  }

  /**
   * Lấy chi tiết một audit log.
   */
  async findOne(id: number) {
    const rows = await this.dataSource.query(
      'SELECT al.* FROM audit_logs al WHERE al.id = ?',
      [id],
    );

    if (rows.length === 0) {
      return { data: null, message: 'Không tìm thấy bản ghi' };
    }

    const row = rows[0];
    return {
      data: {
        id: row.id,
        userId: row.user_id,
        username: row.username,
        roleCode: row.role_code,
        action: row.action,
        module: row.module,
        entityType: row.entity_type,
        entityId: row.entity_id,
        method: row.method,
        path: row.path,
        statusCode: row.status_code,
        ipAddress: row.ip_address,
        userAgent: row.user_agent,
        description: row.description,
        metadata: row.metadata ? (typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata) : null,
        createdAt: row.created_at,
      },
      message: 'Lấy chi tiết nhật ký thành công',
    };
  }
}
