import { Role } from 'src/role/role.entity';
import { Users } from 'src/users/users.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column()
  subject!: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles!: Role[];

  //! for soft delete
  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;

  @ManyToOne(() => Users, (user) => user.deletedDepartments, {
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
