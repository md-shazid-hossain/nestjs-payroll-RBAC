import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OneToOne } from 'typeorm';
import { Employees } from '../employees/employees.entity';

@Entity()
export class SalaryStructure {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Employees, (employee) => employee.salaryStructures, {
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

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;

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
}
