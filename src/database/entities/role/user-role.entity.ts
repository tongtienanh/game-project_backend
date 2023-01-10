import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { User } from 'src/database/entities/user/user.entity';
import { Role } from './role.entity';

@Entity('user_role')
export class UserRole extends CoreBaseEntity {
  @Column()
  userId: number;

  @Column()
  roleId: number;

  @ManyToOne(() => User, (user) => user.userRoles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Role, (role) => role.id)
  @JoinColumn({ name: "role_id" })
  role: Role;
}
