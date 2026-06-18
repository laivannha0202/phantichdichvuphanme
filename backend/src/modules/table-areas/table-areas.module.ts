import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TableArea } from '../../database/entities/table-area.entity';
import { Table } from '../../database/entities/table.entity';
import { TableAreasController } from './table-areas.controller';
import { TableAreasService } from './table-areas.service';

@Module({
  imports: [TypeOrmModule.forFeature([TableArea, Table])],
  controllers: [TableAreasController],
  providers: [TableAreasService],
  exports: [TableAreasService],
})
export class TableAreasModule {}
