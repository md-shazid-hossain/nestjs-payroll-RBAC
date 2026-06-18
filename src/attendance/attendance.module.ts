import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './attendance.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Holiday } from '../holiday/holiday.entity';
import { Employees } from '../employees/employees.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Holiday, Employees])],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
