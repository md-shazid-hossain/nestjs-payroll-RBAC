import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dtos/createRole.dto';
import { Permission } from '../permission/permission.entity';
import { UpdateRoleDto } from './dtos/updateRoleDto';
import { SoftDeleteRoleDto } from './dtos/softDeleteRole.dto';

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

    // ckeck if the permission is available in db
    for (const x of createRoleDto.permissionIds ?? []) {
      const exists = await this.permissionRepository.findOne({
        where: { id: x },
      });

      if (!exists) {
        throw new NotFoundException(`Permission ID ${x} does not exist`);
      }
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

    // ckeck if the permission is available in db
    for (const x of updateRoleDto.permissionIds ?? []) {
      const exists = await this.permissionRepository.findOne({
        where: { id: x },
      });

      if (!exists) {
        throw new NotFoundException(
          `Permission ID ${x} does not exist in Permission Table`,
        );
      }
    }

    const updateRole = await this.roleRepository.preload({
      id: role.id,
      ...updateRoleDto,
      permissions: updateRoleDto.permissionIds?.map((id) => ({ id })),
    });
    // console.log(updateRole);

    if (!updateRole) {
      throw new ConflictException(`Role preload failed`);
    }

    return await this.roleRepository.save(updateRole);
  }

  async softDeleteRole(id: number, softDeleteRoleDto: SoftDeleteRoleDto) {
    const targetToDelete = await this.roleRepository.find({
      where: { id: id },
    });

    if (!targetToDelete) {
      throw new NotFoundException('Role not found!');
    }

    return await this.roleRepository.update(id, {
      deleteDate: new Date(),
      delete_reason: softDeleteRoleDto.delete_reason,
      deletedBy: { id: softDeleteRoleDto.deletedBy },
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
