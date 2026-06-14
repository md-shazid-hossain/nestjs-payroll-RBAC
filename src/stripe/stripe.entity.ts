import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employees } from '../employees/employees.entity';

@Entity()
export class StripeTable {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Employees, (employee) => employee.salaryStructure, {
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
  provided_salary!: number;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  date!: Date;

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
