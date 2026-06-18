import { NestFactory } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port', 5011);
  const corsOrigin = configService.get<string>(
    'app.corsOrigin',
    'http://localhost:5173',
  );

  // Security
  app.use(helmet());
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Cookie parser
  app.use(cookieParser());

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (validationErrors) => {
        const messages = validationErrors.map((err) => {
          const constraints = Object.values(err.constraints ?? {});
          return constraints.length > 0
            ? constraints[0]
            : `${err.property} không hợp lệ`;
        });
        return new BadRequestException(messages);
      },
    }),
  );

  // Global prefix
  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Quản lý nhà hàng API')
    .setDescription('API cho hệ thống quản lý nhà hàng - Sprint 5: Bếp xử lý món')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Xác thực & phân quyền')
    .addTag('Roles', 'Quản lý vai trò')
    .addTag('Users', 'Quản lý người dùng')
    .addTag('Table Areas', 'Quản lý khu vực bàn')
    .addTag('Tables', 'Quản lý bàn')
    .addTag('Menu Categories', 'Quản lý danh mục thực đơn')
    .addTag('Menu Items', 'Quản lý món ăn')
    .addTag('Orders', 'Quản lý đơn hàng & món trong đơn')
    .addTag('Kitchen', 'Bếp xử lý món - KDS')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  logger.log(`Server đang chạy tại http://localhost:${port}/api`);
  logger.log(`Swagger docs tại http://localhost:${port}/api/docs`);
  logger.log(`CORS origin: ${corsOrigin}`);
}
bootstrap();
