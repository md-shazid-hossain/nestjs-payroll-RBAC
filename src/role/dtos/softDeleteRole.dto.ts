import { PartialType } from '@nestjs/swagger';
import { SoftDeleteDepartmentDto } from '../../department/dtos/SoftDeleteDepartmentDto';

export class SoftDeleteRoleDto extends PartialType(SoftDeleteDepartmentDto) {}
