import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './permission.entity';
import { Role } from '../role/role.entity';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';

@Module({
  providers: [PermissionService],
  controllers: [PermissionController],
  imports: [TypeOrmModule.forFeature([Permission, Role])],
})
export class PermissionModule {}
