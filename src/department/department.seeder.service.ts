import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Department } from './department.entity';

@Injectable()
export class DepartmentSeederService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  async seed() {
    const departments: Department[] = [];

    for (let i = 0; i < 10; i++) {
      departments.push(
        this.departmentRepo.create({
          name:
            faker.commerce.department() + '-' + faker.string.alphanumeric(5),
        }),
      );
    }

    await this.departmentRepo.save(departments);

    console.log('🌱 Departments seeded!');
  }
}
