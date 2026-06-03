import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SalaryStructure } from './salary-structure.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSalaryStructureDto } from './dtos/createSalaryStructure.dto';
import { UpdateSalaryStructureDto } from './dtos/updateSalaryStructure.dto';
import { SoftDeleteSalaryStructure } from './dtos/softDeleteSalaryStructure.dto';

@Injectable()
export class SalaryStructureService {
  constructor(
    @InjectRepository(SalaryStructure)
    private salaryStructureRepository: Repository<SalaryStructure>,
  ) {}

  async createSlaryStructure(
    createSalaryStructureDto: CreateSalaryStructureDto,
  ) {
    const existsSalaryForEmployee =
      await this.salaryStructureRepository.findOne({
        where: {
          employee_id: {
            id: createSalaryStructureDto.employeeId,
          },
          deleteDate: IsNull(),
        },
      });

    if (existsSalaryForEmployee) {
      throw new ConflictException('Salary Structure exists for this employee');
    }

    const newSalaryStructure = this.salaryStructureRepository.create({
      ...createSalaryStructureDto,
      employee_id: {
        id: createSalaryStructureDto.employeeId,
      },
    });
    return await this.salaryStructureRepository.save(newSalaryStructure);
  }

  async getSalaryStructure() {
    const data = await this.salaryStructureRepository.find({
      select: {
        id: true,
        allowance: true,
        basicSalary: true,
        employee_id: true,
        latePenalty: true,
        hra: true,
      },
    });

    return data;
  }

  async updateSalaryStructure(
    id: number,
    updateSalaryStructureDto: UpdateSalaryStructureDto,
  ) {
    const findSalaryStructure = await this.salaryStructureRepository.findOne({
      where: { id: id },
    });

    if (!findSalaryStructure) {
      throw new NotFoundException('Salary Structure Not Found!');
    }

    return await this.salaryStructureRepository.update(
      id,
      updateSalaryStructureDto,
    );
  }

  async softDeleteSalaryStructure(
    id: number,
    softDeleteSalaryStructureDto: SoftDeleteSalaryStructure,
  ) {
    const targetToDelete = await this.salaryStructureRepository.findOne({
      where: { id: id },
    });

    if (!targetToDelete) {
      throw new NotFoundException('Salary Structure not found');
    }

    return await this.salaryStructureRepository.update(id, {
      deleteDate: new Date(),
      delete_reason: softDeleteSalaryStructureDto.delete_reason,
      deletedBy: { id: softDeleteSalaryStructureDto.deletedBy },
    });
  }

  async getSoftDeletedSalaryStructure() {
    const data = await this.salaryStructureRepository.find({
      where: { deleteDate: Not(IsNull()) },
      order: { id: 'DESC' },
    });

    return data;
  }
}
