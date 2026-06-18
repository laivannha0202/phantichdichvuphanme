import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateAuditLogs1790000000000 implements MigrationInterface {
  name = 'CreateAuditLogs1790000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'audit_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'user_id', type: 'int', isNullable: true },
          { name: 'username', type: 'varchar', length: '50', isNullable: true },
          { name: 'role_code', type: 'varchar', length: '50', isNullable: true },
          { name: 'action', type: 'varchar', length: '80' },
          { name: 'module', type: 'varchar', length: '100' },
          { name: 'entity_type', type: 'varchar', length: '100', isNullable: true },
          { name: 'entity_id', type: 'varchar', length: '100', isNullable: true },
          { name: 'method', type: 'varchar', length: '10', isNullable: true },
          { name: 'path', type: 'varchar', length: '255', isNullable: true },
          { name: 'status_code', type: 'int', isNullable: true },
          { name: 'ip_address', type: 'varchar', length: '64', isNullable: true },
          { name: 'user_agent', type: 'varchar', length: '255', isNullable: true },
          { name: 'description', type: 'varchar', length: '255', isNullable: true },
          { name: 'metadata', type: 'json', isNullable: true },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'deleted_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // Create indexes
    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_user_id',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_username',
        columnNames: ['username'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_role_code',
        columnNames: ['role_code'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_action',
        columnNames: ['action'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_module',
        columnNames: ['module'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_entity',
        columnNames: ['entity_type', 'entity_id'],
      }),
    );

    await queryRunner.createIndex(
      'audit_logs',
      new TableIndex({
        name: 'idx_audit_logs_created_at',
        columnNames: ['created_at'],
      }),
    );

    // Create foreign key
    await queryRunner.createForeignKey(
      'audit_logs',
      new TableForeignKey({
        name: 'fk_audit_logs_user_id',
        columnNames: ['user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('audit_logs', 'fk_audit_logs_user_id');
    await queryRunner.dropTable('audit_logs');
  }
}
