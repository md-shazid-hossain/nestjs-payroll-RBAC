import { ConflictException, Injectable } from '@nestjs/common';
import { SalaryStructure } from './salary-structure.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSalaryStructureDto } from './dtos/createSalaryStructure.dto';

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
        allowance: true,
        basicSalary: true,
        employee_id: true,
        latePenalty: true,
        hra: true,
      },
    });

    return data;
  }
}
