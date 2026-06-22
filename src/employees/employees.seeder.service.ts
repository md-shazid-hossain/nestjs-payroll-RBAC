import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

import { Employees } from './employees.entity';
import { Department } from '../department/department.entity';

@Injectable()
export class EmployeesSeederService {
  constructor(
    @InjectRepository(Employees)
    private readonly employeeRepo: Repository<Employees>,

    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async seed() {
    const departments = await this.departmentRepo.find();

    if (!departments.length) {
      throw new Error(
        'No departments found. Seed departments before employees.',
      );
    }

    const employees: Employees[] = [];

    for (let i = 0; i < 100; i++) {
      employees.push(
        this.employeeRepo.create({
          name: faker.person.fullName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),

          department_id:
            departments[Math.floor(Math.random() * departments.length)],

          status: faker.datatype.boolean(),

          joiningDate: faker.date.past(),

          gender: faker.helpers.arrayElement(['Male', 'Female', 'Other']),

          fathersName: faker.person.fullName(),
          mothersName: faker.person.fullName(),

          dateOfBirth: faker.date.birthdate({
            min: 20,
            max: 60,
            mode: 'age',
          }),

          nid: faker.string.numeric(10),

          education: faker.helpers.arrayElement([
            'SSC',
            'HSC',
            'Diploma',
            'Bachelor',
            'Master',
          ]),

          presentAddress: faker.location.streetAddress(),
          permanentAddress: faker.location.streetAddress(),

          experience: `${faker.number.int({
            min: 0,
            max: 15,
          })} years`,

          designation: faker.person.jobTitle(),

          profile_pic: faker.image.avatar(),
        }),
      );
    }

    await this.employeeRepo.save(employees);

    console.log('🌱 Employees seeded!');
  }
}
