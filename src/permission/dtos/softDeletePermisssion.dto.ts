import { PartialType } from '@nestjs/swagger';
import { SoftDeleteDepartmentDto } from 'src/department/dtos/SoftDeleteDepartmentDto';

export class SoftDeletePermissionDto extends PartialType(
  SoftDeleteDepartmentDto,
) {}
