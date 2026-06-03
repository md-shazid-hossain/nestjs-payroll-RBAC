// import { Employees } from 'src/employees/employees.entity';
import { Department } from 'src/department/department.entity';
import { Role } from 'src/role/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  // JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  // OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

// export enum UserRole {
//   ADMIN = 'admin',
//   HR_MANAGER = 'hrmanager',
//   FINANCE_OFFICER = 'financeofficer',
//   EMPLOYEE = 'employee',
// }

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  password!: string;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable()
  roles!: Role[];

  // @OneToOne(() => Employees, (employee) => employee.user)
  // @JoinColumn()
  // employee!: Employees;

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

  // for soft delete
  @OneToMany(() => Department, (department) => department.deletedBy)
  deletedDepartments!: Department[];
}
