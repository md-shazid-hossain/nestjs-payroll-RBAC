import { PartialType } from '@nestjs/swagger';
import { EmployeeCreateDto } from './employeesCreate.dto';

export class EmployeeUpdateDto extends PartialType(EmployeeCreateDto) {}
