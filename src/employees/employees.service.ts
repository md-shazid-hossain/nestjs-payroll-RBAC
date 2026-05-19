import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeeCreateDto } from './dtos/employeesCreate.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
  ) {}

  async createEmployee(employeesCreateDto: EmployeeCreateDto) {
    const employee = await this.employeesRepository.findOne({
      where: { email: employeesCreateDto.email },
    });

    if (employee) {
      return 'the employee with this email already exists';
    }

    const newEmployee = this.employeesRepository.create({
      ...employeesCreateDto,
      department_id: {
        id: employeesCreateDto.department_id,
      },
    });

    return await this.employeesRepository.save(newEmployee);
  }

  async getAllEmployees() {
    return await this.employeesRepository.find({
      relations: ['department_id'],
      order: { id: 'DESC' },
    });
  }

  async getEmployeeById(id: number) {
    return await this.employeesRepository.findOne({
      where: { id },
      relations: ['department_id'],
    });
  }

  async updateEmployee(id: number, employeesCreateDto: EmployeeCreateDto) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new ConflictException('Employee Does not exists');
    }

    const updatedEmployee = this.employeesRepository.merge(employee, {
      ...employeesCreateDto,
      department_id: {
        id: employeesCreateDto.department_id,
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
