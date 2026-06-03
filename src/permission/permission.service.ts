import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from 'src/role/role.entity';
import { CreatePermissionDto } from './dtos/createPermission.dto';
import { SoftDeletePermissionDto } from './dtos/softDeletePermisssion.dto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const isExists = await this.permissionRepository.findOne({
      where: {
        action: createPermissionDto.action,
        subject: createPermissionDto.subject,
      },
    });

    if (isExists) {
      throw new ConflictException(
        `The action : ${createPermissionDto.action}  and subject : ${createPermissionDto.subject} already exists`,
      );
    }

    const permission = this.permissionRepository.create({
      action: createPermissionDto.action,
      subject: createPermissionDto.subject,
    });

    return await this.permissionRepository.save(permission);
  }

  async getPermissions() {
    return await this.permissionRepository.find({
      where: { deleteDate: IsNull() },
      order: { id: 'DESC' },
    });
  }

  async softDeletePermission(
    id: number,
    softDeletePermissionDto: SoftDeletePermissionDto,
  ) {
    const targetToDelete = await this.permissionRepository.find({
      where: { id: id },
    });

    if (!targetToDelete) {
      throw new NotFoundException('department not found!');
    }

    return await this.permissionRepository.update(id, {
      deleteDate: new Date(),
      deletedBy: { id: softDeletePermissionDto.deletedBy },
      delete_reason: softDeletePermissionDto.delete_reason,
    });
  }

  async getAllSoftDeletedPermission() {
    const data = await this.permissionRepository.find({
      where: { deleteDate: Not(IsNull()) },
      order: { id: 'DESC' },
    });

    return data;
  }
}
