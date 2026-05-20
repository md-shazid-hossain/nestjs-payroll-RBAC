import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeeCreateDto } from './dtos/employeesCreate.dto';
import { EmployeeUpdateDto } from './dtos/employeeUpdate.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
  ) {}

  async createEmployee(employeesCreateDto: EmployeeCreateDto) {
    const employee = await this.employeesRepository.findOne({
      where: {
        email: employeesCreateDto.email,
      },
    });

    if (employee) {
      return 'the employee with this email already exists';
    }

    const newEmployee = this.employeesRepository.create({
      ...employeesCreateDto,
      department_id: {
        id: employeesCreateDto.department_id,
      },
      user: {
        id: employeesCreateDto.user,
      },
    });

    return await this.employeesRepository.save(newEmployee);
  }

  async getAllEmployees() {
    return this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoin('employee.department_id', 'department')
      .select([
        'employee.id',
        'employee.name',
        'employee.dateOfBirth',
        'department.id',
        'department.name',
      ])
      .getMany();
  }

  async getEmployeeById(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['department_id'],
      select: {
        id: true,
        name: true,
        department_id: {
          id: true,
          name: true,
        },
      },
    });

    if (!employee) {
      throw new NotFoundException('Employee Not Found');
    }

    return employee;
  }

  async updateEmployee(id: number, employeeUpdateDto: EmployeeUpdateDto) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new ConflictException('Employee Does not exists');
    }

    const updatedEmployee = this.employeesRepository.merge(employee, {
      ...employeeUpdateDto,
      department_id: {
        id: employeeUpdateDto.department_id,
      },
      user: {
        id: employeeUpdateDto.user,
      },
    });

    return await this.employeesRepository.save(updatedEmployee);
  }

  async deleteEmployee(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });

    if (!employee) {
      return 'employee not found';
    }

    await this.employeesRepository.delete(id);
    return 'employee deleted successfully';
  }
}
