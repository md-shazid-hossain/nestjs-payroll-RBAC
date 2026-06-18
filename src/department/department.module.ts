import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department } from './department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../users/users.entity';
import { DepartmentSeederService } from './department.seeder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Users])],
  controllers: [DepartmentController],
  providers: [DepartmentService, DepartmentSeederService],
})
export class DepartmentModule {}
