import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Table } from '../../database/entities/table.entity';
import { TableArea } from '../../database/entities/table-area.entity';
import { TablesController } from './tables.controller';
import { TablesService } from './tables.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Table, TableArea]),
    forwardRef(() => OrdersModule),
  ],
  controllers: [TablesController],
  providers: [TablesService],
  exports: [TablesService],
})
export class TablesModule {}
