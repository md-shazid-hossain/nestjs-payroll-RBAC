import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { DepartmentDto } from './dtos/department.dto';
import { SoftDeleteDepartmentDto } from './dtos/SoftDeleteDepartmentDto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async createDepartment(departmentDto: DepartmentDto) {
    const existingDepartment = await this.departmentRepository.findOne({
      where: { name: departmentDto.name },
    });

    if (existingDepartment) {
      throw new ConflictException({
        message: `Department name ${departmentDto.name} already exists`,
      });
    }

    const department = this.departmentRepository.create({
      name: departmentDto.name,
    });
    return await this.departmentRepository.save(department);
  }

  async getAllDepartments() {
    return this.departmentRepository.find({
      where: { deleteDate: IsNull() },
      order: { id: 'DESC' },
      select: { name: true, id: true, employees: true },
      relations: ['employees'],
    });
  }

  async getDepartmentById(id: number) {
    return this.departmentRepository.findOne({
      where: { id },
      order: { id: 'DESC' },
      select: { name: true, id: true },
    });
  }

  async updateDepartment(id: number, departmentDto: DepartmentDto) {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) {
      throw new NotFoundException('Department no found');
    }

    await this.departmentRepository.update(id, { name: departmentDto.name });

    return {
      success: true,
      message: 'Department updated successfully',
    };
  }

  async softDeleteDepartment(
    id: number,
    softdeleteDepartmentDto: SoftDeleteDepartmentDto,
  ) {
    const department = await this.departmentRepository.findOne({
      where: { id: id, deleteDate: IsNull() },
    });

    if (!department) {
      throw new NotFoundException('Department not found');
    }

    await this.departmentRepository.update(id, {
      deleteDate: new Date(),
      delete_reason: softdeleteDepartmentDto.delete_reason,
      deletedBy: { id: softdeleteDepartmentDto.deletedBy },
    });

    return { success: true, message: 'Department deleted successfully' };
  }

  async getSoftDeleatedDepartments() {
    const deleted = await this.departmentRepository.find({
      where: { deleteDate: Not(IsNull()) },
    });

    return deleted;
  }

  // async deleteDepartment(id: number) {
  //   const result = await this.departmentRepository.delete(id);
  //   return { success: (result.affected ?? 0) > 0 };
  // }
}
