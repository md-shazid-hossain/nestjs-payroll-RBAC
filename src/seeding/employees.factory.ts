// src/database/factories/user.factory.ts
import { setSeederFactory } from 'typeorm-extension';
import { Employees } from 'src/employees/employees.entity';

export const employeesFactory = setSeederFactory(Employees, (faker) => {
  const employee = new Employees();
  employee.name = faker.person.fullName();
  employee.email = faker.internet.email();
  employee.
  return employee;
});
