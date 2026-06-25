import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Employees } from '../employees/employees.entity';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
}

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employees, (employee) => employee.attendance)
  employee_id!: Employees;

  @Column({
    type: 'date',
    nullable: false,
  })
  date!: Date;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
  })
  status!: AttendanceStatus;

  @Column({ type: 'timestamp', nullable: true })
  checkInTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  checkOutTime?: Date;

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
