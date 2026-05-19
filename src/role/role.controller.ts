import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dtos/createRole.dto';
import { Role } from './role.entity';
import { UpdateRoleDto } from './dtos/updateRoleDto';

@ApiTags('Roles')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

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
    type: [Role], // indicates an array of Role entities
  })
  async getRoles() {
    return this.roleService.getRole(); // assuming getRole() returns all roles
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by ID',
    description: 'Returns detailed information about a specific role.',
  })
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
  async getRoleById(@Param('id') id: number) {
    return this.roleService.getRoleById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update an existing role',
    description:
      'Updates the role name and/or permission list. All fields are optional, but at least one must be provided.',
  })
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
    @Param('id') id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}
