import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateRolesUsersStaff1740000000000 implements MigrationInterface {
  name = 'CreateRolesUsersStaff1740000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ========== roles ==========
    await queryRunner.createTable(
      new Table({
        name: 'roles',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'code', type: 'varchar', length: '50', isUnique: true },
          { name: 'name', type: 'varchar', length: '100' },
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

    // ========== users ==========
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'username', type: 'varchar', length: '50', isUnique: true },
          { name: 'password_hash', type: 'varchar', length: '255' },
          { name: 'role_id', type: 'int' },
          { name: 'staff_id', type: 'int', isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'ACTIVE'",
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

    // ========== staff ==========
    await queryRunner.createTable(
      new Table({
        name: 'staff',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'full_name', type: 'varchar', length: '100' },
          { name: 'phone', type: 'varchar', length: '20', isNullable: true },
          { name: 'position', type: 'varchar', length: '50', isNullable: true },
          {
            name: 'status',
            type: 'varchar',
            length: '50',
            default: "'ACTIVE'",
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

    // users.role_id → roles.id
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedTableName: 'roles',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
      }),
    );

    // users.staff_id → staff.id
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        columnNames: ['staff_id'],
        referencedTableName: 'staff',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ========== Indexes ==========
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'idx_users_role_id', columnNames: ['role_id'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'idx_users_staff_id', columnNames: ['staff_id'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({ name: 'idx_users_status', columnNames: ['status'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs first
    const usersTable = await queryRunner.getTable('users');
    if (usersTable) {
      const fkRole = usersTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('role_id') !== -1,
      );
      if (fkRole) await queryRunner.dropForeignKey('users', fkRole);

      const fkStaff = usersTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('staff_id') !== -1,
      );
      if (fkStaff) await queryRunner.dropForeignKey('users', fkStaff);
    }

    await queryRunner.dropTable('staff');
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('roles');
  }
}
