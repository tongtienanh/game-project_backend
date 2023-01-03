import {CoreBaseEntity} from "../core/base.entity";
import {Column, Entity, OneToMany} from "typeorm";
import {GameTag} from "./game-tag.entity";
import {Download} from "./download.entity";

@Entity("game")
export class Game extends CoreBaseEntity {
    @Column()
    name: string;

    @Column()
    image: string;

    @Column()
    description: string;

    @Column()
    content: string;

    @Column()
    slug: string;

    @OneToMany(() => GameTag, (gameTag) => gameTag.game)
    gameTag: GameTag[];

    @OneToMany(() => Download, (download) => download.game)
    download: Download[];
}
