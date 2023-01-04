import {CoreBaseEntity} from "../core/base.entity";
import {Column, Entity, OneToMany} from "typeorm";
import {GameTag} from "./game-tag.entity";
import {Download} from "./download.entity";
import {GameCategory} from "./game-category.entity";

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

    @OneToMany(() => GameTag, (gameTag) => gameTag.game, { cascade: ['insert', 'update']})
    gameTag: GameTag[];

    @OneToMany(() => Download, (download) => download.game, { cascade: ['insert', 'update']})
    download: Download[];

    @OneToMany(() => GameCategory, (gameCategory) => gameCategory.game, {cascade: ['insert', 'update']})
    gameCategory: GameCategory[];
}
