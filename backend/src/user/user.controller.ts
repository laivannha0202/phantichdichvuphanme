import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy danh sách người dùng' })
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Lấy chi tiết người dùng' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.create(dto, user);
  }

  @Patch(':id')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.update(id, dto, user);
  }

  @Patch(':id/status')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Cập nhật trạng thái người dùng' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateStatus(id, dto, user);
  }

  @Patch(':id/role')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Đổi vai trò người dùng' })
  async updateRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRoleDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updateRole(id, dto, user);
  }

  @Patch(':id/password')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Đổi mật khẩu người dùng' })
  async updatePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.updatePassword(id, dto, user);
  }

  @Post(':id/reset-password')
  @Roles('QUAN_TRI_HE_THONG', 'QUAN_LY')
  @ApiOperation({ summary: 'Đặt lại mật khẩu người dùng (deprecated, dùng PATCH /:id/password)' })
  async resetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
    @CurrentUser() user: any,
  ) {
    return this.userService.resetPassword(id, dto, user);
  }

  @Delete(':id')
  @Roles('QUAN_TRI_HE_THONG')
  @ApiOperation({ summary: 'Xóa người dùng (soft delete)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
