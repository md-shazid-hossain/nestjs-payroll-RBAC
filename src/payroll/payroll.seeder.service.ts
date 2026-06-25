import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Payroll, Status } from './payroll.entity';
import { Employees } from '../employees/employees.entity';

@Injectable()
export class PayrollSeederService {
  constructor(
    @InjectRepository(Payroll)
    private readonly payrollRepo: Repository<Payroll>,

    @InjectRepository(Employees)
    private readonly employeeRepo: Repository<Employees>,
  ) {}

  async seed() {
    const employees = await this.employeeRepo.find();

    if (!employees.length) {
      console.log('❌ No employees found. Seed employees first!');
      return;
    }

    const payrolls: Payroll[] = [];

    for (const emp of employees) {
      // Set a fixed base salary per employee for the year
      // Realistically, an employee's salary doesn't wildly fluctuate every single month
      const yearlyGrossSalary = faker.number.float({
        min: 20000,
        max: 120000,
        fractionDigits: 2,
      });

      const deduction = parseFloat((yearlyGrossSalary * 0.1).toFixed(2));
      const taxDeduction = parseFloat((yearlyGrossSalary * 0.05).toFixed(2));
      const net = parseFloat(
        (yearlyGrossSalary - deduction - taxDeduction).toFixed(2),
      );

      // 1-12 represents a full year
      for (let month = 1; month <= 12; month++) {
        // Assume months 1-11 are already paid, and month 12 is pending/current
        const status = month === 12 ? Status.PENDING : Status.PAID;

        payrolls.push(
          this.payrollRepo.create({
            employee: emp,
            month,
            gross: yearlyGrossSalary,
            deduction,
            taxDeduction,
            net,
            status,
          }),
        );
      }
    }

    // Batch save (100 employees * 12 months = 1,200 records)
    const chunkSize = 1000;
    for (let i = 0; i < payrolls.length; i += chunkSize) {
      await this.payrollRepo.save(payrolls.slice(i, i + chunkSize));
    }

    console.log(
      `🌱 Payroll seeded successfully with ${payrolls.length} records!`,
    );
  }
}
