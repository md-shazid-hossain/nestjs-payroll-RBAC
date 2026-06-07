import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeesService } from './employees.service';
import { EmployeeCreateDto } from './dtos/employeesCreate.dto';
import { EmployeeUpdateDto } from './dtos/employeeUpdate.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';
import { SoftDeleteEmployeeDto } from './dtos/SoftDeleteEmployeeDto';

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @RequirePermissions('create:employee')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({ type: EmployeeCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
  })
  async createEmployee(@Body() employeeCreateDto: EmployeeCreateDto) {
    return this.employeesService.createEmployee(employeeCreateDto);
  }

  @Get()
  @RequirePermissions('read:employee')
  @ApiOperation({ summary: 'Get all employees' })
  @ApiResponse({ status: 200, description: 'Employees fetched successfully' })
  async getAllEmployees() {
    return this.employeesService.getAllEmployees();
  }

  @Get('deleted-data')
  @RequirePermissions('read:employee')
  @ApiOperation({ summary: 'Get all soft-deleted employees' })
  @ApiResponse({
    status: 200,
    description: 'Soft-deleted employees fetched successfully',
  })
  async getSoftDeletedData() {
    return await this.employeesService.getDeletedData();
  }

  @Get(':id')
  @RequirePermissions('read:singleEmployee')
  @ApiOperation({ summary: 'Get employee by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Employee ID',
  })
  @ApiResponse({ status: 200, description: 'Employee fetched successfully' })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getEmployeeById(id);
  }

  @Put(':id')
  @RequirePermissions('update:employee')
  @ApiOperation({ summary: 'Update employee' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Employee ID',
  })
  @ApiBody({ type: EmployeeUpdateDto })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    schema: { example: { message: 'Employee updated successfully' } },
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() employeeUpdateDto: EmployeeUpdateDto,
  ) {
    return this.employeesService.updateEmployee(id, employeeUpdateDto);
  }

  @Patch(':id')
  @RequirePermissions('delete:employee') // soft delete requires delete permission
  @ApiOperation({ summary: 'Soft delete an employee' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Employee ID',
  })
  @ApiBody({ type: SoftDeleteEmployeeDto })
  @ApiResponse({
    status: 200,
    description: 'Employee soft deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Employee not found' })
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
    @Body() softDeleteEmployeeDto: SoftDeleteEmployeeDto,
  ) {
    return this.employeesService.softDelete(id, softDeleteEmployeeDto);
  }
}
