import { Module } from '@nestjs/common';
import { GameImplService } from './services/game-impl.service';
import { GameController } from './controllers/game.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Game} from "../../database/entities/game/game.entity";
import {Download, GameTag} from "../../database/entities";

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Game,
        Download,
        GameTag,
    ])
  ],
  controllers: [GameController],
  providers: [GameImplService]
})
export class GameModule {}
