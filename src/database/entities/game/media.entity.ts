import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";
import {Game} from "./game.entity";

@Entity("media")
export class Media extends CoreBaseEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column({name: "user_id"})
    userId: number;

    @Column()
    description: string;

    @Column()
    type: number;

    @Column()
    uri: string;

    @Column()
    size: string;

    @ManyToOne(() => Game, (game) => game.media)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    game: Game;
}
