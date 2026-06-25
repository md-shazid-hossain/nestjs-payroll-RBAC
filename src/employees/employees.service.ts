import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Employees } from './employees.entity';
import { EmployeeCreateDto } from './dtos/employeesCreate.dto';
import { EmployeeUpdateDto } from './dtos/employeeUpdate.dto';
import { SoftDeleteEmployeeDto } from './dtos/SoftDeleteEmployeeDto';
import fs from 'fs';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employees)
    private employeesRepository: Repository<Employees>,
  ) {}

  async createEmployee(
    employeesCreateDto: EmployeeCreateDto,
    filename: string,
  ) {
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
      profile_pic: filename,
      department_id: {
        id: employeesCreateDto.department_id,
      },
    });

    return await this.employeesRepository.save(newEmployee);
  }

  async getAllEmployees() {
    const employeeData = this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoin('employee.department_id', 'department')
      .leftJoin('employee.salaryStructure', 'salaryStructure')

      .select('employee.id', 'id')
      .addSelect('employee.name', 'name')
      .addSelect('employee.dateOfBirth', 'dateOfBirth')
      .addSelect('employee.joiningDate', 'joiningDate')
      .addSelect('employee.education', 'education')
      .addSelect('employee.email', 'email')
      .addSelect('employee.experience', 'experience')
      .addSelect('employee.mothersName', 'mothersName')
      .addSelect('employee.fathersName', 'fathersName')
      .addSelect('employee.gender', 'gender')
      .addSelect('employee.nid', 'nid')
      .addSelect('employee.phone', 'phone')
      .addSelect('employee.presentAddress', 'presentAddress')
      .addSelect('employee.permanentAddress', 'permanentAddress')
      .addSelect('employee.status', 'status')

      .addSelect('department.name', 'department_name')
      .addSelect('salaryStructure.basicSalary', 'basicSalary')
      .addSelect(
        `'http://localhost:3000/employees/employee_image/' || employee.profile_pic`,
        'image_url',
      )
      .orderBy('employee.id', 'ASC')

      .getRawMany();

    return employeeData;
  }

  // async getAllEmployees() {
  //   return await this.employeesRepository.find({
  //     relations: ['department_id'],
  //     order: { id: 'DESC' },
  //     select: {
  //       id: true,
  //       name: true,
  //       dateOfBirth: true,
  //       joiningDate: true,
  //       gender: true,
  //       phone: true,
  //       status: true,
  //       department_id: {
  //         id: true,
  //         name: true,
  //       },
  //     },
  //   });
  // }

  async getEmployeeById(id: number) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
      relations: ['department_id'],
      select: {
        id: true,
        name: true,
        dateOfBirth: true,
        joiningDate: true,
        education: true,
        email: true,
        experience: true,
        mothersName: true,
        fathersName: true,
        gender: true,
        nid: true,
        phone: true,
        presentAddress: true,
        permanentAddress: true,
        status: true,
        salaryStructure: {
          basicSalary: true,
        },
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

  async updateEmployee(
    id: number,
    employeeUpdateDto: EmployeeUpdateDto,
    fileName?: string,
  ) {
    const employee = await this.employeesRepository.findOne({
      where: { id },
    });

    if (!employee) {
      throw new ConflictException('Employee Does not exists');
    }

    if (fileName !== '') {
      const filePath = `uploads/${employee.profile_pic}`;

      fs.unlinkSync(filePath);
    }

    const updatedEmployee = this.employeesRepository.merge(employee, {
      ...employeeUpdateDto,
      department_id: {
        id: employeeUpdateDto.department_id,
      },
      profile_pic: fileName,
    });

    return await this.employeesRepository.save(updatedEmployee);
  }

  // async deleteEmployee(id: number) {
  //   const employee = await this.employeesRepository.findOne({
  //     where: { id },
  //   });

  //   if (!employee) {
  //     return 'employee not found';
  //   }

  //   await this.employeesRepository.delete(id);
  //   return 'employee deleted successfully';
  // }

  async softDelete(id: number, softDeleteEmployeeDto: SoftDeleteEmployeeDto) {
    const targetToDelete = await this.employeesRepository.findOne({
      where: { id: id, deleteDate: IsNull() },
    });

    if (!targetToDelete) {
      throw new NotFoundException('Employee Not Found Or Already Deleted!');
    }

    return await this.employeesRepository.update(id, {
      deleteDate: new Date(),
      delete_reason: softDeleteEmployeeDto.delete_reason,
      deletedBy: { id: softDeleteEmployeeDto.deletedBy },
    });
  }

  async getDeletedData() {
    const deleted = await this.employeesRepository.find({
      where: { deleteDate: Not(IsNull()) },
    });

    // console.log(deleted);

    return deleted;
  }

  // async getDeletedData() {
  //   const data = await this.employeesRepository.createQueryBuilder('')
  // }
}
