import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Employees } from '../employees/employees.entity';

export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
}

@Entity()
export class Payroll {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employees, (employee) => employee.payrolls, {
    nullable: false,
  })
  employee!: Employees;

  @Column({
    type: 'int',
    nullable: false,
  })
  month!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  gross!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  deduction!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  taxDeduction!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  net!: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: [Status.PENDING],
  })
  status!: Status;

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
