import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Users } from '../users/users.entity'; // assuming you have a User entity

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Returns a list of all registered users.',
  })
  @ApiOkResponse({
    description: 'List of users retrieved successfully.',
    type: [Users], // replace with your actual User response DTO/entity
  })
  async getAllUsers() {
    return await this.userService.gatAllUsers(); // typo kept as in original
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.getuserById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description:
      'Updates user details (e.g., email, roles). All fields are optional.',
  })
  @ApiOkResponse({
    description: 'User updated successfully.',
    type: Users,
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID does not exist.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data (e.g., malformed email, duplicate roles).',
  })
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUsers(id, updateUserDto);
  }
}
