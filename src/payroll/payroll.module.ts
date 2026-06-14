import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';
import { SalaryStructure } from 'src/salary-structure/salary-structure.entity';
import { Attendance } from 'src/attendance/attendance.entity';
import { Employees } from 'src/employees/employees.entity';
import { Tax } from 'src/tax/tax.entity';
import { Holiday } from 'src/holiday/holiday.entity';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService],
  imports: [
    TypeOrmModule.forFeature([
      Payroll,
      SalaryStructure,
      Attendance,
      Employees,
      Tax,
      Holiday,
    ]),
  ],
})
export class PayrollModule {}
