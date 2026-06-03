import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SalaryStructureService } from './salary-structure.service';
import { CreateSalaryStructureDto } from './dtos/createSalaryStructure.dto';
import { UpdateSalaryStructureDto } from './dtos/updateSalaryStructure.dto';

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
  })
  async getSalaryStructures() {
    return await this.salaryStructureService.getSalaryStructure();
  }

  @Put(':id')
  async updateSalaryStructure(
    @Param('id') id: number,
    @Body() updateSalaryStructureDto: UpdateSalaryStructureDto,
  ) {
    return await this.salaryStructureService.updateSalaryStructure(
      id,
      updateSalaryStructureDto,
    );
  }
}
