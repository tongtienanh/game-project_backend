import {Column, Entity, ManyToOne, OneToMany} from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { RolePermission } from './role-permissions.entity';
import { UserRole } from './user-role.entity';
import {Permissions} from './permission.entity'

@Entity('roles')
export class Role extends CoreBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role, {cascade: ['insert', 'update']})
  rolePermission: RolePermission[];
}
