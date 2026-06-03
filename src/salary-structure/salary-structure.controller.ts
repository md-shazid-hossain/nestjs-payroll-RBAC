import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { SalaryStructureService } from './salary-structure.service';
import { CreateSalaryStructureDto } from './dtos/createSalaryStructure.dto';
import { UpdateSalaryStructureDto } from './dtos/updateSalaryStructure.dto';
import { SoftDeleteSalaryStructure } from './dtos/softDeleteSalaryStructure.dto';

@ApiTags('Salary Structure')
@Controller('salary-structure')
export class SalaryStructureController {
  constructor(
    private readonly salaryStructureService: SalaryStructureService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a salary structure for an employee' })
  @ApiBody({ type: CreateSalaryStructureDto })
  @ApiResponse({
    status: 201,
    description: 'Salary structure created successfully',
    schema: {
      example: {
        success: true,
        message: 'Salary structure added for employee ID 1',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createSalaryStructure(
    @Body() salaryStructureDto: CreateSalaryStructureDto,
  ) {
    await this.salaryStructureService.createSlaryStructure(salaryStructureDto);

    return {
      success: true,
      message: `Salary structure added for employee ID ${salaryStructureDto.employeeId}`,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all salary structures' })
  @ApiResponse({
    status: 200,
    description: 'List of salary structures',
    schema: {
      example: [
        {
          id: 1,
          employeeId: 1,
          baseSalary: 50000,
          allowances: { hra: 10000, travel: 2000 },
          deductions: { tax: 5000 },
          isActive: true,
        },
      ],
    },
  })
  async getSalaryStructures() {
    return await this.salaryStructureService.getSalaryStructure();
  }

  @Put(':id')
  @ApiOperation({ summary: 'Fully update a salary structure' })
  @ApiParam({ name: 'id', description: 'Salary structure ID', type: Number })
  @ApiBody({ type: UpdateSalaryStructureDto })
  @ApiResponse({
    status: 200,
    description: 'Salary structure updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Salary structure not found' })
  async updateSalaryStructure(
    @Param('id') id: number,
    @Body() updateSalaryStructureDto: UpdateSalaryStructureDto,
  ) {
    return await this.salaryStructureService.updateSalaryStructure(
      id,
      updateSalaryStructureDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Soft delete a salary structure' })
  @ApiParam({ name: 'id', description: 'Salary structure ID', type: Number })
  @ApiBody({ type: SoftDeleteSalaryStructure })
  @ApiResponse({
    status: 200,
    description: 'Salary structure soft deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Salary structure not found' })
  async softDeleteSalaryStructure(
    @Param('id') id: number,
    @Body() softDeleteSalaryStructureDto: SoftDeleteSalaryStructure,
  ) {
    return this.salaryStructureService.softDeleteSalaryStructure(
      id,
      softDeleteSalaryStructureDto,
    );
  }
}
