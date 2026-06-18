import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateTableAreasTablesMenuCategoriesMenuItems1740000001000
  implements MigrationInterface
{
  name = 'CreateTableAreasTablesMenuCategoriesMenuItems1740000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== table_areas ==========
    await queryRunner.createTable(
      new Table({
        name: 'table_areas',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'sort_order', type: 'int', default: 0 },
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
        ],
      }),
      true,
    );

    // ========== tables ==========
    await queryRunner.createTable(
      new Table({
        name: 'tables',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'table_area_id', type: 'int' },
          { name: 'name', type: 'varchar', length: '50' },
          { name: 'capacity', type: 'smallint', default: 4 },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'TRONG'",
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

    // ========== menu_categories ==========
    await queryRunner.createTable(
      new Table({
        name: 'menu_categories',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '100' },
          { name: 'sort_order', type: 'int', default: 0 },
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

    // ========== menu_items ==========
    await queryRunner.createTable(
      new Table({
        name: 'menu_items',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'category_id', type: 'int' },
          { name: 'name', type: 'varchar', length: '200' },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'price', type: 'decimal', precision: 12, scale: 2 },
          {
            name: 'cost_price',
            type: 'decimal',
            precision: 12,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'DANG_BAN'",
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

    // tables.table_area_id → table_areas.id
    await queryRunner.createForeignKey(
      'tables',
      new TableForeignKey({
        columnNames: ['table_area_id'],
        referencedTableName: 'table_areas',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // menu_items.category_id → menu_categories.id
    await queryRunner.createForeignKey(
      'menu_items',
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedTableName: 'menu_categories',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // ========== Indexes ==========
    await queryRunner.createIndex(
      'tables',
      new TableIndex({
        name: 'idx_tables_table_area_id',
        columnNames: ['table_area_id'],
      }),
    );
    await queryRunner.createIndex(
      'tables',
      new TableIndex({
        name: 'idx_tables_status',
        columnNames: ['status'],
      }),
    );
    await queryRunner.createIndex(
      'menu_items',
      new TableIndex({
        name: 'idx_menu_items_category_id',
        columnNames: ['category_id'],
      }),
    );
    await queryRunner.createIndex(
      'menu_items',
      new TableIndex({
        name: 'idx_menu_items_status',
        columnNames: ['status'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs first
    const menuItemsTable = await queryRunner.getTable('menu_items');
    if (menuItemsTable) {
      const fkCategory = menuItemsTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('category_id') !== -1,
      );
      if (fkCategory) await queryRunner.dropForeignKey('menu_items', fkCategory);
    }

    const tablesTable = await queryRunner.getTable('tables');
    if (tablesTable) {
      const fkArea = tablesTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('table_area_id') !== -1,
      );
      if (fkArea) await queryRunner.dropForeignKey('tables', fkArea);
    }

    // Drop indexes
    await queryRunner.dropIndex('menu_items', 'idx_menu_items_category_id');
    await queryRunner.dropIndex('menu_items', 'idx_menu_items_status');
    await queryRunner.dropIndex('tables', 'idx_tables_table_area_id');
    await queryRunner.dropIndex('tables', 'idx_tables_status');

    // Drop tables in reverse order
    await queryRunner.dropTable('menu_items');
    await queryRunner.dropTable('menu_categories');
    await queryRunner.dropTable('tables');
    await queryRunner.dropTable('table_areas');
  }
}
