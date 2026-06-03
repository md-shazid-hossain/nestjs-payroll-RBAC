import { PartialType } from '@nestjs/swagger';
import { CreateSalaryStructureDto } from './createSalaryStructure.dto';

export class UpdateSalaryStructureDto extends PartialType(
  CreateSalaryStructureDto,
) {}
