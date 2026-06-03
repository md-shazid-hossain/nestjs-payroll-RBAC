import {
  Controller,
  Put,
  // Delete,
  Post,
  Get,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

import { DepartmentService } from './department.service';
import { DepartmentDto } from './dtos/department.dto';
import { SoftDeleteDepartmentDto } from './dtos/SoftDeleteDepartmentDto';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}
  //! soft delete department
  @Patch(':id')
  @ApiOperation({ summary: 'Soft delete a department' })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Department ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Department soft deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found',
  })
  async softDeleteDepartment(
    @Param('id') id: number,
    @Body() softdeleteDepartmentDto: SoftDeleteDepartmentDto,
  ) {
    return this.departmentService.softDeleteDepartment(
      id,
      softdeleteDepartmentDto,
    );
  }

  @Get('deleted-data')
  @ApiOperation({ summary: 'Get all soft-deleted departments' })
  @ApiResponse({
    status: 200,
    description: 'List of soft-deleted departments',
  })
  async getDeleted() {
    return this.departmentService.getSoftDeleatedDepartments();
  }
  @Post()
  @ApiOperation({ summary: 'Create a new department' })
  @ApiBody({ type: DepartmentDto })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
    schema: {
      example: {
        id: 1,
        name: 'Human Resources',
        createdAt: '2026-05-10T10:00:00.000Z',
      },
    },
  })
  async createDepartment(@Body() departmentDto: DepartmentDto) {
    return this.departmentService.createDepartment(departmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all departments' })
  @ApiResponse({
    status: 200,
    description: 'List of departments',
    schema: {
      example: [
        {
          id: 1,
          name: 'HR',
        },
        {
          id: 2,
          name: 'IT',
        },
      ],
    },
  })
  async getAllDepartments() {
    return this.departmentService.getAllDepartments();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get department by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Department ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Department found',
    schema: {
      example: {
        id: 1,
        name: 'Human Resources',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Department not found',
  })
  async getDepartmentById(@Param('id') id: number) {
    return this.departmentService.getDepartmentById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update department' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
  })
  @ApiBody({ type: DepartmentDto })
  @ApiResponse({
    status: 200,
    description: 'Department updated successfully',
    schema: {
      example: {
        id: 1,
        name: 'Updated Department',
      },
    },
  })
  async updateDepartment(
    @Param('id') id: number,
    @Body() departmentDto: DepartmentDto,
  ) {
    return this.departmentService.updateDepartment(id, departmentDto);
  }

  // @Delete(':id')
  // @ApiOperation({ summary: 'Delete department' })
  // @ApiParam({
  //   name: 'id',
  //   type: Number,
  //   example: 1,
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Department deleted successfully',
  //   schema: {
  //     example: {
  //       message: 'Department deleted',
  //     },
  //   },
  // })
  // async deleteDepartment(@Param('id') id: number) {
  //   return this.departmentService.deleteDepartment(id);
  // }
}
