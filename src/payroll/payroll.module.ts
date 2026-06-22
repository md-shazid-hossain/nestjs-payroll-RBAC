import { Module } from '@nestjs/common';
import { PayrollController } from './payroll.controller';
import { PayrollService } from './payroll.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payroll } from './payroll.entity';
import { SalaryStructure } from '../salary-structure/salary-structure.entity';
import { Attendance } from '../attendance/attendance.entity';
import { Employees } from '../employees/employees.entity';
import { Tax } from '../tax/tax.entity';
import { Holiday } from '../holiday/holiday.entity';
import { PayrollSeederService } from './payroll.seeder.service';

@Module({
  controllers: [PayrollController],
  providers: [PayrollService, PayrollSeederService],
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
