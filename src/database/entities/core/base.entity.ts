import {
  BaseEntity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';
export abstract class CoreBaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6", select: false})
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false})
  updatedAt: Date;

  @DeleteDateColumn({select: false})
  deletedAt: Date;

  @Column({ name: 'createdBy', select: false})
  createdBy?: number;

  @Column({select: false})
  updatedBy?: number;
}
