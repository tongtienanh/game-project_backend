import {Column, Entity, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

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

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: "permission_id", referencedColumnName: "id"})
  permission: Permission;
}
