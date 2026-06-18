import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateReservations1770000000000
  implements MigrationInterface
{
  name = 'CreateReservations1770000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== reservations ==========
    await queryRunner.createTable(
      new Table({
        name: 'reservations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'reservation_code', type: 'varchar', length: '50' },
          { name: 'table_id', type: 'int' },
          { name: 'customer_name', type: 'varchar', length: '100' },
          { name: 'customer_phone', type: 'varchar', length: '20' },
          { name: 'guest_count', type: 'int' },
          {
            name: 'reservation_time',
            type: 'datetime',
            precision: 3,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'CHO_XAC_NHAN'",
          },
          { name: 'note', type: 'text', isNullable: true },
          { name: 'created_by_user_id', type: 'int', isNullable: true },
          {
            name: 'confirmed_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'seated_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'no_show_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
            onUpdate: 'CURRENT_TIMESTAMP(3)',
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

    // ========== Foreign Keys ==========

    // reservations.table_id → tables.id
    await queryRunner.createForeignKey(
      'reservations',
      new TableForeignKey({
        columnNames: ['table_id'],
        referencedTableName: 'tables',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // reservations.created_by_user_id → users.id
    await queryRunner.createForeignKey(
      'reservations',
      new TableForeignKey({
        columnNames: ['created_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ========== Indexes ==========
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'idx_reservations_code',
        columnNames: ['reservation_code'],
      }),
    );
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'idx_reservations_table_id',
        columnNames: ['table_id'],
      }),
    );
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'idx_reservations_customer_phone',
        columnNames: ['customer_phone'],
      }),
    );
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'idx_reservations_reservation_time',
        columnNames: ['reservation_time'],
      }),
    );
    await queryRunner.createIndex(
      'reservations',
      new TableIndex({
        name: 'idx_reservations_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs first
    const reservationsTable = await queryRunner.getTable('reservations');
    if (reservationsTable) {
      const fkTable = reservationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('table_id') !== -1,
      );
      if (fkTable) await queryRunner.dropForeignKey('reservations', fkTable);

      const fkUser = reservationsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('created_by_user_id') !== -1,
      );
      if (fkUser) await queryRunner.dropForeignKey('reservations', fkUser);
    }

    // Drop indexes
    await queryRunner.dropIndex('reservations', 'idx_reservations_code');
    await queryRunner.dropIndex('reservations', 'idx_reservations_table_id');
    await queryRunner.dropIndex('reservations', 'idx_reservations_customer_phone');
    await queryRunner.dropIndex('reservations', 'idx_reservations_reservation_time');
    await queryRunner.dropIndex('reservations', 'idx_reservations_status');

    // Drop table
    await queryRunner.dropTable('reservations');
  }
}
