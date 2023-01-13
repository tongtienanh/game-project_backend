import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";
import {Game} from "./game.entity";

@Entity("game_category")
export class GameCategory extends CoreBaseEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column({name: "category_id"})
    categoryId: number;

    @ManyToOne(() => Game, (game) => game.gameCategory)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    game: Game;
}
