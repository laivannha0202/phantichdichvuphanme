import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Reservation } from '../../database/entities/reservation.entity';
import { Table } from '../../database/entities/table.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Table)
    private readonly tableRepo: Repository<Table>,
  ) {}

  /**
   * Tạo mã đặt bàn tự động
   */
  private async generateReservationCode(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const prefix = `RES-${dateStr}-`;

    const lastReservation = await this.reservationRepo
      .createQueryBuilder('r')
      .where('r.reservation_code LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('r.id', 'DESC')
      .getOne();

    let nextNumber = 1;
    if (lastReservation) {
      const lastCode = lastReservation.reservation_code;
      const lastNum = parseInt(lastCode.split('-').pop() || '0', 10);
      nextNumber = lastNum + 1;
    }

    return `${prefix}${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Kiểm tra trùng lặp reservation cho cùng bàn
   */
  private async checkConflict(
    tableId: number,
    reservationTime: Date,
    excludeId?: number,
  ): Promise<boolean> {
    const query = this.reservationRepo
      .createQueryBuilder('r')
      .where('r.table_id = :tableId', { tableId })
      .andWhere('r.status IN (:...statuses)', {
        statuses: ['DA_XAC_NHAN', 'DA_NHAN_BAN'],
      })
      .andWhere('r.reservation_time = :reservationTime', { reservationTime });

    if (excludeId) {
      query.andWhere('r.id != :excludeId', { excludeId });
    }

    const conflict = await query.getOne();
    return !!conflict;
  }

  /**
   * Tạo đặt bàn mới
   */
  async create(dto: CreateReservationDto, userId?: number): Promise<Reservation> {
    // Kiểm tra bàn tồn tại
    const table = await this.tableRepo.findOne({
      where: { id: dto.table_id, deleted_at: IsNull() },
    });
    if (!table) {
      throw new NotFoundException('Bàn không tồn tại');
    }

    // Kiểm tra bàn không bảo trì
    if (table.status === 'BAO_TRI') {
      throw new BadRequestException('Bàn đang bảo trì, không thể đặt');
    }

    // Kiểm tra guest_count hợp lệ
    if (dto.guest_count > table.capacity) {
      throw new BadRequestException(
        `Số lượng khách (${dto.guest_count}) vượt quá sức chứa bàn (${table.capacity})`,
      );
    }

    // Kiểm tra không đặt trong quá khứ
    const reservationTime = new Date(dto.reservation_time);
    if (reservationTime < new Date()) {
      throw new BadRequestException('Không thể đặt bàn trong quá khứ');
    }

    // Kiểm tra trùng lặp reservation
    const hasConflict = await this.checkConflict(dto.table_id, reservationTime);
    if (hasConflict) {
      throw new BadRequestException(
        'Bàn đã có đặt bàn khác trong thời gian này',
      );
    }

    // Tạo mã đặt bàn
    const reservationCode = await this.generateReservationCode();

    // Tạo reservation
    const reservation = this.reservationRepo.create({
      reservation_code: reservationCode,
      table_id: dto.table_id,
      customer_name: dto.customer_name,
      customer_phone: dto.customer_phone,
      guest_count: dto.guest_count,
      reservation_time: reservationTime,
      status: 'CHO_XAC_NHAN',
      note: dto.note || null,
      created_by_user_id: userId || null,
    });

    return this.reservationRepo.save(reservation);
  }

  /**
   * Lấy danh sách đặt bàn
   */
  async findAll(filters?: {
    status?: string;
    table_id?: number;
    date?: string;
  }): Promise<Reservation[]> {
    const query = this.reservationRepo
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.table', 't')
      .leftJoinAndSelect('r.created_by', 'u')
      .where('r.deleted_at IS NULL');

    if (filters?.status) {
      query.andWhere('r.status = :status', { status: filters.status });
    }

    if (filters?.table_id) {
      query.andWhere('r.table_id = :tableId', { tableId: filters.table_id });
    }

    if (filters?.date) {
      query.andWhere('DATE(r.reservation_time) = :date', { date: filters.date });
    }

    query.orderBy('r.reservation_time', 'ASC');

    return query.getMany();
  }

  /**
   * Lấy chi tiết đặt bàn
   */
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepo.findOne({
      where: { id, deleted_at: IsNull() },
      relations: ['table', 'created_by'],
    });

    if (!reservation) {
      throw new NotFoundException('Đặt bàn không tồn tại');
    }

    return reservation;
  }

  /**
   * Cập nhật đặt bàn
   */
  async update(
    id: number,
    dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    // Chỉ cho phép cập nhật khi trạng thái CHO_XAC_NHAN
    if (reservation.status !== 'CHO_XAC_NHAN') {
      throw new BadRequestException(
        'Chỉ có thể cập nhật đặt bàn ở trạng thái Chờ xác nhận',
      );
    }

    // Nếu đổi bàn, kiểm tra bàn mới
    if (dto.table_id && dto.table_id !== reservation.table_id) {
      const newTable = await this.tableRepo.findOne({
        where: { id: dto.table_id, deleted_at: IsNull() },
      });
      if (!newTable) {
        throw new NotFoundException('Bàn mới không tồn tại');
      }
      if (newTable.status === 'BAO_TRI') {
        throw new BadRequestException('Bàn mới đang bảo trì');
      }
      if (dto.guest_count && dto.guest_count > newTable.capacity) {
        throw new BadRequestException(
          `Số lượng khách (${dto.guest_count}) vượt quá sức chứa bàn mới (${newTable.capacity})`,
        );
      }
    }

    // Cập nhật các trường
    if (dto.table_id !== undefined) reservation.table_id = dto.table_id;
    if (dto.customer_name !== undefined) reservation.customer_name = dto.customer_name;
    if (dto.customer_phone !== undefined) reservation.customer_phone = dto.customer_phone;
    if (dto.guest_count !== undefined) reservation.guest_count = dto.guest_count;
    if (dto.reservation_time !== undefined) {
      reservation.reservation_time = new Date(dto.reservation_time);
    }
    if (dto.note !== undefined) reservation.note = dto.note || null;

    return this.reservationRepo.save(reservation);
  }

  /**
   * Xác nhận đặt bàn
   */
  async confirm(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'CHO_XAC_NHAN') {
      throw new BadRequestException(
        'Chỉ có thể xác nhận đặt bàn ở trạng thái Chờ xác nhận',
      );
    }

    // Cập nhật trạng thái
    reservation.status = 'DA_XAC_NHAN';
    reservation.confirmed_at = new Date();

    // Chuyển bàn sang DA_DAT nếu bàn đang TRONG
    const table = await this.tableRepo.findOne({
      where: { id: reservation.table_id },
    });
    if (table && table.status === 'TRONG') {
      await this.tableRepo.update(table.id, { status: 'DA_DAT' });
    }

    return this.reservationRepo.save(reservation);
  }

  /**
   * Check-in (khách đến nhận bàn)
   */
  async checkIn(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'DA_XAC_NHAN') {
      throw new BadRequestException(
        'Chỉ có thể check-in đặt bàn ở trạng thái Đã xác nhận',
      );
    }

    // Cập nhật trạng thái
    reservation.status = 'DA_NHAN_BAN';
    reservation.seated_at = new Date();

    // Chuyển bàn sang CO_KHACH nếu bàn đang DA_DAT
    const table = await this.tableRepo.findOne({
      where: { id: reservation.table_id },
    });
    if (table && table.status === 'DA_DAT') {
      await this.tableRepo.update(table.id, { status: 'CO_KHACH' });
    }

    return this.reservationRepo.save(reservation);
  }

  /**
   * Hủy đặt bàn
   */
  async cancel(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (!['CHO_XAC_NHAN', 'DA_XAC_NHAN'].includes(reservation.status)) {
      throw new BadRequestException(
        'Chỉ có thể hủy đặt bàn ở trạng thái Chờ xác nhận hoặc Đã xác nhận',
      );
    }

    // Cập nhật trạng thái
    reservation.status = 'DA_HUY';
    reservation.cancelled_at = new Date();

    // Trả bàn về TRONG nếu bàn đang DA_DAT và không có reservation khác
    if (reservation.status === 'DA_XAC_NHAN') {
      const table = await this.tableRepo.findOne({
        where: { id: reservation.table_id },
      });
      if (table && table.status === 'DA_DAT') {
        // Kiểm tra có reservation khác cho bàn này không
        const otherReservation = await this.reservationRepo.findOne({
          where: {
            table_id: reservation.table_id,
            status: In(['DA_XAC_NHAN', 'DA_NHAN_BAN']),
            id: reservation.id !== undefined ? reservation.id : 0,
          },
        });
        if (!otherReservation) {
          await this.tableRepo.update(table.id, { status: 'TRONG' });
        }
      }
    }

    return this.reservationRepo.save(reservation);
  }

  /**
   * Đánh dấu khách không đến
   */
  async noShow(id: number): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (reservation.status !== 'DA_XAC_NHAN') {
      throw new BadRequestException(
        'Chỉ có thể đánh dấu không đến cho đặt bàn ở trạng thái Đã xác nhận',
      );
    }

    // Cập nhật trạng thái
    reservation.status = 'KHONG_DEN';
    reservation.no_show_at = new Date();

    // Trả bàn về TRONG nếu bàn đang DA_DAT
    const table = await this.tableRepo.findOne({
      where: { id: reservation.table_id },
    });
    if (table && table.status === 'DA_DAT') {
      // Kiểm tra có reservation khác cho bàn này không
      const otherReservation = await this.reservationRepo.findOne({
        where: {
          table_id: reservation.table_id,
          status: In(['DA_XAC_NHAN', 'DA_NHAN_BAN']),
        },
      });
      if (!otherReservation) {
        await this.tableRepo.update(table.id, { status: 'TRONG' });
      }
    }

    return this.reservationRepo.save(reservation);
  }

  /**
   * Soft delete reservation
   */
  async remove(id: number): Promise<void> {
    const reservation = await this.findOne(id);

    // Không xóa reservation đã phát sinh lịch sử (DA_NHAN_BAN, HOAN_THANH)
    if (['DA_NHAN_BAN', 'HOAN_THANH'].includes(reservation.status)) {
      throw new BadRequestException(
        'Không thể xóa đặt bàn đã nhận bàn hoặc hoàn thành',
      );
    }

    await this.reservationRepo.softDelete(id);
  }
}
