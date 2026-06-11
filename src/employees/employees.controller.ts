import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EmployeesService } from './employees.service';
import { EmployeeCreateDto } from './dtos/employeesCreate.dto';
import { EmployeeUpdateDto } from './dtos/employeeUpdate.dto';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { PermissionsGuard } from 'src/auth/guards/permission.guard';
import { RequirePermissions } from 'src/auth/decorators/permission.decorator';
import { SoftDeleteEmployeeDto } from './dtos/SoftDeleteEmployeeDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@ApiTags('Employees')
// @ApiBearerAuth()
// @UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @RequirePermissions('create:employee')
  @ApiOperation({ summary: 'Create a new employee' })
  @ApiBody({ type: EmployeeCreateDto })
  @ApiResponse({
    status: 201,
    description: 'Employee created successfully',
  })
  createEmployee(
    @Body() employeeCreateDto: EmployeeCreateDto,
    @UploadedFile() file: Express.Multer.File, // Typing the file object
  ) {
    console.log(file.filename);

    if (!file) {
      throw new BadRequestException('No Image File Detected');
    }

    return this.employeesService.createEmployee(
      employeeCreateDto,
      file.filename,
    );
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

  @Get('employee_image/:filename')
  getEmployeeImage(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'uploads', filename);
    return res.download(filePath);
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
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
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
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.employeesService.updateEmployee(
      id,
      employeeUpdateDto,
      file?.filename,
    );
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
