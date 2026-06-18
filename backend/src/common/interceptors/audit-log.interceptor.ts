import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  SetMetadata,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';
import {
  sanitizeAuditMetadata,
  buildAuditDescription,
} from '../helpers/audit-sanitizer.helper';

// Metadata keys
export const AUDIT_META_MODULE = 'audit:module';
export const AUDIT_META_ACTION = 'audit:action';
export const AUDIT_META_ENTITY_TYPE = 'audit:entityType';

/**
 * Decorator: đánh dấu module cho audit log (dùng cho class hoặc method).
 */
export const AuditModule = (module: string) => SetMetadata(AUDIT_META_MODULE, module);

/**
 * Decorator: đánh dấu action cho audit log (dùng cho method).
 */
export const AuditAction = (action: string) => SetMetadata(AUDIT_META_ACTION, action);

/**
 * Decorator: đánh dấu entity type cho audit log.
 */
export const AuditEntityType = (entityType: string) =>
  SetMetadata(AUDIT_META_ENTITY_TYPE, entityType);

/**
 * Decorator tổng hợp: gắn module + action + entity type trong 1 decorator.
 */
export const Audit = (module: string, action: string, entityType?: string) => {
  return (target: any, key?: string, descriptor?: PropertyDescriptor) => {
    SetMetadata(AUDIT_META_MODULE, module)(target, key!, descriptor!);
    SetMetadata(AUDIT_META_ACTION, action)(target, key!, descriptor!);
    if (entityType) {
      SetMetadata(AUDIT_META_ENTITY_TYPE, entityType)(target, key!, descriptor!);
    }
  };
};

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditLogInterceptor.name);

  constructor(
    private readonly auditLogsService: AuditLogsService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Chỉ intercept POST, PATCH, DELETE
    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const handler = context.getHandler();
    const targetClass = context.getClass();

    const module =
      this.reflector.get<string>(AUDIT_META_MODULE, handler) ??
      this.reflector.get<string>(AUDIT_META_MODULE, targetClass);

    const action =
      this.reflector.get<string>(AUDIT_META_ACTION, handler) ??
      this.reflector.get<string>(AUDIT_META_ACTION, targetClass);

    const entityType =
      this.reflector.get<string>(AUDIT_META_ENTITY_TYPE, handler) ??
      this.reflector.get<string>(AUDIT_META_ENTITY_TYPE, targetClass);

    // Không có metadata audit -> skip
    if (!module || !action) {
      return next.handle();
    }

    const user = request.user;
    const userId = user?.sub ?? null;
    const username = user?.username ?? null;
    const roleCode = user?.roleCode ?? null;
    const path = request.route?.path ?? request.url ?? null;
    const ipAddress = request.ip ?? request.connection?.remoteAddress ?? null;
    const userAgent = request.headers?.['user-agent'] ?? null;

    // entity_id: ưu tiên param:id, fallback param khác
    let entityId: string | null = request.params?.id ?? null;
    if (!entityId) {
      // fallback: tìm param số đầu tiên
      const numericParam = Object.entries(request.params ?? {}).find(
        ([, v]) => v && /^\d+$/.test(String(v)),
      );
      if (numericParam) {
        entityId = String(numericParam[1]);
      }
    }

    const metadata = sanitizeAuditMetadata(
      request.method === 'PATCH' || request.method === 'POST'
        ? request.body ?? {}
        : {},
    );
    const description = buildAuditDescription(action, entityType, entityId);

    return next.handle().pipe(
      tap({
        next: (response: any) => {
          const statusCode = context.switchToHttp().getResponse().statusCode;
          this.auditLogsService.log({
            user_id: userId,
            username,
            role_code: roleCode,
            action,
            module,
            entity_type: entityType ?? null,
            entity_id: entityId,
            method,
            path,
            status_code: statusCode,
            ip_address: ipAddress,
            user_agent: userAgent,
            description,
            metadata,
          });
        },
        error: () => {
          // Không ghi audit khi request thất bại
        },
      }),
    );
  }
}
