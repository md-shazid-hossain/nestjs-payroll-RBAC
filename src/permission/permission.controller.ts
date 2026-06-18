import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dtos/createPermission.dto';
import { SoftDeleteDepartmentDto } from '../department/dtos/SoftDeleteDepartmentDto';

@ApiTags('permission')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new permission' })
  @ApiBody({ type: CreatePermissionDto })
  @ApiResponse({ status: 201, description: 'Permission successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.createPermission(createPermissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all permissions (non-deleted)' })
  @ApiResponse({ status: 200, description: 'List of permissions retrieved.' })
  async getAllPermissions() {
    return await this.permissionService.getPermissions();
  }

  @Get('soft-deleted-permissions')
  @ApiOperation({ summary: 'Get all soft-deleted permissions' })
  @ApiResponse({
    status: 200,
    description: 'List of soft-deleted permissions retrieved.',
  })
  async getSoftDeletedPermissionsDto() {
    return this.permissionService.getAllSoftDeletedPermission();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single permission by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Permission ID' })
  @ApiResponse({ status: 200, description: 'Permission found' })
  @ApiResponse({ status: 404, description: 'Permission not found' })
  async getPermissionById(@Param('id', ParseIntPipe) id: number) {
    return await this.permissionService.singlePermission(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Soft delete a permission by ID' })
  @ApiParam({ name: 'id', description: 'Permission ID', type: Number })
  @ApiBody({ type: SoftDeleteDepartmentDto })
  @ApiResponse({ status: 200, description: 'Permission soft-deleted.' })
  @ApiResponse({ status: 404, description: 'Permission not found.' })
  async softDeletePermission(
    @Param('id', ParseIntPipe) id: number,
    @Body() softDeletePermissionDto: SoftDeleteDepartmentDto,
  ) {
    return await this.permissionService.softDeletePermission(
      id,
      softDeletePermissionDto,
    );
  }
}
