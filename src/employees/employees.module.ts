import { BadRequestException, Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Department } from 'src/department/department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employees } from './employees.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);

          const filename = `employee-${uniqueSuffix}${ext}`;

          callback(null, filename);
        },
      }),

      //! taking only image files
      fileFilter: (req, file, callback) => {
        // Check the mimetype (e.g., 'image/jpeg', 'image/png', 'image/gif')
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          // Reject the file and pass an error
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
    TypeOrmModule.forFeature([Employees, Department]),
    AuthModule,
  ],
  exports: [EmployeesService],
})
export class EmployeesModule {}
