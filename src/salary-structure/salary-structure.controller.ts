import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
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
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async createSalaryStructure(
    @Body() salaryStructureDto: CreateSalaryStructureDto,
  ) {
    // Fixed typo: createSlaryStructure -> createSalaryStructure
    await this.salaryStructureService.createSalaryStructure(salaryStructureDto);

    return {
      success: true,
      message: `Salary structure added for employee ID ${salaryStructureDto.employeeId}`,
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all salary structures' })
  @ApiResponse({ status: 200, description: 'List of salary structures' })
  async getSalaryStructures() {
    return await this.salaryStructureService.getSalaryStructure();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single salary structure by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Salary structure ID' })
  @ApiResponse({
    status: 200,
    description: 'Salary structure retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Salary structure not found' })
  async getSingleSalaryStructure(@Param('id', ParseIntPipe) id: number) {
    return await this.salaryStructureService.getSingleSalaryStructure(id);
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
    @Param('id', ParseIntPipe) id: number,
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
    @Param('id', ParseIntPipe) id: number,
    @Body() softDeleteSalaryStructureDto: SoftDeleteSalaryStructure,
  ) {
    return this.salaryStructureService.softDeleteSalaryStructure(
      id,
      softDeleteSalaryStructureDto,
    );
  }
}
