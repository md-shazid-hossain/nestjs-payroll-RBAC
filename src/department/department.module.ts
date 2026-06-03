import { Module } from '@nestjs/common';
import { DepartmentController } from './department.controller';
import { DepartmentService } from './department.service';
import { Department } from './department.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/users/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Users])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
