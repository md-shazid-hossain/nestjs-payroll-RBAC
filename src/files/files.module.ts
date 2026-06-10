import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { EmployeesController } from 'src/employees/employees.controller';
import { EmployeesModule } from 'src/employees/employees.module';

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
