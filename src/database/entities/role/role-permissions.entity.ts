import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { Role } from './role.entity';
import { Permissions } from './permission.entity';

@Entity('roles_permissions')
export class RolePermission extends CoreBaseEntity {
  @Column()
  roleId: number;

  @Column()
  model: string;

  @Column()
  action: string;

  @Column({ name: "permission_id" })
  permissionId!: number;

  @ManyToOne(() => Role, (role) => role.rolePermission)
  role: Role;

  // @ManyToOne(() => Permissions, (permission) => permission.rolePermissions)
  // @JoinColumn({ name: "permission_id", referencedColumnName: "id"})
  // permission: Permissions;
}
