import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../config/typeorm.config';
import { runSeed } from './seed';

async function main() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();
  console.log('📦 Đã kết nối database');

  try {
    await runSeed(dataSource);
    console.log('✅ Seed hoàn tất');
  } catch (error) {
    console.error('❌ Seed thất bại:', error);
    process.exit(1);
  } finally {
    await dataSource.destroy();
  }
}

main();
