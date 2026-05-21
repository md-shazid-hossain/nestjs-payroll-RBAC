import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Department } from '../department/department.entity';
import { Attendance } from 'src/attendance/attendance.entity';
import { Payroll } from 'src/payroll/payroll.entity';
import { SalaryStructure } from 'src/salary-structure/salary-structure.entity';

@Entity()
export class Employees {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  name!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  phone!: string;

  @ManyToOne(() => Department, (department) => department.id, {
    nullable: false,
  })
  department_id!: Department;

  @Column({
    type: 'boolean',
    nullable: false,
  })
  status!: boolean;

  @Column({
    type: 'date',
    nullable: false,
  })
  joiningDate: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  gender!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  fathersName!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  mothersName!: string;

  @Column({
    type: 'date',
    nullable: false,
  })
  dateOfBirth!: Date;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  nid!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  education!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  presentAddress!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  permanentAddress!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  experience!: string;

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;

  @OneToMany(() => Attendance, (attendance) => attendance.employee_id)
  attendance!: Attendance[];

  @OneToMany(() => Payroll, (payroll) => payroll.employee)
  payrolls!: Payroll[];

  @OneToOne(
    () => SalaryStructure,
    (SalaryStructure) => SalaryStructure.employee_id,
  )
  salaryStructures!: SalaryStructure;

  constructor() {
    this.joiningDate = new Date();
  }

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
