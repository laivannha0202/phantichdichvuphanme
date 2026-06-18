import { DataSource } from 'typeorm';
import type { DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

/**
 * ESM-safe rootDir: dùng process.cwd() thay vì __dirname.
 * TypeORM CLI luôn chạy từ thư mục backend/, nên process.cwd() luôn đúng.
 */
const rootDir = process.cwd();

config({ path: resolve(rootDir, '.env') });

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'quanlynhahang',
  entities: [resolve(rootDir, 'src/**/*.entity{.ts,.js}')],
  migrations: [resolve(rootDir, 'src/database/migrations/*{.ts,.js}')],
  charset: 'utf8mb4',
  synchronize: false,
  logging: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
