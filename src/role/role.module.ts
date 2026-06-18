import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Permission } from '../permission/permission.entity';

@Module({
  providers: [RoleService],
  controllers: [RoleController],
  imports: [TypeOrmModule.forFeature([Role, Permission])],
})
export class RoleModule {}
