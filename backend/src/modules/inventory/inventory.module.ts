import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { Supplier } from '../../database/entities/supplier.entity';
import { Ingredient } from '../../database/entities/ingredient.entity';
import { InventoryTransaction } from '../../database/entities/inventory-transaction.entity';
import { User } from '../../database/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Supplier, Ingredient, InventoryTransaction, User]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}