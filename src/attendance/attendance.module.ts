import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../holiday/holiday.entity';
import { Employees } from '../employees/employees.entity';
import { AttendanceSeederService } from './attendance.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Holiday, Employees])],
  providers: [AttendanceService, AttendanceSeederService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
