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
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/createRole.dto';
import { Role } from './role.entity';
import { UpdateRoleDto } from './dtos/updateRoleDto';
import { SoftDeleteRoleDto } from './dtos/softDeleteRole.dto';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  // ✅ Specific static route BEFORE dynamic :id route
  @Get('soft-deleted-roles')
  @ApiOperation({ summary: 'Get all soft-deleted roles' })
  @ApiOkResponse({
    description: 'List of soft-deleted roles retrieved successfully.',
  })
  async getSoftDeletedRoles() {
    return this.roleService.getSoftDeletedRoles();
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description:
      'Creates a role with optional permission IDs. The role name must be unique.',
  })
  @ApiCreatedResponse({
    description: 'Role successfully created.',
    type: Role,
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data (e.g., missing name, duplicate permission IDs, non-existent permission IDs).',
  })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Returns a list of all roles.',
  })
  @ApiOkResponse({
    description: 'List of roles retrieved successfully.',
    type: [Role],
  })
  async getRoles() {
    return this.roleService.getRole();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by ID',
    description: 'Returns detailed information about a specific role.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiOkResponse({
    description: 'Role found and returned successfully.',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role with the given ID does not exist.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid ID format (must be a number).',
  })
  async getRoleById(@Param('id', ParseIntPipe) id: number) {
    return this.roleService.getRoleById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing role',
    description:
      'Updates the role name and/or permission list. All fields are optional, but at least one must be provided.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({ type: UpdateRoleDto })
  @ApiOkResponse({
    description: 'Role updated successfully.',
    type: Role,
  })
  @ApiNotFoundResponse({
    description: 'Role with the given ID does not exist.',
  })
  @ApiBadRequestResponse({
    description:
      'Invalid input data (e.g., duplicate permission IDs, non-existent permission IDs, or an empty update DTO).',
  })
  async updateRoles(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Soft delete a role by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Role ID' })
  @ApiBody({ type: SoftDeleteRoleDto })
  @ApiOkResponse({ description: 'Role soft deleted successfully.' })
  @ApiNotFoundResponse({
    description: 'Role with the given ID does not exist.',
  })
  async softDeleteRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() softDeleteRoleDto: SoftDeleteRoleDto,
  ) {
    return this.roleService.softDeleteRole(id, softDeleteRoleDto);
  }
}
