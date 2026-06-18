import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from '../../database/entities/reservation.entity';
import { Table } from '../../database/entities/table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Table])],
  controllers: [ReservationController],
  providers: [ReservationService],
  exports: [ReservationService],
})
export class ReservationsModule {}
