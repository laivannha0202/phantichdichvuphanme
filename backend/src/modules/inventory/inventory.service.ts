import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../../database/entities/supplier.entity';
import { Ingredient } from '../../database/entities/ingredient.entity';
import { InventoryTransaction } from '../../database/entities/inventory-transaction.entity';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ExportTransactionDto } from './dto/export-transaction.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(InventoryTransaction)
    private transactionRepository: Repository<InventoryTransaction>,
  ) {}

  // ==================== SUPPLIERS ====================

  async findAllSuppliers(): Promise<Supplier[]> {
    return this.supplierRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneSupplier(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async createSupplier(dto: CreateSupplierDto): Promise<Supplier> {
    const existing = await this.supplierRepository.findOne({
      where: { supplierCode: dto.supplierCode },
    });
    if (existing) {
      throw new BadRequestException(`Supplier code ${dto.supplierCode} already exists`);
    }
    const supplier = this.supplierRepository.create(dto);
    return this.supplierRepository.save(supplier);
  }

  async updateSupplier(id: number, dto: UpdateSupplierDto): Promise<Supplier> {
    const supplier = await this.findOneSupplier(id);
    Object.assign(supplier, dto);
    return this.supplierRepository.save(supplier);
  }

  // ==================== INGREDIENTS ====================

  async findAllIngredients(): Promise<Ingredient[]> {
    return this.ingredientRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOneIngredient(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${id} not found`);
    }
    return ingredient;
  }

  async createIngredient(dto: CreateIngredientDto): Promise<Ingredient> {
    const existing = await this.ingredientRepository.findOne({
      where: { ingredientCode: dto.ingredientCode },
    });
    if (existing) {
      throw new BadRequestException(`Ingredient code ${dto.ingredientCode} already exists`);
    }

    const ingredient = this.ingredientRepository.create({
      ...dto,
      currentStock: dto.currentStock || 0,
      minStock: dto.minStock || 0,
    });
    ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
    return this.ingredientRepository.save(ingredient);
  }

  async updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    const ingredient = await this.findOneIngredient(id);
    Object.assign(ingredient, dto);
    ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
    return this.ingredientRepository.save(ingredient);
  }

  // ==================== TRANSACTIONS ====================

  async findAllTransactions(): Promise<InventoryTransaction[]> {
    return this.transactionRepository.find({
      relations: ['ingredient', 'supplier', 'createdByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async importStock(dto: CreateTransactionDto, userId?: number): Promise<InventoryTransaction> {
    const ingredient = await this.findOneIngredient(dto.ingredientId);

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // Update stock
    ingredient.currentStock = Number(ingredient.currentStock) + Number(dto.quantity);
    ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
    await this.ingredientRepository.save(ingredient);

    // Generate transaction code
    const transactionCode = await this.generateTransactionCode();

    // Create transaction entity directly (avoid TypeORM create() overload inference issue)
    const tx = new InventoryTransaction();
    tx.transactionCode = transactionCode;
    tx.ingredientId = dto.ingredientId;
    tx.supplierId = dto.supplierId || null;
    tx.type = 'NHAP_KHO';
    tx.quantity = dto.quantity;
    tx.unitPrice = dto.unitPrice || null;
    tx.totalAmount = dto.unitPrice ? dto.unitPrice * dto.quantity : null;
    tx.note = dto.note || null;
    tx.createdByUserId = userId || null;

    return this.transactionRepository.save(tx);
  }

  async exportStock(dto: ExportTransactionDto, userId?: number): Promise<InventoryTransaction> {
    const ingredient = await this.findOneIngredient(dto.ingredientId);

    if (dto.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    if (Number(ingredient.currentStock) < Number(dto.quantity)) {
      throw new BadRequestException('Số lượng xuất vượt quá tồn kho');
    }

    // Update stock
    ingredient.currentStock = Number(ingredient.currentStock) - Number(dto.quantity);
    ingredient.status = this.determineStatus(ingredient.currentStock, ingredient.minStock);
    await this.ingredientRepository.save(ingredient);

    // Generate transaction code
    const transactionCode = await this.generateTransactionCode();

    // Create transaction entity directly
    const tx = new InventoryTransaction();
    tx.transactionCode = transactionCode;
    tx.ingredientId = dto.ingredientId;
    tx.supplierId = null;
    tx.type = 'XUAT_KHO';
    tx.quantity = dto.quantity;
    tx.unitPrice = null;
    tx.totalAmount = null;
    tx.note = dto.note || null;
    tx.createdByUserId = userId || null;

    return this.transactionRepository.save(tx);
  }

  // ==================== DASHBOARD ====================

  async getLowStock(): Promise<Ingredient[]> {
    return this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.current_stock <= ingredient.min_stock')
      .andWhere('ingredient.status != :status', { status: 'NGUNG_SU_DUNG' })
      .orderBy('ingredient.current_stock', 'ASC')
      .getMany();
  }

  async getSummary(): Promise<{
    totalIngredients: number;
    lowStockCount: number;
    totalTransactions: number;
    totalStockValue: number;
  }> {
    const totalIngredients = await this.ingredientRepository.count();

    const lowStockCount = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .where('ingredient.current_stock <= ingredient.min_stock')
      .andWhere('ingredient.status != :status', { status: 'NGUNG_SU_DUNG' })
      .getCount();

    const totalTransactions = await this.transactionRepository.count();

    const totalStockValue = await this.ingredientRepository
      .createQueryBuilder('ingredient')
      .select('SUM(ingredient.current_stock)', 'total')
      .getRawOne();

    return {
      totalIngredients,
      lowStockCount,
      totalTransactions,
      totalStockValue: Number(totalStockValue?.total) || 0,
    };
  }

  // ==================== HELPERS ====================

  private determineStatus(currentStock: number, minStock: number): string {
    if (currentStock === 0) {
      return 'HET_HANG';
    }
    if (currentStock <= minStock) {
      return 'SAP_HET';
    }
    return 'CON_HANG';
  }

  private async generateTransactionCode(): Promise<string> {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');

    const count = await this.transactionRepository
      .createQueryBuilder('transaction')
      .where('DATE(transaction.created_at) = CURDATE()')
      .getCount();

    const seq = String(count + 1).padStart(3, '0');
    return `GD-${dateStr}-${seq}`;
  }
}
