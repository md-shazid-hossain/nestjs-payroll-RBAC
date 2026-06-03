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

@ApiTags('Employees')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @RequirePermissions('create:employee')
  @ApiOperation({
    summary: 'Create a new employee',
  })
  @ApiBody({
    type: EmployeeCreateDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+8801712345678',
        department_id: 1,
        base_salary: 50000,
        status: true,
        joiningDate: '2026-05-10',
        gender: 'Male',
        fathersName: 'Robert Doe',
        mothersName: 'Jane Doe',
        dateOfBirth: '2000-01-01',
        nid: '1234567890',
        education: 'BSc in Computer Science',
        presentAddress: 'Dhaka, Bangladesh',
        permanentAddress: 'Khulna, Bangladesh',
        experience: '3 years',
        createdAt: '2026-05-20T10:00:00.000Z',
        updatedAt: '2026-05-20T10:00:00.000Z',
      },
    },
  })
  async createEmployee(@Body() employeeCreateDto: EmployeeCreateDto) {
    return this.employeesService.createEmployee(employeeCreateDto);
  }

  @Get()
  @RequirePermissions('read:employee')
  @ApiOperation({
    summary: 'Get all employees',
  })
  @ApiResponse({
    status: 200,
    description: 'Employees fetched successfully',
  })
  async getAllEmployees() {
    return this.employeesService.getAllEmployees();
  }

  @Get('deleted-data')
  async getSoftDeletedData() {
    return await this.employeesService.getDeletedData();
  }

  @Get(':id')
  @RequirePermissions('read:singleEmployee')
  @ApiOperation({
    summary: 'Get employee by ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Employee ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee fetched successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  async getEmployeeById(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getEmployeeById(id);
  }

  @Put(':id')
  @RequirePermissions('update:employee')
  @ApiOperation({
    summary: 'Update employee',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Employee ID',
  })
  @ApiBody({
    type: EmployeeUpdateDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Employee updated successfully',
    schema: {
      example: {
        message: 'Employee updated successfully',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  async updateEmployee(
    @Param('id', ParseIntPipe) id: number,
    @Body() employeeUpdateDto: EmployeeUpdateDto,
  ) {
    return this.employeesService.updateEmployee(id, employeeUpdateDto);
  }

  // @Delete(':id')
  // @RequirePermissions('delete:employee')
  // @ApiOperation({
  //   summary: 'Delete employee',
  // })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   example: 1,
  //   description: 'Employee ID',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Employee deleted successfully',
  //   schema: {
  //     example: {
  //       message: 'Employee deleted successfully',
  //     },
  //   },
  // })
  // @ApiResponse({
  //   status: 404,
  //   description: 'Employee not found',
  // })
  // async deleteEmployee(@Param('id', ParseIntPipe) id: number) {
  //   return this.employeesService.deleteEmployee(id);
  // }

  @Patch(':id')
  async softDelete(@Param('id') id: number) {
    return this.employeesService.softDelete(id);
  }
}
