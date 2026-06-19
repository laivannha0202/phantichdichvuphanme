import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  @Post('menu-items')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'menu-items'),
        filename: (_req: any, file: any, cb: any) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          cb(null, `menu-item-${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (_req: any, file: any, cb: any) => {
        const ext = extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          cb(
            new BadRequestException(
              `Định dạng file không hỗ trợ. Chỉ chấp nhận: ${ALLOWED_EXTENSIONS.join(', ')}`,
            ),
            false,
          );
          return;
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload ảnh món ăn' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Upload thành công' })
  @ApiResponse({ status: 400, description: 'File không hợp lệ' })
  uploadMenuItem(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('Không có file được upload');
    }

    const baseUrl = process.env.API_URL || 'http://localhost:5011';
    const url = `${baseUrl}/uploads/menu-items/${file.filename}`;

    return {
      url,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
    };
  }
}
