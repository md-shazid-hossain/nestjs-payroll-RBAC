import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToOne } from 'typeorm';
import { Employees } from '../employees/employees.entity';
import { Users } from 'src/users/users.entity';

@Entity()
export class SalaryStructure {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Employees, (employee) => employee.salaryStructure, {
    nullable: false,
  })
  @JoinColumn({ name: 'employee_id' })
  employee_id!: Employees;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  basicSalary!: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  latePenalty!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  hra!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  allowance!: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt!: Date;

  //! for soft delete
  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;

  @ManyToOne(() => Users, (user) => user.deletedSalaryStructure, {
    nullable: true,
  })
  deletedBy!: Users;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 100,
    unique: true,
  })
  delete_reason!: string;
}
