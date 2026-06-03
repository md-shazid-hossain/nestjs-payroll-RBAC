import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { Users } from '../users/users.entity';

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
    type: [Users],
  })
  async getAllUsers() {
    // Fixed typo: gatAllUsers -> getAllUsers
    return await this.userService.getAllUsers();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Returns detailed information about a specific user.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
  @ApiOkResponse({ description: 'User found successfully', type: Users })
  @ApiNotFoundResponse({
    description: 'User with the given ID does not exist.',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    // Fixed typo: getuserById -> getUserById
    return await this.userService.getUserById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user by ID',
    description:
      'Updates user details (e.g., email, roles). All fields are optional.',
  })
  @ApiParam({ name: 'id', type: Number, description: 'User ID' })
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
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // Fixed typo: updateUsers -> updateUser (assuming service method is updateUser)
    return await this.userService.updateUser(id, updateUserDto);
  }
}
