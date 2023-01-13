import {Column, Entity} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";

@Entity("category")
export class Category extends CoreBaseEntity {
    @Column()
    name: string;

    @Column()
    description: string
}
