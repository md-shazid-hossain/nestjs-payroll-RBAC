import { Role } from 'src/role/role.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({
    type: 'date',
    nullable: true,
    default: null,
  })
  deleteDate!: Date;
}
