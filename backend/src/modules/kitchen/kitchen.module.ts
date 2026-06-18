import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KitchenController } from './kitchen.controller';
import { KitchenService } from './kitchen.service';
import { Order } from '../../database/entities/order.entity';
import { OrderItem } from '../../database/entities/order-item.entity';
import { Table } from '../../database/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Table])],
  controllers: [KitchenController],
  providers: [KitchenService],
  exports: [KitchenService],
})
export class KitchenModule {}
