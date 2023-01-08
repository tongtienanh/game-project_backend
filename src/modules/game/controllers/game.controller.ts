import {Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query} from '@nestjs/common';
import {GameImplService} from '../services/game-impl.service';
import {CreateGameDto, DeleteGames} from '../dto/create-game.dto';
import {UpdateGameDto} from '../dto/update-game.dto';
import {FileInterceptor} from "@nestjs/platform-express";
import {ResponseEntity} from "../../../common/resources/base/response.entity";
import {GameRequest} from "../dto/game.request";
import {Permission} from "../../auth/decorators/permisson.decorator";

@Controller('api/game')
export class GameController {
    constructor(private readonly gameService: GameImplService) {
    }

    @Post()
    async create(@Body() createGameDto: CreateGameDto): Promise<ResponseEntity<boolean>> {
        await this.gameService.createOrUpdate(createGameDto);

        return new ResponseEntity<boolean>(true);
    }

    @Post('upload/image')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file) {
        return await this.gameService.upload(file)
    }

    @Get('all')
    @Permission()
    async findAll(@Query() request: GameRequest) {
        return await this.gameService.findAll(request);
    }

    @Delete('delete')
    remove(@Query() request: DeleteGames) {
        return this.gameService.remove(request);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.gameService.findOne(+id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
        return this.gameService.update(+id, updateGameDto);
    }


}
