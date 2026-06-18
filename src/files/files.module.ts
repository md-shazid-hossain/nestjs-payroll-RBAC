import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { EmployeesController } from '../employees/employees.controller';
import { EmployeesModule } from '../employees/employees.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    EmployeesModule,
  ],
  controllers: [EmployeesController],
})
export class FilesModule {}
