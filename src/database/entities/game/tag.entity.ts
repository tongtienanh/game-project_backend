import {Column, Entity, OneToMany} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";
import {GameTag} from "./game-tag.entity";

@Entity("tag")
export class Tag extends CoreBaseEntity {
    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    slug: string;

    @OneToMany(() => GameTag, (gameTag) => gameTag.tag)
    gameTag: GameTag[];
}
