import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { ModulePermission } from './module.entity';
import { RolePermission } from './role-permissions.entity';
import {Role} from "./role.entity";

@Entity('permissions')
export class Permissions extends CoreBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'module_id' })
  moduleId: number;

  @ManyToOne(() => ModulePermission, (module) => module.id)
  @JoinColumn({ name: 'module_id' })
  module: ModulePermission;
}
