import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { Repository } from 'typeorm';
import { DepartmentDto } from './dtos/department.dto';

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
      order: { id: 'DESC' },
      select: { name: true, id: true },
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
    department.name = departmentDto.name;
    return this.departmentRepository.save(department);
  }

  // async deleteDepartment(id: number) {
  //   const result = await this.departmentRepository.delete(id);
  //   return { success: (result.affected ?? 0) > 0 };
  // }
}
