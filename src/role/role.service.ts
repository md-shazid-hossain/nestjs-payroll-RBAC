import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/createRole.dto';
import { Permission } from 'src/permission/permission.entity';
import { UpdateRoleDto } from './dtos/updateRoleDto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,

    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto) {
    const ifExists = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (ifExists) {
      throw new ConflictException(
        `User Role: ${createRoleDto.name} already exists`,
      );
    }

    const role = this.roleRepository.create({
      name: createRoleDto.name,
      permissions: createRoleDto.permissionIds?.map((id) => ({ id })) ?? [],
    });

    return this.roleRepository.save(role);
  }

  async getRole() {
    const roles = await this.roleRepository.find({
      order: { id: 'DESC' },
      relations: ['permissions'],
    });

    return roles;
  }

  async getRoleById(id: number) {
    const role = await this.roleRepository.findOne({
      where: { id: id },
      relations: ['permissions'],
    });

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.roleRepository.findOne({
      where: {
        id: id,
      },
    });

    if (!role) {
      throw new ConflictException(`User Role: ${updateRoleDto.name} Not found`);
    }

    const updateRole = await this.roleRepository.preload({
      id: role.id,
      ...updateRoleDto,
      permissions: updateRoleDto.permissionIds?.map((id) => ({ id })) ?? [],
    });
    // console.log(updateRole);

    if (!updateRole) {
      throw new ConflictException(`Role preload failed`);
    }

    return await this.roleRepository.save(updateRole);
  }

  async softDeleteRole(id: number) {
    const targetToDelete = await this.roleRepository.find({
      where: { id: id },
    });

    if (!targetToDelete) {
      throw new NotFoundException('Role not found!');
    }

    return await this.roleRepository.update(id, {
      deleteDate: new Date(),
    });
  }

  async getSoftDeletedRoles() {
    const data = await this.roleRepository.find({
      where: { deleteDate: Not(IsNull()) },
      order: { id: 'DESC' },
    });

    return data;
  }

  // async deleteRole(id: number, updateRoleDto: UpdateRoleDto) {
  //   const target = await this.roleRepository.findOne({
  //     where: { id: id },
  //   });

  //   if (target) {
  //     throw new ConflictException('Role Not found!');
  //   }
  // }
}
