import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { Role } from 'src/role/role.entity';
import { CreatePermissionDto } from './dtos/createPermission.dto';

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
    return await this.permissionRepository.find({ order: { id: 'DESC' } });
  }
}
