import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateOrdersOrderItems1750000000000
  implements MigrationInterface
{
  name = 'CreateOrdersOrderItems1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== orders ==========
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'table_id', type: 'int' },
          { name: 'order_code', type: 'varchar', length: '50' },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'DANG_CHUAN_BI'",
          },
          { name: 'note', type: 'text', isNullable: true },
          { name: 'created_by_user_id', type: 'int', isNullable: true },
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
            name: 'completed_at',
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
            name: 'deleted_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // ========== order_items ==========
    await queryRunner.createTable(
      new Table({
        name: 'order_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'order_id', type: 'int' },
          { name: 'menu_item_id', type: 'int' },
          { name: 'quantity', type: 'int', default: 1 },
          { name: 'unit_price', type: 'decimal', precision: 12, scale: 2 },
          { name: 'note', type: 'text', isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'CHO_CHE_BIEN'",
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
            name: 'cancelled_at',
            type: 'datetime',
            precision: 3,
            isNullable: true,
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

    // orders.table_id → tables.id
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['table_id'],
        referencedTableName: 'tables',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // orders.created_by_user_id → users.id
    await queryRunner.createForeignKey(
      'orders',
      new TableForeignKey({
        columnNames: ['created_by_user_id'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // order_items.order_id → orders.id
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // order_items.menu_item_id → menu_items.id
    await queryRunner.createForeignKey(
      'order_items',
      new TableForeignKey({
        columnNames: ['menu_item_id'],
        referencedTableName: 'menu_items',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // ========== Indexes ==========
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'idx_orders_order_code',
        columnNames: ['order_code'],
      }),
    );
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'idx_orders_table_id',
        columnNames: ['table_id'],
      }),
    );
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'idx_orders_status',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'orders',
      new TableIndex({
        name: 'idx_orders_created_by_user_id',
        columnNames: ['created_by_user_id'],
      }),
    );
    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        name: 'idx_order_items_order_id',
        columnNames: ['order_id'],
      }),
    );
    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        name: 'idx_order_items_menu_item_id',
        columnNames: ['menu_item_id'],
      }),
    );
    await queryRunner.createIndex(
      'order_items',
      new TableIndex({
        name: 'idx_order_items_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs first
    const orderItemsTable = await queryRunner.getTable('order_items');
    if (orderItemsTable) {
      const fkOrder = orderItemsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('order_id') !== -1,
      );
      if (fkOrder) await queryRunner.dropForeignKey('order_items', fkOrder);

      const fkMenuItem = orderItemsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('menu_item_id') !== -1,
      );
      if (fkMenuItem) await queryRunner.dropForeignKey('order_items', fkMenuItem);
    }

    const ordersTable = await queryRunner.getTable('orders');
    if (ordersTable) {
      const fkTable = ordersTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('table_id') !== -1,
      );
      if (fkTable) await queryRunner.dropForeignKey('orders', fkTable);

      const fkUser = ordersTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('created_by_user_id') !== -1,
      );
      if (fkUser) await queryRunner.dropForeignKey('orders', fkUser);
    }

    // Drop indexes
    await queryRunner.dropIndex('order_items', 'idx_order_items_order_id');
    await queryRunner.dropIndex('order_items', 'idx_order_items_menu_item_id');
    await queryRunner.dropIndex('order_items', 'idx_order_items_status');
    await queryRunner.dropIndex('orders', 'idx_orders_order_code');
    await queryRunner.dropIndex('orders', 'idx_orders_table_id');
    await queryRunner.dropIndex('orders', 'idx_orders_status');
    await queryRunner.dropIndex('orders', 'idx_orders_created_by_user_id');

    // Drop tables in reverse order
    await queryRunner.dropTable('order_items');
    await queryRunner.dropTable('orders');
  }
}
