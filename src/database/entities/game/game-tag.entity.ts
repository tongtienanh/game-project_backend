import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";
import {Tag} from "./tag.entity";
import {Game} from "./game.entity";

@Entity("game_tag")
export class GameTag extends CoreBaseEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column({name: "tag_id"})
    tagId: number;


    @ManyToOne(() => Tag, (tag) => tag.gameTag)
    @JoinColumn({ name: 'tag_id', referencedColumnName: 'id' })
    tag: Tag;

    @ManyToOne(() => Game, (game) => game.gameTag)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    game: Game
}
