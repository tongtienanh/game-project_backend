import {Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import {CoreBaseEntity} from "../core/base.entity";
import {Game} from "./game.entity";

@Entity("download")
export class Download extends CoreBaseEntity {
    @Column({name: "game_id"})
    gameId: number;

    @Column()
    link: string;

    @Column()
    type: number;

    @ManyToOne(() => Game, (game) => game.download)
    @JoinColumn({ name: 'game_id', referencedColumnName: 'id' })
    game: Game;
}
