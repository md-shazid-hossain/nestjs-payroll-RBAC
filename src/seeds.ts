import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DepartmentSeederService } from './department/department.seeder.service';
import { EmployeesSeederService } from './employees/employees.seeder.service';
import { HolidaySeederService } from './holiday/holiday.seeder.service';
import { SalaryStructureSeederService } from './salary-structure/salary-structure.seeder.service';
import { PayrollSeederService } from './payroll/payroll.seeder.service';
import { AttendanceSeederService } from './attendance/attendance.seeder.service';
import { TaxSeederService } from './tax/tax.seeder.service';

async function seedRunner() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // const departmentSeeder = app.get(DepartmentSeederService);
  // await departmentSeeder.seed();

  // const employeeSeeder = app.get(EmployeesSeederService);
  // await employeeSeeder.seed();

  // const holidaySeeder = app.get(HolidaySeederService);
  // await holidaySeeder.seed();

  // const salaryStructureSeeder = app.get(SalaryStructureSeederService);
  // await salaryStructureSeeder.seed();

  // const attendanceSeeder = app.get(AttendanceSeederService);
  // await attendanceSeeder.seed();

  const payrollSeeder = app.get(PayrollSeederService);
  await payrollSeeder.seed();

  // const taxSeeder = app.get(TaxSeederService);
  // await taxSeeder.seed();

  await app.close();
}

seedRunner();
