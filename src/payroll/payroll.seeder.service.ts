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
    const payrolls: Payroll[] = [];

    const employees = await this.employeeRepo.find();

    if (!employees.length) {
      console.log('❌ No employees found. Seed employees first!');
      return;
    }

    for (const emp of employees) {
      // simulate monthly payroll (1–12)
      for (let month = 1; month <= 12; month++) {
        const gross = faker.number.float({
          min: 20000,
          max: 120000,
          fractionDigits: 2,
        });

        const deduction = parseFloat((gross * 0.1).toFixed(2));
        const taxDeduction = parseFloat((gross * 0.05).toFixed(2));
        const net = parseFloat((gross - deduction - taxDeduction).toFixed(2));

        payrolls.push(
          this.payrollRepo.create({
            employee: emp,
            month,
            gross,
            deduction,
            taxDeduction,
            net,
            status: faker.helpers.arrayElement([
              Status.PENDING,
              Status.APPROVED,
              Status.PAID,
            ]),
          }),
        );
      }
    }

    await this.payrollRepo.save(payrolls);

    console.log('🌱 Payroll seeded successfully!');
  }
}
