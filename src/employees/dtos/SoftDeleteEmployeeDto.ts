import { PartialType } from '@nestjs/swagger';
import { SoftDeleteDepartmentDto } from 'src/department/dtos/SoftDeleteDepartmentDto';

export class SoftDeleteEmployeeDto extends PartialType(
  SoftDeleteDepartmentDto,
) {}
