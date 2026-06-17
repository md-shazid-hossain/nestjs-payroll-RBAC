// src/database/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Department } from 'src/department/department.entity';

export const departmentFactory = setSeederFactory(Department, (faker) => {
  const department = new Department();
  department.name = faker.commerce.department();

  return department;
});
