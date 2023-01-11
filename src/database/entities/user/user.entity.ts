import {Entity, Column, BeforeInsert, BeforeUpdate, OneToMany, Unique, JoinColumn, OneToOne} from 'typeorm'
import { CoreBaseEntity } from '../core/base.entity';
import * as bcrypt from 'bcrypt'
import 'dotenv/config'
import { UserRole } from '../role/user-role.entity';
import {LocalFile} from "../local-file/localFile.entity";

@Entity('users')
export class User extends CoreBaseEntity{
    @Column({unique: true})
    username: string;

    @Column()
    password: string;

    @Column({nullable: true})
    age: number;

    @Column({nullable: true})
    gender: number;

    @Column({nullable: true})
    fullname: string;

    @OneToMany(() => UserRole, (userRole) => userRole.user, {cascade: ["update", "insert"]})
    userRoles: UserRole[];

    @JoinColumn({ name: 'avatarId' })

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
       if (this.password) {
        this.password = await bcrypt.hash(this.password, 11)
       }
    }
}
