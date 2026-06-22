import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { SalaryStructure } from './salary-structure.entity';
import { Employees } from '../employees/employees.entity';


@Injectable()
export class SalaryStructureSeederService {
  constructor(
    @InjectRepository(SalaryStructure)
    private readonly salaryRepo: Repository<SalaryStructure>,

    @InjectRepository(Employees)
    private readonly employeeRepo: Repository<Employees>,
  ) {}

  async seed() {
    const salaries: SalaryStructure[] = [];

    // get all employees (important for OneToOne mapping)
    const employees = await this.employeeRepo.find();

    if (!employees.length) {
      console.log('❌ No employees found. Seed employees first!');
      return;
    }

    for (const emp of employees) {
      const basicSalary = faker.number.float({
        min: 15000,
        max: 80000,
        fractionDigits: 2,
      });

      const hra = parseFloat((basicSalary * 0.4).toFixed(2));
      const allowance = parseFloat((basicSalary * 0.2).toFixed(2));

      salaries.push(
        this.salaryRepo.create({
          employee_id: emp,
          basicSalary,
          hra,
          allowance,
          latePenalty: faker.number.int({ min: 0, max: 1000 }),
        }),
      );
    }

    await this.salaryRepo.save(salaries);

    console.log('🌱 Salary Structures seeded!');
  }
}
