import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateInvoicesPayments1760000000000
  implements MigrationInterface
{
  name = 'CreateInvoicesPayments1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== invoices ==========
    await queryRunner.createTable(
      new Table({
        name: 'invoices',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'order_id', type: 'int' },
          { name: 'invoice_code', type: 'varchar', length: '50' },
          {
            name: 'subtotal',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'tax_rate',
            type: 'decimal',
            precision: 5,
            scale: 2,
            default: 10,
          },
          {
            name: 'tax_amount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'discount',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'total',
            type: 'decimal',
            precision: 12,
            scale: 2,
            default: 0,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'CHUA_THANH_TOAN'",
          },
          { name: 'notes', type: 'text', isNullable: true },
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

    // ========== payments ==========
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'invoice_id', type: 'int' },
          { name: 'payment_method', type: 'varchar', length: '50' },
          { name: 'amount', type: 'decimal', precision: 12, scale: 2 },
          { name: 'reference_no', type: 'varchar', length: '100', isNullable: true },
          { name: 'notes', type: 'text', isNullable: true },
          {
            name: 'created_at',
            type: 'datetime',
            precision: 3,
            default: 'CURRENT_TIMESTAMP(3)',
          },
        ],
      }),
      true,
    );

    // ========== Foreign Keys ==========

    // invoices.order_id → orders.id
    await queryRunner.createForeignKey(
      'invoices',
      new TableForeignKey({
        columnNames: ['order_id'],
        referencedTableName: 'orders',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // payments.invoice_id → invoices.id
    await queryRunner.createForeignKey(
      'payments',
      new TableForeignKey({
        columnNames: ['invoice_id'],
        referencedTableName: 'invoices',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // ========== Indexes ==========
    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'idx_invoices_invoice_code',
        columnNames: ['invoice_code'],
      }),
    );
    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'idx_invoices_order_id',
        columnNames: ['order_id'],
      }),
    );
    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'idx_invoices_status',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'invoices',
      new TableIndex({
        name: 'idx_invoices_created_at',
        columnNames: ['created_at'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'idx_payments_invoice_id',
        columnNames: ['invoice_id'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'idx_payments_payment_method',
        columnNames: ['payment_method'],
      }),
    );
    await queryRunner.createIndex(
      'payments',
      new TableIndex({
        name: 'idx_payments_created_at',
        columnNames: ['created_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs first
    const paymentsTable = await queryRunner.getTable('payments');
    if (paymentsTable) {
      const fkInvoice = paymentsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('invoice_id') !== -1,
      );
      if (fkInvoice) await queryRunner.dropForeignKey('payments', fkInvoice);
    }

    const invoicesTable = await queryRunner.getTable('invoices');
    if (invoicesTable) {
      const fkOrder = invoicesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('order_id') !== -1,
      );
      if (fkOrder) await queryRunner.dropForeignKey('invoices', fkOrder);
    }

    // Drop indexes
    await queryRunner.dropIndex('payments', 'idx_payments_invoice_id');
    await queryRunner.dropIndex('payments', 'idx_payments_payment_method');
    await queryRunner.dropIndex('payments', 'idx_payments_created_at');
    await queryRunner.dropIndex('invoices', 'idx_invoices_invoice_code');
    await queryRunner.dropIndex('invoices', 'idx_invoices_order_id');
    await queryRunner.dropIndex('invoices', 'idx_invoices_status');
    await queryRunner.dropIndex('invoices', 'idx_invoices_created_at');

    // Drop tables in reverse order
    await queryRunner.dropTable('payments');
    await queryRunner.dropTable('invoices');
  }
}
