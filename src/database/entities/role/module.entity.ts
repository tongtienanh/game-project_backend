import { Column, Entity, OneToMany } from 'typeorm';
import { CoreBaseEntity } from '../core/base.entity';
import { Permissions } from './permission.entity';

@Entity('modules')
export class ModulePermission extends CoreBaseEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Permissions, (permission) => permission.module)
  permissions: Permissions[];
}
