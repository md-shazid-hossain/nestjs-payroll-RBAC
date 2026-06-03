import { Permission } from 'src/permission/permission.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @ManyToMany(() => Permission, (perm) => perm.roles, { eager: true })
  @JoinTable()
  permissions!: Permission[];

  @ManyToMany(() => Users, (user) => user.roles)
  users!: Users[];

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;
}
