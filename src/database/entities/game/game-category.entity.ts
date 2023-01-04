import {Column, Entity} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";

@Entity("game_category")
export class GameCategory extends CoreBaseEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column({name: "category_id"})
    categoryId: number;
}
